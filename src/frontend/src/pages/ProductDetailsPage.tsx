import { useState } from 'react';
import { useParams, useNavigate } from '@tanstack/react-router';
import { useGetProduct } from '../hooks/useQueries';
import { useCart } from '../cart/CartContext';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import QuantityPicker from '../components/QuantityPicker';
import { ArrowLeft, ShoppingCart } from 'lucide-react';
import { toast } from 'sonner';

export default function ProductDetailsPage() {
  const { productId } = useParams({ from: '/products/$productId' });
  const navigate = useNavigate();
  const { data: product, isLoading } = useGetProduct(BigInt(productId));
  const { addItem } = useCart();
  const [quantity, setQuantity] = useState(1);

  const handleAddToCart = () => {
    if (!product) return;
    addItem({
      productId: product.id,
      quantity,
      name: product.name,
      price: product.price,
      image: product.image,
    });
    toast.success(`Added ${quantity} ${product.name} to cart`);
    setQuantity(1);
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Skeleton className="h-8 w-32 mb-8" />
        <div className="grid md:grid-cols-2 gap-8">
          <Skeleton className="aspect-square" />
          <div className="space-y-4">
            <Skeleton className="h-10 w-3/4" />
            <Skeleton className="h-6 w-1/4" />
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-12 w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h2 className="text-2xl font-bold mb-4">Product not found</h2>
        <Button onClick={() => navigate({ to: '/products' })}>Back to Products</Button>
      </div>
    );
  }

  const imageUrl = product.image || '/assets/generated/product-placeholder.dim_800x800.png';
  const price = Number(product.price) / 100;

  return (
    <div className="container mx-auto px-4 py-8">
      <Button variant="ghost" onClick={() => navigate({ to: '/products' })} className="mb-6">
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Products
      </Button>

      <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
        <div className="aspect-square overflow-hidden rounded-lg bg-muted">
          <img src={imageUrl} alt={product.name} className="w-full h-full object-cover" />
        </div>

        <div className="flex flex-col gap-6">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold mb-2">{product.name}</h1>
            <div className="flex items-center gap-3 mb-4">
              <span className="text-3xl font-bold">${price.toFixed(2)}</span>
              {!product.available && <Badge variant="secondary">Unavailable</Badge>}
            </div>
          </div>

          <div className="prose prose-sm max-w-none">
            <p className="text-muted-foreground">{product.description}</p>
          </div>

          {product.available && (
            <div className="space-y-4 mt-auto">
              <div className="flex items-center gap-4">
                <span className="text-sm font-medium">Quantity:</span>
                <QuantityPicker value={quantity} onChange={setQuantity} />
              </div>
              <Button onClick={handleAddToCart} size="lg" className="w-full">
                <ShoppingCart className="h-5 w-5 mr-2" />
                Add to Cart
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
