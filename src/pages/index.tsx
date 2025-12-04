//import React, { useEffect, useState } from 'react';
//import { useRouter } from 'next/router';
//
//const Index = () => {
//  const [token, setToken] = useState<string | null>(null);
//  const router = useRouter();
//  useEffect(() => {
//    const storedToken = localStorage.getItem('token');
//    if (storedToken) {
//      setToken(storedToken);
//    } else {
//      router.push('/login');
//    }
//  }, []);
//  if (token) {
//    return <div className=' w-full flex flex-col items-center justify-center  h-screen'></div>;
//  } else {
//    return <div>Redirecting to login...</div>;
//  }
//};
//
//export default Index;
//
//


import React, { useEffect } from 'react';
import Link from 'next/link';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { Package, ArrowRightLeft, Users, LayoutDashboard } from 'lucide-react';

export default function LandingPage() {
  const router = useRouter();

  // Si ya hay token (usuario logueado), lo mandamos directo adentro.
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      router.push('/dashboard'); 
    }
  }, [router]);

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <Head>
        <title>Gestión de Inventarios | UdeA</title>
        <meta name="description" content="Sistema de control de inventarios y usuarios" />
      </Head>

      {/* --- NAV (Ahora más limpio, solo Logo) --- */}
      <nav className="w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 max-w-screen-2xl items-center px-4 md:px-8 mx-auto">
          <div className="flex items-center gap-2 font-bold text-xl">
            <div className="p-1.5 bg-primary rounded-lg text-primary-foreground">
              <Package className="h-5 w-5" />
            </div>
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-blue-500">
              StockApp
            </span>
          </div>
          {/* Se eliminó el enlace "Acceso Administrativo" de aquí */}
        </div>
      </nav>

      {/* --- HERO SECTION --- */}
      <main className="flex-1">
        <section className="space-y-6 pb-8 pt-6 md:pb-12 md:pt-10 lg:py-32">
          <div className="container flex max-w-[64rem] flex-col items-center gap-4 text-center mx-auto px-4">
            
            <div className="rounded-2xl bg-muted px-4 py-1.5 text-sm font-medium text-muted-foreground animate-fade-in-down">
              Entrega Final • Desarrollo Web
            </div>

            <h1 className="font-heading text-4xl font-bold sm:text-5xl md:text-6xl lg:text-7xl animate-fade-in-up">
              Control total de tus <br/>
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-green-500 to-emerald-700">
                Maestros y Movimientos
              </span>
            </h1>

            <p className="max-w-[42rem] leading-normal text-muted-foreground sm:text-xl sm:leading-8 animate-fade-in-up animation-delay-200">
              Gestiona inventarios, registra transacciones de entrada/salida y administra roles de usuario en una sola plataforma segura.
            </p>

            {/* BOTÓN ÚNICO DE ACCESO */}
            <div className="space-x-4 animate-fade-in-up animation-delay-300 pt-4">
              <Link
                href="/login"
                className="inline-flex h-11 items-center justify-center rounded-md bg-primary px-8 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              >
                Iniciar Sesión
                <LayoutDashboard className="ml-2 h-4 w-4" />
              </Link>
            </div>
          </div>
        </section>

        {/* --- FEATURES (Importante para la nota de Diseño) --- */}
        <section className="container space-y-6 py-8 md:py-12 lg:py-24 mx-auto px-4">
          <div className="mx-auto grid justify-center gap-4 sm:grid-cols-2 md:max-w-[64rem] md:grid-cols-3">
            
            <div className="relative overflow-hidden rounded-lg border bg-card text-card-foreground p-6 shadow-sm hover:shadow-md transition-all">
              <div className="flex h-10 w-10 flex-col items-center justify-center rounded-lg bg-primary/10 mb-4">
                <Package className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-bold">Gestión de Maestros</h3>
              <p className="text-sm text-muted-foreground mt-2">
                Control de saldos y creación de productos (Solo Admin).
              </p>
            </div>

            <div className="relative overflow-hidden rounded-lg border bg-card text-card-foreground p-6 shadow-sm hover:shadow-md transition-all">
              <div className="flex h-10 w-10 flex-col items-center justify-center rounded-lg bg-primary/10 mb-4">
                <ArrowRightLeft className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-bold">Transacciones</h3>
              <p className="text-sm text-muted-foreground mt-2">
                Registra entradas y salidas con historial detallado.
              </p>
            </div>

            <div className="relative overflow-hidden rounded-lg border bg-card text-card-foreground p-6 shadow-sm hover:shadow-md transition-all">
              <div className="flex h-10 w-10 flex-col items-center justify-center rounded-lg bg-primary/10 mb-4">
                <Users className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-bold">Roles y Usuarios</h3>
              <p className="text-sm text-muted-foreground mt-2">
                Permisos diferenciados para Administradores y Usuarios.
              </p>
            </div>

          </div>
        </section>
      </main>

      {/* --- FOOTER --- */}
      <footer className="py-6 md:px-8 md:py-0 border-t border-border/40">
        <div className="container flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row mx-auto">
          <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
            Desarrollado para <span className="font-bold">Entrega 3</span>. Next.js + Supabase.
          </p>
        </div>
      </footer>
    </div>
  );
}