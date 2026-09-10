/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        // From DESIGN.md - Modern Slate SaaS
        ink: "#0F172A",       // primary: headings, primary button fill
        accent: "#2563EB",    // secondary: links, focus ring, CTAs
        accentSoft: "#EFF6FF",// light chip/hover background for accent
        neutral: "#64748B",   // muted body copy
        canvas: "#F8FAFC",    // page background
        line: "#E2E8F0",      // default border
        lineSoft: "#F1F5F9",  // subtle internal border
        muted: "#94A3B8",     // input placeholder text
        danger: "#EF4444",    // error state
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', "ui-sans-serif", "system-ui", "sans-serif"],
      },
      boxShadow: {
        card: "0 1px 3px 0 rgba(15, 23, 42, 0.06), 0 1px 2px -1px rgba(15, 23, 42, 0.04)",
      },
    },
  },
  plugins: [],
};
