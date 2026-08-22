import { writable, derived, get } from 'svelte/store';
import type {
  Organization, Subscription, Role, User, UserRole, Customer,
  MarketingChannel, MarketingCampaign, Campaign, LeadStatusMaster, Lead,
  LeadStatus, ProductService, Quotation, QuotationItem, QuotationStatus,
  Payment, Invoice, InvoiceItem, ServiceOrder, Feedback, Inquiry,
  Opportunity, Sale, FollowUpTask, SupportTicket, WorkflowRule, Activity, AuditLog
} from '$lib/types/crm';
import {
  initialOrganizations, initialSubscriptions, initialRoles, initialUsers,
  initialMarketingChannels, initialMarketingCampaigns, initialCampaigns,
  initialLeadStatuses, initialLeads, initialCustomers, initialProductsServices,
  initialQuotationItems, initialQuotations, initialInvoices, initialInvoiceItems,
  initialPayments, initialServiceOrders, initialFeedbacks, initialInquiries,
  initialOpportunities, initialSales, initialTasks, initialTickets,
  initialWorkflows, initialActivities, initialAuditLogs
} from '$lib/services/seedData';
import { automationEngine } from '$lib/services/automationEngine';
import { aiService } from '$lib/services/aiService';

// Active User / Role context
export const currentUser = writable<User>(initialUsers[0]);

// 17 Database Table Stores
export const organizations = writable<Organization[]>(initialOrganizations);
export const subscriptions = writable<Subscription[]>(initialSubscriptions);
export const roles = writable<Role[]>(initialRoles);
export const users = writable<User[]>(initialUsers);
export const customers = writable<Customer[]>(initialCustomers);
export const marketingChannels = writable<MarketingChannel[]>(initialMarketingChannels);
export const marketingCampaigns = writable<MarketingCampaign[]>(initialMarketingCampaigns);
export const campaigns = writable<Campaign[]>(initialCampaigns);
export const leadStatuses = writable<LeadStatusMaster[]>(initialLeadStatuses);
export const leads = writable<Lead[]>(initialLeads);
export const productsServices = writable<ProductService[]>(initialProductsServices);
export const quotations = writable<Quotation[]>(initialQuotations);
export const quotationItems = writable<QuotationItem[]>(initialQuotationItems);
export const payments = writable<Payment[]>(initialPayments);
export const invoices = writable<Invoice[]>(initialInvoices);
export const invoiceItems = writable<InvoiceItem[]>(initialInvoiceItems);
export const serviceOrders = writable<ServiceOrder[]>(initialServiceOrders);
export const feedbacks = writable<Feedback[]>(initialFeedbacks);

// Auxiliary Stores
export const inquiries = writable<Inquiry[]>(initialInquiries);
export const opportunities = writable<Opportunity[]>(initialOpportunities);
export const sales = writable<Sale[]>(initialSales);
export const tasks = writable<FollowUpTask[]>(initialTasks);
export const tickets = writable<SupportTicket[]>(initialTickets);
export const workflows = writable<WorkflowRule[]>(initialWorkflows);
export const activities = writable<Activity[]>(initialActivities);
export const auditLogs = writable<AuditLog[]>(initialAuditLogs);
export const toastMessage = writable<{ type: 'success' | 'error' | 'info'; text: string } | null>(null);

export function showToast(text: string, type: 'success' | 'error' | 'info' = 'success') {
  toastMessage.set({ type, text });
  setTimeout(() => toastMessage.set(null), 4000);
}

