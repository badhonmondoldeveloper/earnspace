export interface ParsedTransaction {
  provider: string;
  transactionId: string;
  amount: number;
  senderNumber?: string;
  receiverNumber?: string;
  reference?: string;
  transactionType: string;
  rawText: string;
  parsedSuccessfully: boolean;
}

export class BkashAdapter {
  static parseSMS(smsText: string): ParsedTransaction {
    const rawText = smsText || '';
    
    // bKash Regex Patterns
    // Example SMS: "You have received Tk 500.00 from 01712345678. Ref ES-P8K29. TxnID 9B7X2K1. Balance Tk 1200.00."
    const txIdMatch = rawText.match(/(?:TrxID|TxnID|trxID)\s+([A-Za-z0-9]+)/i);
    const amountMatch = rawText.match(/(?:Tk|BDT)\s*([\d,]+\.?\d*)/i);
    const senderMatch = rawText.match(/from\s+(01\d{9})/i);
    const refMatch = rawText.match(/Ref\s+([A-Za-z0-9\-]+)/i);

    const transactionId = txIdMatch ? txIdMatch[1] : '';
    const amountStr = amountMatch ? amountMatch[1].replace(/,/g, '') : '0';
    const amount = parseFloat(amountStr) || 0;
    const senderNumber = senderMatch ? senderMatch[1] : undefined;
    const reference = refMatch ? refMatch[1] : undefined;

    return {
      provider: 'BKASH',
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
