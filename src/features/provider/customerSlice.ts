import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { supabase } from "@/supabaseClient";

export interface Customer {
  id?: string;
  first_name: string;
  last_name: string;
  phone: string;
  email?: string;
  address?: string;
  country_code?: string;
  provider_id: string;
  created_at?: string;
  last_request_at?: string;
}

interface CustomerListState {
  customers: Customer[];
  loading: boolean;
  error: string | null;
  success: boolean;
  open: boolean;

}

const initialState: CustomerListState = {
  customers: [],
  loading: false,
  error: null,
  success: false,
  open: false,
};

export const addCustomer = createAsyncThunk(
  "customer/addCustomer",
  async (customer: Customer, { rejectWithValue }) => {
    const { error } = await supabase.from("customer").insert(customer);
    if (error) return rejectWithValue(error.message);
    return true;
  }
);

export const addCustomerWithFunction = createAsyncThunk(
  "customer/addCustomerWithFunction",
  async (
    {
      first_name,
      last_name,
      email,
      phone,
      provider_id,
      address, // Default to empty string if not provided
    }: {
      first_name: string;
      last_name: string;
      email?: string;
      phone: string;
      provider_id: string;
      address?: string;
    },
    { rejectWithValue }
  ) => {
    const sessionRes = await supabase.auth.getSession();
    const token = sessionRes.data.session?.access_token;
    if (!token) return rejectWithValue("User not authenticated");

    const password = Math.random().toString(36).slice(-8);

    const res = await fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/add_customer`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        first_name,
        last_name,
        email,
        phone,
        password,
        provider_id,
        address,
      }),
    });

    const result = await res.json();

    if (!res.ok) {
      return rejectWithValue(result.error || "Failed to add customer");
    }

    return result;
  }
);

export const fetchCustomersByProviderId = createAsyncThunk(
  "customer/fetchCustomersByProviderId",
  async (provider_id: string, { rejectWithValue }) => {
    const { data: rows, error: relErr } = await supabase
      .from("provider_customer")
      .select(`
    customer_id,
    lastBookedAt,
    customer:customer!provider_customer_customer_id_fkey (
      id,
      user_id,
      first_name,
      last_name,
      phone,
      email,
      country_code,
      address,
      created_at
    )
  `)
      .eq("provider_id", provider_id);

    if (relErr) return rejectWithValue(relErr.message);
    if (!rows || rows.length === 0) return [];

    const customers = rows
      .filter(r => r.customer)
      .map(r => ({
        ...(r.customer as unknown as Customer),
        last_request_at: r.lastBookedAt ?? null,
      }));

    const needsBackfill = customers.some(c => !c.last_request_at);
    if (!needsBackfill) return customers;

    const customerIdsNeeding = customers
      .filter(c => !c.last_request_at)
      .map(c => c.id);

    if (customerIdsNeeding.length === 0) return customers;

    const { data: bookings, error: bookingErr } = await supabase
      .from("booked_service")
      .select("customer_id, createdAt")
      .eq("provider_id", provider_id)
      .in("customer_id", customerIdsNeeding);

    if (bookingErr) return rejectWithValue(bookingErr.message);

    const lastRequestMap: Record<string, string> = {};
    (bookings ?? []).forEach(b => {
      const prev = lastRequestMap[b.customer_id];
      if (!prev || new Date(b.createdAt) > new Date(prev)) {
        lastRequestMap[b.customer_id] = b.createdAt;
      }
    });

    const enriched = customers.map(c => ({
      ...c,
      last_request_at: c.last_request_at ?? (c.id ? lastRequestMap[c.id] : null) ?? null,
    }));

    return enriched;
  }
);

export const updateCustomer = createAsyncThunk(
  "customer/updateCustomer",
  async (
    {
      provider_id,                 // for authz check in edge fn
      customer,                    // full Customer object from your UI
    }: { provider_id: string; customer: Customer },
    { rejectWithValue }
  ) => {
    if (!customer.id) return rejectWithValue("Customer ID is required");

    // 1) Load current email & user_id to know if we must sync Auth
    const { data: current, error: getErr } = await supabase
      .from("customer")
      .select("email, user_id")
      .eq("id", customer.id)
      .single();

    if (getErr) return rejectWithValue(getErr.message);

    const nextEmail = (customer.email ?? "").trim().toLowerCase() || null;
    const prevEmail = (current?.email ?? "").toLowerCase() || null;
    const emailChanged = nextEmail !== prevEmail;
    const hasAuth = !!current?.user_id;

    // 2) If email changed AND there's an auth user → call edge fn (service role) to update both
    if (emailChanged && hasAuth) {
      const session = await supabase.auth.getSession();
      const token = session.data.session?.access_token;
      if (!token) return rejectWithValue("Not authenticated");

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/update_customer`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            provider_id,
            customer_id: customer.id,
            update: {
              first_name: customer.first_name,
              last_name: customer.last_name,
              phone: customer.phone,
              email: nextEmail,                   // will update auth + table
              address: customer.address ?? null,
              country_code: customer.country_code ?? null,
            },
          }),
        }
      );

      const payload = await res.json();
      if (!res.ok) return rejectWithValue(payload.error || "Failed to update customer");

      return { ...customer, email: nextEmail };
    }

    // 3) Otherwise: normal direct update is fine (RLS should allow via provider_customer link)
    const { error: updErr } = await supabase
      .from("customer")
      .update({
        first_name: customer.first_name,
        last_name: customer.last_name,
        phone: customer.phone,
        email: nextEmail,                  // safe even if null
        address: customer.address ?? null,
        country_code: customer.country_code ?? null,
      })
      .eq("id", customer.id);

    if (updErr) return rejectWithValue(updErr.message);
    return { ...customer, email: nextEmail };
  }
);





