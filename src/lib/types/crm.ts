// Authoritative 17-Table Relational Specification Types for SymphoReach

// Table 1: organizations
export interface Organization {
  organization_id: number;
  organization_name: string;
  email: string;
  phone: string;
  address: string;
  status: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED';
  created_at: string;
}

// Table 2: subscriptions
export interface Subscription {
  subscription_id: number;
  organization_id: number;
  plan_name: string;
  start_date: string;
  end_date: string;
  subscription_status: 'ACTIVE' | 'EXPIRED' | 'CANCELLED' | 'PENDING';
  created_at: string;
}

// Table 3: roles
export type RoleName = 'Super Admin' | 'Admin' | 'Client' | 'Sales' | 'Marketing' | 'Finance' | 'Support';

export interface Role {
  role_id: number;
  role_name: RoleName;
  description: string;
}

export type UserRole = 'ADMIN' | 'SALES' | 'MARKETING' | 'FINANCE' | 'SUPPORT' | 'CUSTOMER';

// Table 4: users
export interface User {
  id: string; // legacy string ID for frontend compatibility
  user_id: number;
  organization_id: number | null; // NULL for Super Admin
  role_id: number;
  role: UserRole;
  name: string;
  email: string;
  password_hash?: string;
  status: 'ACTIVE' | 'INACTIVE';
  created_at: string;
  avatar?: string;
  customerId?: string; // Links if role is CUSTOMER
}

// Table 5: customers
export type CustomerSegment =
  | 'New Customer'
  | 'Returning Customer'
  | 'High Value'
  | 'Inactive'
  | 'Potential'
  | 'Corporate'
  | 'Student'
  | 'Referral Customer';

export interface Customer {
  id: string; // legacy string ID
  customer_id: number;
  organization_id: number;
  user_id?: number | null; // Optional user link for customer portal
  customer_name: string;
  name: string; // for UI component backward-compatibility
  company: string;
  email: string;
  phone: string;
  address?: string;
  segment?: CustomerSegment;
  originalSource?: LeadSource;
  campaignId?: string;
  leadId?: string;
  created_at: string;
  createdDate?: string;
  totalSpent?: number;
  winningOpportunityId?: string;
  status?: 'ACTIVE' | 'INACTIVE';
}

// Table 6: marketing_channels
export interface MarketingChannel {
  channel_id: number;
  organization_id: number;
  channel_name: string;
  description: string;
  status: 'ACTIVE' | 'INACTIVE';
}

export type LeadSource =
  | 'Website'
  | 'LinkedIn'
  | 'Instagram'
  | 'Meta Ads'
  | 'College Referral'
  | 'Student Network'
  | 'Friends & Family'
  | 'Word of Mouth'
  | 'Direct Inquiry'
  | 'Other';

// Table 7: marketing_campaigns
export interface MarketingCampaign {
  campaign_id: number;
  organization_id: number;
  channel_id: number;
  campaign_name: string;
  budget: number;
  amount_spent: number;
  start_date: string;
  end_date: string;
  status: 'ACTIVE' | 'PAUSED' | 'COMPLETED';
}

export interface Campaign {
  id: string;
  name: string;
  channel: LeadSource;
  budget: number;
  startDate: string;
  endDate: string;
  targetAudience: string;
  leadsGenerated: number;
  qualifiedLeads: number;
  customersAcquired: number;
  revenue: number;
  conversionRate: number;
  roi: number;
}

// Table 8: lead_statuses
export type StageName =
  | 'New Enquiry'
  | 'Interested'
  | 'Pricing Enquiry'
  | 'Quotation Sent'
  | 'Negotiation'
  | 'Converted'
  | 'Lost';

export interface LeadStatusMaster {
  lead_status_id: number;
  status_name: StageName;
  stage_order: number;
}

export type LeadStatus =
  | 'NEW'
  | 'CONTACTED'
  | 'QUALIFIED'
  | 'REQUIREMENT'
  | 'OPPORTUNITY'
  | 'QUOTATION'
  | 'NEGOTIATION'
  | 'WON'
  | 'LOST';

