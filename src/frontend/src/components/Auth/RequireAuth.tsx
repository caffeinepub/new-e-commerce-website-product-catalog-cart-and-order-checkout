import { ReactNode } from 'react';
import { useInternetIdentity } from '../../hooks/useInternetIdentity';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { ShieldAlert } from 'lucide-react';

interface RequireAuthProps {
  children: ReactNode;
}

export default function RequireAuth({ children }: RequireAuthProps) {
  const { identity, login, loginStatus } = useInternetIdentity();

  if (!identity) {
    return (
      <div className="container mx-auto px-4 py-16 max-w-md">
        <Alert>
          <ShieldAlert className="h-4 w-4" />
          <AlertTitle>Authentication Required</AlertTitle>
          <AlertDescription className="mt-2">
            You need to be logged in to access this page.
          </AlertDescription>
        </Alert>
        <Button onClick={login} disabled={loginStatus === 'logging-in'} className="w-full mt-4">
          {loginStatus === 'logging-in' ? 'Logging in...' : 'Login to Continue'}
        </Button>
      </div>
    );
  }

  return <>{children}</>;
}
