/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      keyframes: {
        pop: {
          "0%": { transform: "scale(1)" },
          "50%": { transform: "scale(1.3)" },
          "100%": { transform: "scale(1)" },
        },
      },
      animation: {
        pop: "pop 0.3s ease-in-out",
      },
      screens: {
        // 기본 tailwind sm, md, lg, xl, 2xl 외에 custom 추가
        'hd': '1920px',  // Full HD 이상일 때만 적용
      },
      fontFamily: {
        sans: ["Poppins", '"Noto Sans KR"', 'sans-serif'],
        pretendard: ['Pretendard', 'sans-serif'],
      },
      colors: {
        border: 'hsl(var(--border))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
      },
    },
  },
  plugins: [
    require('@tailwindcss/line-clamp'),
  ],
}