// Derived Metrics
export const dashboardMetrics = derived(
  [leads, opportunities, sales, invoices, payments, campaigns, customers, serviceOrders],
  ([$leads, $opportunities, $sales, $invoices, $payments, $campaigns, $customers, $serviceOrders]) => {
    const totalLeads = $leads.length;
    const qualifiedLeads = $leads.filter(l => l.status === 'QUALIFIED' || l.status === 'OPPORTUNITY' || l.status === 'QUOTATION' || l.status === 'NEGOTIATION' || l.status === 'WON' || l.lead_status_id >= 2).length;
    const wonLeads = $leads.filter(l => l.status === 'WON' || l.lead_status_id === 6).length;
    const lostLeads = $leads.filter(l => l.status === 'LOST' || l.lead_status_id === 7).length;

    const totalRevenue = $payments.reduce((acc, p) => acc + p.amount, 0);
    const totalOutstanding = $invoices.filter(i => i.status !== 'CANCELLED').reduce((acc, i) => acc + i.outstandingAmount, 0);
    const totalMarketingSpend = $campaigns.reduce((acc, c) => acc + c.budget, 0);

    const conversionRate = totalLeads > 0 ? (wonLeads / totalLeads) * 100 : 0;
    const marketingRoi = totalMarketingSpend > 0 ? ((totalRevenue - totalMarketingSpend) / totalMarketingSpend) * 100 : 0;

    return {
      totalLeads,
      qualifiedLeads,
      opportunitiesCount: $opportunities.length,
      wonLeads,
      lostLeads,
      totalCustomers: $customers.length,
      activeServiceOrders: $serviceOrders.filter(s => s.service_status === 'IN_PROGRESS' || s.service_status === 'INITIATED').length,
      totalRevenue,
      totalOutstanding,
      totalMarketingSpend,
      conversionRate: Math.round(conversionRate * 10) / 10,
      marketingRoi: Math.round(marketingRoi * 10) / 10
    };
  }
);

// STATUS TRANSITION RULES
const VALID_LEAD_TRANSITIONS: Record<LeadStatus, LeadStatus[]> = {
  NEW: ['CONTACTED', 'QUALIFIED', 'LOST'],
  CONTACTED: ['QUALIFIED', 'LOST'],
  QUALIFIED: ['REQUIREMENT', 'OPPORTUNITY', 'LOST'],
  REQUIREMENT: ['OPPORTUNITY', 'LOST'],
  OPPORTUNITY: ['QUOTATION', 'LOST'],
  QUOTATION: ['NEGOTIATION', 'WON', 'LOST'],
  NEGOTIATION: ['WON', 'LOST'],
  WON: [],
  LOST: []
};

// BUSINESS ACTIONS

/** Switch Active User / Role */
export function setRole(role: UserRole) {
  const matching = get(users).find(u => u.role === role);
  if (matching) {
    currentUser.set(matching);
    showToast(`Switched active view role to ${role}`, 'info');
  }
}

/** Create Lead */
export function createLead(leadData: Omit<Lead, 'id' | 'lead_id' | 'organization_id' | 'lead_status_id' | 'enquiry_subject' | 'enquiry_details' | 'enquiry_date' | 'created_at' | 'leadDate' | 'score' | 'revenueGenerated' | 'conversionStatus'> & { channel_id?: number; campaign_id?: number }): Lead {
  const numericId = Date.now();
  const newId = `ld-${numericId.toString().slice(-4)}`;
  const aiScore = aiService.calculateLeadScore({ source: leadData.source, email: leadData.email, status: leadData.status }).score;

  const channelId = leadData.channel_id || 3; // Default to Website (channel 3)

  const newLead: Lead = {
    ...leadData,
    id: newId,
    lead_id: numericId,
    organization_id: 1,
    channel_id: channelId,
    campaign_id: leadData.campaign_id || null,
    lead_status_id: 1, // New Enquiry
    enquiry_subject: `${leadData.source} Customer Inquiry`,
    enquiry_details: leadData.notes || 'Inbound customer lead',
    enquiry_date: new Date().toISOString(),
    created_at: new Date().toISOString(),
    leadDate: new Date().toISOString().slice(0, 10),
    score: aiScore,
    revenueGenerated: 0,
    conversionStatus: 'ACTIVE'
  };

  leads.update(list => [newLead, ...list]);

  logActivity('LEAD', newId, 'LEAD_CREATED', `Lead ${newLead.name} captured via ${newLead.source}`);
  logAudit('LEAD_CREATED', 'Lead', newId, [{ field: 'status', oldValue: null, newValue: newLead.status }]);

  if (newLead.campaignId) {
    campaigns.update(cList => cList.map(c => c.id === newLead.campaignId ? { ...c, leadsGenerated: c.leadsGenerated + 1 } : c));
  }

  showToast(`New lead '${newLead.name}' created successfully`);
  return newLead;
}

