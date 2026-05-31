// app/layout.tsx
import type { Metadata } from 'next';
import './globals.css';
import { Providers } from './providers';

export const metadata: Metadata = {
  title: 'We Are Getting Married! 🤵👰',
  description: 'You are cordially invited to celebrate our beautiful union.',
};

import { AntdRegistry } from '@ant-design/nextjs-registry';

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
          </AntdRegistry>
        </Providers>
      </body>
    </html>
  );
}
