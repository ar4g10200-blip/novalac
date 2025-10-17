import React, { useMemo } from 'react';
import { Product } from '../types';
import { MINIMUM_STOCK_THRESHOLD } from '../constants';
import { TotalItemsIcon, ValueIcon, LowStockIcon, DamagedIcon } from './icons';

interface KPIsProps {
  products: Product[];
}

interface StatCardProps {
    icon: React.ReactNode;
    label: string;
    value: string | number;
    colorClass: string;
}

const StatCard: React.FC<StatCardProps> = ({ icon, label, value, colorClass }) => (
    <div className="bg-white p-4 rounded-xl shadow-md border border-gray-200 flex items-center space-x-4 space-x-reverse">
        <div className={`p-3 rounded-full ${colorClass}`}>
            {icon}
        </div>
        <div>
            <p className="text-sm text-gray-500">{label}</p>
            <p className="text-2xl font-bold text-gray-800">{value}</p>
        </div>
    </div>
);

export const KPIs: React.FC<KPIsProps> = ({ products }) => {

  const stats = useMemo(() => {
    const totalItems = products.reduce((sum, p) => sum + p.totalStock, 0);
    const totalCleanValue = products.reduce((sum, p) => sum + (p.totalStock - p.damagedStock) * p.price, 0);
    const lowStockProducts = products.filter(p => (p.totalStock - p.damagedStock) < MINIMUM_STOCK_THRESHOLD).length;
    const totalDamagedItems = products.reduce((sum, p) => sum + p.damagedStock, 0);
    return { totalItems, totalCleanValue, lowStockProducts, totalDamagedItems };
  }, [products]);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      <StatCard 
        icon={<TotalItemsIcon className="w-6 h-6 text-white"/>}
        label="إجمالي المنتجات في المخزون"
        value={stats.totalItems.toLocaleString('ar-EG')}
        colorClass="bg-blue-500"
      />
      <StatCard 
        icon={<ValueIcon className="w-6 h-6 text-white"/>}
        label="القيمة الإجمالية للمخزون الصالح"
        value={`$${stats.totalCleanValue.toLocaleString('ar-EG', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
        colorClass="bg-green-500"
      />
      <StatCard 
        icon={<LowStockIcon className="w-6 h-6 text-white"/>}
        label="منتجات ذات مخزون منخفض"
        value={stats.lowStockProducts.toLocaleString('ar-EG')}
        colorClass="bg-yellow-500"
      />
       <StatCard 
        icon={<DamagedIcon className="w-6 h-6 text-white"/>}
        label="إجمالي المنتجات التالفة"
        value={stats.totalDamagedItems.toLocaleString('ar-EG')}
        colorClass="bg-red-500"
      />
    </div>
  );
};