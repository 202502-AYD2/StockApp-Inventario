import '@/styles/globals.css';
import type { AppProps } from 'next/app';
import Layout from '@/components/Organisms/Layout';
import { usePathname } from 'next/navigation';

export default function App({ Component, pageProps }: AppProps) {
  const pathname = usePathname();
  // Exclude Layout for login page
  if (pathname === '/login') {
    return <Component {...pageProps} />;
  }
  return (
    <Component {...pageProps} />

  );
}
