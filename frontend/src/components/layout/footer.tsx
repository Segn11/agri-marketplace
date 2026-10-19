import Link from "next/link";
import { ShieldCheck, Award, MapPin, Mail, Phone, Sprout } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-[#0b172a] text-slate-300 text-xs border-t border-slate-800 pt-16 pb-12">
      <div className="container mx-auto px-4 sm:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 mb-12">
          {/* Brand info */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="flex items-center space-x-2.5">
              <div className="h-9 w-9 rounded-full bg-[#d81b60] flex items-center justify-center text-white shadow-sm">
                <Sprout className="h-5 w-5 text-white" />
              </div>
              <span className="text-2xl font-bold tracking-tight text-white lowercase">
                agri<span className="text-blue-400">marketplace</span>
              </span>
            </Link>
            <p className="text-slate-400 leading-relaxed max-w-sm">
              Empowering farmers, cooperatives, and commercial buyers with real-time digital discovery, certified quality grading, and transparent agricultural commodity trade.
            </p>
            <div className="space-y-1.5 pt-2 text-slate-400">
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-[#d81b60] flex-shrink-0" />
                <span>Agricultural Trade Exchange Center, National Logistics Hub</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-blue-400 flex-shrink-0" />
                <span>support@agrimarket.com &bull; trades@agrimarket.com</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-emerald-400 flex-shrink-0" />
                <span>Customer Care: +251 911 00 22 44 / Toll Free: 8080</span>
              </div>
            </div>
          </div>

          {/* Products */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider text-white mb-4">Commodity Categories</h4>
            <ul className="space-y-2.5 text-slate-400">
              <li><Link href="/products" className="hover:text-white transition">All Commodities</Link></li>
              <li><Link href="/products?q=Teff" className="hover:text-white transition">Cereals & Grains</Link></li>
              <li><Link href="/products?q=Coffee" className="hover:text-white transition">Coffee & Spices</Link></li>
              <li><Link href="/products?q=Sesame" className="hover:text-white transition">Pulses & Oilseeds</Link></li>
              <li><Link href="/products?q=Onion" className="hover:text-white transition">Fresh Vegetables</Link></li>
              <li><Link href="/products" className="hover:text-white transition">Live Market Catalog</Link></li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider text-white mb-4">Platform Services</h4>
            <ul className="space-y-2.5 text-slate-400">
              <li><Link href="/cart" className="hover:text-white transition">Procurement Cart & Settlement</Link></li>
              <li><Link href="/cart" className="hover:text-white transition">AgriPay Escrow Guarantee</Link></li>
              <li><Link href="/buyer" className="hover:text-white transition">4-Step Order Tracking</Link></li>
              <li><Link href="/products" className="hover:text-white transition">Assayed Commodity Lots</Link></li>
              <li><Link href="/register" className="hover:text-white transition">Cooperative Onboarding</Link></li>
              <li><Link href="/cart" className="hover:text-white transition">Freight & Delivery Protocol</Link></li>
            </ul>
          </div>

          {/* Portals & Legal */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider text-white mb-4">Portals & Access</h4>
            <ul className="space-y-2.5 text-slate-400">
              <li><Link href="/buyer" className="hover:text-white transition">Buyer Order Tracking</Link></li>
              <li><Link href="/admin" className="hover:text-white transition">Admin Dashboard</Link></li>
              <li><Link href="/login" className="hover:text-white transition">Member Sign In</Link></li>
              <li><Link href="/register" className="hover:text-white transition">Create Trade Account</Link></li>
              <li><Link href="/products" className="hover:text-white transition">Search Database Lots</Link></li>
              <li><Link href="/" className="hover:text-white transition">Home</Link></li>
            </ul>
          </div>
        </div>

        {/* Quality Badges */}
        <div className="py-6 border-y border-slate-800 flex flex-wrap items-center justify-between gap-4 text-slate-400 text-xs">
          <div className="flex items-center gap-6">
            <span className="flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-emerald-400" />
              <span>Scientific Storage & Warehouse Standards</span>
            </span>
            <span className="flex items-center gap-2">
              <Award className="h-4 w-4 text-amber-400" />
              <span>Certified Quality Assaying & Grading</span>
            </span>
          </div>

          <div className="text-slate-400">
            <span>Trading in Teff, Coffee, Wheat, Maize, Onions, Sesame, Pulses & Spices</span>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-slate-500 gap-4">
          <p>&copy; {new Date().getFullYear()} AgriMarket Platform Ltd. All rights reserved.</p>
          <div className="flex items-center space-x-6">
            <Link href="/" className="hover:text-slate-300 transition">Privacy Policy</Link>
            <span>&bull;</span>
            <Link href="/" className="hover:text-slate-300 transition">Terms of Use</Link>
            <span>&bull;</span>
            <Link href="/" className="hover:text-slate-300 transition">Trading Guidelines</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
