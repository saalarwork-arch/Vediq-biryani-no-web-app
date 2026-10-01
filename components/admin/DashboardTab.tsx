'use client';

import React from 'react';
import {
  ShoppingBag,
  DollarSign,
  TrendingUp,
  Clock,
  ChefHat,
  Truck,
  CheckCircle2,
  XCircle,
  UtensilsCrossed,
  Layers,
  ArrowRight,
  Eye,
  Plus,
} from 'lucide-react';
import { CustomerOrder, MenuItem } from '@/types/supabase';
import { formatINR } from '@/lib/utils';
import { AdminTab } from './AdminSidebar';

interface DashboardTabProps {
  orders: CustomerOrder[];
  menuItems: MenuItem[];
  categoriesCount: number;
  onNavigateTab: (tab: AdminTab) => void;
  onViewOrder: (order: CustomerOrder) => void;
  onAddNewProduct: () => void;
}

export default function DashboardTab({
  orders,
  menuItems,
  categoriesCount,
  onNavigateTab,
  onViewOrder,
  onAddNewProduct,
}: DashboardTabProps) {
  // Compute key order stats
  const totalOrders = orders.length;
  const newOrders = orders.filter((o) => o.order_status === 'pending').length;
  const confirmedOrders = orders.filter((o) => o.order_status === 'confirmed').length;
  const preparingOrders = orders.filter((o) => o.order_status === 'preparing').length;
  const outForDeliveryOrders = orders.filter((o) => o.order_status === 'out_for_delivery').length;
  const deliveredOrders = orders.filter((o) => o.order_status === 'delivered').length;
  const cancelledOrders = orders.filter((o) => o.order_status === 'cancelled').length;

  const totalRevenue = orders
    .filter((o) => o.order_status !== 'cancelled')
    .reduce((sum, o) => sum + (Number(o.total) || 0), 0);

  const activeProducts = menuItems.filter((m) => m.is_active !== false).length;

  const recentOrders = [...orders]
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, 6);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200">
            <Clock className="w-3 h-3 text-amber-500" />
            <span>New Pending</span>
          </span>
        );
      case 'confirmed':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-700 border border-blue-200">
            <CheckCircle2 className="w-3 h-3 text-blue-500" />
            <span>Confirmed</span>
          </span>
        );
      case 'preparing':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-800 border border-amber-300">
            <ChefHat className="w-3 h-3 text-amber-600" />
            <span>Dum Preparing</span>
          </span>
        );
      case 'out_for_delivery':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-purple-50 text-purple-700 border border-purple-200">
            <Truck className="w-3 h-3 text-purple-500" />
            <span>Out for Delivery</span>
          </span>
        );
      case 'delivered':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <CheckCircle2 className="w-3 h-3 text-emerald-500" />
            <span>Delivered</span>
          </span>
        );
      case 'cancelled':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-rose-50 text-rose-700 border border-rose-200">
            <XCircle className="w-3 h-3 text-rose-500" />
            <span>Cancelled</span>
          </span>
        );
      default:
        return (
          <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-stone-100 text-stone-700">
            {status}
          </span>
        );
    }
  };

  return (
    <div className="space-y-8">
      {/* Header with Title & Quick Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#1A1814]">
            Restaurant Executive Dashboard
          </h1>
          <p className="text-xs sm:text-sm text-[#6B665E] mt-1">
            Real-time operations, revenue metrics, orders queue, and active catalog overview.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onAddNewProduct}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#C59A3F] to-[#9E7422] hover:from-[#B8860B] hover:to-[#8C6418] text-white text-xs font-bold shadow-xs transition active:scale-95 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Dish</span>
          </button>
          <button
            onClick={() => onNavigateTab('orders')}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white border border-[#DDD8CE] hover:bg-[#F8F6F0] text-[#1A1814] text-xs font-bold shadow-xs transition active:scale-95 cursor-pointer"
          >
            <ShoppingBag className="w-4 h-4 text-[#9E7422]" />
            <span>Manage Orders</span>
          </button>
        </div>
      </div>

      {/* Top Revenue & Summary Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-white border border-[#EAE6DF] shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-[#ECFDF5] text-[#059669] flex items-center justify-center shrink-0">
            <DollarSign className="w-6 h-6" />
          </div>
          <div>
            <p className="text-[11px] font-bold text-[#6B665E] uppercase tracking-wider">Total Revenue</p>
            <h3 className="text-xl sm:text-2xl font-black text-[#1A1814] mt-0.5">{formatINR(totalRevenue)}</h3>
            <p className="text-[10px] text-[#059669] font-medium flex items-center gap-1 mt-0.5">
              <TrendingUp className="w-3 h-3" /> Excludes cancelled
            </p>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-[#EAE6DF] shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-[#FAF5E8] text-[#9E7422] flex items-center justify-center shrink-0">
            <ShoppingBag className="w-6 h-6" />
          </div>
          <div>
            <p className="text-[11px] font-bold text-[#6B665E] uppercase tracking-wider">Total Orders</p>
            <h3 className="text-xl sm:text-2xl font-black text-[#1A1814] mt-0.5">{totalOrders}</h3>
            <p className="text-[10px] text-[#6B665E] font-medium mt-0.5">Lifetime orders placed</p>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-[#EAE6DF] shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-[#FFFBEB] text-[#D97706] flex items-center justify-center shrink-0">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <p className="text-[11px] font-bold text-[#6B665E] uppercase tracking-wider">New Pending</p>
            <h3 className="text-xl sm:text-2xl font-black text-[#D97706] mt-0.5">{newOrders}</h3>
            <p className="text-[10px] text-[#D97706] font-medium mt-0.5">Requires confirmation</p>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-[#EAE6DF] shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-[#EFF6FF] text-[#2563EB] flex items-center justify-center shrink-0">
            <UtensilsCrossed className="w-6 h-6" />
          </div>
          <div>
            <p className="text-[11px] font-bold text-[#6B665E] uppercase tracking-wider">Active Products</p>
            <h3 className="text-xl sm:text-2xl font-black text-[#1A1814] mt-0.5">{activeProducts}</h3>
            <p className="text-[10px] text-[#6B665E] font-medium mt-0.5">In {categoriesCount} categories</p>
          </div>
        </div>
      </div>

      {/* Order Status Breakdown Pipeline */}
      <div className="p-6 rounded-2xl bg-white border border-[#EAE6DF] shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-[#1A1814]">Live Order Pipeline</h3>
            <p className="text-xs text-[#6B665E]">Current distribution of orders by kitchen fulfillment stage</p>
          </div>
          <button
            onClick={() => onNavigateTab('orders')}
            className="text-xs font-bold text-[#9E7422] hover:underline flex items-center gap-1 cursor-pointer"
          >
            <span>View All Orders</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          <div
            onClick={() => onNavigateTab('orders')}
            className="p-3.5 rounded-xl bg-[#FFFBEB] border border-[#FDE68A] hover:bg-[#FEF3C7] transition cursor-pointer"
          >
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-amber-800">New Pending</span>
              <Clock className="w-3.5 h-3.5 text-amber-600" />
            </div>
            <p className="text-xl font-black text-amber-900 mt-1">{newOrders}</p>
          </div>

          <div
            onClick={() => onNavigateTab('orders')}
            className="p-3.5 rounded-xl bg-[#EFF6FF] border border-[#BFDBFE] hover:bg-[#DBEAFE] transition cursor-pointer"
          >
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-blue-800">Confirmed</span>
              <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" />
            </div>
            <p className="text-xl font-black text-blue-900 mt-1">{confirmedOrders}</p>
          </div>

          <div
            onClick={() => onNavigateTab('orders')}
            className="p-3.5 rounded-xl bg-[#FFF7ED] border border-[#FED7AA] hover:bg-[#FFEDD5] transition cursor-pointer"
          >
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-orange-800">Dum Preparing</span>
              <ChefHat className="w-3.5 h-3.5 text-orange-600" />
            </div>
            <p className="text-xl font-black text-orange-900 mt-1">{preparingOrders}</p>
          </div>

          <div
            onClick={() => onNavigateTab('orders')}
            className="p-3.5 rounded-xl bg-[#FAF5FF] border border-[#E9D5FF] hover:bg-[#F3E8FF] transition cursor-pointer"
          >
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-purple-800">Out for Delivery</span>
              <Truck className="w-3.5 h-3.5 text-purple-600" />
            </div>
            <p className="text-xl font-black text-purple-900 mt-1">{outForDeliveryOrders}</p>
          </div>

          <div
            onClick={() => onNavigateTab('orders')}
            className="p-3.5 rounded-xl bg-[#ECFDF5] border border-[#A7F3D0] hover:bg-[#D1FAE5] transition cursor-pointer"
          >
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-emerald-800">Delivered</span>
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            </div>
            <p className="text-xl font-black text-emerald-900 mt-1">{deliveredOrders}</p>
          </div>

          <div
            onClick={() => onNavigateTab('orders')}
            className="p-3.5 rounded-xl bg-[#FFF1F2] border border-[#FECDD3] hover:bg-[#FFE4E6] transition cursor-pointer"
          >
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-rose-800">Cancelled</span>
              <XCircle className="w-3.5 h-3.5 text-rose-600" />
            </div>
            <p className="text-xl font-black text-rose-900 mt-1">{cancelledOrders}</p>
          </div>
        </div>
      </div>

      {/* Recent Orders Table */}
      <div className="p-6 rounded-2xl bg-white border border-[#EAE6DF] shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-[#1A1814]">Recent Customer Orders</h3>
            <p className="text-xs text-[#6B665E]">Latest incoming orders from the public website</p>
          </div>
          <button
            onClick={() => onNavigateTab('orders')}
            className="text-xs font-bold text-[#9E7422] hover:underline flex items-center gap-1 cursor-pointer"
          >
            <span>All Orders ({orders.length})</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {recentOrders.length === 0 ? (
          <div className="text-center py-10 bg-[#FAF8F5] rounded-xl border border-dashed border-[#DDD8CE]">
            <ShoppingBag className="w-8 h-8 text-[#9E7422] mx-auto mb-2 opacity-50" />
            <p className="text-xs font-bold text-[#1A1814]">No customer orders recorded yet</p>
            <p className="text-[11px] text-[#6B665E] mt-0.5">Orders placed on the website will instantly appear here.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-[#EAE6DF] text-[#6B665E] uppercase tracking-wider text-[10px]">
                  <th className="py-3 px-3">Order #</th>
                  <th className="py-3 px-3">Customer</th>
                  <th className="py-3 px-3">Items</th>
                  <th className="py-3 px-3">Total</th>
                  <th className="py-3 px-3">Status</th>
                  <th className="py-3 px-3">Date</th>
                  <th className="py-3 px-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F2EFE8]">
                {recentOrders.map((ord) => (
                  <tr key={ord.id} className="hover:bg-[#FAF8F5] transition">
                    <td className="py-3 px-3 font-mono font-bold text-[#1A1814]">{ord.order_number}</td>
                    <td className="py-3 px-3">
                      <p className="font-bold text-[#1A1814]">{ord.customer_name}</p>
                      <p className="text-[11px] text-[#6B665E]">{ord.phone}</p>
                    </td>
                    <td className="py-3 px-3 text-[#5A564F]">
                      <span className="font-semibold text-[#1A1814]">{ord.items?.length || 0} items</span>
                      <span className="text-[11px] block text-[#8C877E] truncate max-w-[160px]">
                        {ord.items?.map((i) => `${i.name} (${i.size})`).join(', ')}
                      </span>
                    </td>
                    <td className="py-3 px-3 font-bold text-[#1A1814]">{formatINR(ord.total)}</td>
                    <td className="py-3 px-3">{getStatusBadge(ord.order_status)}</td>
                    <td className="py-3 px-3 text-[#6B665E]">
                      {new Date(ord.created_at).toLocaleDateString('en-IN', {
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </td>
                    <td className="py-3 px-3 text-right">
                      <button
                        onClick={() => onViewOrder(ord)}
                        className="p-1.5 rounded-lg bg-[#FAF5E8] hover:bg-[#F2EFE8] text-[#9E7422] font-bold text-xs transition cursor-pointer"
                        title="View Full Order Details"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
