import React, { useState, useMemo } from 'react';
import { Product, StockLog, ActionType } from '../types';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface StockTrendChartProps {
  logs: StockLog[];
  products: Product[];
}

export const StockTrendChart: React.FC<StockTrendChartProps> = ({ logs, products }) => {
  const [selectedProductId, setSelectedProductId] = useState<string>(products[0]?.id || '');

  const chartData = useMemo(() => {
    if (!selectedProductId) return [];

    const relevantLogs = logs
      .filter(log => log.productId === selectedProductId)
      .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());

    let total = 0;
    let damaged = 0;
    
    const product = products.find(p => p.id === selectedProductId);

    if (relevantLogs.length === 0) {
        if (!product) return [];
        return [{
            date: 'الحالي',
            totalStock: product.totalStock,
            cleanStock: product.totalStock - product.damagedStock,
            damagedStock: product.damagedStock
        }];
    }

    const dataPoints = relevantLogs.map(log => {
      switch (log.type) {
        case ActionType.INBOUND:
          total += log.quantity;
          break;
        case ActionType.OUTBOUND:
          total -= log.quantity;
          break;
        case ActionType.DAMAGED:
          damaged += log.quantity;
          break;
      }
      return {
        date: new Date(log.timestamp).toLocaleDateString('ar-EG'),
        totalStock: total,
        cleanStock: total - damaged,
        damagedStock: damaged,
      };
    });

    const initialDate = new Date(new Date(relevantLogs[0].timestamp).getTime() - 86400000); // one day before first log

    return [
        {
            date: initialDate.toLocaleDateString('ar-EG'),
            totalStock: 0,
            cleanStock: 0,
            damagedStock: 0
        },
        ...dataPoints
    ];
}, [selectedProductId, logs, products]);


  return (
    <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-gray-800">اتجاهات المخزون</h2>
        <select
          value={selectedProductId}
          onChange={(e) => setSelectedProductId(e.target.value)}
          className="w-1/3 shadow-sm sm:text-sm border-gray-300 rounded-md focus:ring-brand-blue focus:border-brand-blue"
        >
          {products.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
        </select>
      </div>
      <div style={{ width: '100%', height: 300 }}>
        <ResponsiveContainer>
          <LineChart
            data={chartData}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis allowDecimals={false} />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="totalStock" name="المخزون الإجمالي" stroke="#8884d8" strokeWidth={2} />
            <Line type="monotone" dataKey="cleanStock" name="المخزون الصالح" stroke="#4ade80" strokeWidth={2} activeDot={{ r: 8 }} />
            <Line type="monotone" dataKey="damagedStock" name="المخزون التالف" stroke="#facc15" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};