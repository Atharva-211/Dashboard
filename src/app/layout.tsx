import './globals.css';
import { ReactNode } from 'react';

export const metadata = {
  title: 'User Dashboard',
  description: 'CRUD dashboard with Firebase backend',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
