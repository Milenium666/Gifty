export interface Gift {
  id?: string;
  title: string;
  description: string;
  category: string;
  priceRange: string;
  imageUrl?: string;
  isFavorite?: boolean;
}
