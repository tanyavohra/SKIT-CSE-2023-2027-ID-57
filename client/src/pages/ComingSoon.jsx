// src/pages/ComingSoon.jsx
//
// Temporary page for sections that are linked from the navbar but not built yet.
// Replace the route's element in App.jsx with the real page when it exists.

import { Link } from "react-router-dom";
import { ArrowLeft, Construction } from "lucide-react";

export default function ComingSoon({ title = "This page" }) {
  return (
    <div className="max-w-[1200px] mx-auto px-4 md:px-6 py-16 md:py-24">
      <div className="max-w-xl mx-auto bg-white border border-[#c6c6cd]/40 rounded-xl shadow-sm p-8 text-center">
        <div className="w-12 h-12 mx-auto rounded-lg bg-[#eff4ff] text-[#0051d5] flex items-center justify-center mb-4 border border-[#c6c6cd]/20">
          <Construction size={24} />
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-[#0b1c30]">{title}</h1>
        <p className="text-sm text-[#45464d] mt-2">This section is coming soon.</p>
        <Link
          to="/dashboard"
          className="inline-flex items-center gap-2 mt-6 px-4 py-2 text-sm font-semibold text-[#0051d5] bg-[#eff4ff] hover:bg-[#e5eeff] transition-colors rounded-lg border border-[#c6c6cd]/30"
        >
          <ArrowLeft size={16} />
          Back to Community
        </Link>
      </div>
    </div>
  );
}