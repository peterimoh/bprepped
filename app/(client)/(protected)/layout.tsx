import DashboardLayout from '@/components/layouts/DashboardLayout';

export default function Layout({ children }: React.PropsWithChildren) {
  return <DashboardLayout>{children}</DashboardLayout>;
}