/** Transition Lead Status */
export function updateLeadStatus(leadId: string, newStatus: LeadStatus, lostReason?: string): boolean {
  const currentLeads = get(leads);
  const targetLead = currentLeads.find(l => l.id === leadId || l.lead_id.toString() === leadId);
  if (!targetLead) {
    showToast('Lead not found', 'error');
    return false;
  }

  if (targetLead.status === newStatus) return true;

  const allowed = VALID_LEAD_TRANSITIONS[targetLead.status] || [];
  if (!allowed.includes(newStatus)) {
    showToast(`Invalid status jump from ${targetLead.status} to ${newStatus}. Lifecycle order must be respected.`, 'error');
    return false;
  }

  if (newStatus === 'LOST' && (!lostReason || lostReason.trim() === '')) {
    showToast('Lost reason is mandatory when marking a lead as LOST', 'error');
    return false;
  }

  const oldStatus = targetLead.status;
  const updatedDate = new Date().toISOString().slice(0, 10);

  // Map to Table 8 lead_status_id
  const statusIdMap: Record<LeadStatus, number> = {
    NEW: 1,
    CONTACTED: 2,
    QUALIFIED: 2,
    REQUIREMENT: 3,
    OPPORTUNITY: 3,
    QUOTATION: 4,
    NEGOTIATION: 5,
    WON: 6,
    LOST: 7
  };

  leads.update(list => list.map(l => {
    if (l.id === targetLead.id) {
      return {
        ...l,
        status: newStatus,
        lead_status_id: statusIdMap[newStatus] || l.lead_status_id,
        lostReason: newStatus === 'LOST' ? lostReason : l.lostReason,
        lostDate: newStatus === 'LOST' ? updatedDate : l.lostDate,
        conversionStatus: newStatus === 'WON' ? 'CONVERTED' : newStatus === 'LOST' ? 'DISQUALIFIED' : l.conversionStatus
      };
    }
    return l;
  }));

  logActivity('LEAD', targetLead.id, 'STATUS_CHANGE', `Status updated from ${oldStatus} to ${newStatus}`);
  logAudit('LEAD_STATUS_UPDATE', 'Lead', targetLead.id, [{ field: 'status', oldValue: oldStatus, newValue: newStatus }]);

  const autoResult = automationEngine.evaluateLeadStatusChange(targetLead, oldStatus, newStatus);
  if (autoResult.actionsPerformed.length > 0) {
    showToast(`Automations triggered: ${autoResult.actionsPerformed.join('; ')}`, 'info');
  }

  if (newStatus === 'WON') {
    handleLeadWonConversion(targetLead);
  }

  return true;
}

/** Convert Lead to Customer when WON */
function handleLeadWonConversion(lead: Lead) {
  const existingCustomers = get(customers);
  let customer = existingCustomers.find(c => c.email === lead.email || c.leadId === lead.id);

  if (!customer) {
    const custNumericId = Date.now();
    const custId = `cust-${custNumericId.toString().slice(-4)}`;
    customer = {
      id: custId,
      customer_id: custNumericId,
      organization_id: lead.organization_id || 1,
      user_id: null,
      customer_name: lead.name,
      leadId: lead.id,
      name: lead.name,
      company: lead.company,
      email: lead.email,
      phone: lead.phone,
      segment: lead.marketingCost > 100 ? 'High Value' : 'New Customer',
      originalSource: lead.source,
      campaignId: lead.campaignId,
      created_at: new Date().toISOString(),
      createdDate: new Date().toISOString().slice(0, 10),
      totalSpent: 0,
      winningOpportunityId: '',
      status: 'ACTIVE'
    };
    customers.update(list => [customer!, ...list]);
    logActivity('CUSTOMER', custId, 'CUSTOMER_CREATED', `Customer account auto-created from winning lead ${lead.name}`);

    if (lead.campaignId) {
      campaigns.update(cList => cList.map(c => c.id === lead.campaignId ? { ...c, customersAcquired: c.customersAcquired + 1 } : c));
    }
  }
}

