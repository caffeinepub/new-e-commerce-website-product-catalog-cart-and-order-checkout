import { useParams, useNavigate } from '@tanstack/react-router';
import { useGetOrder } from '../hooks/useQueries';
import { useGetAllProducts } from '../hooks/useQueries';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

export default function OrderConfirmationPage() {
  const { orderId } = useParams({ from: '/order-confirmation/$orderId' });
  const navigate = useNavigate();
  const { data: order, isLoading } = useGetOrder(BigInt(orderId));
  const { data: products } = useGetAllProducts();

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-16 max-w-2xl">
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h2 className="text-2xl font-bold mb-4">Order not found</h2>
        <Button onClick={() => navigate({ to: '/products' })}>Continue Shopping</Button>
      </div>
    );
  }

  const total = Number(order.total) / 100;

  return (
    <div className="container mx-auto px-4 py-16 max-w-2xl">
      <div className="text-center mb-8">
        <CheckCircle className="h-16 w-16 text-green-600 mx-auto mb-4" />
        <h1 className="text-3xl font-bold mb-2">Order Confirmed!</h1>
        <p className="text-muted-foreground">Thank you for your purchase</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Order #{order.id.toString()}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h3 className="font-semibold mb-2">Order Items</h3>
            <div className="space-y-2">
              {order.items.map((item) => {
                const product = products?.find((p) => p.id === item.productId);
                return (
                  <div key={item.productId.toString()} className="flex justify-between text-sm">
                    <span>
                      {product?.name || `Product #${item.productId.toString()}`} × {item.quantity.toString()}
                    </span>
                    <span>
                      ${product ? ((Number(product.price) / 100) * Number(item.quantity)).toFixed(2) : '—'}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="border-t pt-4">
            <div className="flex justify-between text-lg font-bold">
              <span>Total:</span>
              <span>${total.toFixed(2)}</span>
            </div>
          </div>

          <div className="flex gap-4">
            <Button onClick={() => navigate({ to: '/my-orders' })} variant="outline" className="flex-1">
              View My Orders
            </Button>
            <Button onClick={() => navigate({ to: '/products' })} className="flex-1">
              Continue Shopping
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
