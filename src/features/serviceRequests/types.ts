// src/features/serviceRequests/types.ts

export interface ServiceRequest {
  id: string;
  bookingDate: Date;
  createdAt: Date;
  scheduledFor: Date;
  customerId: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  email: string;
  address?: string;
  categoryName?: string;
  subCategoryName?: string;
  serviceName?: string;
  quantity?: number;
  price?: number;
  discount?: number;
  totalAmount?: number;
  description?: string;
  notes?: string;
  paymentCompleted?: boolean;
  status: string;
}
