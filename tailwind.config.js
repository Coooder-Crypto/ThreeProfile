/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'home-bg': '#010826',
        'about-bg': '#0a2342',
        'skills-bg': '#0f3460',
        'contact-bg': '#1a1a2e',
        'accent': '#0cd1eb',
      },
      animation: {
        'pulse': 'pulse 2s infinite',
        'bounce': 'bounce 2s infinite',
        'fadeInUp': 'fadeInUp 0.8s ease forwards',
        'zoomOut': 'zoomOut 0.5s linear forwards',
      },
      keyframes: {
        pulse: {
          '0%, 100%': { opacity: '0.5' },
          '50%': { opacity: '1' },
        },
        bounce: {
          '0%, 20%, 50%, 80%, 100%': { transform: 'translateY(0)' },
          '40%': { transform: 'translateY(-10px)' },
          '60%': { transform: 'translateY(-5px)' },
        },
        fadeInUp: {
          'from': { 
            opacity: '0',
            transform: 'translateY(30px)'
          },
          'to': { 
            opacity: '1',
            transform: 'translateY(0)'
          },
        },
        zoomOut: {
          '0%': { opacity: '1' },
          '50%': { 
            opacity: '0',
            transform: 'scale3d(1.3, 1.3, 1.3)'
          },
          'to': { opacity: '0' },
        },
      },
      boxShadow: {
        'glow': '0 0 20px rgba(12, 209, 235, 0.8)',
        'content': '0 0 20px rgba(12, 209, 235, 0.3)',
      },
      backgroundImage: {
        'radial-at-tr': 'radial-gradient(circle at top right, var(--tw-gradient-stops))',
        'radial-at-tl': 'radial-gradient(circle at top left, var(--tw-gradient-stops))',
        'radial-at-center': 'radial-gradient(circle at center, var(--tw-gradient-stops))',
      },
    },
  },
  plugins: [],
}
