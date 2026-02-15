import { Link } from '@tanstack/react-router';
import type { Product } from '../backend';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const imageUrl = product.image || '/assets/generated/product-placeholder.dim_800x800.png';
  const price = Number(product.price) / 100;

  return (
    <Link to="/products/$productId" params={{ productId: product.id.toString() }}>
      <Card className="h-full overflow-hidden hover:shadow-lg transition-shadow cursor-pointer group">
        <div className="aspect-square overflow-hidden bg-muted">
          <img
            src={imageUrl}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>
        <CardContent className="p-4">
          <h3 className="font-semibold text-lg mb-2 line-clamp-2">{product.name}</h3>
          <p className="text-sm text-muted-foreground line-clamp-2">{product.description}</p>
        </CardContent>
        <CardFooter className="p-4 pt-0 flex items-center justify-between">
          <span className="text-2xl font-bold">${price.toFixed(2)}</span>
          {!product.available && (
            <Badge variant="secondary" className="ml-auto">
              Unavailable
            </Badge>
          )}
        </CardFooter>
      </Card>
    </Link>
  );
}
