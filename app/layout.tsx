// app/layout.tsx
import type { Metadata } from 'next';
import './globals.css';
import { Providers } from './providers';

export const metadata: Metadata = {
  title: 'We Are Getting Married! 🤵👰',
  description: 'You are cordially invited to celebrate our beautiful day.',
  openGraph: {
    title: 'We Are Getting Married! 🤵👰',
    description: 'You are cordially invited to celebrate our beautiful day.',
    url: 'https://weddinng-invitation.vercel.app',
    siteName: 'Wedding Invitation',
    images: [
      {
        url: 'https://weddinng-invitation.vercel.app/og-image.jpeg',
        width: 1200,
        height: 630,
        alt: 'Wedding Invitation Preview',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
};

import { AntdRegistry } from '@ant-design/nextjs-registry';
import { Toaster } from 'sonner';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased min-h-screen">
        <Providers>
          <AntdRegistry>
            {children}
            <Toaster
              position="top-right"
              toastOptions={{
                classNames: {
                  success: '!bg-green-100 !text-green-800 !border !border-green-300',
                  error: '!bg-red-100 !text-red-800 !border !border-red-300',
                  toast: '!bg-white !text-gray-800 !border !border-gray-200',
                },
                duration: 2000,
              }}
            />
          </AntdRegistry>
        </Providers>
      </body>
    </html>
  );
}
