export default function MonetizationPolicyPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-16 space-y-8">
      <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white">Monetization Policy</h1>
      <p className="text-xs text-slate-500">Last updated: September 2026</p>
      
      <div className="space-y-6 text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
        <section className="space-y-2">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">1. Platform Monetization Principles</h2>
          <p>
            EarnSpace is dedicated to supporting creators through legitimate monetization structures. Monetization on EarnSpace is based strictly on genuine audience engagement, verified creator subscriptions, and legitimate brand campaigns.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">2. Prohibited Practices</h2>
          <p>
            To ensure a safe and sustainable ecosystem, the following are strictly prohibited:
          </p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Artificial bot engagement or fake follower generation</li>
            <li>Incentivized ad clicking or click-farm activity</li>
            <li>Multi-level marketing (MLM) or pyramid mechanics</li>
            <li>Misleading financial promises or guaranteed return claims</li>
          </ul>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">3. Monetization Rollout</h2>
          <p>
            Future creator earning systems, wallet integrations, and withdrawal mechanisms will be introduced in upcoming platform releases subject to identity verification and compliance audits.
          </p>
        </section>
      </div>
    </div>
  );
}

