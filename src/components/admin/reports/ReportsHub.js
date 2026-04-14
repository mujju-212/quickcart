/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Modal, Form, Spinner, Badge, Table } from 'react-bootstrap';
import { FaFileDownload, FaFilePdf, FaFileExcel, FaFilter, FaBox, FaShoppingCart, FaUsers, FaTags, FaGift, FaWarehouse, FaEye, FaCheck } from 'react-icons/fa';
import './ReportsHub.css';

const ReportsHub = () => {
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [currentReport, setCurrentReport] = useState(null);
  const [filters, setFilters] = useState({});
  const [selectedFields, setSelectedFields] = useState([]);
  const [previewData, setPreviewData] = useState(null);
  const [categories, setCategories] = useState([]);
  const [step, setStep] = useState(1); // 1: filters, 2: field selection, 3: preview
  
  const API_URL = process.env.REACT_APP_API_URL || '/api';

  // Load categories for filters
  useEffect(() => {
    fetchCategories();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await fetch(`${API_URL}/categories/admin`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        setCategories(data.categories || []);
      }
    } catch (error) {
      console.error('Error loading categories:', error);
    }
  };

  const reportFields = {
    products: [
      { key: 'product_id', label: 'Product ID', default: true },
      { key: 'name', label: 'Product Name', default: true },
      { key: 'category', label: 'Category', default: true },
      { key: 'price', label: 'Price', default: true },
      { key: 'stock', label: 'Stock Quantity', default: true },
      { key: 'status', label: 'Status', default: true },
      { key: 'description', label: 'Description', default: false },
      { key: 'image_url', label: 'Image URL', default: false },
      { key: 'created_at', label: 'Created Date', default: false }
    ],
    orders: [
      { key: 'order_id', label: 'Order ID', default: true },
      { key: 'customer_name', label: 'Customer Name', default: true },
      { key: 'phone', label: 'Phone', default: true },
      { key: 'total_amount', label: 'Total Amount', default: true },
      { key: 'status', label: 'Status', default: true },
      { key: 'order_date', label: 'Order Date', default: true },
      { key: 'address', label: 'Address', default: false },
      { key: 'items_count', label: 'Items Count', default: false },
      { key: 'payment_method', label: 'Payment Method', default: false }
    ],
    users: [
      { key: 'user_id', label: 'User ID', default: true },
      { key: 'name', label: 'Name', default: true },
      { key: 'email', label: 'Email', default: true },
      { key: 'phone', label: 'Phone', default: true },
      { key: 'role', label: 'Role', default: true },
      { key: 'orders_count', label: 'Total Orders', default: false },
      { key: 'total_spent', label: 'Total Spent', default: false },
      { key: 'created_at', label: 'Registered Date', default: false }
    ],
    inventory: [
      { key: 'product_id', label: 'Product ID', default: true },
      { key: 'name', label: 'Product Name', default: true },
      { key: 'category', label: 'Category', default: true },
      { key: 'stock', label: 'Current Stock', default: true },
      { key: 'price', label: 'Unit Price', default: true },
      { key: 'stock_value', label: 'Stock Value', default: true },
      { key: 'status', label: 'Stock Status', default: true }
    ],
    categories: [
      { key: 'category_id', label: 'Category ID', default: true },
      { key: 'name', label: 'Category Name', default: true },
      { key: 'product_count', label: 'Products', default: true },
      { key: 'total_revenue', label: 'Total Revenue', default: true },
      { key: 'order_count', label: 'Total Orders', default: true }
    ],
    offers: [
      { key: 'offer_id', label: 'Offer ID', default: true },
      { key: 'code', label: 'Offer Code', default: true },
      { key: 'discount_type', label: 'Discount Type', default: true },
      { key: 'discount_value', label: 'Discount Value', default: true },
      { key: 'status', label: 'Status', default: true },
      { key: 'start_date', label: 'Start Date', default: true },
      { key: 'end_date', label: 'End Date', default: true },
      { key: 'usage_count', label: 'Times Used', default: false }
    ]
  };

  const reports = [
    {
      id: 'products',
      title: 'Products Report',
      icon: FaBox,
      description: 'Export all products with stock, pricing, and sales data',
      color: '#FF6B6B',
      filters: [
        { name: 'category_id', label: 'Category', type: 'select', options: 'categories' },
        { name: 'stock_status', label: 'Stock Status', type: 'select', options: [
          { value: 'all', label: 'All' },
          { value: 'in_stock', label: 'In Stock' },
          { value: 'low_stock', label: 'Low Stock' },
          { value: 'out_of_stock', label: 'Out of Stock' }
        ]}
      ]
    },
    {
      id: 'orders',
      title: 'Orders Report',
      icon: FaShoppingCart,
      description: 'Export orders with customer details, items, and payment info',
      color: '#4ECDC4',
      filters: [
        { name: 'status', label: 'Status', type: 'select', options: [
          { value: 'all', label: 'All' },
          { value: 'pending', label: 'Pending' },
          { value: 'confirmed', label: 'Confirmed' },
          { value: 'preparing', label: 'Preparing' },
          { value: 'out_for_delivery', label: 'Out for Delivery' },
          { value: 'delivered', label: 'Delivered' },
          { value: 'cancelled', label: 'Cancelled' }
        ]},
        { name: 'date_range', label: 'Date Range', type: 'select', options: [
          { value: 'all', label: 'All Time' },
          { value: 'today', label: 'Today' },
          { value: 'week', label: 'Last 7 Days' },
          { value: 'month', label: 'Last 30 Days' },
          { value: 'year', label: 'Last Year' },
          { value: 'custom', label: 'Custom Range' }
        ]},
        { name: 'date_from', label: 'From Date', type: 'date', showIf: 'date_range=custom' },
        { name: 'date_to', label: 'To Date', type: 'date', showIf: 'date_range=custom' }
      ]
    },
    {
      id: 'users',
      title: 'Users Report',
      icon: FaUsers,
      description: 'Export users with orders, spending, and activity data',
      color: '#95E1D3',
      filters: [
        { name: 'role', label: 'Role', type: 'select', options: [
          { value: 'all', label: 'All' },
          { value: 'customer', label: 'Customers' },
          { value: 'admin', label: 'Admins' }
        ]},
        { name: 'status', label: 'Status', type: 'select', options: [
          { value: 'all', label: 'All' },
          { value: 'active', label: 'Active' },
          { value: 'inactive', label: 'Inactive' }
        ]}
      ]
    },
    {
      id: 'inventory',
      title: 'Inventory Report',
      icon: FaWarehouse,
      description: 'Export stock levels, values, and reorder alerts',
      color: '#F38181',
      filters: []
    },
    {
      id: 'categories',
      title: 'Categories Report',
      icon: FaTags,
      description: 'Export categories with product counts and revenue',
      color: '#AA96DA',
      filters: []
    },
    {
      id: 'offers',
      title: 'Offers Report',
      icon: FaGift,
      description: 'Export promotional offers with usage statistics',
      color: '#FCBAD3',
      filters: []
    }
  ];

  const handleExport = (report, format) => {
    setCurrentReport({ ...report, format });
    setStep(1);
    
    // Initialize filters and selected fields
    const defaultFilters = {};
    report.filters?.forEach(filter => {
      if (filter.type === 'select' && Array.isArray(filter.options)) {
        defaultFilters[filter.name] = 'all';
      }
    });
    setFilters(defaultFilters);
    
    // Initialize selected fields with defaults
    const fields = reportFields[report.id] || [];
    setSelectedFields(fields.filter(f => f.default).map(f => f.key));
    
    setShowModal(true);
  };

  const handleNextStep = async () => {
    if (step === 1) {
      // Move to field selection
      setStep(2);
    } else if (step === 2) {
      // Load preview
      await loadPreview();
      setStep(3);
    }
  };

  const handlePreviousStep = () => {
    if (step === 3) {
      setStep(2);
    } else if (step === 2) {
      setStep(1);
    }
  };

  const loadPreview = async () => {
    if (!currentReport) return;
    
    setLoading(true);
    try {
      const queryParams = new URLSearchParams({
        preview: 'true',
        format: 'json',  // Explicitly request JSON format for preview
        fields: selectedFields.join(','),
        ...filters
      });

      const response = await fetch(`${API_URL}/reports/${currentReport.id}?${queryParams}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to load preview');
      }

      // Check content type to ensure we got JSON
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        throw new Error('Server returned non-JSON response. Please check backend logs.');
      }

      const data = await response.json();
      setPreviewData(data);
    } catch (error) {
      console.error('Preview error:', error);
      alert('Failed to load preview. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const executeExport = async () => {
    if (!currentReport) return;
    
    setLoading(true);
    try {
      const queryParams = new URLSearchParams({
        format: currentReport.format,
        fields: selectedFields.join(','),
        ...filters
      });

      const response = await fetch(`${API_URL}/reports/${currentReport.id}?${queryParams}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!response.ok) {
        throw new Error('Export failed');
      }

      // Get filename from Content-Disposition header or create default
      const contentDisposition = response.headers.get('Content-Disposition');
      let filename = `${currentReport.id}_report_${new Date().toISOString().split('T')[0]}.${currentReport.format}`;
      
      if (contentDisposition) {
        const matches = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/.exec(contentDisposition);
        if (matches && matches[1]) {
          filename = matches[1].replace(/['"]/g, '');
        }
      }

      // Download file
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);

      setShowModal(false);
      alert(`${currentReport.format.toUpperCase()} report downloaded successfully!`);
    } catch (error) {
      console.error('Export error:', error);
      alert('Failed to export report. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const toggleField = (fieldKey) => {
    if (selectedFields.includes(fieldKey)) {
      setSelectedFields(selectedFields.filter(f => f !== fieldKey));
    } else {
      setSelectedFields([...selectedFields, fieldKey]);
    }
  };

  const selectAllFields = () => {
    const fields = reportFields[currentReport?.id] || [];
    setSelectedFields(fields.map(f => f.key));
  };

  const deselectAllFields = () => {
    setSelectedFields([]);
  };

  const renderFilterField = (filter) => {
    // Check conditional display
    if (filter.showIf) {
      const [key, value] = filter.showIf.split('=');
      if (filters[key] !== value) {
        return null;
      }
    }

    if (filter.type === 'select') {
      let options = [];
      
      // Handle dynamic options (like categories)
      if (filter.options === 'categories') {
        options = [
          { value: 'all', label: 'All Categories' },
          ...categories.map(cat => ({ value: cat.id?.toString() || '', label: cat.name || 'Unnamed' }))
        ];
      } else if (Array.isArray(filter.options)) {
        options = filter.options;
      }

      return (
        <Form.Group key={filter.name} className="mb-3">
          <Form.Label>{filter.label}</Form.Label>
          <Form.Select
            value={filters[filter.name] || 'all'}
            onChange={(e) => setFilters({ ...filters, [filter.name]: e.target.value })}
          >
            {options.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </Form.Select>
        </Form.Group>
      );
    }

    if (filter.type === 'date') {
      return (
        <Form.Group key={filter.name} className="mb-3">
          <Form.Label>{filter.label}</Form.Label>
          <Form.Control
            type="date"
            value={filters[filter.name] || ''}
            onChange={(e) => setFilters({ ...filters, [filter.name]: e.target.value })}
          />
        </Form.Group>
      );
    }

    return null;
  };

  const renderStepContent = () => {
    if (!currentReport) return null;

    // Step 1: Filters
    if (step === 1) {
      return (
        <div>
          <h6 className="mb-3">Apply Filters (Optional)</h6>
          {currentReport.filters && currentReport.filters.length > 0 ? (
            <Form>
              {currentReport.filters.map(filter => renderFilterField(filter))}
            </Form>
          ) : (
            <p className="text-muted">No filters available for this report</p>
          )}
        </div>
      );
    }

    // Step 2: Field Selection
    if (step === 2) {
      const fields = reportFields[currentReport.id] || [];
      return (
        <div>
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h6 className="mb-0">Select Fields to Include</h6>
            <div>
              <Button variant="link" size="sm" onClick={selectAllFields}>Select All</Button>
              <Button variant="link" size="sm" onClick={deselectAllFields}>Deselect All</Button>
            </div>
          </div>
          <div className="field-selection-grid">
            {fields.map(field => (
              <div key={field.key} className="field-checkbox">
                <Form.Check
                  type="checkbox"
                  id={`field-${field.key}`}
                  label={field.label}
                  checked={selectedFields.includes(field.key)}
                  onChange={() => toggleField(field.key)}
                />
              </div>
            ))}
          </div>
          {selectedFields.length === 0 && (
            <div className="alert alert-warning mt-3">
              Please select at least one field
            </div>
          )}
        </div>
      );
    }

    // Step 3: Preview
    if (step === 3) {
      if (loading) {
        return (
          <div className="text-center py-5">
            <Spinner animation="border" />
            <p className="mt-2">Loading preview...</p>
          </div>
        );
      }

      if (!previewData || !previewData.data || previewData.data.length === 0) {
        return (
          <div className="alert alert-info">
            No data available with current filters
          </div>
        );
      }

      const fields = reportFields[currentReport.id] || [];
      const displayFields = fields.filter(f => selectedFields.includes(f.key));

      return (
        <div>
          <h6 className="mb-3">Preview ({previewData.total || 0} records)</h6>
          <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
            <Table striped bordered hover size="sm">
              <thead>
                <tr>
                  {displayFields.map(field => (
                    <th key={field.key}>{field.label}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {previewData.data.slice(0, 10).map((row, idx) => (
                  <tr key={idx}>
                    {displayFields.map(field => (
                      <td key={field.key}>{row[field.key] || '-'}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
          {previewData.total > 10 && (
            <p className="text-muted small mt-2">
              Showing first 10 of {previewData.total} records
            </p>
          )}
        </div>
      );
    }
  };

  return (
    <Container fluid className="reports-hub py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="mb-1">📊 Reports & Export</h2>
          <p className="text-muted mb-0">Generate and download business reports</p>
        </div>
      </div>

      <Row>
        {reports.map(report => {
          const IconComponent = report.icon;
          return (
            <Col key={report.id} xs={12} md={6} lg={4} className="mb-4">
              <Card className="report-card h-100 shadow-sm">
                <Card.Body>
                  <div className="d-flex align-items-start mb-3">
                    <div 
                      className="report-icon me-3" 
                      style={{ backgroundColor: `${report.color}20`, color: report.color }}
                    >
                      <IconComponent size={24} />
                    </div>
                    <div>
                      <h5 className="mb-1">{report.title}</h5>
                      <p className="text-muted small mb-0">{report.description}</p>
                    </div>
                  </div>

                  {report.filters && report.filters.length > 0 && (
                    <Badge bg="info" className="mb-3">
                      <FaFilter className="me-1" /> {report.filters.length} Filters Available
                    </Badge>
                  )}

                  <div className="d-flex gap-2">
                    <Button
                      variant="outline-danger"
                      size="sm"
                      onClick={() => handleExport(report, 'pdf')}
                      disabled={loading}
                      className="flex-fill"
                    >
                      {loading ? (
                        <Spinner animation="border" size="sm" />
                      ) : (
                        <>
                          <FaFilePdf className="me-1" /> PDF
                        </>
                      )}
                    </Button>
                    <Button
                      variant="outline-success"
                      size="sm"
                      onClick={() => handleExport(report, 'excel')}
                      disabled={loading}
                      className="flex-fill"
                    >
                      {loading ? (
                        <Spinner animation="border" size="sm" />
                      ) : (
                        <>
                          <FaFileExcel className="me-1" /> Excel
                        </>
                      )}
                    </Button>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          );
        })}
      </Row>

      {/* Report Configuration Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg" centered>
        <Modal.Header closeButton>
          <Modal.Title>
            {currentReport?.icon && <currentReport.icon className="me-2" />}
            {currentReport?.title} - {currentReport?.format?.toUpperCase()}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {/* Progress Steps */}
          <div className="steps-indicator mb-4">
            <div className={`step ${step >= 1 ? 'active' : ''}`}>
              <div className="step-number">1</div>
              <div className="step-label">Filters</div>
            </div>
            <div className={`step-line ${step >= 2 ? 'active' : ''}`}></div>
            <div className={`step ${step >= 2 ? 'active' : ''}`}>
              <div className="step-number">2</div>
              <div className="step-label">Fields</div>
            </div>
            <div className={`step-line ${step >= 3 ? 'active' : ''}`}></div>
            <div className={`step ${step >= 3 ? 'active' : ''}`}>
              <div className="step-number">3</div>
              <div className="step-label">Preview</div>
            </div>
          </div>

          {/* Step Content */}
          {renderStepContent()}
        </Modal.Body>
        <Modal.Footer>
          <Button 
            variant="secondary" 
            onClick={() => setShowModal(false)}
            disabled={loading}
          >
            Cancel
          </Button>
          
          {step > 1 && (
            <Button 
              variant="outline-primary" 
              onClick={handlePreviousStep}
              disabled={loading}
            >
              Previous
            </Button>
          )}
          
          {step < 3 ? (
            <Button 
              variant="primary" 
              onClick={handleNextStep}
              disabled={loading || (step === 2 && selectedFields.length === 0)}
            >
              Next
            </Button>
          ) : (
            <Button 
              variant="success" 
              onClick={executeExport}
              disabled={loading || selectedFields.length === 0}
            >
              {loading ? (
                <>
                  <Spinner animation="border" size="sm" className="me-2" />
                  Exporting...
                </>
              ) : (
                <>
                  <FaFileDownload className="me-2" />
                  Export {currentReport?.format?.toUpperCase()}
                </>
              )}
            </Button>
          )}
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default ReportsHub;
