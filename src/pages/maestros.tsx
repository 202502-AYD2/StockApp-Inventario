import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { createClient } from '@supabase/supabase-js';
import Layout from '@/components/Organisms/Layout';
import { Package, Plus, Search, Tag, Box } from 'lucide-react';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function MaestrosPage() {
  const router = useRouter();
  const [products, setProducts] = useState<any[]>([]);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  
  // Estado para el formulario de crear (Modal o expandible)
  const [isCreating, setIsCreating] = useState(false);
  const [newProduct, setNewProduct] = useState({ 
    name: '', 
    code: '', 
    stock: 0 
  });

  useEffect(() => {
    // 1. Verificación de sesión
    const session = localStorage.getItem('user_session');
    if (!session) {
      router.push('/login');
    } else {
      setUser(JSON.parse(session));
      fetchProducts();
    }
  }, [router]);

  const fetchProducts = async () => {
    const { data } = await supabase
      .from('Product')
      .select('*')
      .order('id', { ascending: true }); // Ordenar por ID o nombre
      
    if (data) setProducts(data);
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProduct.name) return alert("El nombre es obligatorio");
    setLoading(true);

    try {
      // Insertar en Supabase
      const { error } = await supabase.from('Product').insert([{
        name: newProduct.name,
        code: newProduct.code,
        stock: parseInt(String(newProduct.stock)) // Asegurar que sea número
      }]);

      if (error) throw error;

      // Limpiar y recargar
      setIsCreating(false);
      setNewProduct({ name: '', code: '', stock: 0 });
      await fetchProducts();
      alert("Producto creado exitosamente");

    } catch (err: any) {
      alert("Error creando producto: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="space-y-6 animate-in fade-in duration-500">
        
        {/* ENCABEZADO */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
              <Package className="h-8 w-8 text-primary" />
              Maestros de Inventario
            </h1>
            <p className="text-muted-foreground">
              Catálogo de productos disponibles en el sistema.
            </p>
          </div>

          {/* BOTÓN AGREGAR (SOLO VISIBLE PARA ADMIN - REQUISITO PDF) */}
          {user?.role === 'ADMIN' && (
            <button 
              onClick={() => setIsCreating(!isCreating)}
              className={`px-4 py-2 rounded-md font-medium flex items-center gap-2 transition-colors shadow-sm ${
                isCreating 
                  ? 'bg-gray-100 text-gray-700 hover:bg-gray-200' 
                  : 'bg-primary text-primary-foreground hover:bg-primary/90'
              }`}
            >
              {isCreating ? 'Cancelar' : <><Plus className="h-4 w-4" /> Nuevo Producto</>}
            </button>
          )}
        </div>

        {/* FORMULARIO DE CREACIÓN (SOLO SI SE ACTIVÓ) */}
        {isCreating && (
          <div className="bg-white p-6 rounded-xl border shadow-lg ring-1 ring-black/5">
            <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
              <Box className="h-5 w-5 text-blue-600" /> Datos del Nuevo Producto
            </h3>
            
            <form onSubmit={handleCreate} className="grid gap-4 md:grid-cols-4 items-end">
              <div className="md:col-span-2">
                <label className="text-sm font-medium mb-1 block">Nombre del Producto</label>
                <input 
                  className="w-full border rounded-md p-2 text-sm focus:ring-2 focus:ring-primary/20 outline-none" 
                  placeholder="Ej: Martillo de Goma"
                  value={newProduct.name}
                  onChange={e => setNewProduct({...newProduct, name: e.target.value})}
                  autoFocus
                />
              </div>
              
              <div>
                <label className="text-sm font-medium mb-1 block">Código (Opcional)</label>
                <div className="relative">
                  <Tag className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
                  <input 
                    className="w-full border rounded-md pl-9 p-2 text-sm focus:ring-2 focus:ring-primary/20 outline-none" 
                    placeholder="SKU-001"
                    value={newProduct.code}
                    onChange={e => setNewProduct({...newProduct, code: e.target.value})}
                  />
                </div>
              </div>
              
              <div>
                <label className="text-sm font-medium mb-1 block">Stock Inicial</label>
                <input 
                  type="number"
                  min="0"
                  className="w-full border rounded-md p-2 text-sm focus:ring-2 focus:ring-primary/20 outline-none" 
                  value={newProduct.stock}
                  onChange={e => setNewProduct({...newProduct, stock: parseInt(e.target.value)})}
                />
              </div>

              <div className="md:col-span-4 flex justify-end gap-2 mt-2">
                 <button 
                   type="submit" 
                   disabled={loading}
                   className="bg-green-600 text-white px-6 py-2 rounded-md font-medium hover:bg-green-700 disabled:opacity-50"
                 >
                   {loading ? 'Guardando...' : 'Guardar Producto'}
                 </button>
              </div>
            </form>
          </div>
        )}

        {/* TABLA DE PRODUCTOS */}
        <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-gray-50/80 text-gray-600 font-medium border-b">
                <tr>
                  <th className="px-6 py-4">ID</th>
                  <th className="px-6 py-4">Producto</th>
                  <th className="px-6 py-4">Código Referencia</th>
                  <th className="px-6 py-4">Estado del Stock</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {products.map((prod) => (
                  <tr key={prod.id} className="hover:bg-gray-50/50 transition-colors group">
                    <td className="px-6 py-4 font-mono text-xs text-gray-400">#{prod.id}</td>
                    <td className="px-6 py-4 font-medium text-gray-900 text-base">
                      {prod.name}
                    </td>
                    <td className="px-6 py-4">
                      {prod.code ? (
                        <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs font-mono border">
                          {prod.code}
                        </span>
                      ) : (
                        <span className="text-gray-300 italic text-xs">Sin código</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                         <span className={`text-sm font-bold ${prod.stock < 5 ? 'text-red-600' : 'text-gray-700'}`}>
                           {prod.stock} un.
                         </span>
                         
                         {/* Barra de progreso visual del stock */}
                         <div className="w-24 h-2 bg-gray-100 rounded-full overflow-hidden">
                           <div 
                             className={`h-full rounded-full ${prod.stock < 5 ? 'bg-red-500' : 'bg-green-500'}`}
                             style={{ width: `${Math.min(prod.stock, 100)}%` }} 
                           />
                         </div>
                         
                         {prod.stock < 5 && (
                           <span className="text-[10px] bg-red-100 text-red-700 px-1.5 py-0.5 rounded border border-red-200">
                             Bajo
                           </span>
                         )}
                      </div>
                    </td>
                  </tr>
                ))}
                
                {products.length === 0 && (
                  <tr>
                    <td colSpan={4} className="p-10 text-center text-gray-400">
                      No hay productos registrados en el sistema.
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