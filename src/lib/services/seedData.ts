import type {
  Organization, Subscription, Role, User, Customer, MarketingChannel,
  MarketingCampaign, Campaign, LeadStatusMaster, Lead, ProductService,
  Quotation, QuotationItem, Payment, Invoice, InvoiceItem, ServiceOrder,
  Feedback, Inquiry, Opportunity, Sale, FollowUpTask, SupportTicket,
  WorkflowRule, Activity, AuditLog
} from '$lib/types/crm';

// Table 1: organizations
export const initialOrganizations: Organization[] = [
  {
    organization_id: 1,
    organization_name: 'SymphoReach Global Corporate',
    email: 'contact@symphoreach.com',
    phone: '+1 (800) 555-0199',
    address: '100 Innovation Way, Suite 400, San Francisco, CA',
    status: 'ACTIVE',
    created_at: '2025-01-01T00:00:00Z'
  },
  {
    organization_id: 2,
    organization_name: 'Nexus Digital Systems',
    email: 'info@nexusdigital.io',
    phone: '+1 (800) 555-0244',
    address: '500 Tech Boulevard, Austin, TX',
    status: 'ACTIVE',
    created_at: '2025-03-15T00:00:00Z'
  }
];

// Table 2: subscriptions
export const initialSubscriptions: Subscription[] = [
  {
    subscription_id: 101,
    organization_id: 1,
    plan_name: 'Enterprise Scale Plan',
    start_date: '2026-01-01',
    end_date: '2026-12-31',
    subscription_status: 'ACTIVE',
    created_at: '2026-01-01T08:00:00Z'
  },
  {
    subscription_id: 102,
    organization_id: 2,
    plan_name: 'Growth Pro Plan',
    start_date: '2026-03-15',
    end_date: '2027-03-15',
    subscription_status: 'ACTIVE',
    created_at: '2026-03-15T09:30:00Z'
  }
];

// Table 3: roles
export const initialRoles: Role[] = [
  { role_id: 1, role_name: 'Super Admin', description: 'Platform level administrator across all subscribed organizations' },
  { role_id: 2, role_name: 'Admin', description: 'Organization level administrator' },
  { role_id: 3, role_name: 'Client', description: 'External customer portal access' },
  { role_id: 4, role_name: 'Sales', description: 'Sales pipeline and lead management' },
  { role_id: 5, role_name: 'Marketing', description: 'Campaign management and channel tracking' },
  { role_id: 6, role_name: 'Finance', description: 'Quotations, invoicing, and payment processing' },
  { role_id: 7, role_name: 'Support', description: 'Post-sale customer fulfillment and support tickets' }
];

// Table 4: users
export const initialUsers: User[] = [
  {
    id: 'usr-1',
    user_id: 1,
    organization_id: null, // Super Admin operates at platform level
    role_id: 1,
    role: 'ADMIN',
    name: 'Alex Morgan (Super Admin)',
    email: 'admin@symphoreach.com',
    status: 'ACTIVE',
    created_at: '2025-01-01T00:00:00Z',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100'
  },
  {
    id: 'usr-2',
    user_id: 2,
    organization_id: 1,
    role_id: 4,
    role: 'SALES',
    name: 'Sarah Jenkins (Sales Lead)',
    email: 'sarah@symphoreach.com',
    status: 'ACTIVE',
    created_at: '2025-02-10T00:00:00Z',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100'
  },
  {
    id: 'usr-3',
    user_id: 3,
    organization_id: 1,
    role_id: 5,
    role: 'MARKETING',
    name: 'David Chen (Marketing Dir)',
    email: 'david@symphoreach.com',
    status: 'ACTIVE',
    created_at: '2025-02-12T00:00:00Z',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100'
  },
  {
    id: 'usr-4',
    user_id: 4,
    organization_id: 1,
    role_id: 6,
    role: 'FINANCE',
    name: 'Elena Rostova (Finance Manager)',
    email: 'elena@symphoreach.com',
    status: 'ACTIVE',
    created_at: '2025-02-15T00:00:00Z',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100'
  },
  {
    id: 'usr-5',
    user_id: 5,
    organization_id: 1,
    role_id: 7,
    role: 'SUPPORT',
    name: 'Marcus Vance (Support Lead)',
    email: 'marcus@symphoreach.com',
    status: 'ACTIVE',
    created_at: '2025-03-01T00:00:00Z',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100'
  },
  {
    id: 'usr-6',
    user_id: 6,
    organization_id: 1,
    role_id: 3,
    role: 'CUSTOMER',
    name: 'Sophia Sterling (Portal Client)',
    email: 'sophia@sterlingtech.io',
    status: 'ACTIVE',
    created_at: '2026-07-05T00:00:00Z',
    customerId: 'cust-101',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100'
  }
];

