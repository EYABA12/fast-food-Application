import { Category } from "./category.model";

export interface Product {
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  available: boolean;
  category: Category;          // Utilise l'interface Category
}