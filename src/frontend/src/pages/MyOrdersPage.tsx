import { useNavigate } from '@tanstack/react-router';
import { useGetCustomerOrders } from '../hooks/useQueries';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Package } from 'lucide-react';

export default function MyOrdersPage() {
  const { data: orders, isLoading } = useGetCustomerOrders();
  const navigate = useNavigate();

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Skeleton className="h-10 w-48 mb-8" />
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-32" />
          ))}
        </div>
      </div>
    );
  }

  if (!orders || orders.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <Package className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
        <h2 className="text-2xl font-bold mb-2">No orders yet</h2>
        <p className="text-muted-foreground mb-6">Start shopping to see your orders here</p>
        <Button onClick={() => navigate({ to: '/products' })}>Browse Products</Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">My Orders</h1>

      <div className="space-y-4">
        {orders.map((order) => {
          const total = Number(order.total) / 100;
          const date = new Date(Number(order.createdAt) / 1000000);
          const itemCount = order.items.reduce((sum, item) => sum + Number(item.quantity), 0);

          return (
            <Card key={order.id.toString()} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle>Order #{order.id.toString()}</CardTitle>
                    <p className="text-sm text-muted-foreground mt-1">
                      {date.toLocaleDateString()} at {date.toLocaleTimeString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-lg">${total.toFixed(2)}</p>
                    <p className="text-sm text-muted-foreground">
                      {itemCount} {itemCount === 1 ? 'item' : 'items'}
                    </p>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Button
                  variant="outline"
                  onClick={() => navigate({ to: '/orders/$orderId', params: { orderId: order.id.toString() } })}
                >
                  View Details
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
