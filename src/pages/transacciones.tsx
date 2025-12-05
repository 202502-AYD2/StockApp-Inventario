import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { createClient } from '@supabase/supabase-js';
import Layout from '@/components/Organisms/Layout';
import { ArrowRightLeft, History, PlusCircle, AlertCircle, TrendingDown, TrendingUp } from 'lucide-react';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function TransaccionesPage() {
  const router = useRouter();
  const [movements, setMovements] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  
  // Estado del formulario
  const [formData, setFormData] = useState({
    product_id: '',
    type: 'ENTRADA', // Valor por defecto
    quantity: 1
  });

  useEffect(() => {
    // Verificar Sesion (Admin y User pueden entrar)
    const session = localStorage.getItem('user_session');
    if (!session) {
      router.push('/login');
    } else {
      setUser(JSON.parse(session));
      fetchData();
    }
  }, [router]);

  const fetchData = async () => {
    // Cargar lista de productos para el Select
    const { data: prodData } = await supabase
        .from('Product')
        .select('id, name, stock')
        .order('name');
        
    if (prodData) setProducts(prodData);

    // Cargar historial de movimientos
    
    const { data: movData } = await supabase
      .from('Movement')
      .select('*, Product(name)') 
      .order('created_at', { ascending: false });
      
    if (movData) setMovements(movData);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.product_id) return alert("Por favor selecciona un producto.");
    
    setLoading(true);
    setErrorMsg('');

    try {
      // Intentamos insertar el movimiento
      const { error } = await supabase.from('Movement').insert([{
        product_id: parseInt(formData.product_id),
        type: formData.type,
        quantity: parseInt(String(formData.quantity)),
        user_email: user.email // Guardamos quién lo hizo
      }]);

      if (error) throw error;

      // Si todo sale bien
      setFormData({ ...formData, quantity: 1 }); // Reiniciar cantidad
      await fetchData(); // Recargar la tabla y los productos
      alert("¡Transacción registrada con éxito!");

    } catch (err: any) {
      console.error(err);
      // Aqui atrapamos el error del Trigger
      setErrorMsg(err.message || "Ocurrió un error al registrar.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="space-y-6 animate-in fade-in duration-500">
        
        {/* Encabezado */}
        <div className="flex items-center justify-between">
            <div>
                <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
                <ArrowRightLeft className="h-8 w-8 text-primary" />
                Transacciones
                </h1>
                <p className="text-muted-foreground">
                    Registra entradas (compras) y salidas (ventas) del inventario.
                </p>
            </div>
        </div>

        {/* FORMULARIO DE REGISTRO*/}
        <div className="bg-white p-6 rounded-xl border shadow-sm">
          <div className="flex items-center gap-2 mb-4 border-b pb-2">
            <PlusCircle className="h-5 w-5 text-green-600" /> 
            <h2 className="font-semibold text-lg">Nuevo Movimiento</h2>
          </div>
          
          {errorMsg && (
            <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-md text-sm flex items-center gap-2 border border-red-200">
                <AlertCircle className="h-4 w-4" />
                {errorMsg}
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-4 items-end">
            
            {/* Selector de Producto */}
            <div className="w-full md:w-1/3">
              <label className="text-sm font-medium mb-1 block text-gray-700">Producto</label>
              <select 
                className="w-full border border-gray-300 rounded-md p-2.5 text-sm bg-background focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                value={formData.product_id}
                onChange={e => setFormData({...formData, product_id: e.target.value})}
                required
              >
                <option value="">-- Seleccionar Producto --</option>
                {products.map(p => (
                  <option key={p.id} value={p.id}>
                    {p.name} (Stock disponible: {p.stock})
                  </option>
                ))}
              </select>
            </div>

            {/* Tipo de Movimiento */}
            <div className="w-full md:w-1/4">
              <label className="text-sm font-medium mb-1 block text-gray-700">Acción</label>
              <div className="relative">
                <select 
                    className={`w-full border rounded-md p-2.5 text-sm appearance-none font-medium ${
                        formData.type === 'ENTRADA' 
                        ? 'bg-green-50 border-green-200 text-green-700' 
                        : 'bg-orange-50 border-orange-200 text-orange-700'
                    }`}
                    value={formData.type}
                    onChange={e => setFormData({...formData, type: e.target.value})}
                >
                    <option value="ENTRADA">📥 ENTRADA (Reabastecer)</option>
                    <option value="SALIDA">📤 SALIDA (Venta/Uso)</option>
                </select>
              </div>
            </div>

            {/* Cantidad */}
            <div className="w-full md:w-1/4">
              <label className="text-sm font-medium mb-1 block text-gray-700">Cantidad</label>
              <input 
                type="number" 
                min="1"
                className="w-full border border-gray-300 rounded-md p-2.5 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                value={formData.quantity}
                onChange={e => setFormData({...formData, quantity: parseInt(e.target.value)})}
                required
              />
            </div>

            {/* Boton Submit */}
            <button 
              type="submit" 
              disabled={loading}
              className="w-full md:w-auto bg-primary text-primary-foreground hover:bg-primary/90 px-6 py-2.5 rounded-md font-medium transition-colors shadow-sm disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? 'Procesando...' : 'Registrar Movimiento'}
            </button>
          </form>
        </div>

        {/* TABLA DE HISTORIAL*/}
        <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
          <div className="p-4 bg-gray-50/50 border-b flex items-center justify-between">
             <div className="flex items-center gap-2">
                <History className="h-5 w-5 text-gray-500" />
                <h3 className="font-semibold text-gray-700">Historial Reciente</h3>
             </div>
             <span className="text-xs text-muted-foreground bg-gray-100 px-2 py-1 rounded">
                Últimos {movements.length} movimientos
             </span>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-muted/30 text-muted-foreground font-medium border-b">
                <tr>
                  <th className="px-6 py-3">Fecha y Hora</th>
                  <th className="px-6 py-3">Producto</th>
                  <th className="px-6 py-3">Tipo</th>
                  <th className="px-6 py-3 text-right">Cantidad</th>
                  <th className="px-6 py-3">Responsable</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {movements.map((mov) => (
                  <tr key={mov.id} className="hover:bg-gray-50/80 transition-colors">
                    <td className="px-6 py-3 text-gray-500 whitespace-nowrap text-xs">
                      {new Date(mov.created_at).toLocaleString()}
                    </td>
                    <td className="px-6 py-3 font-medium text-gray-900">
                      {mov.Product?.name || <span className="text-red-400 italic">Producto eliminado</span>}
                    </td>
                    <td className="px-6 py-3">
                      {mov.type === 'ENTRADA' ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-green-100 text-green-700 border border-green-200">
                          <TrendingUp className="h-3 w-3" /> Entrada
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-orange-100 text-orange-700 border border-orange-200">
                          <TrendingDown className="h-3 w-3" /> Salida
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-3 text-right font-mono font-medium">
                      {mov.quantity}
                    </td>
                    <td className="px-6 py-3 text-xs text-muted-foreground">
                      {mov.user_email}
                    </td>
                  </tr>
                ))}
                
                {movements.length === 0 && (
                  <tr>
                    <td colSpan={5} className="py-12 text-center text-muted-foreground flex flex-col items-center justify-center gap-2">
                      <div className="bg-gray-100 p-3 rounded-full">
                        <History className="h-6 w-6 text-gray-400" />
                      </div>
                      <p>No hay transacciones registradas aún.</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </Layout>
  );
}