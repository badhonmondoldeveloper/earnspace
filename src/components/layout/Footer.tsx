import Link from 'next/link';
import { Sparkles } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-400 py-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-2 md:grid-cols-5 gap-8">
        {/* Brand */}
        <div className="col-span-2 space-y-4">
          <Link href="/" className="flex items-center gap-2 font-bold text-xl text-white">
            <div className="w-8 h-8 rounded-lg bg-brand-500 flex items-center justify-center text-white">
              <Sparkles className="w-4 h-4" />
            </div>
            <span>Earn<span className="text-brand-400">Space</span></span>
          </Link>
          <p className="text-xs text-slate-400 max-w-sm leading-relaxed">
            Create your space, build your audience, publish content, customize your digital website, and grow your digital presence.
          </p>
          <p className="text-xs text-slate-500">
            &copy; {new Date().getFullYear()} EarnSpace Platform. All rights reserved.
          </p>
        </div>

        {/* Product */}
        <div>
          <h4 className="text-xs font-semibold text-white uppercase tracking-wider mb-3">Product</h4>
          <ul className="space-y-2 text-xs">
            <li><Link href="/features" className="hover:text-white transition">Features</Link></li>
            <li><Link href="/how-it-works" className="hover:text-white transition">How It Works</Link></li>
            <li><Link href="/creators" className="hover:text-white transition">Creators</Link></li>
            <li><Link href="/pricing" className="hover:text-white transition">Pricing</Link></li>
            <li><Link href="/explore" className="hover:text-white transition">Explore</Link></li>
          </ul>
        </div>

        {/* Platform & Community */}
        <div>
          <h4 className="text-xs font-semibold text-white uppercase tracking-wider mb-3">Community</h4>
          <ul className="space-y-2 text-xs">
            <li><Link href="/blog" className="hover:text-white transition">Platform Blog</Link></li>
            <li><Link href="/community-guidelines" className="hover:text-white transition">Community Guidelines</Link></li>
            <li><Link href="/faq" className="hover:text-white transition">FAQ</Link></li>
            <li><Link href="/contact" className="hover:text-white transition">Contact Us</Link></li>
          </ul>
        </div>

        {/* Legal & Policies */}
        <div>
          <h4 className="text-xs font-semibold text-white uppercase tracking-wider mb-3">Legal & Policies</h4>
          <ul className="space-y-2 text-xs">
            <li><Link href="/terms" className="hover:text-white transition">Terms of Service</Link></li>
            <li><Link href="/privacy" className="hover:text-white transition">Privacy Policy</Link></li>
            <li><Link href="/monetization-policy" className="hover:text-white transition">Monetization Policy</Link></li>
            <li><Link href="/referral-policy" className="hover:text-white transition">Referral Policy</Link></li>
            <li><Link href="/withdrawal-policy" className="hover:text-white transition">Withdrawal Policy</Link></li>
          </ul>
        </div>
      </div>
    </footer>
  );
}

