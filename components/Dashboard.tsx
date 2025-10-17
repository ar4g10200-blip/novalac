import React from 'react';
import { Product, StockLog, ActionType } from '../types';
import { StockSummaryCard } from './StockSummaryCard';
import { StockActionsForm } from './StockActionsForm';
import { StockHistoryTable } from './StockHistoryTable';
import { StockTrendChart } from './StockTrendChart';
import { KPIs } from './KPIs';

interface DashboardProps {
  products: Product[];
  stockLogs: StockLog[];
  onUpdateStock: (productId: string, quantity: number, type: ActionType) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ products, stockLogs, onUpdateStock }) => {
  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-8">
      {/* KPIs Section */}
      <section aria-labelledby="kpi-heading">
        <KPIs products={products} />
      </section>

      {/* Stock Summary Section */}
      <section aria-labelledby="summary-heading">
        <h2 id="summary-heading" className="text-2xl font-bold text-gray-900 mb-4">ملخص المخزون</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {products.map(product => (
            <StockSummaryCard key={product.id} product={product} />
          ))}
        </div>
      </section>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Stock Actions Form - takes 1/3 width on large screens */}
        <section aria-labelledby="actions-heading" className="lg:col-span-1 sticky top-24">
          <StockActionsForm products={products} onUpdateStock={onUpdateStock} />
        </section>
        
        {/* Stock History Table - takes 2/3 width on large screens */}
        <section aria-labelledby="history-heading" className="lg:col-span-2">
          <StockHistoryTable logs={stockLogs} products={products} />
        </section>
      </div>

      {/* Stock Trends Chart Section */}
      <section aria-labelledby="trends-heading">
        <StockTrendChart logs={stockLogs} products={products} />
      </section>
    </div>
  );
};