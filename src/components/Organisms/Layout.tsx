import { AppSidebar } from '@/components/app-sidebar';
import { Separator } from '@/components/ui/separator';
import { SidebarInset, SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { ReactNode } from 'react';

interface LayoutProps {
  children: ReactNode;
  showSidebar?: boolean;
}

// 
export default function Index({ children, showSidebar = true }: LayoutProps) {
  
  // Si showSidebar es falso (Login/Landing), 
  // renderizamos solo el contenido sin la estructura de navegación.
  if (!showSidebar) {
    return <main className="w-full h-full">{children}</main>;
  }

  // Por defecto mostramos todo el sistema
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className='flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 border-b bg-background px-4'>
          <div className='flex items-center gap-2'>
            <SidebarTrigger className='-ml-1' />
            <Separator orientation='vertical' className='mr-2 h-4' />
            {}
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