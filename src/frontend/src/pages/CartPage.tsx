import { useNavigate } from '@tanstack/react-router';
import { useCart } from '../cart/CartContext';
import CartLineItem from '../components/CartLineItem';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ShoppingBag, ArrowRight } from 'lucide-react';

export default function CartPage() {
  const { items, updateQuantity, removeItem, getSubtotal } = useCart();
  const navigate = useNavigate();

  const subtotal = Number(getSubtotal()) / 100;

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <ShoppingBag className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
        <h2 className="text-2xl font-bold mb-2">Your cart is empty</h2>
        <p className="text-muted-foreground mb-6">Add some products to get started</p>
        <Button onClick={() => navigate({ to: '/products' })}>Browse Products</Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Cart Items ({items.length})</CardTitle>
            </CardHeader>
            <CardContent className="divide-y">
              {items.map((item) => (
                <CartLineItem
                  key={item.productId.toString()}
                  item={item}
                  onUpdateQuantity={updateQuantity}
                  onRemove={removeItem}
                />
              ))}
            </CardContent>
          </Card>
        </div>

        <div>
          <Card className="sticky top-20">
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between text-lg">
                <span>Subtotal:</span>
                <span className="font-bold">${subtotal.toFixed(2)}</span>
              </div>
              <p className="text-sm text-muted-foreground">Shipping and taxes calculated at checkout</p>
            </CardContent>
            <CardFooter>
              <Button onClick={() => navigate({ to: '/checkout' })} size="lg" className="w-full">
                Proceed to Checkout
                <ArrowRight className="h-5 w-5 ml-2" />
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}
