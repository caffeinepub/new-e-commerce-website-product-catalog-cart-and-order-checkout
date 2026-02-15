import { Minus, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface QuantityPickerProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
}

export default function QuantityPicker({ value, onChange, min = 1, max = 99 }: QuantityPickerProps) {
  const handleDecrement = () => {
    if (value > min) {
      onChange(value - 1);
    }
  };

  const handleIncrement = () => {
    if (value < max) {
      onChange(value + 1);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = parseInt(e.target.value) || min;
    onChange(Math.max(min, Math.min(max, newValue)));
  };

  return (
    <div className="flex items-center gap-2">
      <Button variant="outline" size="icon" onClick={handleDecrement} disabled={value <= min}>
        <Minus className="h-4 w-4" />
      </Button>
      <Input
        type="number"
        value={value}
        onChange={handleInputChange}
        className="w-16 text-center"
        min={min}
        max={max}
      />
      <Button variant="outline" size="icon" onClick={handleIncrement} disabled={value >= max}>
        <Plus className="h-4 w-4" />
      </Button>
    </div>
  );
}
