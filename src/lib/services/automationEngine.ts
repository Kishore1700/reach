import type { Lead, Quotation, Payment, FollowUpTask } from '$lib/types/crm';

export class AutomationEngine {
  private executedEvents: Set<string> = new Set();

  public evaluateLeadStatusChange(
    lead: Lead,
    oldStatus: string,
    newStatus: string
  ): { actionsPerformed: string[] } {
    const eventKey = `LEAD_STATUS_${lead.id}_${oldStatus}_${newStatus}`;
    if (this.executedEvents.has(eventKey)) {
      return { actionsPerformed: [] };
    }

    const actionsPerformed: string[] = [];

    if (newStatus === 'QUALIFIED' && lead.score >= 70) {
      this.executedEvents.add(eventKey);
      actionsPerformed.push(`Assigned Senior Sales Representative (${lead.assignedEmployee})`);
      actionsPerformed.push(`Created automatic discovery task for ${lead.name}`);
    }

    return { actionsPerformed };
  }

  public evaluateQuotationAccepted(
    quotation: Quotation
  ): { actionsPerformed: string[] } {
    const eventKey = `QUOTATION_ACCEPTED_${quotation.id}`;
    if (this.executedEvents.has(eventKey)) {
      return { actionsPerformed: [] };
    }

    this.executedEvents.add(eventKey);
    return {
      actionsPerformed: [
        `Converted Opportunity ${quotation.opportunityId} to WON`,
        `Created/Activated Customer profile from Lead ${quotation.leadId}`,
        `Generated Proforma Invoice for total $${quotation.grandTotal}`
      ]
    };
  }

  public evaluatePaymentReceived(
    payment: Payment
  ): { actionsPerformed: string[] } {
    const eventKey = `PAYMENT_RECEIVED_${payment.id}`;
    if (this.executedEvents.has(eventKey)) {
      return { actionsPerformed: [] };
    }

    this.executedEvents.add(eventKey);
    return {
      actionsPerformed: [
        `Triggered Thank-You email notification for Customer`,
        `Dispatched Automated Post-Sale Feedback Request survey`
      ]
    };
  }
}

export const automationEngine = new AutomationEngine();