/** Accept Quotation -> Convert Deal -> Invoice & Trigger Service Order */
export function acceptQuotation(quotationId: string): boolean {
  const targetQuotation = get(quotations).find(q => q.id === quotationId || q.quotation_id.toString() === quotationId);
  if (!targetQuotation) return false;

  if (targetQuotation.status === 'ACCEPTED' || targetQuotation.status === 'Accepted') {
    showToast('Quotation is already accepted', 'info');
    return true;
  }

  quotations.update(list => list.map(q => q.id === targetQuotation.id ? { ...q, status: 'ACCEPTED' } : q));

  updateLeadStatus(targetQuotation.leadId, 'WON');

  let targetLead = get(leads).find(l => l.id === targetQuotation.leadId);
  let targetCust = get(customers).find(c => c.leadId === targetQuotation.leadId || (targetLead && c.email === targetLead.email));

  if (!targetCust && targetLead) {
    handleLeadWonConversion(targetLead);
    targetCust = get(customers).find(c => c.leadId === targetQuotation.leadId);
  }

  const custId = targetCust ? targetCust.id : 'cust-101';
  const custNumericId = targetCust ? targetCust.customer_id : 101;

  const saleId = `sle-${Date.now().toString().slice(-4)}`;
  const newSale: Sale = {
    id: saleId,
    quotationId: targetQuotation.id,
    opportunityId: targetQuotation.opportunityId,
    customerId: custId,
    amount: targetQuotation.grandTotal,
    saleDate: new Date().toISOString().slice(0, 10),
    thankYouSent: false,
    feedbackRequested: false
  };
  sales.update(sList => [newSale, ...sList]);

  const invNumericId = Date.now();
  const invoiceId = `inv-${invNumericId.toString().slice(-4)}`;
  const newInvoice: Invoice = {
    id: invoiceId,
    invoice_id: invNumericId,
    organization_id: targetQuotation.organization_id || 1,
    customer_id: custNumericId,
    quotation_id: targetQuotation.quotation_id,
    invoice_number: `INV-2026-${invNumericId.toString().slice(-4)}`,
    invoice_date: new Date().toISOString().slice(0, 10),
    due_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10),
    total_amount: targetQuotation.grandTotal,
    payment_status: 'ISSUED',
    invoiceNumber: `INV-2026-${invNumericId.toString().slice(-4)}`,
    type: 'TAX_INVOICE',
    quotationId: targetQuotation.id,
    saleId,
    customerId: custId,
    issueDate: new Date().toISOString().slice(0, 10),
    dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10),
    subtotal: targetQuotation.taxableAmount,
    tax: targetQuotation.taxAmount,
    total: targetQuotation.grandTotal,
    paidAmount: 0,
    outstandingAmount: targetQuotation.grandTotal,
    status: 'ISSUED'
  };
  invoices.update(iList => [newInvoice, ...iList]);

  // Create Service Order (Table 16)
  const soNumericId = Date.now();
  const newServiceOrder: ServiceOrder = {
    service_order_id: soNumericId,
    organization_id: targetQuotation.organization_id || 1,
    customer_id: custNumericId,
    invoice_id: invNumericId,
    start_date: new Date().toISOString().slice(0, 10),
    service_status: 'INITIATED',
    remarks: `Fulfillment initialized for invoice ${newInvoice.invoiceNumber}`,
    customerName: targetCust ? targetCust.customer_name : 'Valued Client',
    invoiceNumber: newInvoice.invoiceNumber
  };
  serviceOrders.update(soList => [newServiceOrder, ...soList]);

  automationEngine.evaluateQuotationAccepted(targetQuotation);

  logActivity('QUOTATION', targetQuotation.id, 'QUOTATION_ACCEPTED', `Quotation accepted ($${targetQuotation.grandTotal}) -> Invoice ${newInvoice.invoiceNumber} and Service Order #${soNumericId} created`);
  showToast(`Quotation Accepted! Created Invoice ${newInvoice.invoiceNumber} and Service Order`);

  return true;
}

