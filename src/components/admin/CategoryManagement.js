import React, { useState, useEffect, useCallback } from 'react';
import { Card, Table, Button, Modal, Form, Alert, Badge } from 'react-bootstrap';
import categoryService from '../../services/categoryService';
import { PRODUCTS } from '../../utils/constants';
import { getColoredPlaceholder } from '../../utils/helpers';
import useAutoRefresh from '../../hooks/useAutoRefresh';

const CategoryManagement = () => {
  const [categories, setCategories] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    image: '',
    position: 0
  });
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState({ show: false, message: '', type: 'success' });

  const loadCategories = useCallback(async () => {
    setLoading(true);
    try {
      console.log('🔄 Admin: Loading categories from admin API...');
      
      // Call the admin API endpoint to get ALL categories with accurate counts
      const response = await categoryService.getAllCategoriesAdmin();
      
      console.log('🔍 ADMIN LoadCategories Debug:');
      console.log('Admin API response:', response);
      
      if (response.success && response.categories) {
        // Use products_count directly from the database
        const categoriesData = response.categories.map(category => ({
          ...category,
          productCount: category.products_count || 0
        }));
        
        console.log('Final categories with count:', categoriesData);
        setCategories(categoriesData);
      } else {
        throw new Error(response.error || 'Failed to load categories');
      }
    } catch (error) {
      console.error('Error loading categories:', error);
      setAlert({
        show: true,
        message: 'Error loading categories: ' + error.message,
        type: 'danger'
      });
    } finally {
      setLoading(false);
    }
  }, []);

  // Enable auto-refresh every 20 seconds
  useAutoRefresh(loadCategories, 20000, true);

  useEffect(() => {
    loadCategories();
  }, [loadCategories]);

  const showAlert = (message, type = 'success') => {
    setAlert({ show: true, message, type });
    setTimeout(() => setAlert({ show: false, message: '', type: 'success' }), 3000);
  };

  const handleAdd = () => {
    setEditingCategory(null);
    setFormData({ name: '', image: '', position: categories.length });
    setShowModal(true);
  };

  const handleEdit = (category) => {
    setEditingCategory(category);
    setFormData({ 
      name: category.name, 
      image: category.image_url || category.image || '',
      position: category.position || 0
    });
    setShowModal(true);
  };

  const handleDelete = async (categoryId) => {
    console.log('🗑️ Delete clicked for:', categoryId, typeof categoryId);
    
    const categoryToDelete = categories.find(cat => String(cat.id) === String(categoryId));
    const hasProducts = categoryToDelete && categoryToDelete.productCount > 0;
    
    let confirmMessage = 'Are you sure you want to delete this category?';
    if (hasProducts) {
      confirmMessage = `This category has ${categoryToDelete.productCount} products. Deleting it will make those products uncategorized. Are you sure you want to continue?`;
    }
    
    if (window.confirm(confirmMessage)) {
      console.log('✅ Delete confirmed');
      setLoading(true);
      
      try {
        // Ensure ID is string for consistent comparison
        const idToDelete = String(categoryId);
        console.log('ID to delete (converted to string):', idToDelete);
        
        console.log('Calling categoryService.deleteCategory with ID:', idToDelete);
        const result = await categoryService.deleteCategory(idToDelete);
        console.log('Delete result:', result);
        
        if (result && result.success) {
          console.log('✅ Delete successful, reloading categories');
          await loadCategories();
          showAlert('Category deleted successfully!');
        } else {
          console.error('❌ Delete failed:', result);
          showAlert('Failed to delete category', 'danger');
        }
      } catch (error) {
        console.error('Delete error:', error);
        showAlert('Error deleting category', 'danger');
      } finally {
        setLoading(false);
      }
    } else {
      console.log('❌ Delete cancelled');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Prepare form data with correct field name for API
      const { getColoredPlaceholder } = require('../../utils/helpers');
      const submissionData = {
        name: formData.name,
        // Send as image_url (API expects this field name)
        image_url: formData.image || getColoredPlaceholder(formData.name, '#2196F3'),
        position: parseInt(formData.position) || 0
      };

      if (editingCategory) {
        console.log('Updating category:', editingCategory.id, 'with data:', submissionData);
        const result = await categoryService.updateCategory(editingCategory.id, submissionData);
        console.log('Update result:', result);
        showAlert('Category updated successfully!');
      } else {
        console.log('Creating new category with data:', submissionData);
        const result = await categoryService.createCategory(submissionData);
        console.log('Create result:', result);
        showAlert('Category added successfully!');
      }
      
      setShowModal(false);
      
      // Wait a bit for the localStorage updates to complete, then reload
      setTimeout(async () => {
        await loadCategories();
      }, 100);
    } catch (error) {
      console.error('Save error:', error);
      showAlert('Error saving category', 'danger');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <>
      <Card>
        <Card.Header className="d-flex justify-content-between align-items-center">
          <h5 className="mb-0">Category Management</h5>
          <Button variant="primary" onClick={handleAdd}>
            <i className="fas fa-plus me-2"></i>
            Add Category
          </Button>
        </Card.Header>
        <Card.Body>
          {alert.show && (
            <Alert variant={alert.type} dismissible onClose={() => setAlert({ show: false, message: '', type: 'success' })}>
              {alert.message}
            </Alert>
          )}

          <Table responsive hover>
            <thead>
              <tr>
                <th>Image</th>
                <th>Name</th>
                <th>Position</th>
                <th>Products</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="6" className="text-center py-4">
                    <div className="spinner-border text-primary" role="status">
                      <span className="visually-hidden">Loading...</span>
                    </div>
                    <div className="mt-2">Loading categories...</div>
                  </td>
                </tr>
              ) : categories.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center py-4 text-muted">
                    No categories found. Add your first category to get started.
                  </td>
                </tr>
              ) : (
                categories.map((category) => (
                <tr key={category.id}>
                  <td>
                    <img
                      src={category.image_url || category.image}
                      alt={category.name}
                      className="rounded"
                      style={{ width: '50px', height: '50px', objectFit: 'cover' }}
                      onError={(e) => {
                        console.log('❌ Admin image failed to load for:', category.name, 'URL:', category.image_url || category.image);
                        e.target.src = getColoredPlaceholder(50, 50, category.name.charAt(0), '#ffe01b', '#000000');
                      }}
                    />
                  </td>
                  <td>
                    <div className="fw-semibold">{category.name}</div>
                  </td>
                  <td>
                    <Badge bg="secondary">{category.position || 0}</Badge>
                  </td>
                  <td>
                    <Badge bg="info">{category.productCount} products</Badge>
                  </td>
                  <td>
                    <Badge bg={category.productCount > 0 ? 'success' : 'warning'}>
                      {category.productCount > 0 ? 'Active' : 'Empty'}
                    </Badge>
                  </td>
                  <td>
                    <div className="d-flex gap-2">
                      <Button
                        variant="outline-primary"
                        size="sm"
                        onClick={() => handleEdit(category)}
                      >
                        <i className="fas fa-edit"></i>
                      </Button>
                      <Button
                        variant="outline-danger"
                        size="sm"
                        onClick={() => handleDelete(category.id)}
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
        </Card.Body>
      </Card>

      {/* Add/Edit Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>
            {editingCategory ? 'Edit Category' : 'Add New Category'}
          </Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmit}>
          <Modal.Body>
            <Form.Group className="mb-3">
              <Form.Label>Category Name *</Form.Label>
              <Form.Control
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Enter category name"
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Category Image URL (Optional)</Form.Label>
              <Form.Control
                type="url"
                name="image"
                value={formData.image}
                onChange={handleInputChange}
                placeholder="https://example.com/image.jpg (leave empty for auto-generated placeholder)"
              />
              <Form.Text className="text-muted">
                If left empty, a colored placeholder will be generated automatically
              </Form.Text>
              {formData.image && (
                <div className="mt-2">
                  <img
                    src={formData.image}
                    alt="Preview"
                    className="rounded"
                    style={{ width: '100px', height: '100px', objectFit: 'cover' }}
                    onError={(e) => {
                      e.target.style.display = 'none';
                    }}
                  />
                </div>
              )}
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Display Position *</Form.Label>
              <Form.Control
                type="number"
                name="position"
                value={formData.position}
                onChange={handleInputChange}
                placeholder="Enter display position (0 for first)"
                min="0"
                required
              />
              <Form.Text className="text-muted">
                Lower numbers appear first. Use 0 for the first position.
              </Form.Text>
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="outline-secondary" onClick={() => setShowModal(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" disabled={loading}>
              {loading ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2"></span>
                  Saving...
                </>
              ) : (
                editingCategory ? 'Update Category' : 'Add Category'
              )}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </>
  );
};

export default CategoryManagement;