import { useState, useMemo } from 'react';
import { useGetAllProducts } from '../hooks/useQueries';
import ProductCard from '../components/ProductCard';
import SearchBar from '../components/SearchBar';
import { Skeleton } from '@/components/ui/skeleton';

export default function ProductsPage() {
  const { data: products, isLoading } = useGetAllProducts();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredProducts = useMemo(() => {
    if (!products) return [];
    const availableProducts = products.filter((p) => p.available);
    if (!searchTerm) return availableProducts;
    const term = searchTerm.toLowerCase();
    return availableProducts.filter(
      (p) => p.name.toLowerCase().includes(term) || p.description.toLowerCase().includes(term)
    );
  }, [products, searchTerm]);

  return (
    <div className="min-h-screen">
      <div className="relative w-full h-64 md:h-80 bg-muted overflow-hidden">
        <img
          src="/assets/generated/store-hero-banner.dim_1600x600.png"
          alt="ShopHub"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent flex items-end">
          <div className="container mx-auto px-4 pb-8">
            <h1 className="text-4xl md:text-5xl font-bold mb-2">Discover Amazing Products</h1>
            <p className="text-lg text-muted-foreground">Quality items for every need</p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between mb-8">
          <SearchBar value={searchTerm} onChange={setSearchTerm} />
          <p className="text-sm text-muted-foreground">
            {filteredProducts.length} {filteredProducts.length === 1 ? 'product' : 'products'} found
          </p>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <Skeleton key={i} className="h-96" />
            ))}
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-lg text-muted-foreground">No products found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id.toString()} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