// Table 9: leads
export interface Lead {
  id: string;
  lead_id: number;
  organization_id: number;
  customer_id?: number | null;
  channel_id: number;
  campaign_id?: number | null;
  lead_status_id: number;
  enquiry_subject: string;
  enquiry_details: string;
  enquiry_date: string;
  created_at: string;

  // UI Helper fields
  name: string;
  company: string;
  email: string;
  phone: string;
  status: LeadStatus;
  source: LeadSource;
  campaignId?: string;
  marketingCost: number;
  assignedEmployee: string;
  leadDate: string;
  lostReason?: string;
  lostDate?: string;
  score: number;
  notes: string;
  revenueGenerated: number;
  conversionStatus: 'ACTIVE' | 'CONVERTED' | 'DISQUALIFIED';
}

// Table 10: products_services
export interface ProductService {
  product_id: number;
  organization_id: number;
  product_name: string;
  description: string;
  type: 'Product' | 'Service';
  base_price: number;
  status: 'ACTIVE' | 'INACTIVE';
  created_at: string;
}

// Table 11: quotations
export type QuotationStatus =
  | 'DRAFT'
  | 'SENT'
  | 'VIEWED'
  | 'NEGOTIATION'
  | 'ACCEPTED'
  | 'REJECTED'
  | 'EXPIRED'
  | 'Draft'
  | 'Sent'
  | 'Accepted'
  | 'Rejected'
  | 'Expired';

export interface Quotation {
  id: string;
  quotation_id: number;
  organization_id: number;
  customer_id: number;
  lead_id: number;
  quotation_number: string;
  quotation_date: string;
  valid_until: string;
  discount_amount: number;
  total_amount: number;
  status: QuotationStatus;

  // UI compatibility fields
  quotationNumber: string;
  opportunityId: string;
  leadId: string;
  customerId?: string;
  version: number;
  items: QuotationItem[];
  subtotal: number;
  discountTotal: number;
  couponCode?: string;
  taxableAmount: number;
  taxRate: number;
  taxAmount: number;
  grandTotal: number;
  createdDate: string;
  validUntil: string;
  terms: string;
}

// Table 12: quotation_items
export interface QuotationItem {
  id?: string;
  quotation_item_id: number;
  quotation_id: number;
  product_id: number;
  quantity: number;
  unit_price: number;
  discount_amount: number;
  line_total: number;

  // UI helper fields
  description?: string;
  unitPrice?: number;
  discount?: number;
  total?: number;
}

// Table 13: payments
export interface Payment {
  id: string;
  payment_id: number;
  organization_id: number;
  customer_id: number;
  quotation_id: number;
  amount: number;
  payment_method: string;
  transaction_reference: string;
  payment_status: 'SUCCESS' | 'PENDING' | 'FAILED' | 'REFUNDED';
  payment_date: string;

  // UI helper fields
  paymentNumber?: string;
  invoiceId?: string;
  customerId?: string;
  method?: 'CREDIT_CARD' | 'BANK_TRANSFER' | 'UPI' | 'CHECK';
  referenceNumber?: string;
  notes?: string;
}

// Table 14: invoices
export type InvoiceStatus = 'DRAFT' | 'ISSUED' | 'PARTIALLY_PAID' | 'PAID' | 'OVERDUE' | 'CANCELLED';
export type InvoiceType = 'PROFORMA' | 'TAX_INVOICE';

export interface Invoice {
  id: string;
  invoice_id: number;
  organization_id: number;
  customer_id: number;
  quotation_id: number;
  invoice_number: string;
  invoice_date: string;
  due_date: string;
  total_amount: number;
  payment_status: InvoiceStatus;

  // UI helper fields
  invoiceNumber: string;
  type: InvoiceType;
  quotationId: string;
  saleId?: string;
  customerId: string;
  issueDate: string;
  dueDate: string;
  subtotal: number;
  tax: number;
  total: number;
  paidAmount: number;
  outstandingAmount: number;
  status: InvoiceStatus;
}

