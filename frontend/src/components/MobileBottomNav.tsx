import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Home, Calendar, Wrench, Zap, Wallet, Heart, User } from "lucide-react";

interface MobileBottomNavProps {
  type: "customer" | "worker";
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({ type }) => {
  const location = useLocation();

  if (type === "customer") {
    const items = [
      { label: "Home", path: "/app", icon: <Home className="w-5 h-5" /> },
      { label: "Services", path: "/services", icon: <Wrench className="w-5 h-5" /> },
      { label: "Urgent", path: "/services?emergency=true", icon: <Zap className="w-5 h-5 text-red-500" /> },
      { label: "Bookings", path: "/app?tab=bookings", icon: <Calendar className="w-5 h-5" /> }
    ];

    return (
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 z-50 px-2 py-1.5 flex items-center justify-around shadow-lg">
        {items.map((item) => {
          const isActive = location.pathname === item.path || (location.pathname + location.search) === item.path;
          return (
            <Link
              key={item.label}
              to={item.path}
              className={`flex flex-col items-center py-1 px-3 text-[10px] font-bold transition ${
                isActive ? "text-teal-800" : "text-slate-400 hover:text-slate-700"
              }`}
            >
              {item.icon}
              <span className="mt-0.5">{item.label}</span>
            </Link>
          );
        })}
      </div>
    );
  }

  // Worker navigation
  const workerItems = [
    { label: "Home", path: "/worker", icon: <Home className="w-5 h-5" /> },
    { label: "Jobs", path: "/worker?tab=jobs", icon: <Calendar className="w-5 h-5" /> },
    { label: "Earnings", path: "/worker?tab=wallet", icon: <Wallet className="w-5 h-5" /> },
    { label: "Welfare", path: "/worker?tab=welfare", icon: <Heart className="w-5 h-5" /> }
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 z-50 px-2 py-1.5 flex items-center justify-around shadow-lg">
      {workerItems.map((item) => {
        const isActive = location.pathname === item.path || (location.pathname + location.search) === item.path;
        return (
          <Link
            key={item.label}
            to={item.path}
            className={`flex flex-col items-center py-1 px-3 text-[10px] font-bold transition ${
              isActive ? "text-teal-800" : "text-slate-400 hover:text-slate-700"
            }`}
          >
            {item.icon}
            <span className="mt-0.5">{item.label}</span>
          </Link>
        );
      })}
    </div>
  );
};

