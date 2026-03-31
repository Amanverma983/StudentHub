import { AuthProvider } from '@/context/AuthContext';
import { MarketplaceProvider } from '@/context/MarketplaceContext';
import { Toaster } from 'react-hot-toast';
import Script from 'next/script';
import '@/styles/globals.css';

export const metadata = {
  title: {
    default: 'StudentHub — The All-in-One Student Career Platform',
    template: '%s | StudentHub',
  },
  description:
    'StudentHub is the premium career-building toolkit for students. Build your resume, showcase your portfolio, and earn money by completing assignment gigs.',
  keywords: [
    'student jobs', 'assignment gigs', 'resume builder', 'portfolio maker',
    'student freelance', 'earn money as student', 'handwritten assignments',
    'student marketplace India',
  ],
  authors: [{ name: 'StudentHub Team' }],
  creator: 'StudentHub',
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    url: 'https://studenthub.in',
    title: 'StudentHub — The All-in-One Student Career Platform',
    description: 'Build your career. Earn while you study. The premium platform for students.',
    siteName: 'StudentHub',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'StudentHub — The All-in-One Student Career Platform',
    description: 'Build your career. Earn while you study.',
    creator: '@studenthub_in',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 5,
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;1,9..40,400&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-void text-ink font-body antialiased">
        <AuthProvider>
          <MarketplaceProvider>
            {children}
            <Toaster
              position="bottom-right"
              toastOptions={{
                style: {
                  background: '#1a181e',
                  color: '#f4f4f7',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '16px',
                },
              }}
            />
          </MarketplaceProvider>
        </AuthProvider>
        <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="lazyOnload" />
      </body>
    </html>
  );
}
