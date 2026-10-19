import Link from "next/link";
import { Sprout, ShieldCheck, HeartHandshake, PhoneCall, Sparkles, ArrowRight } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-slate-200/60 bg-white/80 backdrop-blur-md pt-16 pb-12 text-sm text-slate-600 mt-auto">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-14">
          {/* Brand info */}
          <div className="md:col-span-1 space-y-4">
            <Link href="/" className="flex items-center space-x-2.5 group">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-emerald-700 via-green-600 to-emerald-500 text-white shadow-sm group-hover:scale-105 transition">
                <Sprout className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-extrabold tracking-tight text-slate-900">
                Agri<span className="text-brand-600">Market</span>
              </span>
            </Link>
            <p className="text-xs text-slate-500 leading-relaxed">
              Empowering farmers across every community with direct digital market access, fair transparent pricing, and instant buyer connections.
            </p>
            <div className="flex items-center gap-2 text-xs font-semibold text-brand-700 bg-brand-50 px-3 py-1.5 rounded-full border border-brand-200/50 w-fit">
              <Sparkles className="h-3 w-3" />
              <span>100% Direct Farm Trading</span>
            </div>
          </div>

          {/* Quick links */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-4">Marketplace</h4>
            <ul className="space-y-2.5 text-xs">
              <li><Link href="/products" className="hover:text-brand-700 transition">All Produce Catalog</Link></li>
              <li><Link href="/products?category=cereals-grains" className="hover:text-brand-700 transition">Grains & Cereals</Link></li>
              <li><Link href="/products?category=vegetables" className="hover:text-brand-700 transition">Fresh Vegetables</Link></li>
              <li><Link href="/products?category=coffee-spices" className="hover:text-brand-700 transition">Highland Coffee & Spices</Link></li>
            </ul>
          </div>

          {/* Farmers & Buyers */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-4">Portals</h4>
            <ul className="space-y-2.5 text-xs">
              <li><Link href="/farmer" className="hover:text-brand-700 transition">Farmer Dashboard</Link></li>
              <li><Link href="/buyer" className="hover:text-brand-700 transition">Buyer Orders</Link></li>
              <li><Link href="/register" className="hover:text-brand-700 transition">Create Producer Account</Link></li>
              <li><Link href="/login" className="hover:text-brand-700 transition">Sign In</Link></li>
            </ul>
          </div>

          {/* Guarantees */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-4">Trust & Security</h4>
            <div className="flex items-start gap-2.5 text-xs text-slate-500">
              <ShieldCheck className="h-4 w-4 text-brand-600 mt-0.5 flex-shrink-0" />
              <span>Strict stock locking preventing duplicate selling.</span>
            </div>
            <div className="flex items-start gap-2.5 text-xs text-slate-500">
              <HeartHandshake className="h-4 w-4 text-brand-600 mt-0.5 flex-shrink-0" />
              <span>Direct farmer contact disclosure on order acceptance.</span>
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-slate-200/60 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-4">
          <p>&copy; {new Date().getFullYear()} AgriMarket Platform. All rights reserved.</p>
          <div className="flex items-center space-x-4">
            <span>Unified Agricultural Network</span>
            <span>&bull;</span>
            <span>Zero Middlemen</span>
            <span>&bull;</span>
            <span>Direct Harvest</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
