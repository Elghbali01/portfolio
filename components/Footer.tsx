"use client";

export default function Footer() {
  return (
    <footer className="mt-24 pt-10 pb-8 border-t border-[#1E293B]/60 text-[#64748B]">
      <div className="max-w-4xl mx-auto px-6 text-center space-y-4">
        {/* Name */}
        <h3 className="text-white text-lg font-semibold tracking-wide">
          Issam Elghbali
        </h3>

        {/* Small line */}
        <div className="h-px w-16 mx-auto bg-[#3B82F6]/50 rounded-full"></div>

        {/* Copyright */}
        <p className="text-sm">
          © {new Date().getFullYear()} Issam Elghbali.
          <span className="ml-1 hover:text-[#3B82F6] transition">
            All rights reserved.
          </span>
        </p>
      </div>
    </footer>
  );
}
