
import React, { useState, useMemo } from 'react';
import { StockLog, ActionType, Product } from '../types';
import { InboundIcon, OutboundIcon, DamagedIcon, ExportIcon } from './icons';

interface StockHistoryTableProps {
  logs: StockLog[];
  products: Product[];
}

const ActionBadge: React.FC<{ type: ActionType }> = ({ type }) => {
  const config = {
    [ActionType.INBOUND]: {
      bg: 'bg-green-100',
      text: 'text-green-800',
      icon: <InboundIcon className="w-4 h-4" />,
      label: 'وارد',
    },
    [ActionType.OUTBOUND]: {
      bg: 'bg-yellow-100',
      text: 'text-yellow-800',
      icon: <OutboundIcon className="w-4 h-4" />,
      label: 'صادر',
    },
    [ActionType.DAMAGED]: {
      bg: 'bg-red-100',
      text: 'text-red-800',
      icon: <DamagedIcon className="w-4 h-4" />,
      label: 'تالف',
    },
  };
  const { bg, text, icon, label } = config[type];
  return (
    <span className={`inline-flex items-center gap-x-1.5 rounded-full px-2 py-1 text-xs font-medium ${bg} ${text}`}>
      {icon}
      {label}
    </span>
  );
};

export const StockHistoryTable: React.FC<StockHistoryTableProps> = ({ logs, products }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterProduct, setFilterProduct] = useState('');
  const [filterAction, setFilterAction] = useState('');
  const [filterDate, setFilterDate] = useState('');

  const filteredLogs = useMemo(() => {
    return logs
      .filter(log => {
        const logDate = log.timestamp.split('T')[0];
        return (
          (filterProduct === '' || log.productId === filterProduct) &&
          (filterAction === '' || log.type === filterAction) &&
          (filterDate === '' || logDate === filterDate) &&
          log.productName.toLowerCase().includes(searchTerm.toLowerCase())
        );
      })
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  }, [logs, searchTerm, filterProduct, filterAction, filterDate]);
  
  const handleExport = () => {
    if (filteredLogs.length === 0) {
        alert('لا توجد بيانات للتصدير.');
        return;
    }

    const headers = ['المنتج', 'الإجراء', 'الكمية', 'التاريخ والوقت'];
    const actionTranslations = {
        [ActionType.INBOUND]: 'وارد',
        [ActionType.OUTBOUND]: 'صادر',
        [ActionType.DAMAGED]: 'تالف'
    };
    
    const translatedRows = filteredLogs.map(log => [
      `"${log.productName.replace(/"/g, '""')}"`,
      actionTranslations[log.type],
      log.quantity,
      `"${new Date(log.timestamp).toLocaleString('ar-EG')}"`
    ]);

    let csvContent = "data:text/csv;charset=utf-8,\uFEFF";
    csvContent += headers.join(',') + '\r\n';
    translatedRows.forEach(rowArray => {
        let row = rowArray.join(',');
        csvContent += row + '\r\n';
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'stock_history.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-gray-800">سجل المخزون</h2>
        <button
          onClick={handleExport}
          className="inline-flex items-center gap-2 px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-brand-blue hover:bg-brand-blue/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-blue"
        >
          <ExportIcon className="w-5 h-5" />
          تصدير إلى CSV
        </button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4 p-4 bg-gray-50 rounded-lg">
        <input
          type="text"
          placeholder="ابحث عن منتج..."
          className="w-full shadow-sm sm:text-sm border-gray-300 rounded-md focus:ring-brand-blue focus:border-brand-blue"
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
        />
        <select
          className="w-full shadow-sm sm:text-sm border-gray-300 rounded-md focus:ring-brand-blue focus:border-brand-blue"
          value={filterProduct}
          onChange={e => setFilterProduct(e.target.value)}
        >
          <option value="">كل المنتجات</option>
          {products.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
        </select>
        <select
          className="w-full shadow-sm sm:text-sm border-gray-300 rounded-md focus:ring-brand-blue focus:border-brand-blue"
          value={filterAction}
          onChange={e => setFilterAction(e.target.value)}
        >
          <option value="">كل الإجراءات</option>
          <option value={ActionType.INBOUND}>وارد</option>
          <option value={ActionType.OUTBOUND}>صادر</option>
          <option value={ActionType.DAMAGED}>تالف</option>
        </select>
        <input
          type="date"
          className="w-full shadow-sm sm:text-sm border-gray-300 rounded-md focus:ring-brand-blue focus:border-brand-blue"
          value={filterDate}
          onChange={e => setFilterDate(e.target.value)}
        />
      </div>

      <div className="overflow-x-auto">
        <div className="max-h-[400px] overflow-y-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50 sticky top-0">
              <tr>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">المنتج</th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">الإجراء</th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">الكمية</th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">التاريخ والوقت</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredLogs.length > 0 ? filteredLogs.map(log => (
                <tr key={log.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{log.productName}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <ActionBadge type={log.type} />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{log.quantity}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(log.timestamp).toLocaleString('ar-EG')}</td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={4} className="text-center py-10 text-gray-500">لم يتم العثور على سجلات.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};