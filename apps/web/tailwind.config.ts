import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        sun: '#ef4444',    // 해 - 빨강
        moon: '#22c55e',   // 달 - 초록
        star: '#eab308',   // 별 - 노랑
        cloud: '#3b82f6',  // 구름 - 파랑
      },
    },
  },
  plugins: [],
};

export default config;
