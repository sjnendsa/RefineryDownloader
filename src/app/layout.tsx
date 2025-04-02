import React from 'react';
import './globals.css';

export const metadata = {
  title: 'Texas Refinery PDF Downloader',
  description: 'Download Texas refinery PDF reports from the Texas Railroad Commission website',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
})  {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}
