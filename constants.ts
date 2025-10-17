import { Product } from './types';

export const PRODUCT_LIST: (Pick<Product, 'id' | 'name' | 'price'>)[] = [
  { id: 'n1-400', name: 'Novalac N1 400g', price: 15.50 },
  { id: 'n1-800', name: 'Novalac N1 800g', price: 28.00 },
  { id: 'n2-400', name: 'Novalac N2 400g', price: 15.50 },
  { id: 'n2-800', name: 'Novalac N2 800g', price: 28.00 },
  { id: 'genio-400', name: 'Novalac Genio 400g', price: 16.00 },
  { id: 'genio-800', name: 'Novalac Genio 800g', price: 29.50 },
  { id: 'plus', name: 'Novalac Plus', price: 18.00 },
  { id: 'ar1', name: 'Novalac AR1', price: 19.50 },
  { id: 'ar2', name: 'Novalac AR2', price: 19.50 },
  { id: 'it1', name: 'Novalac IT1', price: 17.00 },
  { id: 'it2', name: 'Novalac IT2', price: 17.00 },
  { id: 'it3', name: 'Novalac IT3', price: 17.00 },
  { id: 'aminova', name: 'Novalac Aminova', price: 25.00 },
];

export const MINIMUM_STOCK_THRESHOLD = 20;