import { createRouter, createRoute, createRootRoute, RouterProvider, Outlet } from '@tanstack/react-router';
import { CartProvider } from './cart/CartContext';
import HeaderNav from './components/HeaderNav';
import ProductsPage from './pages/ProductsPage';
import ProductDetailsPage from './pages/ProductDetailsPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import OrderConfirmationPage from './pages/OrderConfirmationPage';
import MyOrdersPage from './pages/MyOrdersPage';
import OrderDetailsPage from './pages/OrderDetailsPage';
import AdminProductsPage from './pages/admin/AdminProductsPage';
import AdminProductEditorPage from './pages/admin/AdminProductEditorPage';
import RequireAuth from './components/Auth/RequireAuth';
import RequireAdmin from './components/Auth/RequireAdmin';
import ProfileSetupModal from './components/Auth/ProfileSetupModal';
import { Toaster } from '@/components/ui/sonner';
import { ThemeProvider } from 'next-themes';

function Layout() {
  return (
    <div className="min-h-screen flex flex-col">
      <HeaderNav />
      <main className="flex-1">
        <Outlet />
      </main>
      <footer className="bg-muted/30 border-t mt-auto">
        <div className="container mx-auto px-4 py-6 text-center text-sm text-muted-foreground">
          <p>
            © {new Date().getFullYear()} ShopHub. Built with ❤️ using{' '}
            <a
              href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(
                typeof window !== 'undefined' ? window.location.hostname : 'shophub'
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-foreground transition-colors underline"
            >
              caffeine.ai
            </a>
          </p>
        </div>
      </footer>
      <ProfileSetupModal />
    </div>
  );
}

const rootRoute = createRootRoute({
  component: Layout,
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: ProductsPage,
});

const productsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/products',
  component: ProductsPage,
});

const productDetailsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/products/$productId',
  component: ProductDetailsPage,
});

const cartRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/cart',
  component: CartPage,
});

const checkoutRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/checkout',
  component: CheckoutPage,
});

const orderConfirmationRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/order-confirmation/$orderId',
  component: OrderConfirmationPage,
});

const myOrdersRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/my-orders',
  component: () => (
    <RequireAuth>
      <MyOrdersPage />
    </RequireAuth>
  ),
});

const orderDetailsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/orders/$orderId',
  component: () => (
    <RequireAuth>
      <OrderDetailsPage />
    </RequireAuth>
  ),
});

const adminProductsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/admin/products',
  component: () => (
    <RequireAuth>
      <RequireAdmin>
        <AdminProductsPage />
      </RequireAdmin>
    </RequireAuth>
  ),
});

const adminProductEditorRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/admin/products/$productId/edit',
  component: () => (
    <RequireAuth>
      <RequireAdmin>
        <AdminProductEditorPage />
      </RequireAdmin>
    </RequireAuth>
  ),
});

const adminProductCreateRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/admin/products/new',
  component: () => (
    <RequireAuth>
      <RequireAdmin>
        <AdminProductEditorPage />
      </RequireAdmin>
    </RequireAuth>
  ),
});

const routeTree = rootRoute.addChildren([
  indexRoute,
  productsRoute,
  productDetailsRoute,
  cartRoute,
  checkoutRoute,
  orderConfirmationRoute,
  myOrdersRoute,
  orderDetailsRoute,
  adminProductsRoute,
  adminProductEditorRoute,
  adminProductCreateRoute,
]);

const router = createRouter({ routeTree });

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
      <CartProvider>
        <RouterProvider router={router} />
        <Toaster />
      </CartProvider>
    </ThemeProvider>
  );
}
