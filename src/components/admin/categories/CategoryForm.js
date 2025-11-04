import React, { useState, useEffect } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';

const CategoryForm = ({ show, onHide, category }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    status: 'Active'
  });

  useEffect(() => {
    if (category) {
      setFormData({
        name: category.name || '',
        description: category.description || '',
        status: category.status || 'Active'
      });
    } else {
      setFormData({
        name: '',
        description: '',
        status: 'Active'
      });
    }
  }, [category]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Save logic here
    console.log('Save category:', formData);
    onHide();
  };

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton style={{ background: 'linear-gradient(135deg, #ffd700 0%, #f4c430 100%)' }}>
        <Modal.Title style={{ color: '#1a1a1a', fontWeight: 'bold' }}>
          {category ? 'Edit Category' : 'Add New Category'}
        </Modal.Title>
      </Modal.Header>
      
      <Form onSubmit={handleSubmit}>
        <Modal.Body>
          <Form.Group className="mb-3">
            <Form.Label style={{ fontWeight: '500' }}>Category Name</Form.Label>
            <Form.Control
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter category name"
              required
              style={{ borderRadius: '10px' }}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label style={{ fontWeight: '500' }}>Description</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Enter category description"
              style={{ borderRadius: '10px' }}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label style={{ fontWeight: '500' }}>Status</Form.Label>
            <Form.Select
              name="status"
              value={formData.status}
              onChange={handleChange}
              style={{ borderRadius: '10px' }}
            >
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </Form.Select>
          </Form.Group>
        </Modal.Body>
        
        <Modal.Footer>
          <Button variant="secondary" onClick={onHide}>
            Cancel
          </Button>
          <Button 
            type="submit"
            style={{ 
              background: 'linear-gradient(135deg, #ffd700 0%, #f4c430 100%)', 
              border: 'none', 
              color: '#1a1a1a', 
              fontWeight: 'bold',
              boxShadow: '0 4px 15px rgba(255, 215, 0, 0.3)'
            }}
          >
            {category ? 'Update Category' : 'Add Category'}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export default CategoryForm;