// Table 15: invoice_items
export interface InvoiceItem {
  invoice_item_id: number;
  invoice_id: number;
  product_id: number;
  quantity: number;
  unit_price: number;
  line_total: number;
}

// Table 16: service_orders
export interface ServiceOrder {
  service_order_id: number;
  organization_id: number;
  customer_id: number;
  invoice_id: number;
  start_date: string;
  completion_date?: string;
  service_status: 'INITIATED' | 'IN_PROGRESS' | 'COMPLETED' | 'ON_HOLD' | 'CANCELLED';
  remarks?: string;

  // UI Display helpers
  customerName?: string;
  invoiceNumber?: string;
}

// Table 17: feedback
export interface Feedback {
  id: string;
  feedback_id: number;
  customer_id: number;
  service_order_id: number;
  rating: number; // 1 to 5
  comments: string;
  submitted_at: string;

  // UI Display & Legacy compatibility
  saleId?: string;
  customerId?: string;
  serviceQuality?: 'POOR' | 'AVERAGE' | 'GOOD' | 'EXCELLENT';
  comment?: string;
  improvementSuggestion?: string;
  createdDate?: string;
}

// Auxiliary CRM Entities
export type InquiryCategory = 'FEATURE' | 'PRICING' | 'DISCOUNT' | 'COUPON' | 'GENERAL';

export interface Inquiry {
  id: string;
  leadId?: string;
  customerId?: string;
  inquiryDate: string;
  category: InquiryCategory;
  question: string;
  response?: string;
  assignedEmployee: string;
  status: 'OPEN' | 'IN_PROGRESS' | 'RESOLVED';
  followUpDate?: string;
}

export interface Opportunity {
  id: string;
  leadId: string;
  title: string;
  requirement: string;
  expectedValue: number;
  probability: number;
  weightedRevenue: number;
  expectedCloseDate: string;
  assignedSalesperson: string;
  stage: 'REQUIREMENT_ANALYSIS' | 'PROPOSAL_SENT' | 'NEGOTIATION' | 'CLOSED_WON' | 'CLOSED_LOST';
  stageDate?: string;
  notes: string;
}

export interface Sale {
  id: string;
  quotationId: string;
  opportunityId: string;
  customerId: string;
  amount: number;
  saleDate: string;
  thankYouSent: boolean;
  feedbackRequested: boolean;
}

export type TaskStatus = 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED' | 'OVERDUE';
export type TaskPriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';

export interface FollowUpTask {
  id: string;
  title: string;
  leadId?: string;
  customerId?: string;
  assignedEmployee: string;
  dueDate: string;
  priority: TaskPriority;
  status: TaskStatus;
  notes: string;
}

export type TicketStatus = 'OPEN' | 'ASSIGNED' | 'IN_PROGRESS' | 'RESOLVED' | 'CLOSED';

export interface SupportTicket {
  id: string;
  ticketNumber: string;
  customerId: string;
  subject: string;
  description: string;
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  assignedAgent: string;
  status: TicketStatus;
  createdDate: string;
  resolution?: string;
  closedDate?: string;
}

export interface WorkflowRule {
  id: string;
  name: string;
  trigger: string;
  condition: string;
  action: string;
  enabled: boolean;
  executionCount: number;
}

export interface Activity {
  id: string;
  entityType: 'LEAD' | 'CUSTOMER' | 'QUOTATION' | 'INVOICE' | 'OPPORTUNITY' | 'SERVICE_ORDER';
  entityId: string;
  type: string;
  description: string;
  performedBy: string;
  timestamp: string;
}

export interface AuditLog {
  id: string;
  timestamp: string;
  actor: string;
  action: string;
  entity: string;
  entityId: string;
  changes: {
    field: string;
    oldValue: any;
    newValue: any;
  }[];
}
