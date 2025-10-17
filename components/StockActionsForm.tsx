import React, { useState } from 'react';
import { Product, ActionType } from '../types';

interface StockActionsFormProps {
  products: Product[];
  onUpdateStock: (productId: string, quantity: number, type: ActionType) => void;
}

export const StockActionsForm: React.FC<StockActionsFormProps> = ({ products, onUpdateStock }) => {
  const [productId, setProductId] = useState<string>(products[0]?.id || '');
  const [quantity, setQuantity] = useState<string>('');
  const [actionType, setActionType] = useState<ActionType>(ActionType.INBOUND);
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    const numQuantity = parseInt(quantity, 10);
    if (!productId || !quantity || isNaN(numQuantity) || numQuantity <= 0) {
      setError('يرجى تحديد منتج وإدخال كمية صالحة.');
      return;
    }

    const selectedProduct = products.find(p => p.id === productId);
    if (selectedProduct && (actionType === ActionType.OUTBOUND || actionType === ActionType.DAMAGED)) {
      const cleanStock = selectedProduct.totalStock - selectedProduct.damagedStock;
      if (numQuantity > cleanStock) {
        setError(`فشلت العملية. الكمية تتجاوز المخزون الصالح المتاح (${cleanStock}).`);
        return;
      }
    }
    
    const actionTranslations = {
        [ActionType.INBOUND]: 'وارد',
        [ActionType.OUTBOUND]: 'صادر',
        [ActionType.DAMAGED]: 'تالف'
    };

    onUpdateStock(productId, numQuantity, actionType);
    setSuccess(`تم تسجيل ${numQuantity} وحدة كـ ${actionTranslations[actionType]} بنجاح.`);
    setQuantity('');
    setTimeout(() => setSuccess(''), 3000);
  };

  const actionConfig = {
    [ActionType.INBOUND]: {
      label: 'إضافة إلى المخزون (وارد)',
      buttonClass: 'bg-green-600 hover:bg-green-700',
      title: 'تسجيل مخزون وارد'
    },
    [ActionType.OUTBOUND]: {
      label: 'إزالة من المخزون (صادر)',
      buttonClass: 'bg-yellow-600 hover:bg-yellow-700',
       title: 'تسجيل مخزون صادر'
    },
    [ActionType.DAMAGED]: {
      label: 'تحديد كتالف',
      buttonClass: 'bg-red-600 hover:bg-red-700',
       title: 'تسجيل مخزون تالف'
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
      <h2 className="text-xl font-bold text-gray-800 mb-4">{actionConfig[actionType].title}</h2>
      
      {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">{error}</div>}
      {success && <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4" role="alert">{success}</div>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="actionType" className="block text-sm font-medium text-gray-700">نوع الإجراء</label>
          <select
            id="actionType"
            value={actionType}
            onChange={(e) => setActionType(e.target.value as ActionType)}
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-brand-blue focus:border-brand-blue sm:text-sm rounded-md"
          >
            <option value={ActionType.INBOUND}>وارد</option>
            <option value={ActionType.OUTBOUND}>صادر</option>
            <option value={ActionType.DAMAGED}>تالف</option>
          </select>
        </div>

        <div>
          <label htmlFor="product" className="block text-sm font-medium text-gray-700">المنتج</label>
          <select
            id="product"
            value={productId}
            onChange={(e) => setProductId(e.target.value)}
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-brand-blue focus:border-brand-blue sm:text-sm rounded-md"
          >
            {products.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
          </select>
        </div>

        <div>
          <label htmlFor="quantity" className="block text-sm font-medium text-gray-700">الكمية</label>
          <input
            type="number"
            id="quantity"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            min="1"
            className="mt-1 focus:ring-brand-blue focus:border-brand-blue block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
            placeholder="مثال: 50"
          />
        </div>

        <button
          type="submit"
          className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${actionConfig[actionType].buttonClass} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-300`}
        >
          {actionConfig[actionType].label}
        </button>
      </form>
    </div>
  );
};