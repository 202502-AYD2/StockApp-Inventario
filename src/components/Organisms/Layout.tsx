//import { AppSidebar } from '@/components/app-sidebar';
//import { Separator } from '@/components/ui/separator';
//import { SidebarInset, SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
//
//export default function Index({ children }: { children: React.ReactNode }) {
//  return (
//    <SidebarProvider>
//      <AppSidebar />
//      <SidebarInset>
//        <header className='flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12'>
//          <div className='flex items-center gap-2 px-4'>
//            <SidebarTrigger className='-ml-1' />
//            <Separator orientation='vertical' className='mr-2 data-[orientation=vertical]:h-4' />
//          </div>
//        </header>
//        <div className='flex flex-1 flex-col gap-4 p-4 pt-0'>{children}</div>
//      </SidebarInset>
//    </SidebarProvider>
//  );
//}
//
import { AppSidebar } from '@/components/app-sidebar';
import { Separator } from '@/components/ui/separator';
import { SidebarInset, SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { ReactNode } from 'react';

interface LayoutProps {
  children: ReactNode;
  showSidebar?: boolean; // Propiedad opcional
}

// CAMBIO AQUÍ: showSidebar = true (Por defecto SI mostramos la barra)
export default function Index({ children, showSidebar = true }: LayoutProps) {
  
  // 1. Si explícitamente decimos "false" (ej. para un Login), ocultamos la barra
  if (!showSidebar) {
    return <main className="w-full h-full">{children}</main>;
  }

  // 2. Por defecto mostramos todo el sistema
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className='flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 border-b bg-background px-4'>
          <div className='flex items-center gap-2'>
            <SidebarTrigger className='-ml-1' />
            <Separator orientation='vertical' className='mr-2 h-4' />
            {/* Agregué este título para que se vea mejor el header */}
            <span className="font-medium text-sm text-muted-foreground hidden sm:inline-block">
              StockApp - Sistema de Gestión
            </span>
          </div>
        </header>
        <div className='flex flex-1 flex-col gap-4 p-4 pt-0 bg-muted/10'>
            {children}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}