import React, { useState, useEffect } from 'react';
import { Eye, Download, CheckCircle, Clock, Truck, XCircle, AlertTriangle, Inbox, RefreshCw, X, Printer, MapPin, Phone, User, CreditCard } from 'lucide-react';
import { CURRENCY } from '../constants';
import { Order, OrderStatus } from '../types';
import { useShop } from '../services/store';

const AdminOrders: React.FC = () => {
  const { orders, refreshData, updateOrderStatus } = useShop(); 
  const [activeFilter, setActiveFilter] = useState<OrderStatus | 'all'>('all');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState(false);

  // Load fresh data on mount from database
  useEffect(() => {
    refreshData();
  }, []);

  const filteredOrders = activeFilter === 'all' 
    ? orders 
    : orders.filter(o => o.status === activeFilter);

  const getStatusBadge = (status: OrderStatus) => {
    switch (status) {
      case 'delivered':
        return <span className="flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800"><CheckCircle size={12} className="mr-1"/> Delivered</span>;
      case 'processing':
        return <span className="flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"><Clock size={12} className="mr-1"/> Processing</span>;
      case 'shipped':
        return <span className="flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800"><Truck size={12} className="mr-1"/> Shipped</span>;
      case 'cancelled':
        return <span className="flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800"><XCircle size={12} className="mr-1"/> Cancelled</span>;
      default:
        return <span className="flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800"><Clock size={12} className="mr-1"/> Pending</span>;
    }
  };

  const handleViewOrder = (order: Order) => {
    setSelectedOrder(order);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedOrder(null);
  };

  const handleStatusChange = async (newStatus: OrderStatus) => {
    if (!selectedOrder) return;
    setUpdatingStatus(true);
    try {
        await updateOrderStatus(selectedOrder.id, newStatus);
        // Optimistic update for UI
        setSelectedOrder(prev => prev ? { ...prev, status: newStatus } : null);
    } catch (error) {
        console.error("Failed to update status", error);
        alert("Failed to update status");
    } finally {
        setUpdatingStatus(false);
    }
  };

  const handlePrintInvoice = () => {
    if (!selectedOrder) return;
    
    const invoiceWindow = window.open('', '_blank');
    if (!invoiceWindow) return;

    const invoiceHTML = `
      <html>
        <head>
          <title>Invoice #${selectedOrder.id}</title>
          <style>
            body { font-family: 'Arial', sans-serif; padding: 40px; color: #333; }
            .header { display: flex; justify-content: space-between; margin-bottom: 40px; border-bottom: 2px solid #eee; padding-bottom: 20px; }
            .logo { font-size: 24px; font-weight: bold; color: #16a34a; }
            .invoice-details { text-align: right; }
            .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 40px; margin-bottom: 40px; }
            .section-title { font-weight: bold; margin-bottom: 10px; color: #666; font-size: 14px; text-transform: uppercase; }
            table { width: 100%; border-collapse: collapse; margin-bottom: 30px; }
            th { text-align: left; background: #f9fafb; padding: 12px; border-bottom: 1px solid #eee; }
            td { padding: 12px; border-bottom: 1px solid #eee; }
            .totals { float: right; width: 300px; }
            .total-row { display: flex; justify-content: space-between; padding: 8px 0; }
            .grand-total { font-weight: bold; font-size: 18px; border-top: 2px solid #333; margin-top: 10px; padding-top: 10px; }
            @media print { .no-print { display: none; } }
          </style>
        </head>
        <body>
          <div class="header">
            <div class="logo">E-SHOP INVOICE</div>
            <div class="invoice-details">
              <h1>Invoice</h1>
              <p>Order ID: #${selectedOrder.id}</p>
              <p>Date: ${selectedOrder.date}</p>
              <p>Status: ${selectedOrder.status.toUpperCase()}</p>
            </div>
          </div>

          <div class="grid">
            <div>
              <div class="section-title">Bill To:</div>
              <p><strong>${selectedOrder.customer}</strong></p>
              <p>${selectedOrder.shippingAddress?.phone}</p>
              <p>${selectedOrder.shippingAddress?.address}</p>
              <p>${selectedOrder.shippingAddress?.city || ''}</p>
              <p>${selectedOrder.email}</p>
            </div>
            <div>
              <div class="section-title">Payment Method:</div>
              <p>${selectedOrder.paymentMethod.toUpperCase()}</p>
              ${selectedOrder.transactionId ? `<p>TrxID: ${selectedOrder.transactionId}</p>` : ''}
              ${selectedOrder.senderNumber ? `<p>Sender: ${selectedOrder.senderNumber}</p>` : ''}
            </div>
          </div>

          <table>
            <thead>
              <tr>
                <th>Item</th>
                <th>Quantity</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Order Items (See admin panel for itemized list if database structure supports it)</td>
                <td>${selectedOrder.items}</td>
                <td>${CURRENCY}${selectedOrder.total}</td>
              </tr>
            </tbody>
          </table>

          <div class="totals">
             <div class="total-row grand-total">
               <span>Total:</span>
               <span>${CURRENCY}${selectedOrder.total}</span>
             </div>
          </div>

          <div style="margin-top: 100px; text-align: center; color: #999; font-size: 12px;">
            <p>Thank you for your business!</p>
          </div>
          
          <script>
            window.onload = function() { window.print(); }
          </script>
        </body>
      </html>
    `;

    invoiceWindow.document.write(invoiceHTML);
    invoiceWindow.document.close();
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Orders Management</h1>
        <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded-md">Total: {orders.length}</span>
            <button 
                onClick={() => refreshData()} 
                className="p-1.5 text-gray-500 hover:text-green-600 hover:bg-green-50 rounded-full transition-colors"
                title="Refresh Data"
            >
                <RefreshCw size={18} />
            </button>
        </div>
      </div>

      {/* Stats Filters */}
      <div className="flex space-x-2 overflow-x-auto pb-2 scrollbar-hide">
        {['all', 'pending', 'processing', 'shipped', 'delivered', 'cancelled'].map((status) => (
          <button
            key={status}
            onClick={() => setActiveFilter(status as any)}
            className={`px-4 py-2 rounded-full text-sm font-medium capitalize whitespace-nowrap transition-colors ${
              activeFilter === status 
                ? 'bg-green-600 text-white shadow-md' 
                : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
            }`}
          >
            {status}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden min-h-[400px]">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Payment</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredOrders.length > 0 ? (
                filteredOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-green-600">#{order.id}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex flex-col">
                        <span className="text-sm font-medium text-gray-900">{order.customer}</span>
                        <span className="text-xs text-gray-500">{order.email}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{order.date}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(order.status)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{CURRENCY}{order.total.toFixed(2)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 uppercase">{order.paymentMethod}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-2">
                        <button 
                          onClick={() => handleViewOrder(order)}
                          className="text-gray-400 hover:text-green-600 p-1" 
                          title="View Details"
                        >
                          <Eye size={18} />
                        </button>
                        <button 
                          onClick={() => {
                            setSelectedOrder(order);
                            setTimeout(handlePrintInvoice, 100);
                          }}
                          className="text-gray-400 hover:text-gray-600 p-1" 
                          title="Download Invoice"
                        >
                          <Download size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="px-6 py-20 text-center text-gray-500">
                    <div className="flex flex-col items-center justify-center">
                      <Inbox size={48} className="text-gray-300 mb-4" />
                      <p className="text-lg font-medium text-gray-900">No orders found</p>
                      <p className="text-sm text-gray-500 mt-1">
                          {activeFilter === 'all' 
                            ? "No orders have been placed yet." 
                            : `There are no orders with status: ${activeFilter}`}
                      </p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Order Detail Modal */}
      {isModalOpen && selectedOrder && (
        <div className="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:p-0">
            <div className="fixed inset-0 bg-gray-900 bg-opacity-75 transition-opacity backdrop-blur-sm" onClick={handleCloseModal}></div>

            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-3xl w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="flex justify-between items-start mb-6 border-b border-gray-100 pb-4">
                  <div>
                    <h3 className="text-xl leading-6 font-bold text-gray-900" id="modal-title">
                      Order #{selectedOrder.id}
                    </h3>
                    <p className="text-sm text-gray-500 mt-1">{selectedOrder.date}</p>
                  </div>
                  <button onClick={handleCloseModal} className="text-gray-400 hover:text-red-500 bg-gray-100 hover:bg-red-50 p-2 rounded-full transition-colors">
                    <X size={20} />
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-6">
                   {/* Customer Info */}
                   <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                      <h4 className="font-bold text-gray-700 mb-3 flex items-center"><User size={16} className="mr-2"/> Customer Details</h4>
                      <p className="text-sm font-medium">{selectedOrder.customer}</p>
                      <p className="text-sm text-gray-500">{selectedOrder.email}</p>
                      <p className="text-sm text-gray-500 mt-1">{selectedOrder.shippingAddress?.phone}</p>
                   </div>
                   
                   {/* Shipping Info */}
                   <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                      <h4 className="font-bold text-gray-700 mb-3 flex items-center"><MapPin size={16} className="mr-2"/> Shipping Address</h4>
                      <p className="text-sm text-gray-600">{selectedOrder.shippingAddress?.address}</p>
                      <p className="text-sm text-gray-600">{selectedOrder.shippingAddress?.city}</p>
                      {selectedOrder.shippingAddress?.note && (
                        <p className="text-xs text-yellow-600 mt-2 bg-yellow-50 p-2 rounded border border-yellow-100">
                           Note: {selectedOrder.shippingAddress.note}
                        </p>
                      )}
                   </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-6">
                    {/* Payment Info */}
                   <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                      <h4 className="font-bold text-blue-800 mb-3 flex items-center"><CreditCard size={16} className="mr-2"/> Payment Info</h4>
                      <div className="flex justify-between text-sm mb-1">
                          <span className="text-gray-600">Method:</span>
                          <span className="font-medium uppercase">{selectedOrder.paymentMethod}</span>
                      </div>
                      {selectedOrder.transactionId && (
                          <div className="flex justify-between text-sm mb-1">
                              <span className="text-gray-600">TrxID:</span>
                              <span className="font-mono bg-white px-1 rounded border">{selectedOrder.transactionId}</span>
                          </div>
                      )}
                       {selectedOrder.senderNumber && (
                          <div className="flex justify-between text-sm mb-1">
                              <span className="text-gray-600">Sender:</span>
                              <span className="font-medium">{selectedOrder.senderNumber}</span>
                          </div>
                      )}
                      <div className="flex justify-between text-sm mt-2 pt-2 border-t border-blue-200">
                          <span className="font-bold text-gray-800">Total Amount:</span>
                          <span className="font-bold text-green-600 text-lg">{CURRENCY}{selectedOrder.total}</span>
                      </div>
                   </div>

                   {/* Status Control */}
                   <div className="bg-white p-4 rounded-lg border-2 border-green-100">
                      <h4 className="font-bold text-gray-800 mb-3">Update Status</h4>
                      <div className="space-y-2">
                          <select 
                            value={selectedOrder.status}
                            onChange={(e) => handleStatusChange(e.target.value as OrderStatus)}
                            disabled={updatingStatus}
                            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500"
                          >
                             <option value="pending">Pending</option>
                             <option value="processing">Processing</option>
                             <option value="shipped">Shipped</option>
                             <option value="delivered">Delivered</option>
                             <option value="cancelled">Cancelled</option>
                          </select>
                          <p className="text-xs text-gray-500">
                             Changing status will update the database instantly.
                          </p>
                          {updatingStatus && <p className="text-xs text-green-600 font-medium animate-pulse">Updating...</p>}
                      </div>
                   </div>
                </div>

              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  onClick={handlePrintInvoice}
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-green-600 text-base font-medium text-white hover:bg-green-700 focus:outline-none sm:ml-3 sm:w-auto sm:text-sm items-center"
                >
                  <Printer size={16} className="mr-2" /> Print Invoice
                </button>
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminOrders;