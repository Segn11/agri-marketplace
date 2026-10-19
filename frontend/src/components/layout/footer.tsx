import Link from "next/link";
import { ShieldCheck, Award, MapPin, Mail, Phone, ExternalLink } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300 text-xs border-t border-slate-800 pt-16 pb-12">
      <div className="container mx-auto px-4 sm:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 mb-12">
          {/* Brand info */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="flex items-center space-x-2.5">
              <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-teal-700 to-teal-500 flex items-center justify-center text-white shadow-md">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" className="w-5 h-5">
                  <path d="M12 2a9 9 0 0 1 9 9c0 4.97-4.03 9-9 9A9 9 0 0 1 3 11c0-4.97 4.03-9 9-9z" />
                  <path d="M12 7c-2 2-3 4-3 6a3 3 0 0 0 6 0c0-2-1-4-3-6z" fill="currentColor" opacity="0.9" />
                </svg>
              </div>
              <span className="text-2xl font-bold tracking-tight text-white">
                Agri<span className="text-teal-400">Market</span>
              </span>
            </Link>
            <p className="text-slate-400 leading-relaxed max-w-sm">
              Empowering farmers, cooperatives, and institutional buyers with real-time digital discovery, certified quality grading, and transparent agricultural commodity trade.
            </p>
            <div className="space-y-1.5 pt-2 text-slate-400">
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-teal-400 flex-shrink-0" />
                <span>Agricultural Trade Exchange Center, National Logistics Hub</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-teal-400 flex-shrink-0" />
                <span>support@agrimarket.com &bull; trades@agrimarket.com</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-teal-400 flex-shrink-0" />
                <span>Customer Care: +251 911 00 22 44 / Toll Free: 8080</span>
              </div>
            </div>
          </div>

          {/* Products */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider text-white mb-4">Our Products</h4>
            <ul className="space-y-2.5 text-slate-400">
              <li><Link href="/" className="hover:text-teal-300 transition">AgriVision GIS</Link></li>
              <li><Link href="/products" className="hover:text-teal-300 transition">Digital Auction Engine</Link></li>
              <li><Link href="/products" className="hover:text-teal-300 transition">Direct Marketplace</Link></li>
              <li><Link href="/" className="hover:text-teal-300 transition">AgriAdvisory Intelligence</Link></li>
              <li><Link href="/register" className="hover:text-teal-300 transition">Escrow Settlements</Link></li>
              <li><Link href="/farmer" className="hover:text-teal-300 transition">Farmer Growth Center</Link></li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider text-white mb-4">Our Services</h4>
            <ul className="space-y-2.5 text-slate-400">
              <li><Link href="/products" className="hover:text-teal-300 transition">Centralized Warehousing</Link></li>
              <li><Link href="/products" className="hover:text-teal-300 transition">Quality Assay & Grading</Link></li>
              <li><Link href="/register" className="hover:text-teal-300 transition">Corporate Procurement</Link></li>
              <li><Link href="/farmer" className="hover:text-teal-300 transition">Farmer Cooperative Sourcing</Link></li>
              <li><Link href="/buyer" className="hover:text-teal-300 transition">Cold Chain & Logistics</Link></li>
              <li><Link href="/register" className="hover:text-teal-300 transition">Trade Escrow Protection</Link></li>
            </ul>
          </div>

          {/* Portals & Legal */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider text-white mb-4">Portals & Links</h4>
            <ul className="space-y-2.5 text-slate-400">
              <li><Link href="/farmer" className="hover:text-teal-300 transition">Farmer Portal</Link></li>
              <li><Link href="/buyer" className="hover:text-teal-300 transition">Buyer Procurement</Link></li>
              <li><Link href="/admin" className="hover:text-teal-300 transition">Admin Hub</Link></li>
              <li><Link href="/login" className="hover:text-teal-300 transition">Member Sign In</Link></li>
              <li><Link href="/register" className="hover:text-teal-300 transition">Create Trade Account</Link></li>
              <li><Link href="/products" className="hover:text-teal-300 transition">Commodity Index</Link></li>
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
