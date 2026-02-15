import { useParams, useNavigate } from '@tanstack/react-router';
import { useGetOrder, useGetAllProducts } from '../hooks/useQueries';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { ArrowLeft } from 'lucide-react';

export default function OrderDetailsPage() {
  const { orderId } = useParams({ from: '/orders/$orderId' });
  const navigate = useNavigate();
  const { data: order, isLoading } = useGetOrder(BigInt(orderId));
  const { data: products } = useGetAllProducts();

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Skeleton className="h-10 w-32 mb-8" />
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h2 className="text-2xl font-bold mb-4">Order not found</h2>
        <Button onClick={() => navigate({ to: '/my-orders' })}>Back to My Orders</Button>
      </div>
    );
  }

  const total = Number(order.total) / 100;
  const date = new Date(Number(order.createdAt) / 1000000);

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <Button variant="ghost" onClick={() => navigate({ to: '/my-orders' })} className="mb-6">
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to My Orders
      </Button>

      <h1 className="text-3xl font-bold mb-2">Order #{order.id.toString()}</h1>
      <p className="text-muted-foreground mb-8">
        Placed on {date.toLocaleDateString()} at {date.toLocaleTimeString()}
      </p>

      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Order Items</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {order.items.map((item) => {
                const product = products?.find((p) => p.id === item.productId);
                const imageUrl = product?.image || '/assets/generated/product-placeholder.dim_800x800.png';
                const price = product ? Number(product.price) / 100 : 0;
                const lineTotal = price * Number(item.quantity);

                return (
                  <div key={item.productId.toString()} className="flex gap-4 pb-4 border-b last:border-0">
                    <img src={imageUrl} alt={product?.name || 'Product'} className="w-20 h-20 object-cover rounded-md bg-muted" />
                    <div className="flex-1">
                      <h3 className="font-semibold">{product?.name || `Product #${item.productId.toString()}`}</h3>
                      <p className="text-sm text-muted-foreground">
                        ${price.toFixed(2)} × {item.quantity.toString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold">${lineTotal.toFixed(2)}</p>
                    </div>
                  </div>
                );
              })}
            </CardContent>
          </Card>
        </div>

        <div>
          <Card className="sticky top-20">
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between text-lg font-bold border-t pt-4">
                <span>Total:</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
