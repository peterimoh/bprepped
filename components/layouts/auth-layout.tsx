'use client';
import { Toaster } from '@/components/ui/toaster';

export default function AuthLayout({ children }: React.PropsWithChildren) {
  return (
    <div className="relative flex min-h-screen items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: `url('https://res.cloudinary.com/dywofwzdx/image/upload/v1765090546/pexels-photo-3810788_rvwst0.jpg')`,
        }}
      >
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm"></div>
      </div>

      {children}
      <Toaster />
    </div>
  );
}