// Remove a customer and provider relation
export const removeCustomerFromProvider = createAsyncThunk(
  "customer/removeCustomerFromProvider",
  async (
    { provider_id, customer_id }: { provider_id: string; customer_id: string },
    { rejectWithValue }
  ) => {
    const { error } = await supabase
      .from("provider_customer")
      .delete()
      .eq("provider_id", provider_id)
      .eq("customer_id", customer_id);

    if (error) return rejectWithValue(error.message);
    return customer_id;
  }
);

// Toggle customer status (active/inactive)
export const toggleCustomerStatus = createAsyncThunk(
  "customer/toggleCustomerStatus",
  async (
    { id, status }: { id: string; status: string }, // status = "active" or "inactive"
    { rejectWithValue }
  ) => {
    const { error } = await supabase
      .from("customer")
      .update({ status })
      .eq("id", id);

    if (error) return rejectWithValue(error.message);
    return { id, status };
  }
);


const customerSlice = createSlice({
  name: "customer",
  initialState,
  reducers: {
    resetCustomerState: (state) => {
      state.loading = false;
      state.error = null;
      state.success = false;
    },
    openAddCustomerModal(state) {
      state.open = true;
      state.error = null;
    },
    closeAddCustomerModal(state) {
      state.open = false;
      state.loading = false;
      state.error = null;
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(fetchCustomersByProviderId.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCustomersByProviderId.fulfilled, (state, action) => {
        state.loading = false;
        state.customers = action.payload;
      })
      .addCase(fetchCustomersByProviderId.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(addCustomer.pending, (state) => {
        state.loading = true;
        state.success = false;
        state.error = null;
      })
      .addCase(addCustomer.fulfilled, (state) => {
        state.loading = false;
        state.success = true;
      })
      .addCase(addCustomer.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(addCustomerWithFunction.pending, (state) => {
        state.loading = true;
        state.success = false;
        state.error = null;
      })
      .addCase(addCustomerWithFunction.fulfilled, (state) => {
        state.loading = false;
        state.success = true;
      })
      .addCase(addCustomerWithFunction.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
    // ---- Update Customer ----

    builder
      .addCase(updateCustomer.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(updateCustomer.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        // Update the specific customer in the list
        state.customers = state.customers.map((c) =>
          c.id === action.payload.id
            ? {
                ...c,
                ...action.payload,
                email:
                  action.payload.email === null
                    ? undefined
                    : action.payload.email,
              }
            : c
        );
      })
      .addCase(updateCustomer.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // ---- Delete Customer ----
      .addCase(removeCustomerFromProvider.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(removeCustomerFromProvider.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.customers = state.customers.filter((c) => c.id !== action.payload);
      })
      .addCase(removeCustomerFromProvider.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // ---- Toggle Customer Status ----
      .addCase(toggleCustomerStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(toggleCustomerStatus.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.customers = state.customers.map((c) =>
          c.id === action.payload.id ? { ...c, status: action.payload.status } : c
        );
      })
      .addCase(toggleCustomerStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

  },
});

export const { resetCustomerState, openAddCustomerModal, closeAddCustomerModal } = customerSlice.actions;

export default customerSlice.reducer;
