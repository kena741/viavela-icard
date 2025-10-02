import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { supabase } from "@/supabaseClient";
import type { RootState } from "@/store/store";

export type FeedbackType = "bug" | "idea" | "ui-ux" | "other";

export interface FeedbackMeta {
    page_path?: string;
    user_agent?: string;
    language?: string;
    // Extra user answers
    goal?: string; // What were you trying to do?
    friction?: string; // What was hard or confusing?
    next_improvement?: string; // What's the one thing we should improve next?
    slow_or_break?: "yes" | "no";
    slow_or_break_detail?: string;
    solved_expected?: "yes" | "no";
    missing_detail?: string;
    liked_one_thing?: string;
    weekly_use_likelihood?: number; // 0-10
}

export interface SubmitFeedbackArgs {
    rating: number;
    type: FeedbackType;
    message: string;
    userId?: string | null;
    userEmail?: string | null;
    includeMeta?: boolean;
    meta?: FeedbackMeta | null;
    file?: File | null;
}

export interface FeedbackRow {
    id?: string;
    created_at?: string;
    user_id: string | null;
    user_email: string | null;
    rating: number;
    type: FeedbackType;
    message: string;
    screenshot_url: string | null;
    meta: FeedbackMeta | null;
}

interface FeedbackState {
    status: "idle" | "loading" | "succeeded" | "failed";
    error: string | null;
    lastSubmitted: FeedbackRow | null;
}

const initialState: FeedbackState = {
    status: "idle",
    error: null,
    lastSubmitted: null,
};

async function uploadScreenshot(file?: File | null): Promise<string | null> {
    if (!file) return null;
    const ext = file.name.split(".").pop() || "png";
    const key = `screenshots/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
    const { error } = await supabase.storage.from("feedback").upload(key, file, { upsert: false });
    if (error) throw error;
    const { data } = supabase.storage.from("feedback").getPublicUrl(key);
    return data?.publicUrl ?? null;
}

export const submitFeedback = createAsyncThunk<
    FeedbackRow,
    SubmitFeedbackArgs
>("feedback/submit", async (args, { rejectWithValue }) => {
    try {
        const screenshot_url = await uploadScreenshot(args.file);

        // Prefer the currently authenticated Supabase user to satisfy FK constraints
        const { data: authData } = await supabase.auth.getUser();
        const effectiveUserId = authData?.user?.id ?? null;

        const meta: FeedbackMeta | null = args.includeMeta ? (args.meta ?? null) : (args.meta ?? null);
        const basePayload: FeedbackRow = {
            user_id: effectiveUserId,
            user_email: args.userEmail ?? null,
            rating: args.rating,
            type: args.type,
            message: args.message.trim(),
            screenshot_url,
            meta,
        };

        let { data, error } = await supabase.from("feedback").insert(basePayload).select().single();
        // If FK violation occurs for any reason, retry with anonymous (null) user_id
        type SupabaseErrorWithCode = { code?: string; message?: string };
        const errorWithCode = error as SupabaseErrorWithCode;
        if (error && errorWithCode.code === "23503") {
            const anonPayload = { ...basePayload, user_id: null };
            const retry = await supabase.from("feedback").insert(anonPayload).select().single();
            data = retry.data;
            error = retry.error;
        }
        if (error) throw error;
        return data as FeedbackRow;
    } catch (err: unknown) {
        const errorMessage =
            err && typeof err === "object" && "message" in err
                ? (err as { message?: string }).message
                : "Failed to submit feedback";
        return rejectWithValue(errorMessage);
    }
});

const feedbackSlice = createSlice({
    name: "feedback",
    initialState,
    reducers: {
        resetFeedbackState: () => initialState,
    },
    extraReducers: (builder) => {
        builder
            .addCase(submitFeedback.pending, (state) => {
                state.status = "loading";
                state.error = null;
            })
            .addCase(submitFeedback.fulfilled, (state, action: PayloadAction<FeedbackRow>) => {
                state.status = "succeeded";
                state.lastSubmitted = action.payload;
            })
            .addCase(submitFeedback.rejected, (state, action) => {
                state.status = "failed";
                state.error = (action.payload as string) || action.error.message || "Unknown error";
            });
    },
});

export const { resetFeedbackState } = feedbackSlice.actions;
export default feedbackSlice.reducer;

// Selectors
export const selectFeedbackStatus = (state: RootState) => state.feedback.status;
export const selectFeedbackError = (state: RootState) => state.feedback.error;
export const selectLastFeedback = (state: RootState) => state.feedback.lastSubmitted;
