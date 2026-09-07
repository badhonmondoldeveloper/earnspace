import { ParsedTransaction } from './BkashAdapter';

export class RocketAdapter {
  static parseSMS(smsText: string): ParsedTransaction {
    const rawText = smsText || '';
    
    // Rocket SMS Example: "Tk 250.00 received from A/C: 019123456789. TxnID: 991283. Ref: ES-P8K29."
    const txIdMatch = rawText.match(/(?:TxnID|TxID)\s*[:\s]*([A-Za-z0-9]+)/i);
    const amountMatch = rawText.match(/(?:Tk|BDT)\s*([\d,]+\.?\d*)/i);
    const senderMatch = rawText.match(/(?:from|A\/C)\s*[:\s]*(01\d{9,11})/i);
    const refMatch = rawText.match(/Ref\s*[:\s]*([A-Za-z0-9\-]+)/i);

    const transactionId = txIdMatch ? txIdMatch[1] : '';
    const amountStr = amountMatch ? amountMatch[1].replace(/,/g, '') : '0';
    const amount = parseFloat(amountStr) || 0;
    const senderNumber = senderMatch ? senderMatch[1] : undefined;
    const reference = refMatch ? refMatch[1] : undefined;

    return {
      provider: 'ROCKET',
      transactionId,
      amount,
      senderNumber,
      reference,
      transactionType: 'PAYMENT',
      rawText,
      parsedSuccessfully: Boolean(transactionId && amount > 0),
    };
  }
}