// Table 6: marketing_channels
export const initialMarketingChannels: MarketingChannel[] = [
  { channel_id: 1, organization_id: 1, channel_name: 'LinkedIn', description: 'B2B Professional Network Campaigns', status: 'ACTIVE' },
  { channel_id: 2, organization_id: 1, channel_name: 'Instagram', description: 'Visual Product Demos & Stories', status: 'ACTIVE' },
  { channel_id: 3, organization_id: 1, channel_name: 'Website', description: 'Inbound Inquiries & Contact Forms', status: 'ACTIVE' },
  { channel_id: 4, organization_id: 1, channel_name: 'Facebook', description: 'Meta Targeted Audience Campaigns', status: 'ACTIVE' },
  { channel_id: 5, organization_id: 1, channel_name: 'Referral', description: 'Partner & College Referral Network', status: 'ACTIVE' },
  { channel_id: 6, organization_id: 1, channel_name: 'Word of Mouth', description: 'Organic Client Recommendations', status: 'ACTIVE' }
];

// Table 7: marketing_campaigns
export const initialMarketingCampaigns: MarketingCampaign[] = [
  {
    campaign_id: 1,
    organization_id: 1,
    channel_id: 1,
    campaign_name: 'Q3 Enterprise Software Blitz',
    budget: 15000,
    amount_spent: 14200,
    start_date: '2026-06-01',
    end_date: '2026-08-30',
    status: 'ACTIVE'
  },
  {
    campaign_id: 2,
    organization_id: 1,
    channel_id: 5,
    campaign_name: 'Student & Educator Discount Launch',
    budget: 5000,
    amount_spent: 4100,
    start_date: '2026-07-15',
    end_date: '2026-09-15',
    status: 'ACTIVE'
  },
  {
    campaign_id: 3,
    organization_id: 1,
    channel_id: 4,
    campaign_name: 'Meta Tech Growth Retargeting',
    budget: 8000,
    amount_spent: 7800,
    start_date: '2026-07-01',
    end_date: '2026-08-20',
    status: 'COMPLETED'
  }
];

export const initialCampaigns: Campaign[] = [
  {
    id: 'cmp-1',
    name: 'Q3 Enterprise Software Blitz',
    channel: 'LinkedIn',
    budget: 15000,
    startDate: '2026-06-01',
    endDate: '2026-08-30',
    targetAudience: 'CTOs & VP Engineering in Fintech',
    leadsGenerated: 120,
    qualifiedLeads: 45,
    customersAcquired: 12,
    revenue: 180000,
    conversionRate: 10.0,
    roi: 1100.0
  },
  {
    id: 'cmp-2',
    name: 'Student & Educator Discount Launch',
    channel: 'College Referral',
    budget: 5000,
    startDate: '2026-07-15',
    endDate: '2026-09-15',
    targetAudience: 'University Tech Clubs & Professors',
    leadsGenerated: 350,
    qualifiedLeads: 180,
    customersAcquired: 40,
    revenue: 40000,
    conversionRate: 11.43,
    roi: 700.0
  },
  {
    id: 'cmp-3',
    name: 'Meta Tech Growth Retargeting',
    channel: 'Meta Ads',
    budget: 8000,
    startDate: '2026-07-01',
    endDate: '2026-08-20',
    targetAudience: 'SaaS Founders & Product Leads',
    leadsGenerated: 90,
    qualifiedLeads: 25,
    customersAcquired: 5,
    revenue: 35000,
    conversionRate: 5.56,
    roi: 337.5
  }
];

