import React, { useState, useEffect } from 'react';
import { Card, Table, Button, Modal, Form, Alert, Badge, InputGroup, Row, Col, Dropdown, Pagination } from 'react-bootstrap';
import productService from '../../services/productService';
import { PRODUCTS as CONSTANTS_PRODUCTS } from '../../utils/constants';

const ProductManagement = () => {
  // Load from localStorage first, fallback to constants
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [paginatedProducts, setPaginatedProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletingProduct, setDeletingProduct] = useState(null);

  // Filter and pagination states
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterStock, setFilterStock] = useState('all');
  const [priceRange, setPriceRange] = useState({ min: '', max: '' });
  const [sortBy, setSortBy] = useState('');
  const [sortOrder, setSortOrder] = useState('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    price: '',
    originalPrice: '',
    stock: '',
    size: '',
    image: '', // Primary image URL
    images: [], // Additional image URLs
    description: ''
  });

  useEffect(() => {
    const initializeData = async () => {
      console.log('🔍 ProductManagement mounting...');
      console.log('📦 CONSTANTS_PRODUCTS loaded:', CONSTANTS_PRODUCTS.length, 'products');
      
      try {
        // Load categories
        const categoriesData = await productService.getAllCategories();
        setCategories(categoriesData);
        console.log('📂 Categories loaded:', categoriesData.length);
        console.log('📂 First category:', categoriesData[0]);
        
        // Load products from localStorage (includes both constants and custom additions)
        await loadAllProducts();
      } catch (error) {
        console.error('Error initializing product data:', error);
        console.error('Error details:', error.message);
      }
    };
    
    initializeData();
  }, []);

  const loadAllProducts = async () => {
    console.log('🔄 Loading all products...');
    setLoading(true);
    
    try {
      // Get products from service (which handles localStorage + constants merge)
      const response = await productService.getAllProducts();
      console.log('📦 Product service response:', response);
      
      // Handle both direct array and object response formats
      const allProducts = Array.isArray(response) ? response : response.products || [];
      console.log('📦 Total products loaded:', allProducts.length);
      
      setProducts(allProducts);
      console.log('✅ Products state updated with', allProducts.length, 'products');
    } catch (error) {
      console.error('Error loading products:', error);
      setProducts([]); // Fallback to empty array
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    filterAndSortProducts();
  }, [products, searchTerm, filterCategory, filterStock, priceRange, sortBy, sortOrder]);

  useEffect(() => {
    paginateProducts();
  }, [filteredProducts, currentPage]);

  const filterAndSortProducts = () => {
    console.log('🔍 Filtering products...', { 
      totalProducts: Array.isArray(products) ? products.length : 0, 
      searchTerm, 
      filterCategory, 
      filterStock,
      priceRange 
    });
    
    // Safety check - ensure products is an array
    if (!Array.isArray(products)) {
      console.warn('Products is not an array:', products);
      setFilteredProducts([]);
      return;
    }
    
    let filtered = [...products];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (product.category_name && product.category_name.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (product.category && product.category.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (product.description && product.description.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    // Category filter
    if (filterCategory !== 'all') {
      filtered = filtered.filter(product => 
        product.category_name === filterCategory || 
        product.category === filterCategory
      );
    }

    // Stock filter
    if (filterStock !== 'all') {
      filtered = filtered.filter(product => {
        switch (filterStock) {
          case 'inStock': return product.stock > 5;
          case 'lowStock': return product.stock > 0 && product.stock <= 5;
          case 'outOfStock': return product.stock === 0;
          default: return true;
        }
      });
    }

    // Price range filter
    if (priceRange.min !== '') {
      filtered = filtered.filter(product => product.price >= parseFloat(priceRange.min));
    }
    if (priceRange.max !== '') {
      filtered = filtered.filter(product => product.price <= parseFloat(priceRange.max));
    }

    // Sorting
    filtered.sort((a, b) => {
      let aValue, bValue;
      
      switch (sortBy) {
        case 'name':
          aValue = a.name.toLowerCase();
          bValue = b.name.toLowerCase();
          break;
        case 'price':
          aValue = a.price;
          bValue = b.price;
          break;
        case 'stock':
          aValue = a.stock;
          bValue = b.stock;
          break;
        case 'category':
          aValue = a.category.toLowerCase();
          bValue = b.category.toLowerCase();
          break;
        default:
          return 0;
      }

      if (sortOrder === 'asc') {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
      } else {
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
      }
    });

    console.log('✅ Filtered products:', filtered.length, 'products');
    setFilteredProducts(filtered);
    setCurrentPage(1); // Reset to first page when filters change
  };

  const paginateProducts = () => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginated = filteredProducts.slice(startIndex, endIndex);
    setPaginatedProducts(paginated);
    console.log('📄 Paginated products:', paginated.length, 'on page', currentPage);
  };

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

  const handleAdd = () => {
    setEditingProduct(null);
    setFormData({
      name: '',
      category: '',
      price: '',
      originalPrice: '',
      stock: '',
      size: '',
      image: '',
      description: ''
    });
    setShowModal(true);
  };

  // Helper function to get primary image for display
  const getProductDisplayImage = (product) => {
    const { primaryImage } = parseProductImages(product);
    return primaryImage;
  };

  // Helper function to parse product images from database
  const parseProductImages = (product) => {
    let images = [];
    let primaryImage = '';

    if (product.image_url) {
      try {
        // Try to parse as JSON array (multiple images)
        const parsedImages = JSON.parse(product.image_url);
        if (Array.isArray(parsedImages) && parsedImages.length > 0) {
          primaryImage = parsedImages[0];
          images = parsedImages.slice(1);
        } else {
          primaryImage = product.image_url;
        }
      } catch {
        // If not JSON, treat as single image URL
        primaryImage = product.image_url;
      }
    } else if (product.image) {
      // Fallback to legacy image field
      primaryImage = product.image;
    }

    return { primaryImage, images };
  };

  const handleEdit = (product) => {
    const { primaryImage, images } = parseProductImages(product);
    
    setEditingProduct(product);
    setFormData({
      name: product.name,
      category: product.category_id || product.category || '', // Use category_id from database
      price: product.price,
      originalPrice: product.originalPrice || product.original_price || '',
      stock: product.stock,
      size: product.size,
      image: primaryImage,
      images: images,
      description: product.description || ''
    });
    setShowModal(true);
  };

  const handleDelete = (product) => {
    setDeletingProduct(product);
    setShowDeleteModal(true);
  };

  const handleView = (product) => {
    const { primaryImage, images } = parseProductImages(product);
    
    setEditingProduct(product);
    setFormData({
      name: product.name,
      category: product.category_id || product.category || '', // Use category_id from database
      price: product.price,
      originalPrice: product.originalPrice || product.original_price || '',
      stock: product.stock,
      size: product.size,
      image: primaryImage,
      images: images,
      description: product.description || ''
    });
    // For view mode, we'll use the same modal but disable editing
    setShowModal(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Helper functions for multiple images
  const addImageField = () => {
    setFormData(prev => ({
      ...prev,
      images: [...prev.images, '']
    }));
  };

  const removeImageField = (index) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const updateImageField = (index, value) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.map((img, i) => i === index ? value : img)
    }));
  };

  const resetForm = () => {
    setFormData({
      name: '',
      category: '',
      price: '',
      originalPrice: '',
      stock: '',
      size: '',
      image: '',
      images: [],
      description: ''
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Convert form data to API format with multiple images support
      const allImages = [formData.image, ...formData.images].filter(url => url.trim() !== '');
      
      // Find category name from category ID
      const selectedCategory = categories.find(cat => cat.id.toString() === formData.category.toString());
      const categoryName = selectedCategory ? selectedCategory.name : formData.category;
      
      const apiData = {
        ...formData,
        category_name: categoryName, // API expects category_name
        original_price: formData.originalPrice, // API expects original_price
        image_url: JSON.stringify(allImages) // Store all images as JSON array
      };
      delete apiData.category; // Remove frontend field
      delete apiData.originalPrice; // Remove frontend field
      delete apiData.image;
      delete apiData.images;

      console.log('🔄 Submitting product data:', apiData);
      console.log('📸 Images being saved:', allImages);

      let result;
      if (editingProduct) {
        // Update existing product
        result = await productService.updateProduct(editingProduct.id, apiData);
        setMessage({
          type: 'success',
          text: `Product "${formData.name}" updated successfully!`
        });
      } else {
        // Add new product
        result = await productService.addProduct(apiData);
        setMessage({
          type: 'success',
          text: `Product "${formData.name}" added successfully!`
        });
      }

      // Reload all products from service to get updated data
      await loadAllProducts();

      // Trigger custom event for real-time updates on user end
      const response = await productService.getAllProducts();
      const allProducts = Array.isArray(response) ? response : response.products || [];
      window.dispatchEvent(new CustomEvent('productsUpdated', { 
        detail: { products: allProducts } 
      }));

      setShowModal(false);
      setEditingProduct(null);
      resetForm();
      setTimeout(() => setMessage(null), 3000);
    } catch (error) {
      console.error('Error saving product:', error);
      setMessage({
        type: 'danger',
        text: 'Failed to save product. Please try again.'
      });
      setTimeout(() => setMessage(null), 5000);
    } finally {
      setLoading(false);
    }
  };

  const confirmDelete = async () => {
    if (!deletingProduct) return;

    setLoading(true);
    try {
      await productService.deleteProduct(deletingProduct.id);
      
      // Reload all products from service to get updated data
      await loadAllProducts();

      // Trigger custom event for real-time updates on user end
      const response = await productService.getAllProducts();
      const allProducts = Array.isArray(response) ? response : response.products || [];
      window.dispatchEvent(new CustomEvent('productsUpdated', { 
        detail: { products: allProducts } 
      }));

      setMessage({
        type: 'success',
        text: `Product "${deletingProduct.name}" deleted successfully!`
      });
      
      setShowDeleteModal(false);
      setDeletingProduct(null);
      setTimeout(() => setMessage(null), 3000);
    } catch (error) {
      console.error('Error deleting product:', error);
      setMessage({
        type: 'danger',
        text: 'Failed to delete product. Please try again.'
      });
      setTimeout(() => setMessage(null), 5000);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container-fluid py-4">
      <Card>
        <Card.Header>
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h5 className="mb-0">
              Product Management 
              <Badge bg="success" className="ms-2">
                {filteredProducts.length} of {Array.isArray(products) ? products.length : 0} products
              </Badge>
              <Badge bg="info" className="ms-2">
                Loaded from Constants: {CONSTANTS_PRODUCTS.length}
              </Badge>
            </h5>
            <div>
              <Button 
                variant="outline-success" 
                size="sm"
                onClick={async () => {
                  console.log('🔄 Refreshing products from service...');
                  await loadAllProducts();
                }}
                className="me-2"
              >
                <i className="fas fa-refresh me-1"></i>
                Refresh ({Array.isArray(products) ? products.length : 0})
              </Button>
              <Button variant="primary" onClick={handleAdd}>
                <i className="fas fa-plus me-2"></i>
                Add Product
              </Button>
            </div>
          </div>
          
          {/* Search and Filters Row */}
          <Row className="g-3">
            {/* Search */}
            <Col md={3}>
              <InputGroup>
                <InputGroup.Text>
                  <i className="fas fa-search"></i>
                </InputGroup.Text>
                <Form.Control
                  type="text"
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </InputGroup>
            </Col>

            {/* Category Filter */}
            <Col md={2}>
              <Form.Select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
              >
                <option value="all">All Categories</option>
                {categories.map(category => (
                  <option key={category.id} value={category.name}>{category.name}</option>
                ))}
              </Form.Select>
            </Col>

            {/* Stock Filter */}
            <Col md={2}>
              <Form.Select
                value={filterStock}
                onChange={(e) => setFilterStock(e.target.value)}
              >
                <option value="all">All Stock</option>
                <option value="inStock">In Stock</option>
                <option value="lowStock">Low Stock</option>
                <option value="outOfStock">Out of Stock</option>
              </Form.Select>
            </Col>

            {/* Price Range */}
            <Col md={2}>
              <InputGroup>
                <Form.Control
                  type="number"
                  placeholder="Min ₹"
                  value={priceRange.min}
                  onChange={(e) => setPriceRange(prev => ({ ...prev, min: e.target.value }))}
                />
                <Form.Control
                  type="number"
                  placeholder="Max ₹"
                  value={priceRange.max}
                  onChange={(e) => setPriceRange(prev => ({ ...prev, max: e.target.value }))}
                />
              </InputGroup>
            </Col>

            {/* Sort */}
            <Col md={3}>
              <InputGroup>
                <Form.Select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                >
                  <option value="">Sort by...</option>
                  <option value="name">Name</option>
                  <option value="price">Price</option>
                  <option value="stock">Stock</option>
                  <option value="category">Category</option>
                </Form.Select>
                <Button
                  variant="outline-secondary"
                  onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                >
                  <i className={`fas fa-sort-${sortOrder === 'asc' ? 'up' : 'down'}`}></i>
                </Button>
              </InputGroup>
            </Col>
          </Row>
        </Card.Header>

        <Card.Body>
          {message && (
            <Alert variant={message.type} dismissible onClose={() => setMessage(null)}>
              {message.text}
            </Alert>
          )}

          {/* Products Table */}
          <div className="table-responsive">
            <Table striped bordered hover>
              <thead className="table-dark">
                <tr>
                  <th>Image</th>
                  <th>Product Name</th>
                  <th>Category</th>
                  <th>Price</th>
                  <th>Stock</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="7" className="text-center py-4">
                      <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Loading...</span>
                      </div>
                      <div className="mt-2">Loading products...</div>
                    </td>
                  </tr>
                ) : paginatedProducts.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="text-center py-4">
                      <div className="text-muted">
                        <i className="fas fa-box-open fa-3x mb-3"></i>
                        <h5>No Products Found</h5>
                        <p>No products match your current filters.</p>
                        <Button 
                          variant="outline-primary" 
                          onClick={() => {
                            setSearchTerm('');
                            setFilterCategory('all');
                            setFilterStock('all');
                            setPriceRange({ min: '', max: '' });
                            setSortBy('');
                          }}
                        >
                          Clear Filters
                        </Button>
                      </div>
                    </td>
                  </tr>
                ) : (
                  paginatedProducts.map((product) => (
                    <tr key={product.id}>
                      <td>
                        <img
                          src={getProductDisplayImage(product)}
                          alt={product.name}
                          className="rounded"
                          style={{ width: '40px', height: '40px', objectFit: 'cover' }}
                          onError={(e) => {
                            e.target.style.display = 'none';
                            e.target.nextElementSibling.style.display = 'inline-block';
                          }}
                        />
                        <i 
                          className="fas fa-image text-muted" 
                          style={{ 
                            display: 'none',
                            width: '40px',
                            height: '40px',
                            lineHeight: '40px',
                            textAlign: 'center'
                          }}
                        ></i>
                      </td>
                      <td>
                        <strong>{product.name}</strong>
                        <br />
                        <small className="text-muted">{product.size}</small>
                      </td>
                      <td>{product.category_name || product.category}</td>
                      <td>
                        <span className="fw-bold text-success">₹{product.price}</span>
                        {product.originalPrice && parseFloat(product.originalPrice) > parseFloat(product.price) && (
                          <>
                            <br />
                            <small className="text-muted text-decoration-line-through">
                              ₹{product.originalPrice}
                            </small>
                          </>
                        )}
                      </td>
                      <td>{product.stock}</td>
                      <td>
                        <Badge bg={
                          product.stock === 0 ? 'danger' : 
                          product.stock <= 5 ? 'warning' : 'success'
                        }>
                          {product.stock === 0 ? 'Out of Stock' : 
                           product.stock <= 5 ? 'Low Stock' : 'In Stock'}
                        </Badge>
                      </td>
                      <td>
                        <div className="d-flex gap-1">
                          <Button
                            variant="outline-info"
                            size="sm"
                            onClick={() => handleView(product)}
                            title="View Details"
                          >
                            <i className="fas fa-eye"></i>
                          </Button>
                          <Button
                            variant="outline-warning"
                            size="sm"
                            onClick={() => handleEdit(product)}
                            title="Edit Product"
                          >
                            <i className="fas fa-edit"></i>
                          </Button>
                          <Button
                            variant="outline-danger"
                            size="sm"
                            onClick={() => handleDelete(product)}
                            title="Delete Product"
                          >
                            <i className="fas fa-trash"></i>
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </Table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="d-flex justify-content-between align-items-center mt-3">
              <div className="text-muted">
                Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, filteredProducts.length)} of {filteredProducts.length} products
              </div>
              <Pagination>
                <Pagination.Prev 
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(currentPage - 1)}
                />
                {[...Array(totalPages)].map((_, index) => (
                  <Pagination.Item
                    key={index + 1}
                    active={index + 1 === currentPage}
                    onClick={() => setCurrentPage(index + 1)}
                  >
                    {index + 1}
                  </Pagination.Item>
                ))}
                <Pagination.Next 
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage(currentPage + 1)}
                />
              </Pagination>
            </div>
          )}
        </Card.Body>
      </Card>

      {/* Add/Edit Product Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} size="xl" centered>
        <Modal.Header closeButton>
          <Modal.Title>
            {editingProduct ? (
              <>
                <i className="fas fa-edit me-2"></i>
                {editingProduct ? 'View/Edit Product' : 'Edit Product'}
              </>
            ) : (
              <>
                <i className="fas fa-plus me-2"></i>
                Add New Product
              </>
            )}
          </Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmit}>
          <Modal.Body>
            <Row>
              {/* Left Column - Product Information */}
              <Col lg={8}>
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Product Name *</Form.Label>
                      <Form.Control
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        placeholder="Enter product name"
                        required
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Category *</Form.Label>
                      <Form.Select
                        name="category"
                        value={formData.category}
                        onChange={handleInputChange}
                        required
                      >
                        <option value="">Select Category</option>
                        {categories.map(category => (
                          <option key={category.id} value={category.id}>
                            {category.name}
                          </option>
                        ))}
                      </Form.Select>
                    </Form.Group>
                  </Col>
                </Row>

                <Row>
                  <Col md={4}>
                    <Form.Group className="mb-3">
                      <Form.Label>Selling Price (₹) *</Form.Label>
                      <Form.Control
                        type="number"
                        name="price"
                        value={formData.price}
                        onChange={handleInputChange}
                        placeholder="0.00"
                        step="0.01"
                        min="0"
                        required
                      />
                    </Form.Group>
                  </Col>
                  <Col md={4}>
                    <Form.Group className="mb-3">
                      <Form.Label>Original Price (₹)</Form.Label>
                      <Form.Control
                        type="number"
                        name="originalPrice"
                        value={formData.originalPrice}
                        onChange={handleInputChange}
                        placeholder="0.00"
                        step="0.01"
                        min="0"
                      />
                      <Form.Text className="text-muted">
                        Leave empty if no discount
                      </Form.Text>
                    </Form.Group>
                  </Col>
                  <Col md={4}>
                    <Form.Group className="mb-3">
                      <Form.Label>Stock Quantity *</Form.Label>
                      <Form.Control
                        type="number"
                        name="stock"
                        value={formData.stock}
                        onChange={handleInputChange}
                        placeholder="0"
                        min="0"
                        required
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <Form.Group className="mb-3">
                  <Form.Label>Size/Weight/Quantity *</Form.Label>
                  <Form.Control
                    type="text"
                    name="size"
                    value={formData.size}
                    onChange={handleInputChange}
                    placeholder="e.g., 1 kg, 500 ml, 250 g, Pack of 6"
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Product Image URL *</Form.Label>
                  <Form.Control
                    type="url"
                    name="image"
                    value={formData.image}
                    onChange={handleInputChange}
                    placeholder="https://example.com/image.jpg"
                    required
                  />
                  <Form.Text className="text-muted">
                    Enter a valid image URL (use Unsplash, Pexels, etc.)
                  </Form.Text>
                </Form.Group>

                {/* Additional Images */}
                <Form.Group className="mb-3">
                  <Form.Label>Additional Images (Optional)</Form.Label>
                  {formData.images.map((imageUrl, index) => (
                    <div key={index} className="d-flex mb-2">
                      <Form.Control
                        type="url"
                        value={imageUrl}
                        onChange={(e) => updateImageField(index, e.target.value)}
                        placeholder="https://example.com/additional-image.jpg"
                        className="me-2"
                      />
                      <Button
                        variant="outline-danger"
                        size="sm"
                        onClick={() => removeImageField(index)}
                      >
                        ✕
                      </Button>
                    </div>
                  ))}
                  <Button
                    variant="outline-primary"
                    size="sm"
                    onClick={addImageField}
                    className="mt-2"
                  >
                    + Add Image
                  </Button>
                  <Form.Text className="text-muted d-block">
                    Add multiple product images for better presentation
                  </Form.Text>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Product Description</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={4}
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    placeholder="Enter detailed product description, features, benefits..."
                  />
                </Form.Group>
              </Col>
              
              {/* Right Column - Product Preview */}
              <Col lg={4}>
                <div className="text-center">
                  <Form.Label className="d-block">Product Preview</Form.Label>
                  
                  {/* Product Card Preview */}
                  <Card className="shadow-sm" style={{ maxWidth: '300px', margin: '0 auto' }}>
                    <div style={{ position: 'relative' }}>
                      {formData.image ? (
                        <Card.Img
                          variant="top"
                          src={formData.image}
                          alt="Product Preview"
                          style={{ 
                            height: '200px', 
                            objectFit: 'cover',
                            backgroundColor: '#f8f9fa'
                          }}
                          onError={(e) => {
                            e.target.style.display = 'none';
                            e.target.nextElementSibling.style.display = 'flex';
                          }}
                          onLoad={(e) => {
                            e.target.style.display = 'block';
                            e.target.nextElementSibling.style.display = 'none';
                          }}
                        />
                      ) : null}
                      <div 
                        className="d-flex align-items-center justify-content-center text-muted" 
                        style={{ 
                          display: formData.image ? 'none' : 'flex',
                          height: '200px',
                          backgroundColor: '#f8f9fa',
                          border: '2px dashed #dee2e6'
                        }}
                      >
                        <div className="text-center">
                          <i className="fas fa-image fa-3x mb-2"></i>
                          <br />
                          <small>Image Preview</small>
                        </div>
                      </div>
                      
                      {/* Discount Badge */}
                      {formData.originalPrice && parseFloat(formData.originalPrice) > parseFloat(formData.price || 0) && (
                        <Badge 
                          bg="danger" 
                          className="position-absolute"
                          style={{ top: '10px', left: '10px' }}
                        >
                          {Math.round(((parseFloat(formData.originalPrice) - parseFloat(formData.price || 0)) / parseFloat(formData.originalPrice)) * 100)}% OFF
                        </Badge>
                      )}
                    </div>
                    
                    <Card.Body>
                      <Card.Title className="h6 mb-1" style={{ fontSize: '14px' }}>
                        {formData.name || 'Product Name'}
                      </Card.Title>
                      <Card.Text className="text-muted mb-2" style={{ fontSize: '12px' }}>
                        {formData.size || 'Size/Weight'}
                      </Card.Text>
                      
                      <div className="d-flex justify-content-between align-items-center mb-2">
                        <div>
                          {formData.price && (
                            <span className="fw-bold text-success" style={{ fontSize: '16px' }}>
                              ₹{formData.price}
                            </span>
                          )}
                          {formData.originalPrice && parseFloat(formData.originalPrice) > parseFloat(formData.price || 0) && (
                            <small className="text-muted text-decoration-line-through ms-1">
                              ₹{formData.originalPrice}
                            </small>
                          )}
                        </div>
                      </div>
                      
                      {/* Stock Status */}
                      {formData.stock !== '' && (
                        <small className={`d-block ${
                          parseInt(formData.stock) === 0 ? 'text-danger' : 
                          parseInt(formData.stock) <= 5 ? 'text-warning' : 'text-success'
                        }`}>
                          <i className={`fas fa-circle me-1 ${
                            parseInt(formData.stock) === 0 ? 'text-danger' : 
                            parseInt(formData.stock) <= 5 ? 'text-warning' : 'text-success'
                          }`} style={{ fontSize: '8px' }}></i>
                          {parseInt(formData.stock) === 0 ? 'Out of Stock' : 
                           parseInt(formData.stock) <= 5 ? 'Low Stock' : 'In Stock'}
                          {formData.stock && ` (${formData.stock} units)`}
                        </small>
                      )}
                      
                      <Button variant="primary" size="sm" className="w-100 mt-2" disabled>
                        <i className="fas fa-shopping-cart me-1"></i>
                        Add to Cart
                      </Button>
                    </Card.Body>
                  </Card>
                  
                  {/* Category Badge */}
                  {formData.category && (
                    <Badge bg="secondary" className="mt-2">
                      {formData.category}
                    </Badge>
                  )}
                  
                  {/* Description Preview */}
                  {formData.description && (
                    <div className="mt-3 p-2 bg-light rounded">
                      <small className="text-muted">
                        <strong>Description:</strong><br />
                        {formData.description.substring(0, 100)}
                        {formData.description.length > 100 && '...'}
                      </small>
                    </div>
                  )}
                </div>
              </Col>
            </Row>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="outline-secondary" onClick={() => setShowModal(false)}>
              <i className="fas fa-times me-2"></i>
              Cancel
            </Button>
            <Button type="submit" variant="primary" disabled={loading}>
              {loading ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2"></span>
                  Saving...
                </>
              ) : (
                <>
                  <i className={`fas fa-${editingProduct ? 'save' : 'plus'} me-2`}></i>
                  {editingProduct ? 'Update Product' : 'Add Product'}
                </>
              )}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title className="text-danger">
            <i className="fas fa-exclamation-triangle me-2"></i>
            Confirm Delete
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {deletingProduct && (
            <div>
              <p className="mb-3">
                Are you sure you want to delete this product? This action cannot be undone and will remove the product from the user store immediately.
              </p>
              
              <div className="bg-light p-3 rounded">
                <div className="d-flex align-items-center">
                  <img
                    src={getProductDisplayImage(deletingProduct)}
                    alt={deletingProduct.name}
                    className="rounded me-3"
                    style={{ width: '60px', height: '60px', objectFit: 'cover' }}
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.nextElementSibling.style.display = 'inline-block';
                    }}
                  />
                  <i 
                    className="fas fa-image text-muted me-3" 
                    style={{ 
                      display: 'none',
                      width: '60px',
                      height: '60px',
                      lineHeight: '60px',
                      textAlign: 'center',
                      backgroundColor: '#f8f9fa',
                      border: '1px solid #dee2e6',
                      borderRadius: '0.375rem'
                    }}
                  ></i>
                  <div>
                    <h6 className="mb-1">{deletingProduct.name}</h6>
                    <small className="text-muted">
                      {deletingProduct.category_name || deletingProduct.category} • {deletingProduct.size}
                    </small>
                    <br />
                    <small className="text-muted">
                      Price: ₹{deletingProduct.price} • Stock: {deletingProduct.stock} units
                    </small>
                  </div>
                </div>
              </div>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button 
            variant="outline-secondary" 
            onClick={() => setShowDeleteModal(false)}
            disabled={loading}
          >
            <i className="fas fa-times me-2"></i>
            Cancel
          </Button>
          <Button 
            variant="danger" 
            onClick={confirmDelete}
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="spinner-border spinner-border-sm me-2"></span>
                Deleting...
              </>
            ) : (
              <>
                <i className="fas fa-trash me-2"></i>
                Delete Product
              </>
            )}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default ProductManagement;