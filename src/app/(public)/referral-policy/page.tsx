export default function ReferralPolicyPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-16 space-y-8">
      <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white">Referral Policy</h1>
      <p className="text-xs text-slate-500">Last updated: September 2026</p>
      
      <div className="space-y-6 text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
        <section className="space-y-2">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">1. Honest Growth & Referrals</h2>
          <p>
            EarnSpace encourages community growth through genuine user invitations. Referral programs are governed by strict verification to ensure all referred accounts represent active, unique users.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">2. Anti-Spam & Fraud Prevention</h2>
          <p>
            Creating self-referral accounts, using automated scripts, or posting spam referral links across external services is strictly prohibited and will result in account suspension.
          </p>
        </section>
      </div>
    </div>
  );
}

