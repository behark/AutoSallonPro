/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        // Primary brand colors
        primary: {
          DEFAULT: "#1E3A8A", // Deep navy blue for luxury feel
          50: "#EFF6FF",
          100: "#DBEAFE",
          200: "#BFDBFE",
          300: "#93C5FD",
          400: "#60A5FA",
          500: "#3B82F6",
          600: "#2563EB",
          700: "#1D4ED8",
          800: "#1E40AF",
          900: "#1E3A8A",
          950: "#172554",
        },
        // Secondary colors
        secondary: {
          DEFAULT: "#1F2937", // Dark gray for contrast
          50: "#F9FAFB",
          100: "#F3F4F6",
          200: "#E5E7EB",
          300: "#D1D5DB",
          400: "#9CA3AF",
          500: "#6B7280",
          600: "#4B5563",
          700: "#374151",
          800: "#1F2937",
          900: "#111827",
          950: "#030712",
        },
        // Accent color for buttons, highlights
        accent: {
          DEFAULT: "#DC2626", // Bold red for calls to action
          50: "#FEF2F2",
          100: "#FEE2E2",
          200: "#FECACA",
          300: "#FCA5A5",
          400: "#F87171",
          500: "#EF4444",
          600: "#DC2626",
          700: "#B91C1C",
          800: "#991B1B",
          900: "#7F1D1D",
          950: "#450A0A",
        },
        // Success, warning, error colors
        success: "#10B981", // Green
        warning: "#F59E0B", // Amber
        error: "#EF4444",   // Red
        // Background colors
        background: "#FFFFFF",
        "background-alt": "#F9FAFB",
        // Text colors
        "text-primary": "#1F2937",
        "text-secondary": "#6B7280",
        "text-disabled": "#9CA3AF",
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        heading: ["Montserrat", "system-ui", "sans-serif"],
        display: ["Playfair Display", "serif"],
      },
      borderRadius: {
        lg: "0.5rem",
        xl: "0.75rem",
        "2xl": "1rem",
        "3xl": "1.5rem",
        "4xl": "2rem",
      },
      boxShadow: {
        card: "0 2px 8px 0 rgba(0, 0, 0, 0.05)",
        dropdown: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
        button: "0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)",
        pricing: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
      },
      animation: {
        "fade-in": "fade-in 0.5s ease-out",
        "slide-up": "slide-up 0.5s ease-out",
        "slide-down": "slide-down 0.5s ease-out",
        "slide-left": "slide-left 0.5s ease-out",
        "slide-right": "slide-right 0.5s ease-out",
      },
      keyframes: {
        "fade-in": {
          "0%": { opacity: 0 },
          "100%": { opacity: 1 },
        },
        "slide-up": {
          "0%": { transform: "translateY(10px)", opacity: 0 },
          "100%": { transform: "translateY(0)", opacity: 1 },
        },
        "slide-down": {
          "0%": { transform: "translateY(-10px)", opacity: 0 },
          "100%": { transform: "translateY(0)", opacity: 1 },
        },
        "slide-left": {
          "0%": { transform: "translateX(10px)", opacity: 0 },
          "100%": { transform: "translateX(0)", opacity: 1 },
        },
        "slide-right": {
          "0%": { transform: "translateX(-10px)", opacity: 0 },
          "100%": { transform: "translateX(0)", opacity: 1 },
        },
      },
      backgroundImage: {
        'hero-pattern': "linear-gradient(to right bottom, rgba(30, 58, 138, 0.8), rgba(30, 58, 138, 0.9)), url('/images/hero-bg.jpg')",
        'gradient-primary': "linear-gradient(135deg, #1E3A8A 0%, #3B82F6 100%)",
        'gradient-dark': "linear-gradient(135deg, #111827 0%, #1F2937 100%)",
      },
    },
  },
  plugins: [
    require("@tailwindcss/typography"),
    require("@tailwindcss/forms"),
    require("@tailwindcss/aspect-ratio"),
    require("tailwindcss-animate"),
    require("daisyui"),
  ],
  daisyui: {
    themes: [
      {
        autoani: {
          primary: "#1E3A8A",
          secondary: "#1F2937",
          accent: "#DC2626",
          neutral: "#191D24",
          "base-100": "#ffffff",
          "base-200": "#F9FAFB",
          "base-300": "#F3F4F6",
          info: "#3ABFF8",
          success: "#10B981",
          warning: "#F59E0B",
          error: "#EF4444",
        },
      },
      "light",
      "dark",
    ],
  },
}
