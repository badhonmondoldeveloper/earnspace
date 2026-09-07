import { ParsedTransaction } from './BkashAdapter';

export class UpayAdapter {
  static parseSMS(smsText: string): ParsedTransaction {
    const rawText = smsText || '';
    
    // Upay SMS Example: "Upay Payment Received: Tk 150.00 from 01312345678. Ref ES-P8K29. TrxID UP129381."
    const txIdMatch = rawText.match(/(?:TrxID|TxnID|TxID)\s*[:\s]*([A-Za-z0-9]+)/i);
    const amountMatch = rawText.match(/(?:Tk|BDT)\s*([\d,]+\.?\d*)/i);
    const senderMatch = rawText.match(/from\s*(01\d{9})/i);
    const refMatch = rawText.match(/Ref\s*[:\s]*([A-Za-z0-9\-]+)/i);

    const transactionId = txIdMatch ? txIdMatch[1] : '';
    const amountStr = amountMatch ? amountMatch[1].replace(/,/g, '') : '0';
    const amount = parseFloat(amountStr) || 0;
    const senderNumber = senderMatch ? senderMatch[1] : undefined;
    const reference = refMatch ? refMatch[1] : undefined;

    return {
      provider: 'UPAY',
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
