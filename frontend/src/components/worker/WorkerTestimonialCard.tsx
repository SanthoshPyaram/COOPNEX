import React from "react";
import { motion } from "framer-motion";
import { Star, ShieldCheck, MapPin, Award } from "lucide-react";

export interface WorkerStory {
  id: string;
  name: string;
  trade: string;
  nsqfLevel: string;
  experience: string;
  location: string;
  rating: number;
  completedJobs: number;
  quote: string;
  photoUrl: string;
  badge: string;
  badgeColor: string;
}

export const WORKER_STORIES: WorkerStory[] = [
  {
    id: "story-1",
    name: "Ramesh Kumar",
    trade: "Master Electrician",
    nsqfLevel: "NSQF Level 4",
    experience: "11 Years",
    location: "Hyderabad, Telangana",
    rating: 4.95,
    completedJobs: 480,
    quote:
      "Private aggregator apps cut 30% of my hard-earned money and kept me waiting for weeks. In COOPNEX, 100% of my payment hits my bank account immediately via UPI OTP confirmation.",
    photoUrl: "https://images.unsplash.com/photo-1540569014015-19a7be504e3a?w=400&q=80",
    badge: "Primary Guild Lead",
    badgeColor: "bg-emerald-50 text-emerald-800 border border-emerald-200"
  },
  {
    id: "story-2",
    name: "Sujatha Devi",
    trade: "Solar & Appliance Specialist",
    nsqfLevel: "NSQF Level 3",
    experience: "8 Years",
    location: "Bengaluru, Karnataka",
    rating: 4.98,
    completedJobs: 310,
    quote:
      "As a certified woman technician, household safety and respect matter most. Our cooperative federation gives us comprehensive accidental insurance, transparent rates, and dignified work.",
    photoUrl: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=400&q=80",
    badge: "Women's Guild Director",
    badgeColor: "bg-blue-50 text-blue-800 border border-blue-200"
  },
  {
    id: "story-3",
    name: "Manoj Verma",
    trade: "Plumbing & Sanitation Expert",
    nsqfLevel: "NSQF Level 4",
    experience: "14 Years",
    location: "Pune, Maharashtra",
    rating: 4.92,
    completedJobs: 540,
    quote:
      "The emergency dispatch stipend gives me 25% extra pay when attending urgent burst pipe calls within 7 minutes. Plus, our cooperative tool library lets me borrow expensive pressure gauges for free.",
    photoUrl: "https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?w=400&q=80",
    badge: "Rapid Response Specialist",
    badgeColor: "bg-purple-50 text-purple-800 border border-purple-200"
  },
  {
    id: "story-4",
    name: "Anand Mistri",
    trade: "Master Wood Craftsman",
    nsqfLevel: "NSQF Level 4",
    experience: "16 Years",
    location: "Ahmedabad, Gujarat",
    rating: 4.96,
    completedJobs: 620,
    quote:
      "Having 1 worker = 1 vote in our primary society gives real power to artisans. We decide standard district labor rates together, instead of an algorithm squeezing our livelihood.",
    photoUrl: "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=400&q=80",
    badge: "Society Executive Member",
    badgeColor: "bg-amber-50 text-amber-800 border border-amber-200"
  }
];

interface WorkerTestimonialCardProps {
  story: WorkerStory;
  index: number;
}

export const WorkerTestimonialCard: React.FC<WorkerTestimonialCardProps> = ({ story, index }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 25 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ y: -6 }}
      className="group relative bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/90 shadow-md hover:shadow-xl hover:border-blue-400 transition-all duration-300 flex flex-col justify-between overflow-hidden"
    >
      {/* Top Banner & Location */}
      <div>
        <div className="flex items-center justify-between gap-2 mb-4">
          <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-wider ${story.badgeColor}`}>
            <Award className="w-3 h-3" />
            <span>{story.badge}</span>
          </span>

          <div className="flex items-center gap-1 text-[11px] font-semibold text-slate-500">
            <MapPin className="w-3.5 h-3.5 text-blue-600" />
            <span>{story.location}</span>
          </div>
        </div>

        {/* Worker Portrait & Header Info */}
        <div className="flex items-center gap-4 mb-4">
          <div className="relative w-16 h-16 sm:w-18 sm:h-18 rounded-2xl overflow-hidden border-2 border-slate-200 group-hover:border-blue-500 shadow-sm shrink-0 transition-colors">
            <img
              src={story.photoUrl}
              alt={`${story.name} - ${story.trade}`}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              loading="lazy"
            />
            <div className="absolute bottom-0 right-0 w-4 h-4 bg-emerald-500 rounded-tl-md border-t border-l border-white flex items-center justify-center">
              <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
            </div>
          </div>

          <div className="space-y-0.5 min-w-0">
            <div className="flex items-center gap-1.5">
              <h4 className="font-black text-slate-900 text-base sm:text-lg truncate group-hover:text-blue-600 transition-colors">
                {story.name}
              </h4>
              <span title="KYC & Police Verified">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
              </span>
            </div>
            <div className="text-xs font-bold text-blue-600 truncate">{story.trade}</div>
            <div className="text-[11px] text-slate-500 font-medium">
              {story.nsqfLevel} • {story.experience} exp
            </div>
          </div>
        </div>

        {/* Star Rating & Completed Jobs */}
        <div className="flex items-center gap-3 py-2 px-3 rounded-xl bg-slate-50 border border-slate-200 mb-3 text-xs">
          <div className="flex items-center gap-1 text-amber-500 font-bold">
            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
            <span>{story.rating.toFixed(1)}</span>
          </div>
          <span className="text-slate-300">•</span>
          <span className="text-slate-600 font-semibold">{story.completedJobs}+ Completed Jobs</span>
          <span className="text-slate-300">•</span>
          <span className="text-emerald-700 font-bold text-[11px]">100% Retained Pay</span>
        </div>

        {/* Testimonial Quote */}
        <blockquote className="text-xs sm:text-sm text-slate-700 leading-relaxed italic font-medium pt-1">
          "{story.quote}"
        </blockquote>
      </div>

      {/* Bottom Footer Details */}
      <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500 font-mono">
        <span className="font-bold text-emerald-700">Verified Member</span>
        <span>COOPNEX Guild</span>
      </div>
    </motion.div>
  );
};
