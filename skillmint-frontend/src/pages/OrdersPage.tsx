import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Package, ExternalLink } from 'lucide-react';
import { orderApi } from '../api/services';
import type { Order } from '../types';
import { motion } from 'framer-motion';

const statusColors: Record<string, string> = {
  PENDING: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
  COMPLETED: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
  FAILED: 'text-red-400 bg-red-500/10 border-red-500/20',
  REFUNDED: 'text-blue-400 bg-blue-500/10 border-blue-500/20',
  PROCESSING: 'text-[#7B89D4] bg-[#5C6AC4]/10 border-[#5C6AC4]/20',
};

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    document.title = 'My Orders – SkillMint';
    orderApi.getAll().then((r) => setOrders(r.data.data || [])).finally(() => setIsLoading(false));
  }, []);

  if (isLoading) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-12">
        {[...Array(3)].map((_, i) => <div key={i} className="h-28 bg-[#111827] rounded-xl mb-4 animate-pulse" />)}
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="text-3xl font-bold text-[#e2e8f0] mb-2">My Orders</h1>
      <p className="text-[#64748b] mb-8">{orders.length} order{orders.length !== 1 ? 's' : ''}</p>

      {orders.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <div className="w-20 h-20 rounded-2xl flex items-center justify-center mb-6 border border-[#1e293b] bg-[#111827]">
            <Package size={32} className="text-[#2d3748]" />
          </div>
          <h2 className="text-xl font-bold text-[#94a3b8] mb-2">No orders yet</h2>
          <p className="text-[#64748b] mb-6 text-sm">Your purchase history will appear here</p>
          <Link to="/courses" className="btn-primary">Browse Courses</Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order, i) => (
            <motion.div
              key={order.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="p-5 bg-[#111827] border border-[#1e293b] rounded-xl hover:border-[#2d3748] transition-all"
            >
              <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
                <div>
                  <p className="font-semibold text-[#e2e8f0]">Order #{order.orderNumber}</p>
                  <p className="text-xs text-[#64748b] mt-1">
                    {new Date(order.createdAt).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${statusColors[order.status] || 'text-[#94a3b8]'}`}>
                    {order.status}
                  </span>
                  <span className="font-bold text-[#e2e8f0]">₹{order.totalAmount?.toLocaleString('en-IN')}</span>
                </div>
              </div>
              <div className="space-y-2">
                {(order.items || []).map((item) => (
                  <div key={item.id} className="flex items-center gap-3 text-sm">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#5C6AC4] flex-shrink-0" />
                    <Link to={`/courses/${item.course?.id}`} className="text-[#94a3b8] hover:text-[#7B89D4] transition-colors flex items-center gap-1 truncate">
                      {item.course?.title}
                      <ExternalLink size={11} className="flex-shrink-0" />
                    </Link>
                    <span className="text-[#64748b] text-xs ml-auto flex-shrink-0">₹{item.price?.toLocaleString('en-IN')}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
