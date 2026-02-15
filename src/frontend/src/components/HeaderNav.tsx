import { Link, useNavigate } from '@tanstack/react-router';
import { ShoppingCart, Menu, Package } from 'lucide-react';
import { useCart } from '../cart/CartContext';
import LoginButton from './Auth/LoginButton';
import { useIsCallerAdmin } from '../hooks/useUserRole';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { useState } from 'react';

export default function HeaderNav() {
  const { getTotalItems } = useCart();
  const navigate = useNavigate();
  const { data: isAdmin } = useIsCallerAdmin();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const totalItems = getTotalItems();

  const navLinks = [
    { to: '/products', label: 'Products' },
    { to: '/my-orders', label: 'My Orders' },
  ];

  if (isAdmin) {
    navLinks.push({ to: '/admin/products', label: 'Admin' });
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <Link to="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
            <img src="/assets/generated/store-logo.dim_512x512.png" alt="ShopHub" className="h-10 w-10" />
            <span className="text-xl font-bold tracking-tight">ShopHub</span>
          </Link>

          <nav className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                activeProps={{ className: 'text-foreground' }}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              className="relative"
              onClick={() => navigate({ to: '/cart' })}
            >
              <ShoppingCart className="h-5 w-5" />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center font-medium">
                  {totalItems}
                </span>
              )}
            </Button>
            <div className="hidden md:block">
              <LoginButton />
            </div>
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild className="md:hidden">
                <Button variant="ghost" size="icon">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right">
                <nav className="flex flex-col gap-4 mt-8">
                  {navLinks.map((link) => (
                    <Link
                      key={link.to}
                      to={link.to}
                      className="text-lg font-medium text-muted-foreground hover:text-foreground transition-colors"
                      activeProps={{ className: 'text-foreground' }}
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {link.label}
                    </Link>
                  ))}
                  <div className="pt-4 border-t">
                    <LoginButton />
                  </div>
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}
