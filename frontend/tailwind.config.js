/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        coopnex: {
          primary: "#2563EB", // Primary Royal Blue
          deep: "#1D4ED8", // Deep Blue
          indigo: "#4F46E5", // Secondary Indigo
          violet: "#7C3AED", // Electric Violet
          lavender: "#8B5CF6", // Soft Violet
          amber: "#F59E0B", // Warm Gold
          coral: "#F43F5E", // Emergency Coral/Rose
          navy: "#172554", // Deep Navy Text
          slate: "#64748B", // Secondary Text
          canvas: "#F8FAFC", // Very Soft Blue/White
          surface: "#FFFFFF", // Pure White
          border: "#E2E8F0", // Subtle Border
          success: "#10B981", // Semantic green only
          blue: {
            DEFAULT: "#2563EB",
            50: "#EFF6FF",
            100: "#DBEAFE",
            200: "#BFDBFE",
            300: "#93C5FD",
            400: "#60A5FA",
            500: "#3B82F6",
            600: "#2563EB",
            700: "#1D4ED8",
            800: "#1E40AF",
            900: "#172554"
          }
        },
        coop: {
          primary: "#2563EB",
          secondary: "#4F46E5",
          accent: "#7C3AED",
          lavender: "#8B5CF6",
          gold: "#F59E0B",
          emergency: "#F43F5E",
          navy: "#172554",
          slate: "#64748B",
          surface: "#FFFFFF",
          canvas: "#F8FAFC",
          border: "#E2E8F0",
          success: "#10B981"
        }
      },
      boxShadow: {
        '2xs': '0 1px 1px 0 rgba(0, 0, 0, 0.03)',
        'xs': '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
        'glow-primary': '0 10px 25px -5px rgba(37, 99, 235, 0.28)',
        'glow-indigo': '0 10px 25px -5px rgba(79, 70, 229, 0.28)',
        'glow-violet': '0 10px 25px -5px rgba(124, 58, 237, 0.28)',
        'glow-amber': '0 10px 25px -5px rgba(245, 158, 11, 0.28)',
        'glow-emergency': '0 10px 25px -5px rgba(244, 63, 94, 0.32)',
        'card-lift': '0 12px 30px -10px rgba(23, 37, 84, 0.08)'
      },
      fontFamily: {
        sans: ['"Inter"', '"Plus Jakarta Sans"', 'system-ui', 'sans-serif'],
        display: ['"Plus Jakarta Sans"', '"Inter"', 'sans-serif'],
        mono: ['"Space Grotesk"', 'ui-monospace', 'monospace']
      }
    },
  },
  plugins: [],
}
