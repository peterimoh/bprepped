import DashboardLayout from '@/components/layouts/dashboard-layout';

export default function Layout({ children }: React.PropsWithChildren) {
  return <DashboardLayout>{children}</DashboardLayout>;
}
