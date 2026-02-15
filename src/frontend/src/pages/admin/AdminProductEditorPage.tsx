import { useState, useEffect } from 'react';
import { useParams, useNavigate } from '@tanstack/react-router';
import { useGetProduct } from '../../hooks/useQueries';
import { useCreateProduct, useUpdateProduct } from '../../hooks/useAdminProducts';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';
import { Skeleton } from '@/components/ui/skeleton';

export default function AdminProductEditorPage() {
  const params = useParams({ strict: false });
  const navigate = useNavigate();
  const productId = params.productId ? BigInt(params.productId) : null;
  const isEditMode = !!productId;

  const { data: product, isLoading } = useGetProduct(productId || BigInt(0));
  const createProduct = useCreateProduct();
  const updateProduct = useUpdateProduct();

  const [formData, setFormData] = useState({
    name: '',
    price: '',
    image: '',
    description: '',
  });

  useEffect(() => {
    if (isEditMode && product) {
      setFormData({
        name: product.name,
        price: (Number(product.price) / 100).toString(),
        image: product.image,
        description: product.description,
      });
    }
  }, [product, isEditMode]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.price || !formData.description) {
      toast.error('Please fill in all required fields');
      return;
    }

    const priceInCents = Math.round(parseFloat(formData.price) * 100);
    if (isNaN(priceInCents) || priceInCents <= 0) {
      toast.error('Please enter a valid price');
      return;
    }

    try {
      if (isEditMode && productId) {
        await updateProduct.mutateAsync({
          id: productId,
          name: formData.name,
          price: BigInt(priceInCents),
          image: formData.image,
          description: formData.description,
        });
        toast.success('Product updated successfully');
      } else {
        await createProduct.mutateAsync({
          name: formData.name,
          price: BigInt(priceInCents),
          image: formData.image,
          description: formData.description,
        });
        toast.success('Product created successfully');
      }
      navigate({ to: '/admin/products' });
    } catch (error) {
      console.error('Error saving product:', error);
      toast.error('Failed to save product');
    }
  };

  if (isEditMode && isLoading) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <Skeleton className="h-10 w-32 mb-8" />
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <Button variant="ghost" onClick={() => navigate({ to: '/admin/products' })} className="mb-6">
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Products
      </Button>

      <Card>
        <CardHeader>
          <CardTitle>{isEditMode ? 'Edit Product' : 'Create New Product'}</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name">Product Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Enter product name"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="price">Price (USD) *</Label>
              <Input
                id="price"
                type="number"
                step="0.01"
                min="0"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                placeholder="0.00"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="image">Image URL</Label>
              <Input
                id="image"
                value={formData.image}
                onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                placeholder="https://example.com/image.jpg"
              />
              <p className="text-xs text-muted-foreground">Leave empty to use placeholder image</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Enter product description"
                rows={5}
                required
              />
            </div>

            <div className="flex gap-4">
              <Button type="button" variant="outline" onClick={() => navigate({ to: '/admin/products' })} className="flex-1">
                Cancel
              </Button>
              <Button
                type="submit"
                className="flex-1"
                disabled={createProduct.isPending || updateProduct.isPending}
              >
                {createProduct.isPending || updateProduct.isPending
                  ? 'Saving...'
                  : isEditMode
                    ? 'Update Product'
                    : 'Create Product'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