// Table 8: lead_statuses (Master lookup)
export const initialLeadStatuses: LeadStatusMaster[] = [
  { lead_status_id: 1, status_name: 'New Enquiry', stage_order: 1 },
  { lead_status_id: 2, status_name: 'Interested', stage_order: 2 },
  { lead_status_id: 3, status_name: 'Pricing Enquiry', stage_order: 3 },
  { lead_status_id: 4, status_name: 'Quotation Sent', stage_order: 4 },
  { lead_status_id: 5, status_name: 'Negotiation', stage_order: 5 },
  { lead_status_id: 6, status_name: 'Converted', stage_order: 6 },
  { lead_status_id: 7, status_name: 'Lost', stage_order: 7 }
];

// Table 9: leads
export const initialLeads: Lead[] = [
  {
    id: 'ld-101',
    lead_id: 101,
    organization_id: 1,
    customer_id: 101,
    channel_id: 1,
    campaign_id: 1,
    lead_status_id: 6, // Converted
    enquiry_subject: 'Enterprise License Deployment Inquiry',
    enquiry_details: 'Inquiring for 50 licenses for Sterling Tech team',
    enquiry_date: '2026-07-05T10:00:00Z',
    created_at: '2026-07-05T10:00:00Z',
    name: 'Sophia Sterling',
    company: 'Sterling Tech Solutions',
    email: 'sophia@sterlingtech.io',
    phone: '+1 (555) 234-5678',
    status: 'WON',
    source: 'LinkedIn',
    campaignId: 'cmp-1',
    marketingCost: 125,
    assignedEmployee: 'Sarah Jenkins',
    leadDate: '2026-07-05',
    score: 94,
    notes: 'High intent enterprise lead inquiring for 50 licenses.',
    revenueGenerated: 45000,
    conversionStatus: 'CONVERTED'
  },
  {
    id: 'ld-102',
    lead_id: 102,
    organization_id: 1,
    customer_id: null,
    channel_id: 4,
    campaign_id: 3,
    lead_status_id: 4, // Quotation Sent
    enquiry_subject: 'Custom API Integration Pricing',
    enquiry_details: 'Evaluating custom API integration package for SaaS platform',
    enquiry_date: '2026-07-12T14:30:00Z',
    created_at: '2026-07-12T14:30:00Z',
    name: 'Rahul Sharma',
    company: 'Apex Digital Labs',
    email: 'rahul@apexdigital.com',
    phone: '+1 (555) 876-5432',
    status: 'QUOTATION',
    source: 'Meta Ads',
    campaignId: 'cmp-3',
    marketingCost: 88,
    assignedEmployee: 'Sarah Jenkins',
    leadDate: '2026-07-12',
    score: 82,
    notes: 'Evaluating custom API integration package.',
    revenueGenerated: 0,
    conversionStatus: 'ACTIVE'
  },
  {
    id: 'ld-103',
    lead_id: 103,
    organization_id: 1,
    customer_id: null,
    channel_id: 5,
    campaign_id: 2,
    lead_status_id: 2, // Interested
    enquiry_subject: 'University Lab License Program',
    enquiry_details: 'Needs multi-user lab license discount details',
    enquiry_date: '2026-07-18T11:15:00Z',
    created_at: '2026-07-18T11:15:00Z',
    name: 'Dr. Aris Vance',
    company: 'Vance Tech Institute',
    email: 'aris@vancetech.edu',
    phone: '+1 (555) 998-1122',
    status: 'QUALIFIED',
    source: 'College Referral',
    campaignId: 'cmp-2',
    marketingCost: 20,
    assignedEmployee: 'Sarah Jenkins',
    leadDate: '2026-07-18',
    score: 76,
    notes: 'Inquired for multi-user lab license program.',
    revenueGenerated: 0,
    conversionStatus: 'ACTIVE'
  },
  {
    id: 'ld-104',
    lead_id: 104,
    organization_id: 1,
    customer_id: null,
    channel_id: 3,
    campaign_id: null,
    lead_status_id: 1, // New Enquiry
    enquiry_subject: 'General Product Demo Request',
    enquiry_details: 'Submitted website contact form requesting live demo',
    enquiry_date: '2026-08-01T09:00:00Z',
    created_at: '2026-08-01T09:00:00Z',
    name: 'Chloe Bennett',
    company: 'Horizon Cloud Networks',
    email: 'chloe@horizoncloud.io',
    phone: '+1 (555) 443-8899',
    status: 'NEW',
    source: 'Website',
    marketingCost: 15,
    assignedEmployee: 'Sarah Jenkins',
    leadDate: '2026-08-01',
    score: 65,
    notes: 'Submitted website demo request.',
    revenueGenerated: 0,
    conversionStatus: 'ACTIVE'
  }
];

