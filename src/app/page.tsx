'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function HomePage() {
  const router = useRouter();

  useEffect(() => {
    // Redirige a /auth/login
    router.push('/auth/login');
  }, [router]);

  return null; // No muestra nada en la página principal
}