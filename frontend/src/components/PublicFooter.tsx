import { CoopnexLogo } from "./brand/CoopnexLogo";
import React from "react";
import { Link } from "react-router-dom";
import { ShieldCheck, Phone, Mail, MapPin, Sparkles } from "lucide-react";

export const PublicFooter: React.FC = () => {
  return (
    <footer className="bg-[#0B1220] text-slate-400 text-xs border-t border-white/10 select-none">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
          {/* Col 1: Brand & Mission */}
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center">
              <CoopnexLogo variant="full" size="md" theme="dark" showTagline />
            </div>
            <p className="text-slate-400 text-xs leading-relaxed max-w-sm">
              People. Skills. Cooperatives. Connected. A next-generation cooperative network connecting people, skilled workers, local services and cooperative communities with 0% middleman deductions.
            </p>
            <div className="pt-2 text-[11px] text-[#28A66A] font-semibold flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-[#F4B740]" />
              <span>Connecting People • Empowering Cooperatives</span>
            </div>
          </div>

          {/* Col 2: Services */}
          <div>
            <h4 className="text-white font-bold uppercase tracking-wider text-[11px] mb-3">
              Services
            </h4>
            <ul className="space-y-2 text-slate-300">
              <li><Link to="/services?service=Electrician" className="hover:text-white transition">Electrician & Solar</Link></li>
              <li><Link to="/services?service=Plumber" className="hover:text-white transition">Plumbing & Sanitation</Link></li>
              <li><Link to="/services?service=Carpenter" className="hover:text-white transition">Carpentry & Woodwork</Link></li>
              <li><Link to="/services?service=Painter" className="hover:text-white transition">Painting & Water-Proofing</Link></li>
              <li><Link to="/services?service=Caregiver" className="hover:text-white transition">Elderly Care & Nursing</Link></li>
              <li><Link to="/services?service=Technician" className="hover:text-white transition">Appliance & HVAC Repair</Link></li>
            </ul>
          </div>

          {/* Col 3: For Workers & Cooperatives */}
          <div>
            <h4 className="text-white font-bold uppercase tracking-wider text-[11px] mb-3">
              Ecosystem
            </h4>
            <ul className="space-y-2 text-slate-300">
              <li><Link to="/for-workers" className="hover:text-white transition">For Artisans</Link></li>
              <li><Link to="/join-worker" className="hover:text-white transition">Join as an Artisan</Link></li>
              <li><Link to="/for-cooperatives" className="hover:text-white transition">For Primary Societies</Link></li>
              <li><Link to="/how-it-works" className="hover:text-white transition">How It Works</Link></li>
              <li><Link to="/about" className="hover:text-white transition">About the Cooperative</Link></li>
              <li><Link to="/admin/login" className="text-blue-400 hover:text-white font-semibold transition">Admin Operations Portal</Link></li>
            </ul>
          </div>

          {/* Col 4: Trust & Support */}
          <div>
            <h4 className="text-white font-bold uppercase tracking-wider text-[11px] mb-3">
              Help & Governance
            </h4>
            <ul className="space-y-2 text-[11px] text-slate-300">
              <li className="flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-[#28A66A]" />
                <span>Toll Free: 1800-425-COOP</span>
              </li>
              <li className="flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-[#28A66A]" />
                <span>support@coopnex.org</span>
              </li>
              <li className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-[#28A66A]" />
                <span>Cooperative Bhavan, Amaravati & Hyderabad</span>
              </li>
              <li className="pt-2 text-[10px] text-slate-500">
                <span>Working Hours: 24/7 National Emergency Dispatch</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-slate-500">
          <div>
            © 2026 COOPNEX. All rights reserved. Cooperative Workforce Network.
          </div>
          <div className="flex items-center gap-4">
            <span className="hover:text-slate-400 cursor-pointer">Privacy Policy</span>
            <span>•</span>
            <span className="hover:text-slate-400 cursor-pointer">Terms of Service</span>
            <span>•</span>
            <span className="hover:text-slate-400 cursor-pointer">Worker Welfare Charter</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
