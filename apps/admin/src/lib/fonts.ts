import localFont from 'next/font/local';

export const euclid = localFont({
  src: [
    { path: '../../public/fonts/euclidcircularb-light.woff2', weight: '300', style: 'normal' },
    { path: '../../public/fonts/euclidcircularb-regular.woff2', weight: '400', style: 'normal' },
    { path: '../../public/fonts/euclidcircularb-regular-italic.woff2', weight: '400', style: 'italic' },
    { path: '../../public/fonts/euclidcircularb-medium.woff2', weight: '500', style: 'normal' },
    { path: '../../public/fonts/euclidcircularb-semibold.woff2', weight: '600', style: 'normal' },
  ],
  variable: '--font-euclid',
  display: 'swap',
});
