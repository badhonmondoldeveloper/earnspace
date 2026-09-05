export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-16 space-y-8">
      <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white">About EarnSpace</h1>
      <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
        EarnSpace was built with a clear core brand vision: <strong>Create • Connect • Grow • Earn</strong>.
      </p>
      <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
        Our platform empowers individuals and creators to take full ownership of their online brand. From an interactive social feed and 24-hour stories to long-form blogging and block-based mini-websites, EarnSpace provides the complete foundation for digital identity.
      </p>
      <div className="p-6 rounded-2xl bg-brand-50 dark:bg-brand-950/40 border border-brand-200 dark:border-brand-800 space-y-2">
        <h3 className="text-base font-bold text-brand-700 dark:text-brand-300">Our Commitment to Integrity</h3>
        <p className="text-xs text-brand-800 dark:text-brand-200 leading-relaxed">
          We maintain strict platform standards against artificial engagement, fake wallet balances, or misleading financial claims. All interactions on EarnSpace are 100% organic and verifiable.
        </p>
      </div>
    </div>
  );
}

