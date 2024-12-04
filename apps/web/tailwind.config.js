/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"],
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",

    // Or if using `src` directory:
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "background-login": "url('/assets/background-login.jpg')",
      },
      borderRadius: {
        xs: "4px",
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      fontSize: {
        md: "16 px",
      },
      colors: {
        hero: "#3c272b",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        chart: {
          1: "hsl(var(--chart-1))",
          2: "hsl(var(--chart-2))",
          3: "hsl(var(--chart-3))",
          4: "hsl(var(--chart-4))",
          5: "hsl(var(--chart-5))",
        },
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "slide-in": {
          "0%": {
            transform: "translateX(100%) translateY(-50%) top(50%)",
            opacity: 0,
          },
          "25%": {
            transform: "translateX(75%) translateY(-50%) top(50%)",
            opacity: 0.25,
          },
          "50%": {
            transform: "translateX(50%) translateY(-50%) top(50%)",
            opacity: 0.5,
          },
          "75%": {
            transform: "translateX(25%) translateY(-50%) top(50%)",
            opacity: 0.75,
          },
          "100%": {
            transform: "translateX(0) translateY(-50%) top(50%)",
            opacity: 1,
          },
        },
        "slide-out": {
          "0%": {
            transform: "translateX(0) translateY(-50%) top(50%)",
            opacity: 1,
          },
          "25%": {
            transform: "translateX(25%) translateY(-50%) top(50%)",
            opacity: 0.75,
          },
          "50%": {
            transform: "translateX(50%) translateY(-50%) top(50%)",
            opacity: 0.5,
          },
          "75%": {
            transform: "translateX(75%) translateY(-50%) top(50%)",
            opacity: 0.25,
          },
          "100%": {
            transform: "translateX(100%) translateY(-50%) top(50%)",
            opacity: 0,
          },
        },
        "fade-in-left": {
          "0%": {
            transform: "translateX(-100%) translateY(-50%)",
            opacity: 0,
          },
          "100%": { transform: "translateX(0) translateY(-50%)", opacity: 1 },
        },
        "fade-out-left": {
          "0%": { transform: "translateX(0) translateY(-50%)", opacity: 1 },
          "100%": {
            transform: "translateX(-100%) translateY(-50%)",
            opacity: 0,
          },
        },
        "fade-in-right": {
          "0%": { transform: "translateX(100%) translateY(-50%)", opacity: 0 },
          "100%": { transform: "translateX(0) translateY(-50%)", opacity: 1 },
        },
        "fade-out-right": {
          "0%": { transform: "translateX(0) translateY(-50%)", opacity: 1 },
          "100%": {
            transform: "translateX(100%) translateY(-50%)",
            opacity: 0,
          },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "slide-in": "slide-in 0.5s ease-in-out",
        "slide-out": "slide-out 0.5s ease-in-out",
        "fade-in-left": "fade-in-left 0.5s ease-in-out",
        "fade-out-left": "fade-out-left 0.5s ease-in-out",
        "fade-in-right": "fade-in-right 0.5s ease-in-out",
        "fade-out-right": "fade-out-right 0.5s ease-in-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
