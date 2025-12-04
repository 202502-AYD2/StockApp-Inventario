//import * as React from 'react';
//import {
//  IconCamera,
//  IconChartBar,
//  IconDashboard,
//  IconDatabase,
//  IconFileAi,
//  IconFileDescription,
//  IconFileWord,
//  IconFolder,
//  IconHelp,
//  IconListDetails,
//  IconReport,
//  IconSearch,
//  IconSettings,
//  IconUsers,
//} from '@tabler/icons-react';
//
//import { NavDocuments } from '@/components/nav-documents';
//import { NavMain } from '@/components/nav-main';
//import { NavUser } from '@/components/nav-user';
//import {
//  Sidebar,
//  SidebarContent,
//  SidebarFooter,
//  SidebarHeader,
//  SidebarMenu,
//  SidebarMenuItem,
//} from '@/components/ui/sidebar';
//
//const data = {
//  user: {
//    name: 'Miguel Angel',
//    email: 'Miguel@prdod.com',
//    avatar: '/avatars/shadcn.jpg',
//  },
//  navMain: [
//    {
//      title: 'Dashboard',
//      url: '/dashboard',
//      icon: IconDashboard,
//    },
//    {
//      title: 'Mis Tareas',
//      url: '/tasks',
//      icon: IconListDetails,
//    },
//    {
//      title: 'Notifications',
//      url: '/notifications',
//      icon: IconChartBar,
//    },
//    {
//      title: 'Projects',
//      url: '/project',
//      icon: IconFolder,
//    },
//    {
//      title: 'Team',
//      url: '/team',
//      icon: IconUsers,
//    },
//  ],
//  navClouds: [
//    {
//      title: 'Capture',
//      icon: IconCamera,
//      isActive: true,
//      url: '#',
//      items: [
//        {
//          title: 'Active Proposals',
//          url: '#',
//        },
//        {
//          title: 'Archived',
//          url: '#',
//        },
//      ],
//    },
//    {
//      title: 'Proposal',
//      icon: IconFileDescription,
//      url: '#',
//      items: [
//        {
//          title: 'Active Proposals',
//          url: '#',
//        },
//        {
//          title: 'Archived',
//          url: '#',
//        },
//      ],
//    },
//    {
//      title: 'Prompts',
//      icon: IconFileAi,
//      url: '#',
//      items: [
//        {
//          title: 'Active Proposals',
//          url: '#',
//        },
//        {
//          title: 'Archived',
//          url: '#',
//        },
//      ],
//    },
//  ],
//  navSecondary: [
//    {
//      title: 'Settings',
//      url: '#',
//      icon: IconSettings,
//    },
//    {
//      title: 'Get Help',
//      url: '#',
//      icon: IconHelp,
//    },
//    {
//      title: 'Search',
//      url: '#',
//      icon: IconSearch,
//    },
//  ],
//  documents: [
//    {
//      name: 'User Management',
//      url: '/users',
//      icon: IconDatabase,
//    },
//    {
//      name: 'Reports',
//      url: '/reports',
//      icon: IconReport,
//    },
//    {
//      name: 'Integrations',
//      url: '/integrations',
//      icon: IconFileWord,
//    },
//  ],
//};
//
//export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
//  return (
//    <Sidebar collapsible='offcanvas' {...props}>
//      <SidebarHeader>
//        <SidebarMenu>
//          <SidebarMenuItem>
//            <img src='/LOGOTAREAS.png' alt='Logo' />
//          </SidebarMenuItem>
//        </SidebarMenu>
//      </SidebarHeader>
//      <SidebarContent>
//        <NavMain items={data.navMain} />
//        <NavDocuments items={data.documents} />
//      </SidebarContent>
//      <SidebarFooter>
//        <NavUser user={data.user} />
//      </SidebarFooter>
//    </Sidebar>
//  );
//}
//


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
    // 1. Leemos quién inició sesión desde el LocalStorage
    const storedSession = localStorage.getItem("user_session");
    if (storedSession) {
      setUser(JSON.parse(storedSession));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user_session");
    router.push("/");
  };

  // Evitamos errores de hidratación esperando a que monte el componente
  if (!isMounted) return null;

  return (
    <Sidebar>
      {/* --- HEADER (Logo) --- */}
      <SidebarHeader className="p-4 border-b">
        <div className="flex items-center gap-2 font-bold text-xl text-primary">
          <Package className="h-6 w-6" />
          <span>StockApp</span>
        </div>
      </SidebarHeader>

      {/* --- CONTENT (Menú Principal) --- */}
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Plataforma</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              
              {/* 1. Dashboard (Para TODOS) */}
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link href="/dashboard" className="flex gap-2">
                    <LayoutDashboard className="h-4 w-4" />
                    <span>Dashboard</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>

              {/* 2. Transacciones (Para TODOS) */}
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link href="/transacciones" className="flex gap-2">
                    <ArrowRightLeft className="h-4 w-4" />
                    <span>Transacciones</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>

              {/* 3. Maestros (Para TODOS ver, pero editar solo Admin) */}
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link href="/maestros" className="flex gap-2">
                    <Package className="h-4 w-4" />
                    <span>Maestros (Productos)</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>

              {/* 4. Usuarios (SOLO PARA ADMIN) - Aquí está la magia del PDF */}
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

      {/* --- FOOTER (Usuario Logueado) --- */}
      <SidebarFooter className="border-t p-4">
        {user ? (
          <div className="flex flex-col gap-4">
            {/* Tarjeta del Usuario */}
            <div className="flex items-center gap-3 bg-sidebar-accent/50 p-2 rounded-lg">
              {/* Avatar Generado con Iniciales */}
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

            {/* Botón Cerrar Sesión */}
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