/** Record Payment against Invoice */
export function recordPayment(invoiceId: string, amount: number, method: Payment['method'], reference: string, notes?: string): boolean {
  const currentInvoices = get(invoices);
  const targetInvoice = currentInvoices.find(i => i.id === invoiceId || i.invoice_id.toString() === invoiceId);

  if (!targetInvoice) {
    showToast('Invoice not found', 'error');
    return false;
  }

  if (targetInvoice.status === 'CANCELLED') {
    showToast('Cannot record payment for a cancelled invoice', 'error');
    return false;
  }

  if (amount <= 0) {
    showToast('Payment amount must be greater than zero', 'error');
    return false;
  }

  if (amount > targetInvoice.outstandingAmount) {
    showToast(`Payment amount ($${amount}) exceeds outstanding invoice balance ($${targetInvoice.outstandingAmount})`, 'error');
    return false;
  }

  const newPaid = targetInvoice.paidAmount + amount;
  const newOutstanding = targetInvoice.total - newPaid;
  const newStatus: Invoice['status'] = newOutstanding === 0 ? 'PAID' : 'PARTIALLY_PAID';

  invoices.update(list => list.map(i => {
    if (i.id === targetInvoice.id) {
      return {
        ...i,
        paidAmount: newPaid,
        outstandingAmount: newOutstanding,
        status: newStatus,
        payment_status: newStatus
      };
    }
    return i;
  }));

  const payNumericId = Date.now();
  const payId = `pay-${payNumericId.toString().slice(-4)}`;
  const newPayment: Payment = {
    id: payId,
    payment_id: payNumericId,
    organization_id: targetInvoice.organization_id || 1,
    customer_id: targetInvoice.customer_id || 101,
    quotation_id: targetInvoice.quotation_id || 301,
    amount,
    payment_method: method,
    transaction_reference: reference,
    payment_status: 'SUCCESS',
    payment_date: new Date().toISOString(),
    paymentNumber: `PAY-2026-${payNumericId.toString().slice(-4)}`,
    invoiceId: targetInvoice.id,
    customerId: targetInvoice.customerId,
    method,
    referenceNumber: reference,
    notes
  };
  payments.update(pList => [newPayment, ...pList]);

  customers.update(cList => cList.map(c => c.id === targetInvoice.customerId || c.customer_id === targetInvoice.customer_id ? { ...c, totalSpent: (c.totalSpent || 0) + amount } : c));

  // Advance corresponding Service Order to IN_PROGRESS if INITIATED
  serviceOrders.update(soList => soList.map(so => {
    if (so.invoice_id === targetInvoice.invoice_id && so.service_status === 'INITIATED') {
      return { ...so, service_status: 'IN_PROGRESS', remarks: 'Payment received. Service delivery actively in progress.' };
    }
    return so;
  }));

  if (newStatus === 'PAID') {
    automationEngine.evaluatePaymentReceived(newPayment);
    triggerPostSaleWorkflow(targetInvoice.customerId, targetInvoice.saleId);
  }

  logActivity('INVOICE', targetInvoice.id, 'PAYMENT_RECEIVED', `Recorded payment of $${amount} via ${method}`);
  showToast(`Payment of $${amount} successfully recorded`);

  return true;
}

