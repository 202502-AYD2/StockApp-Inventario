import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { createClient } from '@supabase/supabase-js';
import Layout from '@/components/Organisms/Layout';
import { 
  Package, 
  Users, 
  AlertTriangle, 
  TrendingUp, 
} from 'lucide-react';

// 1. IMPORTAR LA LIBRERÍA DE GRÁFICAS (Esto faltaba en tu código)
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  Legend 
} from 'recharts';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function Dashboard() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalUsers: 0,
    lowStock: 0
  });

  // 2. ESTADO PARA LOS DATOS DE LA GRÁFICA (Esto faltaba)
  const [chartData, setChartData] = useState<any[]>([]);

  useEffect(() => {
    const session = localStorage.getItem('user_session');
    
    if (!session) {
      router.push('/login');
    } else {
      const userData = JSON.parse(session);
      setUser(userData);
      fetchStats(userData);
    }
  }, [router]);

  const fetchStats = async (currentUser: any) => {
    try {
      // --- CARGA DE DATOS BÁSICOS ---
      const { count: productsCount } = await supabase
        .from('Product')
        .select('*', { count: 'exact', head: true });

      const { data: lowStockData } = await supabase
        .from('Product')
        .select('id')
        .lt('stock', 5);

      let usersCount = 0;
      if (currentUser.role === 'ADMIN') {
        const { count } = await supabase
          .from('User')
          .select('*', { count: 'exact', head: true });
        usersCount = count || 0;
      }

      setStats({
        totalProducts: productsCount || 0,
        totalUsers: usersCount || 0,
        lowStock: lowStockData?.length || 0
      });

      // --- 3. LOGICA PARA LLENAR LA GRÁFICA (Esto faltaba) ---
      const { data: movements } = await supabase
        .from('Movement')
        .select('type, quantity');

      if (movements && movements.length > 0) {
        // Sumar todas las entradas
        const totalEntradas = movements
          .filter(m => m.type === 'ENTRADA')
          .reduce((acc, curr) => acc + curr.quantity, 0);

        // Sumar todas las salidas
        const totalSalidas = movements
          .filter(m => m.type === 'SALIDA')
          .reduce((acc, curr) => acc + curr.quantity, 0);

        // Guardar en el formato que pide Recharts
        setChartData([
          { name: 'Entradas', cantidad: totalEntradas, fill: '#16a34a' }, // Barra Verde
          { name: 'Salidas', cantidad: totalSalidas, fill: '#ea580c' },   // Barra Naranja
        ]);
      } else {
        // Si no hay datos, inicializamos en cero para que no salga error
        setChartData([
            { name: 'Entradas', cantidad: 0, fill: '#16a34a' },
            { name: 'Salidas', cantidad: 0, fill: '#ea580c' },
        ]);
      }

    } catch (error) {
      console.error("Error cargando estadísticas:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-64 text-muted-foreground">
          Cargando panel de control...
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-8 animate-in fade-in duration-500">
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-gray-900">Panel de Control</h1>
            <p className="text-muted-foreground mt-1">
              Bienvenido, <span className="font-semibold text-primary">{user?.name}</span>.
            </p>
          </div>
          <div className="bg-white border px-4 py-2 rounded-md shadow-sm text-sm font-medium text-gray-600">
            {new Date().toLocaleDateString('es-ES', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </div>
        </div>

        {/* --- TARJETAS --- */}
        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
           {/* Total Productos */}
           <div className="p-6 bg-white rounded-xl border shadow-sm flex items-center justify-between hover:shadow-md transition-all">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Productos</p>
                <h3 className="text-3xl font-bold mt-2 text-gray-800">{stats.totalProducts}</h3>
              </div>
              <div className="h-12 w-12 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center border border-blue-100">
                <Package className="h-6 w-6" />
              </div>
           </div>
           
           {/* Alerta Stock */}
           <div className={`p-6 rounded-xl border shadow-sm flex items-center justify-between hover:shadow-md transition-all ${stats.lowStock > 0 ? 'bg-red-50 border-red-200' : 'bg-white'}`}>
              <div>
                <p className={`text-sm font-medium ${stats.lowStock > 0 ? 'text-red-600' : 'text-muted-foreground'}`}>Alerta Stock</p>
                <h3 className={`text-3xl font-bold mt-2 ${stats.lowStock > 0 ? 'text-red-700' : ''}`}>{stats.lowStock}</h3>
              </div>
              <div className={`h-12 w-12 rounded-full flex items-center justify-center border ${stats.lowStock > 0 ? 'bg-white text-red-600 border-red-200' : 'bg-gray-100 text-gray-600'}`}>
                <AlertTriangle className="h-6 w-6" />
              </div>
           </div>

           {/* Usuarios (Solo Admin) */}
           {user?.role === 'ADMIN' && (
             <div className="p-6 bg-white rounded-xl border shadow-sm flex items-center justify-between hover:shadow-md transition-all">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Usuarios</p>
                  <h3 className="text-3xl font-bold mt-2">{stats.totalUsers}</h3>
                </div>
                <div className="h-12 w-12 bg-purple-50 text-purple-600 rounded-full flex items-center justify-center border border-purple-100">
                  <Users className="h-6 w-6" />
                </div>
             </div>
           )}
        </div>

        {/* --- 4. AQUÍ ESTÁ EL COMPONENTE DE LA GRÁFICA REAL --- */}
        <div className="grid gap-6 md:grid-cols-1">
          <div className="bg-white p-6 rounded-xl border shadow-sm h-[450px]">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="font-bold text-lg text-gray-800">Balance de Movimientos</h3>
                <p className="text-sm text-muted-foreground">Comparativa histórica de Entradas vs Salidas</p>
              </div>
              <div className="p-2 bg-gray-50 rounded-lg">
                <TrendingUp className="text-gray-400 h-5 w-5" />
              </div>
            </div>
            
            {/* Si chartData está vacío (porque no has hecho transacciones), mostramos aviso */}
            {chartData.length > 0 && (chartData[0].cantidad > 0 || chartData[1].cantidad > 0) ? (
                <ResponsiveContainer width="100%" height="85%">
                <BarChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                    <XAxis 
                        dataKey="name" 
                        axisLine={false} 
                        tickLine={false} 
                        tick={{ fill: '#6b7280', fontSize: 12 }} 
                        dy={10}
                    />
                    <YAxis 
                        axisLine={false} 
                        tickLine={false} 
                        tick={{ fill: '#6b7280', fontSize: 12 }} 
                    />
                    <Tooltip 
                        contentStyle={{ 
                            borderRadius: '8px', 
                            border: 'none', 
                            boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -1px rgb(0 0 0 / 0.06)',
                            backgroundColor: '#ffffff'
                        }}
                        cursor={{ fill: '#f3f4f6' }}
                    />
                    <Legend iconType="circle" wrapperStyle={{ paddingTop: '20px' }}/>
                    <Bar dataKey="cantidad" radius={[6, 6, 0, 0]} barSize={80} animationDuration={1000} />
                </BarChart>
                </ResponsiveContainer>
            ) : (
                <div className="h-64 flex flex-col items-center justify-center bg-gray-50/50 rounded-lg border-2 border-dashed border-gray-200">
                   <p className="text-muted-foreground font-medium">No hay datos para mostrar</p>
                   <p className="text-xs text-gray-400 mt-1">Ve a 'Transacciones' y registra movimientos.</p>
                </div>
            )}
          </div>
        </div>

      </div>
    </Layout>
  );
}