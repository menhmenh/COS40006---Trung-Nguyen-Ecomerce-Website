// Subscription Plan Interface
export interface ISubscriptionPlan {
  plan_id: string;
  plan_name: string;
  description?: string;
  price: number;
  billing_cycle: number;
  frequency: 'MONTHLY' | 'QUARTERLY' | 'ANNUAL';
  max_skip_per_year: number;
  status: 'ACTIVE' | 'INACTIVE' | 'ARCHIVED';
  created_date: Date;
  updated_date: Date;
  created_by?: string;
}

// Subscription Interface
export interface ISubscription {
  subscription_id: string;
  user_id: string;
  plan_id: string;
  subscription_status: 'ACTIVE' | 'PAUSED' | 'CANCELLED' | 'PENDING';
  start_date: Date;
  next_billing_date: Date;
  last_billing_date?: Date;
  cancelled_date?: Date;
  cancellation_reason?: string;
  payment_method_id?: string;
  delivery_address_id?: string;
  skipped_months: number;
  created_date: Date;
  updated_date: Date;
}

// Subscription Item Interface
export interface ISubscriptionItem {
  subscription_item_id: string;
  subscription_id: string;
  month_number: number;
  product_id?: string;
  quantity: number;
  included_items?: string; // JSON array
  customization?: string; // JSON object
  created_date: Date;
  updated_date: Date;
}

// Subscription Order Interface
export interface ISubscriptionOrder {
  subscription_order_id: string;
  subscription_id: string;
  order_id?: string;
  billing_month: Date;
  amount: number;
  status: 'PENDING' | 'CHARGED' | 'FAILED' | 'REFUNDED';
  payment_status: 'UNPAID' | 'PAID' | 'FAILED';
  retry_count: number;
  last_retry_date?: Date;
  charge_date?: Date;
  error_message?: string;
  created_date: Date;
  updated_date: Date;
}

// Subscription Skip Request Interface
export interface ISubscriptionSkipRequest {
  skip_request_id: string;
  subscription_id: string;
  skip_billing_date: Date;
  status: 'APPROVED' | 'REJECTED';
  reason?: string;
  created_date: Date;
  requested_by?: string;
}

// Subscription Change Interface
export interface ISubscriptionChange {
  change_id: string;
  subscription_id: string;
  change_type: 'PLAN_UPGRADE' | 'PLAN_DOWNGRADE' | 'ADDRESS_UPDATE' | 'PAUSE' | 'RESUME' | 'CANCEL';
  old_value?: string; // JSON
  new_value?: string; // JSON
  effective_date: Date;
  reason?: string;
  created_date: Date;
  created_by?: string;
}

// DTOs for API requests/responses
export interface CreateSubscriptionDTO {
  plan_id: string;
  user_id: string;
  delivery_address_id: string;
  payment_method_id: string;
}

export interface UpdateSubscriptionDTO {
  subscription_status?: 'ACTIVE' | 'PAUSED' | 'CANCELLED';
  delivery_address_id?: string;
  payment_method_id?: string;
}

export interface CreateSubscriptionPlanDTO {
  plan_name: string;
  description?: string;
  price: number;
  billing_cycle?: number;
  frequency?: string;
  max_skip_per_year?: number;
}
