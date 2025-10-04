import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { resetStore } from './resetActions';



import authReducer from "../features/auth/loginSlice";
import createuserReducer from "../features/auth/signupSlice";
import availabilityReducer from "../features/availability/availabilitySlice";
import serviceStatsReducer from "../features/serviceStats/serviceStatsSlice";
import serviceReducer from "../features/service/serviceSlice";
import { addServiceModalSliceReducer } from "../features/service/addServiceSlice";
import { addMenuItemModalSliceReducer } from "../features/menu/addMenuItemSlice";
import { menuItemsReducer } from "../features/menu/fetchmenuItemsSlice";
import editServiceReducer from "../features/service/editServiceSlice";
import providerReducer from "../features/provider/providerSlice";
import customerReducer from "../features/provider/customerSlice";

const appReducer = combineReducers({
  auth: authReducer,
  createuser: createuserReducer,
  availability: availabilityReducer,
  serviceStats: serviceStatsReducer,
  service: serviceReducer,
  editService: editServiceReducer,
  provider: providerReducer,
  customer: customerReducer,
  addServiceModal: addServiceModalSliceReducer,
  addMenuItemModal: addMenuItemModalSliceReducer,
  menuItems: menuItemsReducer,
});

// Reset the store when resetStore action is dispatched
const RESET_TYPE = resetStore.type;
const rootReducer = (
  state: ReturnType<typeof appReducer> | undefined,
  action: { type: string;[key: string]: unknown }
) => {
  if (action && action.type === RESET_TYPE) {
    state = undefined;
  }
  return appReducer(state, action);
};

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
});

// Types for use throughout the app
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
