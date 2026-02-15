import { Trash2 } from 'lucide-react';
import type { CartItem } from '../cart/CartContext';
import { Button } from '@/components/ui/button';
import QuantityPicker from './QuantityPicker';

interface CartLineItemProps {
  item: CartItem;
  onUpdateQuantity: (productId: bigint, quantity: number) => void;
  onRemove: (productId: bigint) => void;
}

export default function CartLineItem({ item, onUpdateQuantity, onRemove }: CartLineItemProps) {
  const imageUrl = item.image || '/assets/generated/product-placeholder.dim_800x800.png';
  const price = Number(item.price) / 100;
  const lineTotal = price * item.quantity;

  return (
    <div className="flex gap-4 py-4 border-b">
      <img src={imageUrl} alt={item.name} className="w-24 h-24 object-cover rounded-md bg-muted" />
      <div className="flex-1 flex flex-col justify-between">
        <div>
          <h3 className="font-semibold">{item.name}</h3>
          <p className="text-sm text-muted-foreground">${price.toFixed(2)} each</p>
        </div>
        <div className="flex items-center gap-4">
          <QuantityPicker value={item.quantity} onChange={(q) => onUpdateQuantity(item.productId, q)} />
          <Button variant="ghost" size="icon" onClick={() => onRemove(item.productId)} className="text-destructive">
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
      <div className="text-right">
        <p className="font-bold text-lg">${lineTotal.toFixed(2)}</p>
      </div>
    </div>
  );
}
