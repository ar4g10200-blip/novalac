export enum ActionType {
  INBOUND = 'INBOUND',
  OUTBOUND = 'OUTBOUND',
  DAMAGED = 'DAMAGED',
}

export interface Product {
  id: string;
  name: string;
  price: number;
  totalStock: number;
  damagedStock: number;
}

export interface StockLog {
  id: string;
  productId: string;
  productName: string;
  quantity: number;
  type: ActionType;
  timestamp: string;
}