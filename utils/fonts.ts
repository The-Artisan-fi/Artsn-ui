import { Inter, Roboto_Mono, Urbanist } from 'next/font/google';

// const inter = Inter({
//   variable: '--font-inter',
//   subsets: ['latin'],
//   weight: [
//     '400', // Regular
//     '500', // Medium
//     '700', // Bold
//   ],
// });

// const robotoMono = Roboto_Mono({
//   variable: '--font-roboto-mono',
//   subsets: ['latin'],
//   display: 'swap',
//   weight: [
//     '400', // Regular
//     '500', // Medium
//     '600', // Semibold
//     '700', // Bold
//   ],
// });

const urbanist = Urbanist({
  variable: '--font-urbanist',
  subsets: ['latin'],
  display: 'swap',
  weight: [
    '400', // Regular
    '500', // Medium
    '600', // Semibold
    '700', // Bold
  ],
});

const fontVariables = ` ${urbanist.variable}`;

export default fontVariables;
