export interface Tea {
  id?: number;
  brand: string;
  name: string;
  description?: string;
  image?: string;
  rating: number;
  teaCategoryId: number;
  syncStatus?: 'INSERT' | 'UPDATE' | 'DELETE' | null;
  notes: string;
}
