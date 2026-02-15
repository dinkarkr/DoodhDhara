
export type TransactionType = 'PURCHASE' | 'SALE';

export interface Party {
  id: string;
  name: string;
  contact: string;
  type: 'CONTRACTOR' | 'CLIENT';
  village?: string;
}

export interface MilkEntry {
  id: string;
  date: string;
  partyId: string;
  type: TransactionType;
  quantity: number; // in Litres
  fat: number;
  clr: number;
  snf: number;
  rate: number; // per Litre
  amount: number;
  status: 'PENDING' | 'PAID';
}

export interface AppConfig {
  purchaseFatRate: number; 
  purchaseSnfRate: number;
  saleFatRate: number;
  saleSnfRate: number;
}

export const DEFAULT_CONFIG: AppConfig = {
  purchaseFatRate: 620,
  purchaseSnfRate: 310,
  saleFatRate: 750,
  saleSnfRate: 380
};
