import React from 'react';
import { Product } from '../types';
import { MINIMUM_STOCK_THRESHOLD } from '../constants';

interface StockSummaryCardProps {
  product: Product;
}

const StockMetric: React.FC<{ label: string; value: number | string; colorClass: string; isBold?: boolean }> = ({ label, value, colorClass, isBold }) => (
  <div>
    <p className="text-sm text-gray-500">{label}</p>
    <p className={`text-2xl ${colorClass} ${isBold ? 'font-bold' : 'font-semibold'}`}>{value}</p>
  </div>
);

export const StockSummaryCard: React.FC<StockSummaryCardProps> = ({ product }) => {
  const cleanStock = product.totalStock - product.damagedStock;
  const isLowStock = cleanStock < MINIMUM_STOCK_THRESHOLD;
  const cleanStockValue = (cleanStock * product.price).toFixed(2);

  return (
    <div className="bg-white p-4 rounded-xl shadow-md border border-gray-200 hover:shadow-lg hover:border-brand-blue transition-all duration-300 flex flex-col justify-between">
      <div>
        <h3 className="text-md font-bold text-gray-800 truncate mb-3">{product.name}</h3>
        <div className="grid grid-cols-3 gap-2 text-center mb-3">
            <StockMetric label="الإجمالي" value={product.totalStock} colorClass="text-gray-700" />
            <StockMetric label="الصالح" value={cleanStock} colorClass={isLowStock ? 'text-red-500' : 'text-green-600'} isBold />
            <StockMetric label="التالف" value={product.damagedStock} colorClass={product.damagedStock > 0 ? 'text-yellow-600' : 'text-gray-400'} />
        </div>
         <div className="text-center border-t pt-2 mt-2">
            <p className="text-sm text-gray-500">قيمة المخزون الصالح</p>
            <p className="text-lg font-semibold text-brand-blue">${cleanStockValue}</p>
        </div>
      </div>
       {isLowStock && (
        <div className="mt-3 bg-red-100 text-red-700 text-xs font-semibold px-2 py-1 rounded-md text-center">
          كمية المخزون الصالح منخفضة
        </div>
      )}
    </div>
  );
};