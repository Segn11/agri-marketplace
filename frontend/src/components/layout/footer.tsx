import Link from "next/link";
import { Sprout, ShieldCheck, HeartHandshake, PhoneCall } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-slate-200/80 bg-white/70 backdrop-blur-md pt-16 pb-12 text-sm text-slate-600">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
          {/* Brand info */}
          <div className="md:col-span-1 space-y-4">
            <Link href="/" className="flex items-center space-x-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-brand-700 to-brand-500 text-white shadow-sm">
                <Sprout className="h-5 w-5" />
              </div>
              <span className="text-xl font-bold tracking-tight text-slate-900">
                Agri<span className="text-brand-600">Market</span>
              </span>
            </Link>
            <p className="text-xs text-slate-500 leading-relaxed">
              Empowering farmers across every community with direct digital market access, fair transparent pricing, and instant buyer connections.
            </p>
          </div>

          {/* Quick links */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-3">Marketplace</h4>
            <ul className="space-y-2 text-xs">
              <li><Link href="/products" className="hover:text-brand-600 transition">All Produce</Link></li>
              <li><Link href="/products?category=cereals-grains" className="hover:text-brand-600 transition">Grains & Cereals</Link></li>
              <li><Link href="/products?category=vegetables" className="hover:text-brand-600 transition">Fresh Vegetables</Link></li>
              <li><Link href="/products?category=coffee-spices" className="hover:text-brand-600 transition">Highland Coffee & Spices</Link></li>
            </ul>
          </div>

          {/* Farmers & Buyers */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-3">Portals</h4>
            <ul className="space-y-2 text-xs">
              <li><Link href="/farmer" className="hover:text-brand-600 transition">Farmer Dashboard</Link></li>
              <li><Link href="/buyer" className="hover:text-brand-600 transition">Buyer Orders</Link></li>
              <li><Link href="/register" className="hover:text-brand-600 transition">Create Producer Account</Link></li>
              <li><Link href="/login" className="hover:text-brand-600 transition">Sign In</Link></li>
            </ul>
          </div>

          {/* Guarantees */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-3">Trust & Security</h4>
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

        <div className="pt-8 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-4">
          <p>&copy; {new Date().getFullYear()} AgriMarket Platform. All rights reserved.</p>
          <div className="flex space-x-6">
            <span>Unified Agricultural Network</span>
            <span>•</span>
            <span>Zero Middlemen</span>
            <span>•</span>
            <span>Direct Harvest</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
