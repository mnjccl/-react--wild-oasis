export interface CabinData {
  id?: number;
  name: string;
  max_capacity: number;
  regular_price: number;
  discount: number;
  description: string;
  image: File | string;
}