// Table 5: customers
export const initialCustomers: Customer[] = [
  {
    id: 'cust-101',
    customer_id: 101,
    organization_id: 1,
    user_id: 6, // Sophia Sterling user link
    customer_name: 'Sophia Sterling',
    name: 'Sophia Sterling',
    company: 'Sterling Tech Solutions',
    email: 'sophia@sterlingtech.io',
    phone: '+1 (555) 234-5678',
    address: '450 Silicon Avenue, San Jose, CA',
    segment: 'High Value',
    originalSource: 'LinkedIn',
    campaignId: 'cmp-1',
    created_at: '2026-07-15T00:00:00Z',
    createdDate: '2026-07-15',
    totalSpent: 45000,
    winningOpportunityId: 'opp-201',
    status: 'ACTIVE'
  }
];

// Table 10: products_services
export const initialProductsServices: ProductService[] = [
  {
    product_id: 1,
    organization_id: 1,
    product_name: 'SymphoReach Enterprise Platform License',
    description: 'Full annual enterprise cloud platform access with unlimited seats',
    type: 'Product',
    base_price: 35000,
    status: 'ACTIVE',
    created_at: '2026-01-01T00:00:00Z'
  },
  {
    product_id: 2,
    organization_id: 1,
    product_name: 'Dedicated Onboarding & API Integration',
    description: 'Custom engineering setup, SSO integration, and staff training',
    type: 'Service',
    base_price: 10000,
    status: 'ACTIVE',
    created_at: '2026-01-01T00:00:00Z'
  },
  {
    product_id: 3,
    organization_id: 1,
    product_name: '24/7 Premium SLA Support Package',
    description: 'Dedicated technical account manager with 15-minute response SLA',
    type: 'Service',
    base_price: 5000,
    status: 'ACTIVE',
    created_at: '2026-01-01T00:00:00Z'
  }
];

// Table 12: quotation_items
export const initialQuotationItems: QuotationItem[] = [
  {
    id: 'qti-1',
    quotation_item_id: 1,
    quotation_id: 301,
    product_id: 1,
    quantity: 1,
    unit_price: 35000,
    discount_amount: 0,
    line_total: 35000,
    description: 'SymphoReach Enterprise Platform License',
    unitPrice: 35000,
    discount: 0,
    total: 35000
  },
  {
    id: 'qti-2',
    quotation_item_id: 2,
    quotation_id: 301,
    product_id: 2,
    quantity: 1,
    unit_price: 10000,
    discount_amount: 0,
    line_total: 10000,
    description: 'Dedicated Onboarding & API Integration',
    unitPrice: 10000,
    discount: 0,
    total: 10000
  }
];

