/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{html,js,tsx,ts}"],
  theme: {
    extend: {
      colors:{
        'main-black':'#353535',
        'toolbar-red':'#f7544c',
      },
      animation: {
        jump1: 'jump1 1.5s ease-in-out infinite alternate',
        jump2: 'jump2 1.5s ease-in-out infinite alternate',
        jump3: 'jump3 1.5s ease-in-out infinite alternate',
        jump4: 'jump4 1.5s ease-in-out infinite alternate',
      },
      keyframes: {
        jump1: {
          '0%, 15%': { transform: 'rotate(0deg)' },
          '35%, 100%': { transformOrigin: '-50% center', transform: 'rotate(-180deg)' },
        },
        jump2: {
          '0%, 30%': { transform: 'rotate(0deg)' },
          '50%, 100%': { transformOrigin: '-50% center', transform: 'rotate(-180deg)' },
        },
        jump3: {
          '0%, 45%': { transform: 'rotate(0deg)' },
          '65%, 100%': { transformOrigin: '-50% center', transform: 'rotate(-180deg)' },
        },
        jump4: {
          '0%, 60%': { transform: 'rotate(0deg)' },
          '80%, 100%': { transformOrigin: '-50% center', transform: 'rotate(-180deg)' },
        },
        slide: {
          'from': { transform: 'translateX(0)', filter: 'brightness(1)' },
          'to': { transform: 'translateX(calc(8em - 1em * 1.25))', filter: 'brightness(1.45)' },
        },
        jumpDown1: {
          '5%': { transform: 'scale(1, 1)' },
          '15%': { transformOrigin: 'center bottom', transform: 'scale(1.3, 0.7)' },
          '20%, 25%': { transformOrigin: 'center bottom', transform: 'scale(0.8, 1.4)' },
          '40%': { transformOrigin: 'center top', transform: 'scale(1.3, 0.7)' },
          '55%, 100%': { transform: 'scale(1, 1)' },
        },
        jumpDown2: {
          '20%': { transform: 'scale(1, 1)' },
          '30%': { transformOrigin: 'center bottom', transform: 'scale(1.3, 0.7)' },
          '35%, 40%': { transformOrigin: 'center bottom', transform: 'scale(0.8, 1.4)' },
          '55%': { transformOrigin: 'center top', transform: 'scale(1.3, 0.7)' },
          '70%, 100%': { transform: 'scale(1, 1)' },
        },
        jumpDown3: {
          '35%': { transform: 'scale(1, 1)' },
          '45%': { transformOrigin: 'center bottom', transform: 'scale(1.3, 0.7)' },
          '50%, 55%': { transformOrigin: 'center bottom', transform: 'scale(0.8, 1.4)' },
          '70%': { transformOrigin: 'center top', transform: 'scale(1.3, 0.7)' },
          '85%, 100%': { transform: 'scale(1, 1)' },
        },
        jumpDown4: {
          '50%': { transform: 'scale(1, 1)' },
          '60%': { transformOrigin: 'center bottom', transform: 'scale(1.3, 0.7)' },
          '65%, 70%': { transformOrigin: 'center bottom', transform: 'scale(0.8, 1.4)' },
          '85%': { transformOrigin: 'center top', transform: 'scale(1.3, 0.7)' },
          '100%': { transform: 'scale(1, 1)' },
        },
      },
    },
  },
  plugins: [],
}

