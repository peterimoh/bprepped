import { Card, CardContent, CardHeader } from './card';
import { Logo } from './logo';
import { cn } from '@/lib/utils';
import { Spinner } from './spinner';

interface LoadingSpinnerProps {
  className?: string;
  loadingText?: string;
}

export function LoadingSpinner({
  className,
  loadingText = 'Loading...',
}: LoadingSpinnerProps) {
  return (
    <Card
      className={cn(
        'relative z-10 w-full max-w-md border-2 bg-white shadow-elevated',
        className
      )}
    >
      <CardHeader className="text-center">
        <div className="mb-4 flex justify-center">
          <Logo />
        </div>
      </CardHeader>
      <CardContent className="pt-6 text-center">
        <Spinner loadingText={loadingText} />
      </CardContent>
    </Card>
  );
}
