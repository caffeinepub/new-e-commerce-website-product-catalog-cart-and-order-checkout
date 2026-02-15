import { useNavigate } from '@tanstack/react-router';
import { useGetAllProducts } from '../../hooks/useQueries';
import { useSetProductAvailability } from '../../hooks/useAdminProducts';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Skeleton } from '@/components/ui/skeleton';
import { Plus, Edit } from 'lucide-react';
import { toast } from 'sonner';

export default function AdminProductsPage() {
  const { data: products, isLoading } = useGetAllProducts();
  const navigate = useNavigate();
  const setAvailability = useSetProductAvailability();

  const handleToggleAvailability = async (productId: bigint, currentAvailability: boolean) => {
    try {
      await setAvailability.mutateAsync({ id: productId, available: !currentAvailability });
      toast.success(`Product ${!currentAvailability ? 'published' : 'unpublished'}`);
    } catch (error) {
      console.error('Error toggling availability:', error);
      toast.error('Failed to update product availability');
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Skeleton className="h-10 w-64 mb-8" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-80" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Product Management</h1>
        <Button onClick={() => navigate({ to: '/admin/products/new' })}>
          <Plus className="h-4 w-4 mr-2" />
          Add Product
        </Button>
      </div>

      {!products || products.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-lg text-muted-foreground mb-4">No products yet</p>
          <Button onClick={() => navigate({ to: '/admin/products/new' })}>Create Your First Product</Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => {
            const imageUrl = product.image || '/assets/generated/product-placeholder.dim_800x800.png';
            const price = Number(product.price) / 100;

            return (
              <Card key={product.id.toString()}>
                <CardHeader className="p-0">
                  <div className="aspect-square overflow-hidden rounded-t-lg bg-muted">
                    <img src={imageUrl} alt={product.name} className="w-full h-full object-cover" />
                  </div>
                </CardHeader>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <CardTitle className="text-lg">{product.name}</CardTitle>
                    <Badge variant={product.available ? 'default' : 'secondary'}>
                      {product.available ? 'Published' : 'Unpublished'}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground line-clamp-2 mb-2">{product.description}</p>
                  <p className="text-xl font-bold">${price.toFixed(2)}</p>
                </CardContent>
                <CardFooter className="p-4 pt-0 flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <Switch
                      checked={product.available}
                      onCheckedChange={() => handleToggleAvailability(product.id, product.available)}
                      disabled={setAvailability.isPending}
                    />
                    <span className="text-sm">{product.available ? 'Published' : 'Unpublished'}</span>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      navigate({ to: '/admin/products/$productId/edit', params: { productId: product.id.toString() } })
                    }
                  >
                    <Edit className="h-4 w-4 mr-1" />
                    Edit
                  </Button>
                </CardFooter>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