/** Update Service Order Fulfillment Status */
export function updateServiceOrderStatus(serviceOrderId: number, status: ServiceOrder['service_status'], remarks?: string): boolean {
  const currentOrders = get(serviceOrders);
  const targetOrder = currentOrders.find(so => so.service_order_id === serviceOrderId);
  if (!targetOrder) {
    showToast('Service order not found', 'error');
    return false;
  }

  const oldStatus = targetOrder.service_status;
  const completionDate = status === 'COMPLETED' ? new Date().toISOString().slice(0, 10) : targetOrder.completion_date;

  serviceOrders.update(list => list.map(so => {
    if (so.service_order_id === serviceOrderId) {
      return {
        ...so,
        service_status: status,
        completion_date: completionDate,
        remarks: remarks || so.remarks
      };
    }
    return so;
  }));

  logActivity('SERVICE_ORDER', serviceOrderId.toString(), 'STATUS_UPDATE', `Service Order #${serviceOrderId} status updated from ${oldStatus} to ${status}`);
  logAudit('SERVICE_ORDER_STATUS_UPDATE', 'service_orders', serviceOrderId.toString(), [{ field: 'service_status', oldValue: oldStatus, newValue: status }]);

  showToast(`Service Order #${serviceOrderId} updated to ${status}`);
  return true;
}

/** Trigger Post-Sale Automated Message + Feedback Request */
function triggerPostSaleWorkflow(customerId: string, saleId?: string) {
  if (!saleId) return;

  sales.update(sList => sList.map(s => {
    if (s.id === saleId) {
      return { ...s, thankYouSent: true, feedbackRequested: true };
    }
    return s;
  }));

  tasks.update(tList => [
    {
      id: `tsk-${Date.now().toString().slice(-4)}`,
      title: 'Conduct Post-Sale Service Fulfillment & Feedback Check-in',
      customerId,
      assignedEmployee: 'Marcus Vance',
      dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10),
      priority: 'MEDIUM',
      status: 'PENDING',
      notes: 'Automated post-sale follow-up task triggered.'
    },
    ...tList
  ]);
}

/** Submit Customer Feedback tied to Service Order */
export function submitFeedback(fbData: { customer_id: number; service_order_id: number; rating: number; comments: string; serviceQuality?: Feedback['serviceQuality'] }): Feedback {
  const numericId = Date.now();
  const newId = `fbk-${numericId.toString().slice(-4)}`;
  const newFb: Feedback = {
    id: newId,
    feedback_id: numericId,
    customer_id: fbData.customer_id,
    service_order_id: fbData.service_order_id,
    rating: fbData.rating,
    comments: fbData.comments,
    submitted_at: new Date().toISOString(),
    saleId: 'sl-501',
    customerId: `cust-${fbData.customer_id}`,
    serviceQuality: fbData.serviceQuality || (fbData.rating >= 4 ? 'EXCELLENT' : fbData.rating === 3 ? 'GOOD' : 'POOR'),
    comment: fbData.comments,
    createdDate: new Date().toISOString().slice(0, 10)
  };
  feedbacks.update(fList => [newFb, ...fList]);
  logActivity('CUSTOMER', fbData.customer_id.toString(), 'FEEDBACK_SUBMITTED', `Customer feedback recorded for Service Order #${fbData.service_order_id} (Rating: ${fbData.rating}/5)`);
  showToast('Thank you! Service feedback has been recorded.');
  return newFb;
}

/** Create Activity Log */
function logActivity(entityType: Activity['entityType'], entityId: string, type: string, description: string) {
  const user = get(currentUser);
  const newAct: Activity = {
    id: `act-${Date.now().toString().slice(-4)}`,
    entityType,
    entityId,
    type,
    description,
    performedBy: user ? user.name : 'System',
    timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19)
  };
  activities.update(list => [newAct, ...list]);
}

/** Create Audit Log */
function logAudit(action: string, entity: string, entityId: string, changes: AuditLog['changes']) {
  const user = get(currentUser);
  const newAudit: AuditLog = {
    id: `aud-${Date.now().toString().slice(-4)}`,
    timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19),
    actor: user ? user.name : 'System',
    action,
    entity,
    entityId,
    changes
  };
  auditLogs.update(list => [newAudit, ...list]);
}
