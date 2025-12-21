'use client';
import { ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import {
  FileText,
  Home,
  Scan,
  MessageSquare,
  Settings,
  Coins,
  Menu,
  X,
  BarChart3,
  Briefcase,
  Layout,
} from 'lucide-react';
import { useRouter, usePathname } from 'next/navigation';
import { useState } from 'react';
import { cn } from '@/lib/utils';
import ProfileDropdown from '@/components/profile-dropdown';
import { Path } from '@/lib/path';
import { Logo } from '../ui/logo';

interface DashboardLayoutProps {
  children: ReactNode;
}

const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const menuItems = [
    { icon: Home, label: 'Dashboard', path: Path.Client.Protected.Root },
    {
      icon: FileText,
      label: 'My Resumes',
      path: Path.Client.Protected.Resumes,
    },
    {
      icon: Briefcase,
      label: 'Experiences',
      path: Path.Client.Protected.Experiences,
    },
    { icon: Layout, label: 'Templates', path: Path.Client.Protected.Templates },
    {
      icon: Scan,
      label: 'Resume Scanner',
      path: Path.Client.Protected.Scanner.Root,
    },
    {
      icon: MessageSquare,
      label: 'Interview Prep',
      path: Path.Client.Protected.Interview.Root,
    },
    { icon: Coins, label: 'Tokens', path: Path.Client.Protected.Tokens },
    { icon: BarChart3, label: 'Usage', path: Path.Client.Protected.Usage },
    { icon: Settings, label: 'Settings', path: Path.Client.Protected.Settings },
  ];

  const handleLogout = () => {
    router.push(Path.Client.Root);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Sidebar - Fixed on left, visible on md screens and up */}
      <aside className="hidden md:fixed md:inset-y-0 md:left-0 md:z-50 md:flex md:flex-shrink-0">
        <div className="glass-card flex h-full w-64 flex-col border-r border-border/30">
          {/* Logo Section */}
          <div className="flex flex-shrink-0 items-center border-b border-border/30 px-6 py-8">
            <div
              className="group flex cursor-pointer items-center gap-3"
              onClick={() => router.push(Path.Client.Protected.Root)}
            >
              <Logo path={Path.Client.Protected.Root} />
            </div>
          </div>
          {/* Navigation */}
          <nav className="flex-1 space-y-2 overflow-y-auto px-4 py-8">
            {menuItems.map((item) => {
              const isActive =
                pathname === item.path ||
                (item.path === Path.Client.Protected.Interview.Root &&
                  pathname.startsWith(Path.Client.Protected.Interview.Root));
              return (
                <Button
                  key={item.path}
                  variant="ghost"
                  className={cn(
                    'hover-lift w-full justify-start rounded-2xl p-4 text-base transition-all duration-300',
                    isActive
                      ? 'border border-primary/30 bg-gradient-to-r from-primary/20 to-accent/20 text-primary shadow-sm'
                      : 'text-muted-foreground hover:bg-muted/50 hover:text-foreground'
                  )}
                  onClick={() => router.push(item.path)}
                >
                  <item.icon
                    className={cn(
                      'mr-3 h-5 w-5',
                      isActive ? 'text-primary' : 'text-muted-foreground'
                    )}
                  />
                  <span className="font-medium">{item.label}</span>
                </Button>
              );
            })}
          </nav>
        </div>
      </aside>

      {/* Main Content Area - with left margin to avoid overlap with fixed sidebar */}
      <div className="md:pl-64">
        {/* Top Navigation Bar - Sticky within the main content area */}
        <header className="glass sticky top-0 z-40 border-b border-border/30">
          <div className="container mx-auto flex items-center justify-between px-4 py-4 sm:px-6">
            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="sm"
              className="md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </Button>

            {/* Mobile Logo */}
            <div
              className="flex cursor-pointer items-center gap-3 md:hidden"
              onClick={() => router.push(Path.Client.Protected.Root)}
            >
              <Logo path={Path.Client.Protected.Root} />
            </div>

            <div className="ml-auto flex items-center gap-3">
              <ProfileDropdown />
            </div>
          </div>
        </header>

        {/* Page Content - Scrollable */}
        <main className="flex-1 p-4 sm:p-6 md:p-8">
          <div className="container mx-auto">{children}</div>
        </main>
      </div>

      {/* Mobile Sidebar Overlay */}
      {mobileMenuOpen && (
        <>
          <div
            className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm md:hidden"
            onClick={() => setMobileMenuOpen(false)}
          />
          <aside className="glass-card fixed inset-y-0 left-0 z-50 w-64 border-r border-border/30 shadow-lg md:hidden">
            <div className="flex h-full flex-col">
              {/* Mobile Logo Section */}
              <div className="flex items-center justify-between border-b border-border/30 px-6 py-8">
                <div className="flex items-center gap-3">
                  <Logo path={Path.Client.Protected.Root} />
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>
              {/* Mobile Navigation */}
              <nav className="flex-1 space-y-2 overflow-y-auto px-4 py-8">
                {menuItems.map((item) => {
                  const isActive =
                    pathname === item.path ||
                    (item.path === Path.Client.Protected.Interview.Root &&
                      pathname.startsWith(
                        Path.Client.Protected.Interview.Root
                      ));
                  return (
                    <Button
                      key={item.path}
                      variant="ghost"
                      className={cn(
                        'hover-lift w-full justify-start rounded-2xl px-4 py-4 text-base transition-all duration-300',
                        isActive
                          ? 'border border-primary/30 bg-gradient-to-r from-primary/20 to-accent/20 text-primary shadow-md'
                          : 'text-muted-foreground hover:bg-muted/50 hover:text-foreground'
                      )}
                      onClick={() => {
                        router.push(item.path);
                        setMobileMenuOpen(false);
                      }}
                    >
                      <item.icon
                        className={cn(
                          'mr-3 h-5 w-5',
                          isActive ? 'text-primary' : 'text-muted-foreground'
                        )}
                      />
                      <span className="font-medium">{item.label}</span>
                    </Button>
                  );
                })}
              </nav>
            </div>
          </aside>
        </>
      )}
    </div>
  );
};

export default DashboardLayout;
