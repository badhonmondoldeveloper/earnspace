import { ParsedTransaction } from './BkashAdapter';

export class NagadAdapter {
  static parseSMS(smsText: string): ParsedTransaction {
    const rawText = smsText || '';
    
    // Nagad SMS Example: "Money Received. Amount: Tk 300.00. Sender: 01812345678. Ref: ES-P8K29. TxnID: 71829ABC."
    const txIdMatch = rawText.match(/(?:TxnID|TxID|TXN)\s*[:\s]*([A-Za-z0-9]+)/i);
    const amountMatch = rawText.match(/(?:Amount|Tk|BDT)\s*[:\s]*([\d,]+\.?\d*)/i);
    const senderMatch = rawText.match(/(?:Sender|from)\s*[:\s]*(01\d{9})/i);
    const refMatch = rawText.match(/Ref\s*[:\s]*([A-Za-z0-9\-]+)/i);

    const transactionId = txIdMatch ? txIdMatch[1] : '';
    const amountStr = amountMatch ? amountMatch[1].replace(/,/g, '') : '0';
    const amount = parseFloat(amountStr) || 0;
    const senderNumber = senderMatch ? senderMatch[1] : undefined;
    const reference = refMatch ? refMatch[1] : undefined;

    return {
      provider: 'NAGAD',
      transactionId,
      amount,
      senderNumber,
      reference,
      transactionType: rawText.toLowerCase().includes('received') ? 'PAYMENT' : 'CASH_IN',
      rawText,
      parsedSuccessfully: Boolean(transactionId && amount > 0),
    };
  }
}
