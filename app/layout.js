import './globals.css';
import Providers from '@/app/components/Providers';

export const metadata = {
  title: 'Nirmaan Donation Dashboard',
  description: 'Manage donations and payments',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}