import type { Config } from 'tailwindcss';
export default { content: ['./src/**/*.{ts,tsx}'], corePlugins: { preflight: false }, theme: { extend: { colors: { forest: '#17382A', gold: '#C79B2A', cream: '#F4EFE6' } } }, plugins: [] } satisfies Config;
