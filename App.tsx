import React, { useState, useEffect, useCallback } from 'react';
import { Product, StockLog, ActionType } from './types';
import { PRODUCT_LIST } from './constants';
import { Dashboard } from './components/Dashboard';
import { WarehouseIcon } from './components/icons';

const App: React.FC = () => {
  const [products, setProducts] = useState<Product[]>(() => {
    try {
      const savedProducts = localStorage.getItem('inventory_products');
      if (savedProducts) {
        const parsedProducts = JSON.parse(savedProducts);
        // Ensure price is up-to-date from constants
        return parsedProducts.map((p: Product) => ({
            ...p,
            price: PRODUCT_LIST.find(pl => pl.id === p.id)?.price || 0
        }));
      }
    } catch (error) {
      console.error("Error reading products from localStorage", error);
    }
    return PRODUCT_LIST.map(p => ({ ...p, totalStock: 0, damagedStock: 0 }));
  });

  const [stockLogs, setStockLogs] = useState<StockLog[]>(() => {
    try {
      const savedLogs = localStorage.getItem('inventory_stockLogs');
      return savedLogs ? JSON.parse(savedLogs) : [];
    } catch (error) {
      console.error("Error reading logs from localStorage", error);
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('inventory_products', JSON.stringify(products));
      localStorage.setItem('inventory_stockLogs', JSON.stringify(stockLogs));
    } catch (error) {
      console.error("Error saving to localStorage", error);
    }
  }, [products, stockLogs]);

  const handleUpdateStock = useCallback((productId: string, quantity: number, type: ActionType) => {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    const newLog: StockLog = {
      id: `${new Date().toISOString()}-${Math.random()}`,
      productId,
      productName: product.name,
      quantity,
      type,
      timestamp: new Date().toISOString(),
    };

    setStockLogs(prevLogs => [newLog, ...prevLogs]);

    setProducts(prevProducts =>
      prevProducts.map(p => {
        if (p.id === productId) {
          switch(type) {
            case ActionType.INBOUND:
              return { ...p, totalStock: p.totalStock + quantity };
            case ActionType.OUTBOUND:
              return { ...p, totalStock: p.totalStock - quantity };
            case ActionType.DAMAGED:
              return { ...p, damagedStock: p.damagedStock + quantity };
            default:
              return p;
          }
        }
        return p;
      })
    );
  }, [products]);

  return (
    <div className="min-h-screen bg-slate-100 text-gray-800">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
            <div className="flex items-center space-x-4">
                 <div className="bg-brand-blue p-2 rounded-lg">
                    <WarehouseIcon className="h-8 w-8 text-white"/>
                 </div>
                 <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 tracking-tight">
                    مخزون مستودع نوفالاك
                 </h1>
            </div>
        </div>
      </header>
      <main>
        <Dashboard products={products} stockLogs={stockLogs} onUpdateStock={handleUpdateStock} />
      </main>
      <footer className="text-center py-4 text-sm text-gray-500">
        <p>&copy; {new Date().getFullYear()} إدارة مخزون نوفالاك. جميع الحقوق محفوظة.</p>
      </footer>
    </div>
  );
};

export default App;