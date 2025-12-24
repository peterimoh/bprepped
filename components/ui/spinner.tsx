import { cn } from '@/lib/utils';

interface SpinnerProps {
  loadingText?: string | null;
  className?: string;
}

export function Spinner({
  loadingText = 'Loading...',
  className,
}: SpinnerProps) {
  return (
    <div className={cn('flex flex-col items-center justify-center', className)}>
      <div className="flex justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-solid border-primary border-t-transparent"></div>
      </div>

      {loadingText && <p className={'py-4'}>{loadingText}</p>}
    </div>
  );
}
