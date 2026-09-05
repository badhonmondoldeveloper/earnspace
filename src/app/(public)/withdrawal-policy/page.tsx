export default function WithdrawalPolicyPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-16 space-y-8">
      <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white">Withdrawal & Payout Policy</h1>
      <p className="text-xs text-slate-500">Last updated: September 2026</p>
      
      <div className="space-y-6 text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
        <section className="space-y-2">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">1. Legitimate Creator Settlements</h2>
          <p>
            EarnSpace is engineered with strict financial audit standards. Platform payouts require full account verification, compliance checks, and legal verification prior to transaction processing.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">2. Financial Integrity</h2>
          <p>
            No payouts or withdrawals are generated through artificial activity. Platform balances represent real, settled transactions from creator subscriptions and brand campaign deliverables.
          </p>
        </section>
      </div>
    </div>
  );
}