// Table 11: quotations
export const initialQuotations: Quotation[] = [
  {
    id: 'qt-301',
    quotation_id: 301,
    organization_id: 1,
    customer_id: 101,
    lead_id: 101,
    quotation_number: 'QT-2026-001',
    quotation_date: '2026-07-10',
    valid_until: '2026-08-10',
    discount_amount: 0,
    total_amount: 45000,
    status: 'ACCEPTED',
    quotationNumber: 'QT-2026-001',
    opportunityId: 'opp-201',
    leadId: 'ld-101',
    customerId: 'cust-101',
    version: 1,
    items: initialQuotationItems,
    subtotal: 45000,
    discountTotal: 0,
    taxableAmount: 45000,
    taxRate: 0,
    taxAmount: 0,
    grandTotal: 45000,
    createdDate: '2026-07-10',
    validUntil: '2026-08-10',
    terms: 'Payment terms: 50% upfront, 50% upon deployment completion.'
  }
];

// Table 14: invoices
export const initialInvoices: Invoice[] = [
  {
    id: 'inv-401',
    invoice_id: 401,
    organization_id: 1,
    customer_id: 101,
    quotation_id: 301,
    invoice_number: 'INV-2026-089',
    invoice_date: '2026-07-15',
    due_date: '2026-08-15',
    total_amount: 45000,
    payment_status: 'PAID',
    invoiceNumber: 'INV-2026-089',
    type: 'TAX_INVOICE',
    quotationId: 'qt-301',
    saleId: 'sl-501',
    customerId: 'cust-101',
    issueDate: '2026-07-15',
    dueDate: '2026-08-15',
    subtotal: 45000,
    tax: 0,
    total: 45000,
    paidAmount: 45000,
    outstandingAmount: 0,
    status: 'PAID'
  }
];

// Table 15: invoice_items
export const initialInvoiceItems: InvoiceItem[] = [
  {
    invoice_item_id: 1,
    invoice_id: 401,
    product_id: 1,
    quantity: 1,
    unit_price: 35000,
    line_total: 35000
  },
  {
    invoice_item_id: 2,
    invoice_id: 401,
    product_id: 2,
    quantity: 1,
    unit_price: 10000,
    line_total: 10000
  }
];

// Table 13: payments
export const initialPayments: Payment[] = [
  {
    id: 'pay-601',
    payment_id: 601,
    organization_id: 1,
    customer_id: 101,
    quotation_id: 301,
    amount: 45000,
    payment_method: 'BANK_TRANSFER',
    transaction_reference: 'WIRE-99482103',
    payment_status: 'SUCCESS',
    payment_date: '2026-07-16T11:00:00Z',
    paymentNumber: 'PAY-2026-001',
    invoiceId: 'inv-401',
    customerId: 'cust-101',
    method: 'BANK_TRANSFER',
    referenceNumber: 'WIRE-99482103',
    notes: 'Full payment cleared for Enterprise License + Onboarding'
  }
];

// Table 16: service_orders
export const initialServiceOrders: ServiceOrder[] = [
  {
    service_order_id: 701,
    organization_id: 1,
    customer_id: 101,
    invoice_id: 401,
    start_date: '2026-07-18',
    completion_date: '2026-08-05',
    service_status: 'COMPLETED',
    remarks: 'Enterprise platform deployed and SSO configured successfully.',
    customerName: 'Sophia Sterling (Sterling Tech Solutions)',
    invoiceNumber: 'INV-2026-089'
  }
];

// Table 17: feedback
export const initialFeedbacks: Feedback[] = [
  {
    id: 'fb-801',
    feedback_id: 801,
    customer_id: 101,
    service_order_id: 701,
    rating: 5,
    comments: 'Exceptional onboarding experience! The platform integration was seamless.',
    submitted_at: '2026-08-06T15:20:00Z',
    saleId: 'sl-501',
    customerId: 'cust-101',
    serviceQuality: 'EXCELLENT',
    comment: 'Exceptional onboarding experience! The platform integration was seamless.',
    improvementSuggestion: 'Provide customizable dashboard widgets in future updates.',
    createdDate: '2026-08-06'
  }
];

