// import type { Config } from "tailwindcss";

// const config: Config = {
//     darkMode: ["class"],
//     content: [
//     "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
//     "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
//     "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
//   ],
//   theme: {
//   	extend: {
//   		colors: {
//   			background: 'var(--background)',
//   			foreground: 'var(--foreground)'
//   		},
//   		borderRadius: {
//   			lg: 'var(--radius)',
//   			md: 'calc(var(--radius) - 2px)',
//   			sm: 'calc(var(--radius) - 4px)'
//   		}
//   	}
//   },
//   plugins: [require("tailwindcss-animate")],
// };
// export default config;


import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))'
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)'
      },
	  fontFamily: {
        signature: ['agustina', 'sans-serif'],
        sans: ['Urbanist', 'sans-serif'],
        mono: ['Roboto Mono', 'monospace'],
        syne: ['Syne', 'sans-serif'],
        urbanist: ['Urbanist', 'sans-serif'],
        poppins: ['Poppins', 'sans-serif'],
        cormorant: ['Cormorant Infant', 'serif'],
      },
     
      colors: {
        bg: {
          DEFAULT: '#F9F9FA',
          dark: '#1E1B19'
        },
        background: {
          DEFAULT: '#F9F9FA',
          dark: '#1E1B19'
        },
        footerBackground: {
          DEFAULT: '#CBBBA066',
              dark: '#1E1B19'
        },
        foreground: {
          DEFAULT: '#7B6A58',
          dark: '#E0D8D0'
        },
        primary: {
          DEFAULT: '#FFFFFF',
          foreground: '#FFFFFF',
          dark: '#8B6A4F',
          'dark-foreground': '#FFFFFF'
        },
        secondary: {
          DEFAULT: '#000000',
          foreground: '#4A4A4A',
          dark: '#3A3633',
          'dark-foreground': '#E0D8D0'
        },
        accent: {
          DEFAULT: '#7B6A58',
          foreground: '#FFFFFF',
          dark: '#E65A4F',
          'dark-foreground': '#FFFFFF'
        },
        muted: {
          DEFAULT: '#E5DED8',
          foreground: '#6C6C6C',
          dark: '#2A2624',
          'dark-foreground': '#A19789'
        },
        card: {
          DEFAULT: '#FFFFFF',
          foreground: '#4A4A4A',
          dark: '#2A2624',
          'dark-foreground': '#E0D8D0'
        },
        popover: {
          DEFAULT: '#FFFFFF',
          foreground: '#4A4A4A',
          dark: '#2A2624',
          'dark-foreground': '#E0D8D0'
        },
        border: {
          DEFAULT: '#D1C7BE',
          dark: '#4A4541'
        },
        input: {
          DEFAULT: '#E5DED8',
          dark: '#3A3633'
        },
        ring: {
          DEFAULT: '#B08968',
          dark: '#8B6A4F'
        },
        destructive: {
          DEFAULT: '#D73427',
          foreground: '#FFFFFF',
          dark: '#E65A4F',
          'dark-foreground': '#FFFFFF'
        },
        chart: {
          '1': { DEFAULT: '#B08968', dark: '#8B6A4F' },
          '2': { DEFAULT: '#D73427', dark: '#E65A4F' },
          '3': { DEFAULT: '#E5DED8', dark: '#3A3633' },
          '4': { DEFAULT: '#FAF7F5', dark: '#1E1B19' },
          '5': { DEFAULT: '#4A4A4A', dark: '#E0D8D0' }
        }
      },
      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' }
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' }
        }
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        'spin-slow': 'spin 3s linear infinite',
        pulse: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        bounce: 'bounce 1s infinite',
        spin: 'spin 1s linear infinite',
        ping: 'ping 1s cubic-bezier(0, 0, 0.2, 1) infinite',
        'fade-in': 'fadeIn 0.5s ease-out',
        'slide-in': 'slideIn 0.5s ease-out',
        wiggle: 'wiggle 1s ease-in-out infinite',
        shake: 'shake 0.82s cubic-bezier(.36,.07,.19,.97) both',
        heartbeat: 'heartbeat 1.5s ease-in-out infinite both',
        flip: 'flip 1s ease-in-out infinite'
      }
    }
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;