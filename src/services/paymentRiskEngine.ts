export interface EvaluateRiskParams {
  amount: number;
  referenceMatched: boolean;
  amountMatched: boolean;
  deviceTrusted: boolean;
  parserConfidence: number; // 0.0 to 1.0
  userFrequencyCount24h?: number;
}

export class PaymentRiskEngine {
  /**
   * Calculates transaction risk score and level
   */
  static evaluateRisk(params: EvaluateRiskParams): { riskScore: number; riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' } {
    let riskScore = 0.0;

    // Unmatched reference penalty
    if (!params.referenceMatched) riskScore += 25.0;

    // Amount mismatch penalty
    if (!params.amountMatched) riskScore += 35.0;

    // Untrusted or unknown device penalty
    if (!params.deviceTrusted) riskScore += 30.0;

    // Low parser confidence penalty
    if (params.parserConfidence < 0.8) riskScore += 20.0;

    // High frequency anomaly penalty (e.g. > 10 transactions in 24h)
    if (params.userFrequencyCount24h && params.userFrequencyCount24h > 10) {
      riskScore += 25.0;
    }

    // High single transaction amount check (> ৳25,000)
    if (params.amount > 25000) {
      riskScore += 15.0;
    }

    let riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' = 'LOW';
    if (riskScore >= 60.0) {
      riskLevel = 'HIGH';
    } else if (riskScore >= 30.0) {
      riskLevel = 'MEDIUM';
    }

    return {
      riskScore: Math.min(riskScore, 100.0),
      riskLevel,
    };
  }
}
