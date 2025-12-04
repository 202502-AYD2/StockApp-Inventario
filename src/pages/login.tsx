//import { LoginForm } from "@/components/login-form"
//
//export default function LoginPage() {
//  return (
//    <div className="bg-muted flex min-h-svh flex-col items-center justify-center p-6 md:p-10">
//      <div className="w-full max-w-sm md:max-w-4xl">
//        <LoginForm />
//      </div>
//    </div>
//  )
//}
//

import { useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { createClient } from '@supabase/supabase-js';
import { LayoutDashboard, Loader2, AlertCircle } from 'lucide-react';

// Inicializa Supabase (Asegúrate de tener tus variables en .env)
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(''); // Limpiamos errores previos

    try {
      // Usamos maybeSingle() para que no lance error si no encuentra nada, solo devuelve null
      const { data: user, error: dbError } = await supabase
        .from('User') 
        .select('*')
        .eq('email', formData.email)
        .eq('password', formData.password)
        .maybeSingle(); 

      // 1. Si hubo un error TÉCNICO de la base de datos (conexión, permisos, etc.)
      if (dbError) {
        console.error("Error BD:", dbError);
        setError("Ocurrió un error de conexión. Intenta más tarde.");
        return; // Detenemos la función aquí
      }
      
      // 2. Si NO hubo error técnico, pero el usuario no apareció (Credenciales mal)
      if (!user) {
        // AQUÍ ESTÁ EL CAMBIO: No lanzamos 'throw', solo ponemos el mensaje
        setError('Credenciales inválidas o usuario no encontrado.');
        return; // Detenemos la función aquí suavemente
      }

      // 3. Si llegamos aquí, es ÉXITO
      localStorage.setItem('user_session', JSON.stringify(user));

      // --- CAMBIO: REDIRECCIÓN INTELIGENTE ---
      // Verificamos si es ADMIN para llevarlo a su zona especial
      if (user.role === 'ADMIN') {
        router.push('/dashboard'); // Llevamos al jefe a gestionar usuarios
      } else {
        router.push('/dashboard'); // El resto al dashboard normal
      }
      // ---------------------------------------

    } catch (err: any) {
      // Esto solo atrapa errores inesperados (crashes reales)
      console.error("Error inesperado:", err);
      setError("Algo salió mal inesperadamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-muted/40 p-4">
      <div className="w-full max-w-sm space-y-6 bg-white p-8 rounded-lg shadow-lg border">
        
        <div className="flex flex-col space-y-2 text-center">
          <div className="mx-auto bg-primary/10 p-3 rounded-full">
            <LayoutDashboard className="h-6 w-6 text-primary" />
          </div>
          <h1 className="text-2xl font-semibold tracking-tight">Bienvenido de nuevo</h1>
          <p className="text-sm text-muted-foreground">
            Ingresa tus credenciales para acceder al sistema
          </p>
        </div>

        {error && (
          <div className="bg-destructive/15 text-destructive text-sm p-3 rounded-md flex items-center gap-2">
            <AlertCircle className="h-4 w-4" />
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium leading-none" htmlFor="email">
              Correo Electrónico
            </label>
            <input
              id="email"
              type="email"
              placeholder="admin@inventario.com"
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              required
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium leading-none" htmlFor="password">
              Contraseña
            </label>
            <input
              id="password"
              type="password"
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
              required
            />
          </div>
          
          <button
            type="submit"
            disabled={loading}
            className="w-full inline-flex h-10 items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow hover:bg-primary/90 disabled:opacity-50 transition-colors"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Verificando...
              </>
            ) : (
              'Ingresar'
            )}
          </button>
        </form>

        <div className="text-center text-sm text-muted-foreground">
          <Link href="/" className="hover:text-primary underline underline-offset-4">
            Volver al inicio
          </Link>
        </div>
      </div>
    </div>
  );
}