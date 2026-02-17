import { useState } from 'react';
import type { Order } from '../data/orders';

interface OrdersTableProps {
  orders: Order[];
}

const formatDate = (date: Date): string => {
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${month}/${day}`;
};

export default function OrdersTable({ orders }: OrdersTableProps) {
  const [filter, setFilter] = useState<'all' | 'delivered' | null>(null);

  const completedOrders = orders.filter(o => o.completed);
  const totalOrderedProblems = orders.reduce((sum, o) => sum + o.problemCount, 0);
  const deliveredProblems = completedOrders.reduce((sum, o) => sum + o.problemCount, 0);

  const displayOrders = filter === 'delivered' ? completedOrders : orders;

  return (
    <div className="h-full flex flex-col bg-surface/20 w-full rounded-lg border border-border/30 overflow-hidden">
      {/* Split Header */}
      <div className="border-b border-border/30 bg-surfaceHighlight/30 shrink-0 h-[88px] flex">
        {/* Left: Orders */}
        <div className="flex-1 p-3 flex flex-col justify-between border-r border-border/30">
          <div className="flex items-center">
            <h3 className="text-xs font-bold uppercase tracking-wider text-text-muted flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-text-dim"></span>
              ORDERS
            </h3>
          </div>
          <div className="flex items-end gap-4">
            <div className="flex items-end gap-2">
              <span className="text-3xl font-mono font-bold text-text-main leading-none">
                {orders.length}
              </span>
              <span className="text-[9px] font-mono text-text-dim mb-1">ORDERS</span>
            </div>
            <div className="flex items-end gap-2">
              <span className="text-3xl font-mono font-bold text-text-main leading-none">
                {totalOrderedProblems}
              </span>
              <span className="text-[9px] font-mono text-text-dim mb-1">PROBLEMS</span>
            </div>
          </div>
        </div>
        {/* Right: Delivered (clickable) */}
        <div
          onClick={() => setFilter(filter === 'delivered' ? null : 'delivered')}
          className={`flex-1 p-3 flex flex-col justify-between cursor-pointer transition-colors ${
            filter === 'delivered' ? 'bg-yellow-500/10' : 'hover:bg-white/5'
          }`}
        >
          <div className="flex items-center">
            <h3 className="text-xs font-bold uppercase tracking-wider text-text-muted flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-yellow-500"></span>
              DELIVERED
            </h3>
          </div>
          <div className="flex items-end gap-4">
            <div className="flex items-end gap-2">
              <span className="text-3xl font-mono font-bold text-text-main leading-none">
                {completedOrders.length}
              </span>
              <span className="text-[9px] font-mono text-text-dim mb-1">ORDERS</span>
            </div>
            <div className="flex items-end gap-2">
              <span className="text-3xl font-mono font-bold text-text-main leading-none">
                {deliveredProblems}
              </span>
              <span className="text-[9px] font-mono text-text-dim mb-1">PROBLEMS</span>
            </div>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-auto flex-1 custom-scrollbar w-full">
        <table className="w-full text-[10px] text-left border-collapse table-fixed">
          <thead className="sticky top-0 z-10 bg-surfaceHighlight border-b border-border text-[9px] uppercase tracking-wider font-mono text-text-muted">
            <tr>
              <th className="px-2.5 py-2 font-semibold w-9 text-center">#</th>
              <th className="px-2.5 py-2 font-semibold">ORDER</th>
              <th className="px-2.5 py-2 font-semibold">PARTNER</th>
              <th className="px-2.5 py-2 font-semibold">SIZE</th>
              <th className="px-2.5 py-2 font-semibold">DUE</th>
              <th className="pl-2.5 pr-5 py-2 font-semibold text-right">DELIVERED</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/30">
            {displayOrders.map((order) => (
              <tr
                key={order.id}
                className="group hover:bg-surfaceHighlight/30 transition-colors duration-75"
              >
                <td className="px-2.5 py-3 text-center">
                  <div className={`h-5 w-5 mx-auto rounded flex items-center justify-center text-[9px] font-mono font-bold ${
                    order.completed
                      ? 'bg-yellow-500/20 text-yellow-500 border border-yellow-500/50'
                      : 'bg-surfaceHighlight border border-border text-text-muted'
                  }`}>
                    {order.id}
                  </div>
                </td>
                <td className="px-2.5 py-3 whitespace-nowrap">
                  <span className="font-medium font-mono text-[10px] text-text-muted">
                    {order.orderName}
                  </span>
                </td>
                <td className="px-2.5 py-3 whitespace-nowrap">
                  <span className="font-semibold font-mono text-xs text-text-main">
                    {order.displayName}
                  </span>
                </td>
                <td className="px-2.5 py-3 whitespace-nowrap">
                  <span className="font-mono font-bold text-text-main">{order.problemCount}</span>
                </td>
                <td className="px-2.5 py-3 whitespace-nowrap">
                  <span className="font-mono text-text-dim text-[9px]">
                    {formatDate(order.dueDate)}
                  </span>
                </td>
                <td className="pl-2.5 pr-5 py-3 whitespace-nowrap text-right">
                  <span className="font-mono text-text-dim text-[9px]">
                    {order.deliveredDate ? formatDate(order.deliveredDate) : '—'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