// Auxiliaries
export const initialInquiries: Inquiry[] = [
  {
    id: 'inq-1',
    leadId: 'ld-101',
    inquiryDate: '2026-07-05',
    category: 'PRICING',
    question: 'Can you share volume discount tiers for 50+ enterprise users?',
    response: 'Shared custom pricing sheet offering 15% volume discount.',
    assignedEmployee: 'Sarah Jenkins',
    status: 'RESOLVED'
  }
];

export const initialOpportunities: Opportunity[] = [
  {
    id: 'opp-201',
    leadId: 'ld-101',
    title: 'Sterling Tech Enterprise License Deployment',
    requirement: '50 Enterprise Cloud Seats + Custom SSO Integration',
    expectedValue: 45000,
    probability: 100,
    weightedRevenue: 45000,
    expectedCloseDate: '2026-07-15',
    assignedSalesperson: 'Sarah Jenkins',
    stage: 'CLOSED_WON',
    notes: 'Won against competitor due to faster onboarding SLA.'
  }
];

export const initialSales: Sale[] = [
  {
    id: 'sl-501',
    quotationId: 'qt-301',
    opportunityId: 'opp-201',
    customerId: 'cust-101',
    amount: 45000,
    saleDate: '2026-07-15',
    thankYouSent: true,
    feedbackRequested: true
  }
];

export const initialTasks: FollowUpTask[] = [
  {
    id: 'tsk-1',
    title: 'Schedule Q3 Performance Review with Sophia Sterling',
    customerId: 'cust-101',
    assignedEmployee: 'Sarah Jenkins',
    dueDate: '2026-08-28',
    priority: 'HIGH',
    status: 'PENDING',
    notes: 'Discuss expansion into their European subsidiary.'
  }
];

export const initialTickets: SupportTicket[] = [
  {
    id: 'tkt-1',
    ticketNumber: 'TKT-2026-012',
    customerId: 'cust-101',
    subject: 'SSO Certificate Renewal Clarification',
    description: 'Requesting confirmation on SAML 2.0 metadata certificate expiry date.',
    priority: 'LOW',
    assignedAgent: 'Marcus Vance',
    status: 'RESOLVED',
    createdDate: '2026-08-10',
    resolution: 'Provided updated SAML cert file and valid expiry date.',
    closedDate: '2026-08-10'
  }
];

export const initialWorkflows: WorkflowRule[] = [
  {
    id: 'wf-1',
    name: 'Auto-Generate Service Order on Payment Success',
    trigger: 'PAYMENT_RECEIVED',
    condition: 'payment_status == SUCCESS',
    action: 'Create service_orders entry with status INITIATED',
    enabled: true,
    executionCount: 14
  },
  {
    id: 'wf-2',
    name: 'Post-Fulfillment Feedback Prompt',
    trigger: 'SERVICE_ORDER_COMPLETED',
    condition: 'service_status == COMPLETED',
    action: 'Send automated rating & feedback request link to customer',
    enabled: true,
    executionCount: 9
  }
];

export const initialActivities: Activity[] = [
  {
    id: 'act-1',
    entityType: 'CUSTOMER',
    entityId: 'cust-101',
    type: 'SERVICE_ORDER_COMPLETED',
    description: 'Service Order #701 completed successfully.',
    performedBy: 'Marcus Vance',
    timestamp: '2026-08-05T17:00:00Z'
  }
];

export const initialAuditLogs: AuditLog[] = [
  {
    id: 'aud-1',
    timestamp: '2026-08-05T17:00:00Z',
    actor: 'Marcus Vance',
    action: 'UPDATE_SERVICE_STATUS',
    entity: 'service_orders',
    entityId: '701',
    changes: [{ field: 'service_status', oldValue: 'IN_PROGRESS', newValue: 'COMPLETED' }]
  }
];
