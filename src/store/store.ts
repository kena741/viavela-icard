import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { resetStore } from './resetActions';



import authReducer from "../features/auth/loginSlice";
import createuserReducer from "../features/auth/signupSlice";
import availabilityReducer from "../features/availability/availabilitySlice";
import serviceStatsReducer from "../features/serviceStats/serviceStatsSlice";
import serviceRequestsReducer from "../features/serviceRequests/serviceRequestsSlice";
import serviceReducer from "../features/service/serviceSlice";
import { addServiceModalSliceReducer } from "../features/service/addServiceSlice";
import editServiceReducer from "../features/service/editServiceSlice";
import categoryWithSubReducer from "../features/service/categoryWithSubSlice";
import providerReducer from "../features/provider/providerSlice";
import customerReducer from "../features/provider/customerSlice";
import requestDetailServiceReducer from "../features/requests/requestDetailServiceSlice";
import assignHandymanModalReducer from "../features/requests/assignHandymanModalSlice";
import requestsReducer from "../features/requests/requestsSlice";
import handymanReducer from "../features/handyman/handymanSlice";
import feedbackReducer from "../features/feedback/feedbackSlice";
import customerDetailReducer from "../features/customer copy/customerSlice";
import orderReducer from "../features/bookService/orderSlice";

const appReducer = combineReducers({
  auth: authReducer,
  createuser: createuserReducer,
  availability: availabilityReducer,
  serviceStats: serviceStatsReducer,
  serviceRequests: serviceRequestsReducer,
  service: serviceReducer,
  editService: editServiceReducer,
  categoryWithSub: categoryWithSubReducer,
  provider: providerReducer,
  customer: customerReducer,
  requestDetailService: requestDetailServiceReducer,
  assignHandymanModal: assignHandymanModalReducer,
  requests: requestsReducer,
  handyman: handymanReducer,
  feedback: feedbackReducer,
  customerDetail: customerDetailReducer,
  order: orderReducer,
  addServiceModal: addServiceModalSliceReducer,
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
