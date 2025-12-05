import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { createClient } from '@supabase/supabase-js';
import Layout from '@/components/Organisms/Layout';
import { 
  Users, 
  Shield, 
  User, 
  Edit, 
  Trash2, 
  Plus, 
  Save, 
  X, 
  CheckCircle 
} from 'lucide-react';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function GestionUsuarios() {
  const router = useRouter();
  const [usersList, setUsersList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState<any>(null);
  
  // Estado para controlar el formulario Crear o Editar
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null); // Si es null, estamos creando. Si tiene ID entnces editamos.

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'USER'
  });

  useEffect(() => {
    const session = localStorage.getItem('user_session');
    if (!session) {
      router.push('/login');
      return;
    }
    const user = JSON.parse(session);
    setCurrentUser(user);

    if (user.role !== 'ADMIN') {
      alert("Acceso denegado.");
      router.push('/dashboard');
      return;
    }

    fetchUsers();
  }, [router]);

  const fetchUsers = async () => {
    try {
      const { data, error } = await supabase
        .from('User') 
        .select('*')
        .order('id', { ascending: true });

      if (error) throw error;
      setUsersList(data || []);
    } catch (error) {
      console.error("Error cargando usuarios:", error);
    } finally {
      setLoading(false);
    }
  };

  // ABRIR FORMULARIO PARA CREAR
  const handleOpenCreate = () => {
    setEditingId(null); // modo crear
    setFormData({ name: '', email: '', password: '', role: 'USER' });
    setShowForm(true);
  };

  // -ABRIR FORMULARIO PARA EDITAR 
  const handleOpenEdit = (user: any) => {
    setEditingId(user.id); // Modo edición
    setFormData({
      name: user.name,
      email: user.email,
      password: '', // Dejamos vacio por seguridad si no escribe nada, no se cambia
      role: user.role
    });
    setShowForm(true);
  };

  // GUARDAR, CREAR O ACTUALIZAR
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validaciones basicas
    if (!formData.name || !formData.email) {
        alert("Nombre y Correo son obligatorios");
        return;
    }
    // Si estamos creando, la contraseña es obligatoria
    if (!editingId && !formData.password) {
        alert("La contraseña es obligatoria para nuevos usuarios");
        return;
    }

    try {
        if (editingId) {
            // modo edicion
            const updates: any = {
                name: formData.name,
                email: formData.email,
                role: formData.role,
                updatedAt: new Date().toISOString()
            };
            
            // Solo actualizamos contraseña si el usuario escribe una nueva
            if (formData.password.trim() !== "") {
                updates.password = formData.password;
            }

            const { error } = await supabase
                .from('User')
                .update(updates)
                .eq('id', editingId);

            if (error) throw error;
            alert("Usuario actualizado correctamente.");

        } else {
            // MODO CREACIOn
            // Validar si correo existe
            const { data: existing } = await supabase
                .from('User')
                .select('id')
                .eq('email', formData.email)
                .maybeSingle();

            if (existing) {
                alert("Este correo ya está registrado.");
                return;
            }

            const randomId = `user-${Date.now()}`; // ID manual unico
            const { error } = await supabase.from('User').insert([{
                id: randomId,
                name: formData.name,
                email: formData.email,
                password: formData.password,
                role: formData.role,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            }]);

            if (error) throw error;
            alert("Usuario creado correctamente.");
        }

        // Limpiar y recargar
        setShowForm(false);
        fetchUsers();

    } catch (err: any) {
        alert("Error: " + err.message);
    }
  };

  // Eliminar usuario
  const handleDelete = async (userId: string) => {
    if (userId === currentUser.id) {
        alert("No puedes eliminarte a ti mismo.");
        return;
    }

    if (!confirm("¿Estás seguro de eliminar este usuario? Esta acción no se puede deshacer.")) {
        return;
    }

    try {
        const { error } = await supabase.from('User').delete().eq('id', userId);
        if (error) throw error;
        fetchUsers();
    } catch (err: any) {
        alert("Error al eliminar: " + err.message);
    }
  };

  if (loading) return <div className="p-8">Cargando sistema...</div>;

  return (
    <Layout>
      <div className="space-y-6 animate-in fade-in duration-500">
        
        {/* HEADER */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
              <Users className="h-8 w-8 text-primary" />
              Gestión de Usuarios
            </h1>
            <p className="text-muted-foreground">
              Administración completa de personal (Crear, Editar, Eliminar).
            </p>
          </div>
          
          <button 
            onClick={showForm ? () => setShowForm(false) : handleOpenCreate}
            className={`px-4 py-2 rounded-md font-medium flex items-center gap-2 transition-colors shadow-sm ${
                showForm 
                  ? 'bg-gray-100 text-gray-700 hover:bg-gray-200' 
                  : 'bg-primary text-primary-foreground hover:bg-primary/90'
            }`}
          >
            {showForm ? <><X className="h-4 w-4"/> Cancelar</> : <><Plus className="h-4 w-4" /> Nuevo Usuario</>}
          </button>
        </div>

        {/* FORMULARIO UNIFICADO (CREAR Y EDITAR) */}
        {showForm && (
            <div className="bg-white p-6 rounded-xl border shadow-lg ring-1 ring-black/5 mb-6 border-l-4 border-l-primary">
                <h3 className="font-bold text-lg mb-4 text-gray-800 flex items-center gap-2">
                    {editingId ? <><Edit className="h-5 w-5"/> Editando Usuario</> : <><Plus className="h-5 w-5"/> Nuevo Usuario</>}
                </h3>
                
                <form onSubmit={handleSave} className="grid gap-4 md:grid-cols-2 lg:grid-cols-5 items-end">
                    {/* Nombre */}
                    <div className="lg:col-span-1">
                        <label className="text-xs font-semibold uppercase text-gray-500 mb-1 block">Nombre</label>
                        <input 
                            className="w-full border rounded-md p-2 text-sm focus:ring-2 focus:ring-primary/20 outline-none" 
                            placeholder="Ej: Laura Gomez"
                            value={formData.name}
                            onChange={e => setFormData({...formData, name: e.target.value})}
                        />
                    </div>

                    {/* Correo */}
                    <div className="lg:col-span-1">
                        <label className="text-xs font-semibold uppercase text-gray-500 mb-1 block">Correo</label>
                        <input 
                            type="email"
                            className="w-full border rounded-md p-2 text-sm focus:ring-2 focus:ring-primary/20 outline-none" 
                            placeholder="correo@ejemplo.com"
                            value={formData.email}
                            onChange={e => setFormData({...formData, email: e.target.value})}
                        />
                    </div>

                    {/* Contraseña */}
                    <div className="lg:col-span-1">
                        <label className="text-xs font-semibold uppercase text-gray-500 mb-1 block">
                            {editingId ? "Nueva Contraseña (Opcional)" : "Contraseña"}
                        </label>
                        <input 
                            type="password"
                            className="w-full border rounded-md p-2 text-sm focus:ring-2 focus:ring-primary/20 outline-none" 
                            placeholder={editingId ? "Dejar vacío para no cambiar" : "******"}
                            value={formData.password}
                            onChange={e => setFormData({...formData, password: e.target.value})}
                        />
                    </div>

                    {/* Rol */}
                    <div className="lg:col-span-1">
                        <label className="text-xs font-semibold uppercase text-gray-500 mb-1 block">Rol</label>
                        <select 
                            className="w-full border rounded-md p-2 text-sm bg-white focus:ring-2 focus:ring-primary/20 outline-none"
                            value={formData.role}
                            onChange={e => setFormData({...formData, role: e.target.value})}
                        >
                            <option value="USER">Empleado (User)</option>
                            <option value="ADMIN">Administrador</option>
                        </select>
                    </div>

                    {/* Boton Guardar */}
                    <div className="lg:col-span-1">
                        <button 
                            type="submit" 
                            className="w-full bg-green-600 text-white px-4 py-2 rounded-md font-medium hover:bg-green-700 flex items-center justify-center gap-2"
                        >
                            <Save className="h-4 w-4" /> {editingId ? "Actualizar" : "Guardar"}
                        </button>
                    </div>
                </form>
            </div>
        )}

        {/* lista de usuarios */}
        <div className="bg-white border rounded-lg shadow-sm overflow-hidden">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-50 text-gray-600 font-medium border-b">
              <tr>
                <th className="px-6 py-4">Usuario</th>
                <th className="px-6 py-4">Correo</th>
                <th className="px-6 py-4">Rol</th>
                <th className="px-6 py-4 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {usersList.map((usuario) => (
                <tr key={usuario.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-4 font-medium flex items-center gap-3">
                    <div className="h-9 w-9 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-sm border border-blue-200">
                       {usuario.name?.charAt(0).toUpperCase() || '?'}
                    </div>
                    {usuario.name}
                  </td>
                  <td className="px-6 py-4 text-gray-500">
                    {usuario.email}
                  </td>
                  <td className="px-6 py-4">
                    {usuario.role === 'ADMIN' ? (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-purple-100 text-purple-700 border border-purple-200">
                        <Shield className="h-3 w-3" /> ADMIN
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-gray-100 text-gray-700 border border-gray-200">
                        <User className="h-3 w-3" /> USER
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                        {/* Boton Editar */}
                        <button
                            onClick={() => handleOpenEdit(usuario)}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                            title="Editar datos"
                        >
                            <Edit className="h-4 w-4" />
                        </button>

                        {/* Boton Eliminar */}
                        <button
                            onClick={() => handleDelete(usuario.id)}
                            disabled={usuario.id === currentUser.id} // No borrarse a sí mismo
                            className="p-2 text-red-600 hover:bg-red-50 rounded-md transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                            title="Eliminar usuario"
                        >
                            <Trash2 className="h-4 w-4" />
                        </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {usersList.length === 0 && (
             <div className="p-8 text-center text-muted-foreground">No hay usuarios encontrados.</div>
          )}
        </div>
      </div>
    </Layout>
  );
}