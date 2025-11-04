import React, { useState, useEffect, useCallback } from 'react';
import offersService from '../../../services/offersService';
import categoryService from '../../../services/categoryService';
import productService from '../../../services/productService';
import useAutoRefresh from '../../../hooks/useAutoRefresh';

const OffersManagement = () => {
  const [offers, setOffers] = useState([]);
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingOffer, setEditingOffer] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    code: '',
    discountType: 'percentage',
    discountValue: 0,
    minOrderValue: 0,
    maxDiscountAmount: 0,
    image: '',
    status: 'active',
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    usageLimit: 100,
    applicableCategories: 'all',
    applicableProducts: 'all',
    applicationType: 'all', // 'all', 'categories', 'products'
    type: 'general'
  });
  const [imageUploadType, setImageUploadType] = useState('url');
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [categorySearchTerm, setCategorySearchTerm] = useState('');
  const [productSearchTerm, setProductSearchTerm] = useState('');

  // Filter categories based on search
  const filteredCategories = categories.filter(cat =>
    cat.name.toLowerCase().includes(categorySearchTerm.toLowerCase())
  );

  // Filter products based on search AND selected categories
  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(productSearchTerm.toLowerCase());
    
    // If no categories selected, show all products (that match search)
    if (selectedCategories.length === 0) {
      return matchesSearch;
    }
    
    // If categories selected, only show products from those categories
    const productCategoryId = String(product.category_id || product.categoryId);
    const isInSelectedCategory = selectedCategories.includes(productCategoryId);
    
    return matchesSearch && isInSelectedCategory;
  });

  const loadOffers = useCallback(async () => {
    try {
      const allOffers = await offersService.getAllOffers();
      setOffers(Array.isArray(allOffers) ? allOffers : []);
    } catch (error) {
      console.error('Error loading offers:', error);
      setOffers([]);
    }
  }, []);

  const loadCategories = useCallback(async () => {
    try {
      const response = await categoryService.getAllCategories();
      const allCategories = response.categories || response || [];
      setCategories(Array.isArray(allCategories) ? allCategories : []);
    } catch (error) {
      console.error('Error loading categories:', error);
      setCategories([]);
    }
  }, []);

  const loadProducts = useCallback(async () => {
    try {
      console.log('🛒 Loading products...');
      const response = await productService.getAllProducts();
      console.log('🛒 Products response:', response);
      const allProducts = response.products || response || [];
      console.log('🛒 Processed products:', allProducts.length, 'items');
      setProducts(Array.isArray(allProducts) ? allProducts : []);
    } catch (error) {
      console.error('❌ Error loading products:', error);
      setProducts([]);
    }
  }, []);

  // Load all data function
  const loadAllData = useCallback(async () => {
    console.log('🔄 Refreshing offers data...');
    await Promise.all([loadOffers(), loadCategories(), loadProducts()]);
  }, [loadOffers, loadCategories, loadProducts]);

  // Enable auto-refresh every 20 seconds
  useAutoRefresh(loadAllData, 20000, true);

  // Load data on mount
  useEffect(() => {
    loadAllData();
  }, [loadAllData]);

  const handleInputChange = (e) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? parseFloat(value) || 0 : value
    }));
  };

  const handleApplicationTypeChange = (type) => {
    setFormData(prev => ({
      ...prev,
      applicationType: type,
      applicableCategories: 'all',
      applicableProducts: 'all'
    }));
    setSelectedCategories([]);
    setSelectedProducts([]);
  };

  const handleCategoryCheckbox = (categoryId) => {
    let newSelected = [...selectedCategories];
    if (newSelected.includes(categoryId)) {
      newSelected = newSelected.filter(id => id !== categoryId);
    } else {
      newSelected.push(categoryId);
    }
    setSelectedCategories(newSelected);
    setFormData(prev => ({
      ...prev,
      applicableCategories: newSelected.length > 0 ? newSelected.join(',') : 'all'
    }));
  };

  const handleSelectAllCategories = (e) => {
    if (e.target.checked) {
      // Use filteredCategories instead of all categories
      const allCategoryIds = filteredCategories.map(cat => String(cat.id));
      setSelectedCategories(allCategoryIds);
      setFormData(prev => ({
        ...prev,
        applicableCategories: allCategoryIds.join(',')
      }));
    } else {
      setSelectedCategories([]);
      setFormData(prev => ({
        ...prev,
        applicableCategories: 'all'
      }));
    }
  };

  const handleProductCheckbox = (productId) => {
    let newSelected = [...selectedProducts];
    if (newSelected.includes(productId)) {
      newSelected = newSelected.filter(id => id !== productId);
    } else {
      newSelected.push(productId);
    }
    setSelectedProducts(newSelected);
    setFormData(prev => ({
      ...prev,
      applicableProducts: newSelected.length > 0 ? newSelected.join(',') : 'all'
    }));
  };

  const handleSelectAllProducts = (e) => {
    if (e.target.checked) {
      // Use filteredProducts instead of all products
      const allProductIds = filteredProducts.map(prod => String(prod.id));
      setSelectedProducts(allProductIds);
      setFormData(prev => ({
        ...prev,
        applicableProducts: allProductIds.join(',')
      }));
    } else {
      setSelectedProducts([]);
      setFormData(prev => ({
        ...prev,
        applicableProducts: 'all'
      }));
    }
  };

  const handleCategorySelect = (e) => {
    const selectedOptions = Array.from(e.target.selectedOptions, option => option.value);
    setSelectedCategories(selectedOptions);
    setFormData(prev => ({
      ...prev,
      applicableCategories: selectedOptions.length > 0 ? selectedOptions.join(',') : 'all'
    }));
  };

  const handleProductSelect = (e) => {
    const selectedOptions = Array.from(e.target.selectedOptions, option => option.value);
    setSelectedProducts(selectedOptions);
    setFormData(prev => ({
      ...prev,
      applicableProducts: selectedOptions.length > 0 ? selectedOptions.join(',') : 'all'
    }));
  };

  const generateCouponCode = () => {
    const prefixes = ['SAVE', 'GET', 'DEAL', 'OFFER', 'SALE', 'PROMO'];
    const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
    const number = Math.floor(Math.random() * 90) + 10;
    const code = `${prefix}${number}`;
    setFormData(prev => ({ ...prev, code: code }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setFormData(prev => ({
          ...prev,
          image: e.target.result
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      code: '',
      discountType: 'percentage',
      discountValue: 0,
      minOrderValue: 0,
      maxDiscountAmount: 0,
      image: '',
      status: 'active',
      startDate: new Date().toISOString().split('T')[0],
      endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      usageLimit: 100,
      applicableCategories: 'all',
      applicableProducts: 'all',
      applicationType: 'all',
      type: 'general'
    });
    setSelectedCategories([]);
    setSelectedProducts([]);
  };

  const handleAddOffer = async (e) => {
    e.preventDefault();
    try {
      if (!formData.title.trim() || !formData.code.trim()) {
        alert('Title and code are required');
        return;
      }
      
      // Prepare data for API with correct field names
      const offerData = {
        title: formData.title,
        description: formData.description,
        code: formData.code.toUpperCase(),
        discount_type: formData.discountType,
        discount_value: parseFloat(formData.discountValue),
        min_order_value: parseFloat(formData.minOrderValue) || 0,
        max_discount_amount: parseFloat(formData.maxDiscountAmount) || null,
        image_url: formData.image || '',
        status: formData.status,
        start_date: formData.startDate,
        end_date: formData.endDate,
        usage_limit: parseInt(formData.usageLimit) || 100,
        offer_type: formData.type,
        applicable_categories: formData.applicationType === 'categories' ? formData.applicableCategories : 'all',
        applicable_products: formData.applicationType === 'products' ? formData.applicableProducts : 'all'
      };

      await offersService.createOffer(offerData);
      alert('Offer created successfully!');
      resetForm();
      setShowAddModal(false);
      loadOffers();
    } catch (error) {
      console.error('Error creating offer:', error);
      alert('Failed to create offer: ' + error.message);
    }
  };

  const handleEditOffer = (offer) => {
    setEditingOffer(offer);
    
    // Parse applicable categories
    let applicationType = 'all';
    let categories = 'all';
    let products = 'all';
    let selectedCats = [];
    let selectedProds = [];

    if (offer.applicable_categories && offer.applicable_categories !== 'all') {
      applicationType = 'categories';
      categories = offer.applicable_categories;
      selectedCats = offer.applicable_categories.split(',').map(c => c.trim());
    }

    if (offer.applicable_products && offer.applicable_products !== 'all') {
      applicationType = 'products';
      products = offer.applicable_products;
      selectedProds = offer.applicable_products.split(',').map(p => p.trim());
    }
    
    setFormData({
      title: offer.title || '',
      description: offer.description || '',
      code: offer.code || '',
      discountType: offer.discount_type || 'percentage',
      discountValue: offer.discount_value || 0,
      minOrderValue: offer.min_order_value || 0,
      maxDiscountAmount: offer.max_discount_amount || 0,
      image: offer.image_url || '',
      status: offer.status || 'active',
      startDate: offer.start_date || new Date().toISOString().split('T')[0],
      endDate: offer.end_date || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      usageLimit: offer.usage_limit || 100,
      applicableCategories: categories,
      applicableProducts: products,
      applicationType: applicationType,
      type: offer.offer_type || 'general'
    });
    setSelectedCategories(selectedCats);
    setSelectedProducts(selectedProds);
    setShowEditModal(true);
  };

  const handleUpdateOffer = async (e) => {
    e.preventDefault();
    try {
      if (!formData.title.trim() || !formData.code.trim()) {
        alert('Title and code are required');
        return;
      }
      
      // Prepare data for API with correct field names
      const offerData = {
        title: formData.title,
        description: formData.description,
        code: formData.code.toUpperCase(),
        discount_type: formData.discountType,
        discount_value: parseFloat(formData.discountValue),
        min_order_value: parseFloat(formData.minOrderValue) || 0,
        max_discount_amount: parseFloat(formData.maxDiscountAmount) || null,
        image_url: formData.image || '',
        status: formData.status,
        start_date: formData.startDate,
        end_date: formData.endDate,
        usage_limit: parseInt(formData.usageLimit) || 100,
        offer_type: formData.type,
        applicable_categories: formData.applicationType === 'categories' ? formData.applicableCategories : 'all',
        applicable_products: formData.applicationType === 'products' ? formData.applicableProducts : 'all'
      };

      await offersService.updateOffer(editingOffer.id, offerData);
      alert('Offer updated successfully!');
      resetForm();
      setShowEditModal(false);
      setEditingOffer(null);
      loadOffers();
    } catch (error) {
      console.error('Error updating offer:', error);
      alert('Failed to update offer: ' + error.message);
    }
  };

  const handleDeleteOffer = async (offerId) => {
    if (window.confirm('Are you sure you want to delete this offer?')) {
      try {
        await offersService.deleteOffer(offerId);
        alert('Offer deleted successfully!');
        loadOffers();
      } catch (error) {
        console.error('Error deleting offer:', error);
        alert('Failed to delete offer: ' + error.message);
      }
    }
  };

  const toggleOfferStatus = async (offerId) => {
    const offer = offers.find(o => o.id === offerId);
    const newStatus = offer.status === 'active' ? 'inactive' : 'active';
    try {
      await offersService.updateOffer(offerId, { status: newStatus });
      loadOffers();
    } catch (error) {
      console.error('Error updating offer status:', error);
      alert('Failed to update offer status: ' + error.message);
    }
  };

  const getDiscountTypeColor = (type) => {
    switch (type) {
      case 'percentage': return 'bg-success';
      case 'fixed': return 'bg-warning';
      case 'free_delivery': return 'bg-info';
      default: return 'bg-secondary';
    }
  };

  const getOfferTypeColor = (type) => {
    switch (type) {
      case 'first_order': return 'bg-primary';
      case 'category_specific': return 'bg-warning';
      case 'weekend_special': return 'bg-info';
      case 'delivery_offer': return 'bg-success';
      default: return 'bg-secondary';
    }
  };

  const isExpired = (endDate) => {
    return new Date(endDate) < new Date();
  };

  const isUpcoming = (startDate) => {
    return new Date(startDate) > new Date();
  };

  const getUsagePercentage = (used, limit) => {
    return Math.round((used / limit) * 100);
  };

  return (
    <div className="container-fluid">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2>Offers Management</h2>
          <p className="text-muted">Manage discount codes and promotional offers</p>
        </div>
        <button 
          className="btn btn-warning"
          onClick={() => setShowAddModal(true)}
        >
          <i className="fas fa-plus me-2"></i>Add Offer
        </button>
      </div>
      
      <div className="row">
        <div className="col-12">
          <div className="card">
            <div className="card-body">
              <div className="table-responsive">
                <table className="table table-hover">
                  <thead>
                    <tr>
                      <th>Offer Details</th>
                      <th>Code</th>
                      <th>Discount</th>
                      <th>Usage</th>
                      <th>Duration</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {offers.map(offer => (
                      <tr key={offer.id}>
                        <td>
                          <div className="d-flex align-items-center">
                            {offer.image_url ? (
                              <img 
                                src={offer.image_url} 
                                alt={offer.title}
                                style={{ width: '40px', height: '40px', objectFit: 'cover', borderRadius: '8px' }}
                                className="me-3"
                                onError={(e) => {
                                  e.target.onerror = null;
                                  e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="40" height="40"%3E%3Crect width="40" height="40" fill="%23ffe01b"/%3E%3Ctext x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle" font-size="20" fill="%23000"%3E%F0%9F%8E%81%3C/text%3E%3C/svg%3E';
                                }}
                              />
                            ) : (
                              <div 
                                className="me-3 d-flex align-items-center justify-content-center"
                                style={{ 
                                  width: '40px', 
                                  height: '40px', 
                                  backgroundColor: '#ffe01b', 
                                  borderRadius: '8px',
                                  fontSize: '20px'
                                }}
                              >
                                🎁
                              </div>
                            )}
                            <div>
                              <div className="fw-bold">{offer.title}</div>
                              <div className="text-muted small">{offer.description}</div>
                              <span className={`badge ${getOfferTypeColor(offer.type || 'general')} mt-1`}>
                                {(offer.type || 'general').replace('_', ' ')}
                              </span>
                            </div>
                          </div>
                        </td>
                        <td>
                          <span className="badge bg-dark fs-6">{offer.code}</span>
                        </td>
                        <td>
                          <div>
                            <span className={`badge ${getDiscountTypeColor(offer.discount_type || offer.discountType || 'percentage')}`}>
                              {(offer.discount_type || offer.discountType || 'percentage') === 'percentage' 
                                ? `${offer.discount_value || offer.discountValue || 0}% OFF`
                                : (offer.discount_type || offer.discountType || 'percentage') === 'fixed'
                                ? `₹${offer.discount_value || offer.discountValue || 0} OFF`
                                : 'FREE DELIVERY'
                              }
                            </span>
                            <div className="small text-muted">
                              Min: ₹{offer.min_order_value || offer.minOrderValue || 0} | Max: ₹{offer.max_discount_amount || offer.maxDiscountAmount || 0}
                            </div>
                          </div>
                        </td>
                        <td>
                          <div>
                            <div className="small">
                              {offer.used_count || offer.usedCount || 0} / {offer.usage_limit || offer.usageLimit || 0}
                            </div>
                            <div className="progress" style={{ height: '5px' }}>
                              <div 
                                className={`progress-bar ${getUsagePercentage(offer.used_count || offer.usedCount, offer.usage_limit || offer.usageLimit) > 80 ? 'bg-danger' : 'bg-success'}`}
                                style={{ width: `${getUsagePercentage(offer.used_count || offer.usedCount, offer.usage_limit || offer.usageLimit)}%` }}
                              ></div>
                            </div>
                          </div>
                        </td>
                        <td>
                          <div className="small">
                            <div>Start: {new Date(offer.start_date || offer.startDate).toLocaleDateString('en-IN')}</div>
                            <div>End: {new Date(offer.end_date || offer.endDate).toLocaleDateString('en-IN')}</div>
                            {isExpired(offer.end_date || offer.endDate) && <span className="badge bg-danger ms-1">Expired</span>}
                            {isUpcoming(offer.start_date || offer.startDate) && <span className="badge bg-info ms-1">Upcoming</span>}
                          </div>
                        </td>
                        <td>
                          <span 
                            className={`badge ${offer.status === 'active' ? 'bg-success' : 'bg-secondary'}`}
                            style={{ cursor: 'pointer' }}
                            onClick={() => toggleOfferStatus(offer.id)}
                          >
                            {offer.status === 'active' ? 'Active' : 'Inactive'}
                          </span>
                        </td>
                        <td>
                          <div className="btn-group">
                            <button 
                              className="btn btn-sm btn-outline-primary"
                              onClick={() => handleEditOffer(offer)}
                            >
                              <i className="fas fa-edit"></i>
                            </button>
                            <button 
                              className="btn btn-sm btn-outline-danger"
                              onClick={() => handleDeleteOffer(offer.id)}
                            >
                              <i className="fas fa-trash"></i>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                    {offers.length === 0 && (
                      <tr>
                        <td colSpan="7" className="text-center py-4">
                          <div className="text-muted">
                            <i className="fas fa-tags fa-3x mb-3"></i>
                            <p>No offers found. Add your first offer!</p>
                          </div>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Add Offer Modal */}
      {showAddModal && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-xl">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Add New Offer</h5>
                <button 
                  type="button" 
                  className="btn-close"
                  onClick={() => setShowAddModal(false)}
                ></button>
              </div>
              <form onSubmit={handleAddOffer}>
                <div className="modal-body">
                  <div className="row">
                    <div className="col-md-6">
                      <div className="mb-3">
                        <label className="form-label">Offer Title</label>
                        <input
                          type="text"
                          className="form-control"
                          name="title"
                          value={formData.title}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                      
                      <div className="mb-3">
                        <label className="form-label">Description</label>
                        <textarea
                          className="form-control"
                          name="description"
                          rows="3"
                          value={formData.description}
                          onChange={handleInputChange}
                        />
                      </div>

                      <div className="mb-3">
                        <label className="form-label">Offer Code</label>
                        <div className="input-group">
                          <input
                            type="text"
                            className="form-control"
                            name="code"
                            value={formData.code}
                            onChange={handleInputChange}
                            placeholder="e.g., SAVE50, WELCOME15"
                            style={{ textTransform: 'uppercase' }}
                            required
                          />
                          <button 
                            type="button" 
                            className="btn btn-outline-warning"
                            onClick={generateCouponCode}
                            title="Auto-generate coupon code"
                          >
                            <i className="fas fa-magic me-1"></i>Generate
                          </button>
                        </div>
                        <small className="text-muted">Enter a code or click Generate for a random one</small>
                      </div>

                      <div className="row">
                        <div className="col-md-6">
                          <div className="mb-3">
                            <label className="form-label">Discount Type</label>
                            <select
                              className="form-control"
                              name="discountType"
                              value={formData.discountType}
                              onChange={handleInputChange}
                            >
                              <option value="percentage">Percentage</option>
                              <option value="fixed">Fixed Amount</option>
                              <option value="free_delivery">Free Delivery</option>
                            </select>
                          </div>
                        </div>
                        <div className="col-md-6">
                          <div className="mb-3">
                            <label className="form-label">
                              {formData.discountType === 'percentage' ? 'Discount %' : 'Discount ₹'}
                            </label>
                            <input
                              type="number"
                              className="form-control"
                              name="discountValue"
                              value={formData.discountValue}
                              onChange={handleInputChange}
                              min="0"
                              disabled={formData.discountType === 'free_delivery'}
                            />
                          </div>
                        </div>
                      </div>

                      <div className="row">
                        <div className="col-md-6">
                          <div className="mb-3">
                            <label className="form-label">Min Order Value</label>
                            <input
                              type="number"
                              className="form-control"
                              name="minOrderValue"
                              value={formData.minOrderValue}
                              onChange={handleInputChange}
                              min="0"
                            />
                          </div>
                        </div>
                        <div className="col-md-6">
                          <div className="mb-3">
                            <label className="form-label">Max Discount Amount</label>
                            <input
                              type="number"
                              className="form-control"
                              name="maxDiscountAmount"
                              value={formData.maxDiscountAmount}
                              onChange={handleInputChange}
                              min="0"
                            />
                          </div>
                        </div>
                      </div>

                      <div className="mb-3">
                        <label className="form-label">Usage Limit</label>
                        <input
                          type="number"
                          className="form-control"
                          name="usageLimit"
                          value={formData.usageLimit}
                          onChange={handleInputChange}
                          min="1"
                        />
                      </div>
                    </div>

                    <div className="col-md-6">
                      <div className="mb-3">
                        <label className="form-label">Offer Type</label>
                        <select
                          className="form-control"
                          name="type"
                          value={formData.type}
                          onChange={handleInputChange}
                        >
                          <option value="general">General</option>
                          <option value="first_order">First Order</option>
                          <option value="category_specific">Category Specific</option>
                          <option value="weekend_special">Weekend Special</option>
                          <option value="delivery_offer">Delivery Offer</option>
                        </select>
                      </div>

                      <div className="mb-3">
                        <label className="form-label">Image Upload Type</label>
                        <div className="btn-group w-100" role="group">
                          <input 
                            type="radio" 
                            className="btn-check" 
                            name="uploadType" 
                            id="offer-url-type"
                            checked={imageUploadType === 'url'}
                            onChange={() => setImageUploadType('url')}
                          />
                          <label className="btn btn-outline-primary" htmlFor="offer-url-type">Image URL</label>
                          
                          <input 
                            type="radio" 
                            className="btn-check" 
                            name="uploadType" 
                            id="offer-upload-type"
                            checked={imageUploadType === 'upload'}
                            onChange={() => setImageUploadType('upload')}
                          />
                          <label className="btn btn-outline-primary" htmlFor="offer-upload-type">Upload File</label>
                        </div>
                      </div>

                      {imageUploadType === 'url' ? (
                        <div className="mb-3">
                          <label className="form-label">Image URL</label>
                          <input
                            type="url"
                            className="form-control"
                            name="image"
                            value={formData.image}
                            onChange={handleInputChange}
                            placeholder="https://example.com/offer.jpg"
                          />
                        </div>
                      ) : (
                        <div className="mb-3">
                          <label className="form-label">Upload Image</label>
                          <input
                            type="file"
                            className="form-control"
                            accept="image/*"
                            onChange={handleImageChange}
                          />
                        </div>
                      )}

                      <div className="row">
                        <div className="col-md-6">
                          <div className="mb-3">
                            <label className="form-label">Start Date</label>
                            <input
                              type="date"
                              className="form-control"
                              name="startDate"
                              value={formData.startDate}
                              onChange={handleInputChange}
                            />
                          </div>
                        </div>
                        <div className="col-md-6">
                          <div className="mb-3">
                            <label className="form-label">End Date</label>
                            <input
                              type="date"
                              className="form-control"
                              name="endDate"
                              value={formData.endDate}
                              onChange={handleInputChange}
                            />
                          </div>
                        </div>
                      </div>

                      <div className="mb-3">
                        <label className="form-label">Status</label>
                        <select
                          className="form-control"
                          name="status"
                          value={formData.status}
                          onChange={handleInputChange}
                        >
                          <option value="active">Active</option>
                          <option value="inactive">Inactive</option>
                        </select>
                      </div>

                      <div className="mb-3">
                        <label className="form-label">Apply Offer To Categories</label>
                        <input
                          type="text"
                          className="form-control mb-2"
                          placeholder="🔍 Search categories..."
                          value={categorySearchTerm}
                          onChange={(e) => setCategorySearchTerm(e.target.value)}
                        />
                        <div className="border rounded p-3" style={{ maxHeight: '200px', overflowY: 'auto' }}>
                          <div className="form-check mb-2">
                            <input
                              type="checkbox"
                              className="form-check-input"
                              id="select-all-categories"
                              checked={selectedCategories.length === filteredCategories.length && filteredCategories.length > 0}
                              onChange={handleSelectAllCategories}
                            />
                            <label className="form-check-label fw-bold" htmlFor="select-all-categories">
                              <i className="fas fa-check-double me-1"></i>Select All Categories
                            </label>
                          </div>
                          <hr className="my-2" />
                          {filteredCategories.length > 0 ? (
                            filteredCategories.map(category => (
                              <div key={category.id} className="form-check">
                                <input
                                  type="checkbox"
                                  className="form-check-input"
                                  id={`category-${category.id}`}
                                  checked={selectedCategories.includes(String(category.id))}
                                  onChange={() => handleCategoryCheckbox(String(category.id))}
                                />
                                <label className="form-check-label" htmlFor={`category-${category.id}`}>
                                  {category.name}
                                </label>
                              </div>
                            ))
                          ) : (
                            <p className="text-muted mb-0">
                              <i className="fas fa-info-circle me-1"></i>No categories found
                            </p>
                          )}
                        </div>
                        <small className="text-muted">
                          {selectedCategories.length > 0 
                            ? `${selectedCategories.length} category/categories selected` 
                            : 'No categories selected - offer applies to all'}
                        </small>
                      </div>

                      <div className="mb-3">
                        <label className="form-label">Apply Offer To Products</label>
                        {selectedCategories.length > 0 && (
                          <div className="alert alert-info py-2 mb-2">
                            <i className="fas fa-filter me-1"></i>
                            Showing products from {selectedCategories.length} selected {selectedCategories.length === 1 ? 'category' : 'categories'}
                          </div>
                        )}
                        <input
                          type="text"
                          className="form-control mb-2"
                          placeholder="🔍 Search products..."
                          value={productSearchTerm}
                          onChange={(e) => setProductSearchTerm(e.target.value)}
                        />
                        <div className="border rounded p-3" style={{ maxHeight: '250px', overflowY: 'auto' }}>
                          <div className="form-check mb-2">
                            <input
                              type="checkbox"
                              className="form-check-input"
                              id="select-all-products"
                              checked={selectedProducts.length === filteredProducts.length && filteredProducts.length > 0}
                              onChange={handleSelectAllProducts}
                            />
                            <label className="form-check-label fw-bold" htmlFor="select-all-products">
                              <i className="fas fa-check-double me-1"></i>Select All Products
                            </label>
                          </div>
                          <hr className="my-2" />
                          {filteredProducts.length > 0 ? (
                            filteredProducts.map(product => (
                              <div key={product.id} className="form-check">
                                <input
                                  type="checkbox"
                                  className="form-check-input"
                                  id={`product-${product.id}`}
                                  checked={selectedProducts.includes(String(product.id))}
                                  onChange={() => handleProductCheckbox(String(product.id))}
                                />
                                <label className="form-check-label" htmlFor={`product-${product.id}`}>
                                  {product.name} - ₹{product.price}
                                </label>
                              </div>
                            ))
                          ) : (
                            <p className="text-muted mb-0">
                              <i className="fas fa-info-circle me-1"></i>
                              {selectedCategories.length > 0 
                                ? 'No products found in selected categories' 
                                : 'No products available'}
                            </p>
                          )}
                        </div>
                        <small className="text-muted">
                          {selectedProducts.length > 0 
                            ? `${selectedProducts.length} product(s) selected` 
                            : 'No products selected - offer applies to all'}
                        </small>
                      </div>
                    </div>
                  </div>

                  {formData.image && (
                    <div className="mb-3">
                      <label className="form-label">Offer Banner Preview</label>
                      <div>
                        <img 
                          src={formData.image} 
                          alt="Offer Preview"
                          style={{ width: '200px', height: '100px', objectFit: 'cover', borderRadius: '8px' }}
                        />
                      </div>
                    </div>
                  )}
                </div>
                <div className="modal-footer">
                  <button 
                    type="button" 
                    className="btn btn-secondary"
                    onClick={() => setShowAddModal(false)}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-warning">
                    Add Offer
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Edit Offer Modal - Similar structure but with update functionality */}
      {showEditModal && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-xl">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Edit Offer</h5>
                <button 
                  type="button" 
                  className="btn-close"
                  onClick={() => setShowEditModal(false)}
                ></button>
              </div>
              <form onSubmit={handleUpdateOffer}>
                <div className="modal-body">
                  {/* Same form structure as Add Modal */}
                  <div className="row">
                    <div className="col-md-6">
                      <div className="mb-3">
                        <label className="form-label">Offer Title</label>
                        <input
                          type="text"
                          className="form-control"
                          name="title"
                          value={formData.title}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                      
                      <div className="mb-3">
                        <label className="form-label">Description</label>
                        <textarea
                          className="form-control"
                          name="description"
                          rows="3"
                          value={formData.description}
                          onChange={handleInputChange}
                        />
                      </div>

                      <div className="mb-3">
                        <label className="form-label">Offer Code</label>
                        <div className="input-group">
                          <input
                            type="text"
                            className="form-control"
                            name="code"
                            value={formData.code}
                            onChange={handleInputChange}
                            placeholder="e.g., SAVE50, WELCOME15"
                            style={{ textTransform: 'uppercase' }}
                            required
                          />
                          <button 
                            type="button" 
                            className="btn btn-outline-warning"
                            onClick={generateCouponCode}
                            title="Auto-generate coupon code"
                          >
                            <i className="fas fa-magic me-1"></i>Generate
                          </button>
                        </div>
                        <small className="text-muted">Enter a code or click Generate for a random one</small>
                      </div>

                      <div className="row">
                        <div className="col-md-6">
                          <div className="mb-3">
                            <label className="form-label">Discount Type</label>
                            <select
                              className="form-control"
                              name="discountType"
                              value={formData.discountType}
                              onChange={handleInputChange}
                            >
                              <option value="percentage">Percentage</option>
                              <option value="fixed">Fixed Amount</option>
                              <option value="free_delivery">Free Delivery</option>
                            </select>
                          </div>
                        </div>
                        <div className="col-md-6">
                          <div className="mb-3">
                            <label className="form-label">
                              {formData.discountType === 'percentage' ? 'Discount %' : 'Discount ₹'}
                            </label>
                            <input
                              type="number"
                              className="form-control"
                              name="discountValue"
                              value={formData.discountValue}
                              onChange={handleInputChange}
                              min="0"
                              disabled={formData.discountType === 'free_delivery'}
                            />
                          </div>
                        </div>
                      </div>

                      <div className="row">
                        <div className="col-md-6">
                          <div className="mb-3">
                            <label className="form-label">Min Order Value</label>
                            <input
                              type="number"
                              className="form-control"
                              name="minOrderValue"
                              value={formData.minOrderValue}
                              onChange={handleInputChange}
                              min="0"
                            />
                          </div>
                        </div>
                        <div className="col-md-6">
                          <div className="mb-3">
                            <label className="form-label">Max Discount Amount</label>
                            <input
                              type="number"
                              className="form-control"
                              name="maxDiscountAmount"
                              value={formData.maxDiscountAmount}
                              onChange={handleInputChange}
                              min="0"
                            />
                          </div>
                        </div>
                      </div>

                      <div className="mb-3">
                        <label className="form-label">Usage Limit</label>
                        <input
                          type="number"
                          className="form-control"
                          name="usageLimit"
                          value={formData.usageLimit}
                          onChange={handleInputChange}
                          min="1"
                        />
                      </div>
                    </div>

                    <div className="col-md-6">
                      <div className="mb-3">
                        <label className="form-label">Offer Type</label>
                        <select
                          className="form-control"
                          name="type"
                          value={formData.type}
                          onChange={handleInputChange}
                        >
                          <option value="general">General</option>
                          <option value="first_order">First Order</option>
                          <option value="category_specific">Category Specific</option>
                          <option value="weekend_special">Weekend Special</option>
                          <option value="delivery_offer">Delivery Offer</option>
                        </select>
                      </div>

                      <div className="mb-3">
                        <label className="form-label">Image Upload Type</label>
                        <div className="btn-group w-100" role="group">
                          <input 
                            type="radio" 
                            className="btn-check" 
                            name="editUploadType" 
                            id="edit-offer-url-type"
                            checked={imageUploadType === 'url'}
                            onChange={() => setImageUploadType('url')}
                          />
                          <label className="btn btn-outline-primary" htmlFor="edit-offer-url-type">Image URL</label>
                          
                          <input 
                            type="radio" 
                            className="btn-check" 
                            name="editUploadType" 
                            id="edit-offer-upload-type"
                            checked={imageUploadType === 'upload'}
                            onChange={() => setImageUploadType('upload')}
                          />
                          <label className="btn btn-outline-primary" htmlFor="edit-offer-upload-type">Upload File</label>
                        </div>
                      </div>

                      {imageUploadType === 'url' ? (
                        <div className="mb-3">
                          <label className="form-label">Image URL</label>
                          <input
                            type="url"
                            className="form-control"
                            name="image"
                            value={formData.image}
                            onChange={handleInputChange}
                            placeholder="https://example.com/offer.jpg"
                          />
                        </div>
                      ) : (
                        <div className="mb-3">
                          <label className="form-label">Upload Image</label>
                          <input
                            type="file"
                            className="form-control"
                            accept="image/*"
                            onChange={handleImageChange}
                          />
                        </div>
                      )}

                      <div className="row">
                        <div className="col-md-6">
                          <div className="mb-3">
                            <label className="form-label">Start Date</label>
                            <input
                              type="date"
                              className="form-control"
                              name="startDate"
                              value={formData.startDate}
                              onChange={handleInputChange}
                            />
                          </div>
                        </div>
                        <div className="col-md-6">
                          <div className="mb-3">
                            <label className="form-label">End Date</label>
                            <input
                              type="date"
                              className="form-control"
                              name="endDate"
                              value={formData.endDate}
                              onChange={handleInputChange}
                            />
                          </div>
                        </div>
                      </div>

                      <div className="mb-3">
                        <label className="form-label">Status</label>
                        <select
                          className="form-control"
                          name="status"
                          value={formData.status}
                          onChange={handleInputChange}
                        >
                          <option value="active">Active</option>
                          <option value="inactive">Inactive</option>
                        </select>
                      </div>

                      <div className="mb-3">
                        <label className="form-label">Apply Offer To Categories</label>
                        <input
                          type="text"
                          className="form-control mb-2"
                          placeholder="🔍 Search categories..."
                          value={categorySearchTerm}
                          onChange={(e) => setCategorySearchTerm(e.target.value)}
                        />
                        <div className="border rounded p-3" style={{ maxHeight: '200px', overflowY: 'auto' }}>
                          <div className="form-check mb-2">
                            <input
                              type="checkbox"
                              className="form-check-input"
                              id="select-all-categories-edit"
                              checked={selectedCategories.length === filteredCategories.length && filteredCategories.length > 0}
                              onChange={handleSelectAllCategories}
                            />
                            <label className="form-check-label fw-bold" htmlFor="select-all-categories-edit">
                              <i className="fas fa-check-double me-1"></i>Select All Categories
                            </label>
                          </div>
                          <hr className="my-2" />
                          {filteredCategories.length > 0 ? (
                            filteredCategories.map(category => (
                              <div key={category.id} className="form-check">
                                <input
                                  type="checkbox"
                                  className="form-check-input"
                                  id={`category-edit-${category.id}`}
                                  checked={selectedCategories.includes(String(category.id))}
                                  onChange={() => handleCategoryCheckbox(String(category.id))}
                                />
                                <label className="form-check-label" htmlFor={`category-edit-${category.id}`}>
                                  {category.name}
                                </label>
                              </div>
                            ))
                          ) : (
                            <p className="text-muted mb-0">
                              <i className="fas fa-info-circle me-1"></i>No categories found
                            </p>
                          )}
                        </div>
                        <small className="text-muted">
                          {selectedCategories.length > 0 
                            ? `${selectedCategories.length} category/categories selected` 
                            : 'No categories selected - offer applies to all'}
                        </small>
                      </div>

                      <div className="mb-3">
                        <label className="form-label">Apply Offer To Products</label>
                        {selectedCategories.length > 0 && (
                          <div className="alert alert-info py-2 mb-2">
                            <i className="fas fa-filter me-1"></i>
                            Showing products from {selectedCategories.length} selected {selectedCategories.length === 1 ? 'category' : 'categories'}
                          </div>
                        )}
                        <input
                          type="text"
                          className="form-control mb-2"
                          placeholder="🔍 Search products..."
                          value={productSearchTerm}
                          onChange={(e) => setProductSearchTerm(e.target.value)}
                        />
                        <div className="border rounded p-3" style={{ maxHeight: '250px', overflowY: 'auto' }}>
                          <div className="form-check mb-2">
                            <input
                              type="checkbox"
                              className="form-check-input"
                              id="select-all-products-edit"
                              checked={selectedProducts.length === filteredProducts.length && filteredProducts.length > 0}
                              onChange={handleSelectAllProducts}
                            />
                            <label className="form-check-label fw-bold" htmlFor="select-all-products-edit">
                              <i className="fas fa-check-double me-1"></i>Select All Products
                            </label>
                          </div>
                          <hr className="my-2" />
                          {filteredProducts.length > 0 ? (
                            filteredProducts.map(product => (
                              <div key={product.id} className="form-check">
                                <input
                                  type="checkbox"
                                  className="form-check-input"
                                  id={`product-edit-${product.id}`}
                                  checked={selectedProducts.includes(String(product.id))}
                                  onChange={() => handleProductCheckbox(String(product.id))}
                                />
                                <label className="form-check-label" htmlFor={`product-edit-${product.id}`}>
                                  {product.name} - ₹{product.price}
                                </label>
                              </div>
                            ))
                          ) : (
                            <p className="text-muted mb-0">
                              <i className="fas fa-info-circle me-1"></i>
                              {selectedCategories.length > 0 
                                ? 'No products found in selected categories' 
                                : 'No products available'}
                            </p>
                          )}
                        </div>
                        <small className="text-muted">
                          {selectedProducts.length > 0 
                            ? `${selectedProducts.length} product(s) selected` 
                            : 'No products selected - offer applies to all'}
                        </small>
                      </div>
                    </div>
                  </div>

                  {formData.image && (
                    <div className="mb-3">
                      <label className="form-label">Offer Banner Preview</label>
                      <div>
                        <img 
                          src={formData.image} 
                          alt="Offer Banner"
                          style={{ width: '200px', height: '100px', objectFit: 'cover', borderRadius: '8px' }}
                        />
                      </div>
                    </div>
                  )}
                </div>
                <div className="modal-footer">
                  <button 
                    type="button" 
                    className="btn btn-secondary"
                    onClick={() => setShowEditModal(false)}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-warning">
                    Update Offer
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OffersManagement;