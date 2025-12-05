import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { 
  LayoutDashboard, 
  Package, 
  ArrowRightLeft, 
  Users, 
  LogOut, 
  UserCircle 
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

export function AppSidebar() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    // Leemos quien inicio sesion desde el LocalStorage
    const storedSession = localStorage.getItem("user_session");
    if (storedSession) {
      setUser(JSON.parse(storedSession));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user_session");
    router.push("/");
  };

  // evitamos errores esperando a que monte el componente
  if (!isMounted) return null;

  return (
    <Sidebar>
      {/* header o logo*/}
      <SidebarHeader className="p-4 border-b">
        <div className="flex items-center gap-2 font-bold text-xl text-primary">
          <Package className="h-6 w-6" />
          <span>StockApp</span>
        </div>
      </SidebarHeader>

      {/*Menu Principal*/}
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Plataforma</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              
              {/* Dashboard Para TODOS*/}
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link href="/dashboard" className="flex gap-2">
                    <LayoutDashboard className="h-4 w-4" />
                    <span>Dashboard</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>

              {/*TransaccionesPara TODOS*/}
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link href="/transacciones" className="flex gap-2">
                    <ArrowRightLeft className="h-4 w-4" />
                    <span>Transacciones</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>

              {/* maestros Todos pueden ver, pero editar solo puede Admin*/}
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link href="/maestros" className="flex gap-2">
                    <Package className="h-4 w-4" />
                    <span>Maestros (Productos)</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>

              {/* usuarios SOLO PARA ADMIN */}
              {user?.role === "ADMIN" && (
                <SidebarMenuItem>
                  <SidebarMenuButton asChild className="">
                    <Link href="/usuarios" className="flex gap-2">
                      <Users className="h-4 w-4" />
                      <span>Gestión de Usuarios</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              )}

            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {/*FOOTER usuario Logueado */}
      <SidebarFooter className="border-t p-4">
        {user ? (
          <div className="flex flex-col gap-4">
            {/*tarjeta del Usuario */}
            <div className="flex items-center gap-3 bg-sidebar-accent/50 p-2 rounded-lg">
              {/* imagen Generada con iniciales */}
              <div className="h-10 w-10 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold text-lg shadow-sm">
                {user.name ? user.name.charAt(0).toUpperCase() : "U"}
              </div>
              
              <div className="flex flex-col overflow-hidden">
                <span className="truncate font-semibold text-sm">{user.name}</span>
                <span className="truncate text-xs text-muted-foreground uppercase tracking-wider">
                  {user.role}
                </span>
              </div>
            </div>

            {/* Boton Cerrar Sesion */}
            <button 
              onClick={handleLogout}
              className="flex items-center gap-2 text-xs text-muted-foreground hover:text-destructive transition-colors px-2"
            >
              <LogOut className="h-3 w-3" />
              Cerrar Sesión
            </button>
          </div>
        ) : (
          <div className="text-xs text-center text-muted-foreground">
            Cargando usuario...
          </div>
        )}
      </SidebarFooter>
    </Sidebar>
  );
}