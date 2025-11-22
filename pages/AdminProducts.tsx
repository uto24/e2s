import React, { useState } from 'react';
import { Edit, Trash2, Plus, Search, Filter, X, Image as ImageIcon, DollarSign, Truck, CreditCard } from 'lucide-react';
import { useShop } from '../services/store';
import { CURRENCY } from '../constants';
import { Product } from '../types';

const AdminProducts: React.FC = () => {
  const { products, addProduct, deleteProduct } = useShop();
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Form State
  const [formData, setFormData] = useState({
    title: '',
    price: '',
    wholesalePrice: '',
    category: '',
    images: '', // Changed from image to images (string for textarea)
    stock: '',
    description: '',
    sizes: '',
    colors: '',
    shippingInside: '60',
    shippingOutside: '120',
    isCodAvailable: true
  });

  const filteredProducts = products.filter(product => 
    product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const sellingPrice = parseFloat(formData.price) || 0;
    const wholesalePrice = parseFloat(formData.wholesalePrice) || sellingPrice;
    
    // Process Images
    const imageList = formData.images
      .split(',')
      .map(url => url.trim())
      .filter(url => url !== '');
      
    const mainImage = imageList.length > 0 ? imageList[0] : 'https://images.unsplash.com/photo-1553456558-aff63285bdd1?auto=format&fit=crop&w=800&q=80';

    const newProduct: Product = {
      id: Math.random().toString(36).substr(2, 9),
      slug: formData.title.toLowerCase().replace(/ /g, '-'),
      title: formData.title,
      description: formData.description || 'No description provided.',
      price: sellingPrice,
      wholesalePrice: wholesalePrice,
      category: formData.category || 'General',
      image: mainImage,
      images: imageList,
      rating: 0,
      reviews_count: 0,
      stock: parseInt(formData.stock) || 0,
      status: 'active',
      sizes: formData.sizes ? formData.sizes.split(',').map(s => s.trim()).filter(s => s !== '') : [],
      colors: formData.colors ? formData.colors.split(',').map(c => c.trim()).filter(c => c !== '') : [],
      shippingFees: {
        inside: parseFloat(formData.shippingInside) || 0,
        outside: parseFloat(formData.shippingOutside) || 0
      },
      isCodAvailable: formData.isCodAvailable
    };

    addProduct(newProduct);
    setIsModalOpen(false);
    setFormData({
      title: '',
      price: '',
      wholesalePrice: '',
      category: '',
      images: '',
      stock: '',
      description: '',
      sizes: '',
      colors: '',
      shippingInside: '60',
      shippingOutside: '120',
      isCodAvailable: true
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl font-bold text-gray-900">Products</h1>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 shadow-sm transition-colors"
        >
          <Plus size={20} className="mr-2" />
          Add Product
        </button>
      </div>

      {products.length === 0 && (
        <div className="bg-blue-50 text-blue-700 p-4 rounded-md border border-blue-200">
          No products found. Click "Add Product" to create your first item.
        </div>
      )}

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        {/* Toolbar */}
        <div className="p-4 border-b border-gray-200 flex flex-col sm:flex-row gap-4 justify-between items-center bg-gray-50">
          <div className="relative w-full sm:w-96">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search size={18} className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search products..."
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-green-500 sm:text-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex items-center space-x-2">
            <button className="flex items-center px-3 py-2 border border-gray-300 rounded-md bg-white text-gray-700 text-sm hover:bg-gray-50">
              <Filter size={16} className="mr-2" /> Filter
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Product
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Category
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Pricing
                </th>
                 <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Shipping
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Stock
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th scope="col" className="relative px-6 py-3">
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredProducts.map((product) => (
                <tr key={product.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="h-10 w-10 flex-shrink-0">
                        <img className="h-10 w-10 rounded-lg object-cover border border-gray-200" src={product.image} alt="" />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{product.title}</div>
                        <div className="text-xs text-gray-500">SKU: {product.id.toUpperCase()}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {product.category}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <div className="flex flex-col">
                      <span className="text-gray-900 font-medium">Sell: {CURRENCY}{product.price}</span>
                      <span className="text-gray-500 text-xs">Wholesale: {CURRENCY}{product.wholesalePrice}</span>
                    </div>
                  </td>
                   <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div className="flex flex-col text-xs">
                       <span>In: {CURRENCY}{product.shippingFees?.inside}</span>
                       <span>Out: {CURRENCY}{product.shippingFees?.outside}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className={`h-2.5 w-2.5 rounded-full mr-2 ${product.stock > 10 ? 'bg-green-500' : product.stock > 0 ? 'bg-yellow-500' : 'bg-red-500'}`}></div>
                      <span className="text-sm text-gray-900">{product.stock}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                     <div className="flex flex-col space-y-1">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full w-fit ${product.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                        {product.status.toUpperCase()}
                      </span>
                      {!product.isCodAvailable && <span className="text-xs text-red-500 font-semibold">NO COD</span>}
                     </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end space-x-2">
                      <button className="text-blue-600 hover:text-blue-900 p-1 rounded-full hover:bg-blue-50">
                        <Edit size={18} />
                      </button>
                      <button 
                        onClick={() => deleteProduct(product.id)}
                        className="text-red-600 hover:text-red-900 p-1 rounded-full hover:bg-red-50"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Product Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 bg-gray-900 bg-opacity-75 transition-opacity backdrop-blur-sm" aria-hidden="true" onClick={() => setIsModalOpen(false)}></div>
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg leading-6 font-bold text-gray-900" id="modal-title">Add New Product</h3>
                  <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-red-500 transition-colors">
                    <X size={24} />
                  </button>
                </div>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Title</label>
                    <input 
                      type="text" 
                      name="title" 
                      required
                      value={formData.title}
                      onChange={handleInputChange}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-gray-50 p-3 rounded-lg border border-gray-100">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 flex items-center"><DollarSign size={14} className="mr-1"/> Selling Price</label>
                      <input 
                        type="number" 
                        name="price" 
                        required
                        value={formData.price}
                        onChange={handleInputChange}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 flex items-center"><DollarSign size={14} className="mr-1"/> Wholesale Price</label>
                      <input 
                        type="number" 
                        name="wholesalePrice" 
                        value={formData.wholesalePrice}
                        onChange={handleInputChange}
                        placeholder="Cost for affiliates"
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Stock</label>
                      <input 
                        type="number" 
                        name="stock" 
                        required
                        value={formData.stock}
                        onChange={handleInputChange}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-blue-50 p-3 rounded-lg border border-blue-100">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 flex items-center"><Truck size={14} className="mr-1"/> Shipping (Inside)</label>
                      <input 
                        type="number" 
                        name="shippingInside" 
                        value={formData.shippingInside}
                        onChange={handleInputChange}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                      />
                    </div>
                     <div>
                      <label className="block text-sm font-medium text-gray-700 flex items-center"><Truck size={14} className="mr-1"/> Shipping (Outside)</label>
                      <input 
                        type="number" 
                        name="shippingOutside" 
                        value={formData.shippingOutside}
                        onChange={handleInputChange}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                      />
                    </div>
                     <div className="flex items-center pt-6">
                      <input
                        id="isCodAvailable"
                        name="isCodAvailable"
                        type="checkbox"
                        checked={formData.isCodAvailable}
                        onChange={handleInputChange}
                        className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                      />
                      <label htmlFor="isCodAvailable" className="ml-2 block text-sm font-medium text-gray-700">
                         Allow COD?
                      </label>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Category</label>
                    <select 
                      name="category" 
                      value={formData.category}
                      onChange={handleInputChange}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                    >
                      <option value="">Select Category</option>
                      <option value="Electronics">Electronics</option>
                      <option value="Fashion">Fashion</option>
                      <option value="Home">Home</option>
                      <option value="Beauty">Beauty</option>
                    </select>
                  </div>
                  
                  {/* Variants */}
                   <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Sizes (Comma separated)</label>
                      <input 
                        type="text" 
                        name="sizes" 
                        value={formData.sizes}
                        onChange={handleInputChange}
                        placeholder="S, M, L, XL"
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Colors (Comma separated)</label>
                      <input 
                        type="text" 
                        name="colors" 
                        value={formData.colors}
                        onChange={handleInputChange}
                        placeholder="Red, Blue, Black"
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Images (Comma separated URLs)</label>
                    <div className="mt-1">
                      <textarea 
                        name="images" 
                        value={formData.images}
                        onChange={handleInputChange}
                        placeholder="https://example.com/img1.jpg, https://example.com/img2.jpg"
                        rows={3}
                        className="block w-full px-3 py-2 rounded-md border border-gray-300 focus:ring-green-500 focus:border-green-500 sm:text-sm"
                      />
                      <p className="mt-1 text-xs text-gray-500">Add multiple image links separated by commas.</p>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Description</label>
                    <textarea 
                      name="description" 
                      rows={4} 
                      value={formData.description}
                      onChange={handleInputChange}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                    ></textarea>
                  </div>
                  <div className="mt-5 sm:mt-6">
                    <button
                      type="submit"
                      className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-green-600 text-base font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 sm:text-sm"
                    >
                      Save Product
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminProducts;