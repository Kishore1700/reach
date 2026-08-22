import type { Lead, Opportunity, Customer } from '$lib/types/crm';

export interface AiLeadScoreResult {
  score: number;
  tier: 'HOT' | 'WARM' | 'COLD';
  breakdown: { factor: string; impact: number }[];
  recommendedAction: string;
}

export class AiService {
  public calculateLeadScore(lead: Partial<Lead>): AiLeadScoreResult {
    let score = 50; // base score
    const breakdown: { factor: string; impact: number }[] = [];

    // Source weight
    if (lead.source === 'LinkedIn' || lead.source === 'College Referral') {
      score += 20;
      breakdown.push({ factor: `High conversion channel (${lead.source})`, impact: +20 });
    } else if (lead.source === 'Meta Ads' || lead.source === 'Website') {
      score += 10;
      breakdown.push({ factor: `Standard digital channel (${lead.source})`, impact: +10 });
    }

    // Email domain corporate check
    if (lead.email) {
      const lowerEmail = lead.email.toLowerCase().trim();
      if (!lowerEmail.endsWith('@gmail.com') && !lowerEmail.endsWith('@yahoo.com') && !lowerEmail.endsWith('@hotmail.com') && !lowerEmail.endsWith('@outlook.com')) {
        score += 15;
        breakdown.push({ factor: 'Verified corporate email domain', impact: +15 });
      }
    }

    // Status progress
    if (lead.status === 'QUALIFIED' || lead.status === 'OPPORTUNITY') {
      score += 15;
      breakdown.push({ factor: 'Advanced lifecycle stage', impact: +15 });
    }

    const finalScore = Math.min(100, Math.max(0, score));
    const tier = finalScore >= 80 ? 'HOT' : finalScore >= 50 ? 'WARM' : 'COLD';

    let recommendedAction = 'Schedule exploratory call within 24 hours';
    if (tier === 'HOT') {
      recommendedAction = 'Send tailored quotation with volume discount immediately';
    } else if (tier === 'COLD') {
      recommendedAction = 'Enroll in automated top-of-funnel email nurture drip';
    }

    return {
      score: finalScore,
      tier,
      breakdown,
      recommendedAction
    };
  }

  public predictWinProbability(opportunity: Partial<Opportunity>): { probability: number; rationale: string } {
    let prob = 30;
    if (opportunity.stage === 'PROPOSAL_SENT') prob = 75;
    if (opportunity.stage === 'NEGOTIATION') prob = 85;
    if (opportunity.stage === 'CLOSED_WON') prob = 100;
    if (opportunity.stage === 'CLOSED_LOST') prob = 0;

    return {
      probability: prob,
      rationale: `Derived from lifecycle velocity, stage (${opportunity.stage}), and engagement history.`
    };
  }

  public predictCustomerChurn(customer: Partial<Customer>): { risk: 'LOW' | 'MEDIUM' | 'HIGH'; score: number; suggestion: string } {
    const totalSpent = customer.totalSpent || 0;
    if (totalSpent > 30000) {
      return { risk: 'LOW', score: 15, suggestion: 'Offer VIP customer advisory board access & QBR meeting.' };
    }
    return { risk: 'MEDIUM', score: 45, suggestion: 'Send product update newsletter and check usage metrics.' };
  }
}

export const aiService = new AiService();
