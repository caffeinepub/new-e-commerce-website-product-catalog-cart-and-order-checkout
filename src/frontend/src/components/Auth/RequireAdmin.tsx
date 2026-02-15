import { ReactNode } from 'react';
import { useIsCallerAdmin } from '../../hooks/useUserRole';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { ShieldX } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

interface RequireAdminProps {
  children: ReactNode;
}

export default function RequireAdmin({ children }: RequireAdminProps) {
  const { data: isAdmin, isLoading } = useIsCallerAdmin();

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-16">
        <Skeleton className="h-32 w-full max-w-md mx-auto" />
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="container mx-auto px-4 py-16 max-w-md">
        <Alert variant="destructive">
          <ShieldX className="h-4 w-4" />
          <AlertTitle>Access Denied</AlertTitle>
          <AlertDescription className="mt-2">
            You do not have permission to access this page. Admin privileges are required.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return <>{children}</>;
}
