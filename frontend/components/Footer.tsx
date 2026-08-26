import React from "react";
import Link from "next/link";
import { Compass, Sparkles, CheckCircle2 } from "lucide-react";

export function Footer() {
  return (
    <footer className="w-full bg-slate-900 text-slate-300 border-t border-slate-800 mt-16 sm:mt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12 pb-12 border-b border-slate-800">
          {/* Brand Column */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-2xl bg-gradient-to-tr from-indigo-500 to-violet-500 flex items-center justify-center shadow-md shadow-indigo-500/30">
                <Compass className="h-5 w-5 text-white" />
              </div>
              <span className="text-2xl font-black text-white tracking-tight">
                KelanaAI
              </span>
            </div>
            <p className="text-sm text-slate-400 max-w-sm leading-relaxed">
              Your autonomous AI travel architect. Plan smart, explore deeper, and experience authentic global destinations with effortless precision.
            </p>
            <div className="flex items-center gap-3 text-xs font-semibold text-indigo-400">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-indigo-950/80 border border-indigo-800/80">
                <Sparkles className="h-3 w-3" />
                AWS Bedrock Enhanced
              </span>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-950/80 text-emerald-400 border border-emerald-800/80">
                <CheckCircle2 className="h-3 w-3" />
                Real-time Planning
              </span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200">
              Explore Destinations
            </h4>
            <ul className="space-y-2 text-xs font-medium text-slate-400">
              <li><Link href="/" className="hover:text-white transition-colors">Tokyo & Japan Tours</Link></li>
              <li><Link href="/" className="hover:text-white transition-colors">Bali Island Escapes</Link></li>
              <li><Link href="/" className="hover:text-white transition-colors">Paris & European Getaways</Link></li>
              <li><Link href="/" className="hover:text-white transition-colors">Swiss Alps Adventures</Link></li>
              <li><Link href="/" className="hover:text-white transition-colors">Southeast Asia Highlights</Link></li>
            </ul>
          </div>

          {/* Features */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200">
              Planner Features
            </h4>
            <ul className="space-y-2 text-xs font-medium text-slate-400">
              <li><Link href="/" className="hover:text-white transition-colors">Daily Itinerary Cards</Link></li>
              <li><Link href="/" className="hover:text-white transition-colors">Smart Budget Breakdown</Link></li>
              <li><Link href="/" className="hover:text-white transition-colors">Local Culinary Guides</Link></li>
              <li><Link href="/" className="hover:text-white transition-colors">Seasonal Packing & Tips</Link></li>
              <li><Link href="/trips" className="hover:text-white transition-colors">Saved Travel History</Link></li>
            </ul>
          </div>

          {/* Resources & Legal */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200">
              Company & Legal
            </h4>
            <ul className="space-y-2 text-xs font-medium text-slate-400">
              <li><a href="#" className="hover:text-white transition-colors">About KelanaAI</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Travel Safety Guide</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Contact Support</a></li>
            </ul>
          </div>
        </div>

        {/* Bottom Copyright Strip */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500 font-medium">
          <p>© {new Date().getFullYear()} KelanaAI. All rights reserved. Crafted for world travelers.</p>
          <div className="flex items-center gap-6">
            <a href="#" className="hover:text-slate-300 transition-colors">Privacy</a>
            <a href="#" className="hover:text-slate-300 transition-colors">Terms</a>
            <a href="#" className="hover:text-slate-300 transition-colors">Security</a>
            <a href="#" className="hover:text-slate-300 transition-colors flex items-center gap-1">
              <span>System Status</span>
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 inline-block" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
