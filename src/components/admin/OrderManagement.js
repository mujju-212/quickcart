import React, { useState, useEffect, useCallback } from 'react';
import { Card, Table, Badge, Button, Modal, Form, Row, Col, Alert, Dropdown, Nav, Tab, Spinner, InputGroup, FormControl } from 'react-bootstrap';
import { FaEye, FaEdit, FaCheck, FaTruck, FaBox, FaTimes, FaPhone, FaEnvelope, FaMapMarkerAlt, FaCreditCard, FaShoppingBag, FaCheckCircle, FaBan, FaClock, FaSearch } from 'react-icons/fa';
import { useLocation } from 'react-router-dom';
import orderService from '../../services/orderService';
import OrderTimeline from '../order/OrderTimeline';
import useAutoRefresh from '../../hooks/useAutoRefresh';

const OrderManagement = () => {
  const location = useLocation();
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [activeTab, setActiveTab] = useState('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    confirmed: 0,
    preparing: 0,
    out_for_delivery: 0,
    delivered: 0,
    cancelled: 0
  });

  // Handle navigation from dashboard (view/edit order)
  useEffect(() => {
    if (location.state?.viewOrderId && orders.length > 0) {
      const order = orders.find(o => o.id === location.state.viewOrderId);
      if (order) {
        handleViewOrder(order);
      }
    } else if (location.state?.editOrderId && orders.length > 0) {
      const order = orders.find(o => o.id === location.state.editOrderId);
      if (order) {
        handleViewOrder(order); // Same modal, just opens in edit mode
      }
    }
  }, [location.state, orders]);

  const loadOrders = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const ordersData = await orderService.getAllOrders();
      
      console.log('📦 Order Management - Raw data received:', ordersData?.length || 0, 'orders');
      
      if (Array.isArray(ordersData)) {
        // Transform database format to component format
        const transformedOrders = ordersData.map(order => ({
          ...order,
          customer: order.user_name || order.customer,
          date: order.created_at || order.date,
          email: order.email || '',
          fullAddress: order.address || order.delivery_address || '',
          paymentMethod: order.payment_method || 'COD',
          paymentStatus: order.payment_status || 'Pending',
          deliveryFee: parseFloat(order.delivery_fee || 0),
          items: Array.isArray(order.items) ? order.items.map(item => ({
            id: item.product_id || item.id,
            name: item.product_name || item.name,
            quantity: parseInt(item.quantity || 1),
            price: parseFloat(item.product_price || item.price || 0),
            total_price: parseFloat(item.total_price || item.total || 0)
          })) : [],
          timeline: order.timeline || []
        }));
        
        const sortedOrders = transformedOrders.sort((a, b) => new Date(b.date) - new Date(a.date));
        setOrders(sortedOrders);
        
        // Calculate stats
        const newStats = {
          total: sortedOrders.length,
          pending: sortedOrders.filter(o => o.status === 'pending').length,
          confirmed: sortedOrders.filter(o => o.status === 'confirmed').length,
          preparing: sortedOrders.filter(o => o.status === 'preparing').length,
          out_for_delivery: sortedOrders.filter(o => o.status === 'out_for_delivery').length,
          delivered: sortedOrders.filter(o => o.status === 'delivered').length,
          cancelled: sortedOrders.filter(o => o.status === 'cancelled').length
        };
        setStats(newStats);
        
        console.log(`✅ Order Management - Loaded ${sortedOrders.length} orders successfully`);
        console.log('📊 Order Stats:', newStats);
      } else {
        console.error('❌ Orders data is not an array:', ordersData);
        setOrders([]);
      }
    } catch (error) {
      console.error('❌ Error loading orders:', error);
      setError('Failed to load orders. Please try again.');
      setOrders([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // Enable auto-refresh every 20 seconds
  useAutoRefresh(loadOrders, 20000, true);

  useEffect(() => {
    loadOrders();
  }, [loadOrders]);

  const getStatusVariant = (status) => {
    switch (status) {
      case 'pending': return 'warning';
      case 'confirmed': return 'info';
      case 'preparing': return 'primary';
      case 'out_for_delivery': return 'secondary';
      case 'delivered': return 'success';
      case 'cancelled': return 'danger';
      default: return 'secondary';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending': return <FaEdit />;
      case 'confirmed': return <FaCheck />;
      case 'preparing': return <FaBox />;
      case 'out_for_delivery': return <FaTruck />;
      case 'delivered': return <FaCheck />;
      case 'cancelled': return <FaTimes />;
      default: return <FaEdit />;
    }
  };

  const getStatusActions = (order) => {
    const actions = [];
    
    switch (order.status) {
      case 'pending':
        actions.push(
          { label: 'Confirm Order', status: 'confirmed', variant: 'success', icon: <FaCheck /> },
          { label: 'Cancel Order', status: 'cancelled', variant: 'danger', icon: <FaTimes /> }
        );
        break;
      case 'confirmed':
        actions.push(
          { label: 'Start Preparing', status: 'preparing', variant: 'primary', icon: <FaBox /> },
          { label: 'Cancel Order', status: 'cancelled', variant: 'danger', icon: <FaTimes /> }
        );
        break;
      case 'preparing':
        actions.push(
          { label: 'Out for Delivery', status: 'out_for_delivery', variant: 'info', icon: <FaTruck /> }
        );
        break;
      case 'out_for_delivery':
        actions.push(
          { label: 'Mark Delivered', status: 'delivered', variant: 'success', icon: <FaCheck /> }
        );
        break;
      default:
        return null;
    }
    
    return actions;
  };

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await orderService.updateOrderStatus(orderId, newStatus);
      loadOrders();
    } catch (error) {
      console.error('Error updating order status:', error);
      // You could add a toast notification here
    }
  };

  const handleViewOrder = (order) => {
    setSelectedOrder(order);
    setShowModal(true);
  };

  const getFilteredOrders = () => {
    let filtered = orders;
    
    // Filter by tab
    if (activeTab === 'new') {
      filtered = filtered.filter(o => ['pending', 'confirmed'].includes(o.status));
    } else if (activeTab === 'processing') {
      filtered = filtered.filter(o => ['preparing', 'out_for_delivery'].includes(o.status));
    } else if (activeTab === 'completed') {
      filtered = filtered.filter(o => o.status === 'delivered');
    } else if (activeTab === 'cancelled') {
      filtered = filtered.filter(o => o.status === 'cancelled');
    }
    
    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(o => 
        o.id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        o.customer?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        o.user_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        o.phone?.includes(searchTerm)
      );
    }
    
    return filtered;
  };

  const filteredOrders = getFilteredOrders();

  const renderStatsCard = (title, count, icon, variant, tabKey) => (
    <Card 
      className={`text-center cursor-pointer ${activeTab === tabKey ? 'border-' + variant : ''}`}
      onClick={() => setActiveTab(tabKey)}
      style={{ cursor: 'pointer', transition: 'all 0.3s' }}
    >
      <Card.Body>
        <div className={`text-${variant} mb-2`} style={{ fontSize: '2rem' }}>
          {icon}
        </div>
        <h3 className="mb-1">{count}</h3>
        <div className="text-muted small">{title}</div>
      </Card.Body>
    </Card>
  );

  return (
    <>
      {/* Order Statistics Cards */}
      <Row className="mb-4">
        <Col md={3}>
          {renderStatsCard('Total Orders', stats.total, <FaShoppingBag />, 'primary', 'all')}
        </Col>
        <Col md={3}>
          {renderStatsCard('New Orders', stats.pending + stats.confirmed, <FaClock />, 'warning', 'new')}
        </Col>
        <Col md={3}>
          {renderStatsCard('Processing', stats.preparing + stats.out_for_delivery, <FaTruck />, 'info', 'processing')}
        </Col>
        <Col md={3}>
          {renderStatsCard('Completed', stats.delivered, <FaCheckCircle />, 'success', 'completed')}
        </Col>
      </Row>

      <Card>
        <Card.Header>
          <h5 className="mb-0">Order Management</h5>
        </Card.Header>
        <Card.Body>
          {error && (
            <Alert variant="danger" className="mb-3" dismissible onClose={() => setError(null)}>
              <i className="fas fa-exclamation-triangle me-2"></i>
              {error}
            </Alert>
          )}

          {/* Order Tabs */}
          <Tab.Container activeKey={activeTab} onSelect={(k) => setActiveTab(k)}>
            <Nav variant="tabs" className="mb-3">
              <Nav.Item>
                <Nav.Link eventKey="all">
                  All Orders <Badge bg="secondary" className="ms-2">{stats.total}</Badge>
                </Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="new">
                  New Orders <Badge bg="warning" className="ms-2">{stats.pending + stats.confirmed}</Badge>
                </Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="pending">
                  Pending <Badge bg="warning" className="ms-2">{stats.pending}</Badge>
                </Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="confirmed">
                  Confirmed <Badge bg="info" className="ms-2">{stats.confirmed}</Badge>
                </Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="processing">
                  Processing <Badge bg="primary" className="ms-2">{stats.preparing + stats.out_for_delivery}</Badge>
                </Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="completed">
                  Completed <Badge bg="success" className="ms-2">{stats.delivered}</Badge>
                </Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="cancelled">
                  Cancelled <Badge bg="danger" className="ms-2">{stats.cancelled}</Badge>
                </Nav.Link>
              </Nav.Item>
            </Nav>
          </Tab.Container>
          
          {/* Search Bar */}
          <div className="mb-3 mt-3">
            <InputGroup>
              <InputGroup.Text>
                <FaSearch />
              </InputGroup.Text>
              <FormControl
                placeholder="Search by Order ID, Customer Name, or Phone..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              {searchTerm && (
                <Button 
                  variant="outline-secondary" 
                  onClick={() => setSearchTerm('')}
                >
                  Clear
                </Button>
              )}
            </InputGroup>
          </div>
          
          {loading ? (
            <div className="text-center py-5">
              <Spinner animation="border" variant="primary" />
              <div className="mt-3">Loading orders...</div>
            </div>
          ) : (
            <>
              <Table responsive hover>
                <thead>
                  <tr>
                    <th>Order ID</th>
                    <th>Customer</th>
                    <th>Items</th>
                    <th>Amount</th>
                    <th>Status</th>
                    <th>Date & Time</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredOrders.length === 0 ? (
                    <tr>
                      <td colSpan="7" className="text-center py-4">
                        <div className="text-muted">
                          {activeTab === 'all' ? 'No orders found' : `No ${activeTab} orders found`}
                        </div>
                      </td>
                    </tr>
                  ) : (
                    filteredOrders.map((order) => (
                <tr key={order.id}>
                  <td>
                    <div className="fw-semibold">{order.id}</div>
                  </td>
                  <td>
                    <div>
                      <div className="fw-semibold text-primary">
                        {order.customer || order.user_name || 'N/A'}
                      </div>
                      <small className="text-muted">
                        <FaPhone size={10} className="me-1" />
                        {order.phone || 'N/A'}
                      </small>
                    </div>
                  </td>
                  <td>
                    <Badge bg="info">{order.items?.length || 0} items</Badge>
                  </td>
                  <td>
                    <div className="fw-semibold text-success">₹{order.total}</div>
                  </td>
                  <td>
                    <Badge 
                      bg={getStatusVariant(order.status)} 
                      className="d-flex align-items-center gap-1"
                      style={{ fontSize: '11px', padding: '5px 8px' }}
                    >
                      {getStatusIcon(order.status)}
                      {order.status.replace('_', ' ').toUpperCase()}
                    </Badge>
                  </td>
                  <td>
                    <div className="fw-semibold">
                      {new Date(order.date).toLocaleDateString('en-IN', { 
                        day: '2-digit', 
                        month: 'short', 
                        year: 'numeric' 
                      })}
                    </div>
                    <small className="text-muted">
                      <FaClock size={10} className="me-1" />
                      {new Date(order.date).toLocaleTimeString('en-IN', { 
                        hour: '2-digit', 
                        minute: '2-digit',
                        hour12: true 
                      })}
                    </small>
                  </td>
                  <td>
                    <div className="d-flex gap-1">
                      <Button
                        variant="outline-primary"
                        size="sm"
                        onClick={() => handleViewOrder(order)}
                        title="View Details"
                      >
                        <FaEye />
                      </Button>
                      
                      {getStatusActions(order) && (
                        <Dropdown>
                          <Dropdown.Toggle variant="outline-success" size="sm">
                            Actions
                          </Dropdown.Toggle>
                          <Dropdown.Menu>
                            {getStatusActions(order).map((action, index) => (
                              <Dropdown.Item
                                key={index}
                                onClick={() => handleStatusChange(order.id, action.status)}
                                className={`text-${action.variant}`}
                              >
                                {action.icon} {action.label}
                              </Dropdown.Item>
                            ))}
                          </Dropdown.Menu>
                        </Dropdown>
                      )}
                    </div>
                  </td>
                </tr>
                    ))
                  )}
                </tbody>
              </Table>
            </>
          )}
        </Card.Body>
      </Card>

      {/* Enhanced Order Details Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} size="xl">
        <Modal.Header closeButton style={{ 
          background: 'linear-gradient(135deg, #ffd700 0%, #f4c430 100%)', 
          borderBottom: '2px solid #ffcd00' 
        }}>
          <Modal.Title className="d-flex align-items-center gap-2" style={{ color: '#1a1a1a' }}>
            <FaEye /> Order Details - {selectedOrder?.id}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedOrder && (
            <div>
              {/* Status Alert */}
              <Alert 
                variant={getStatusVariant(selectedOrder.status)} 
                className="d-flex align-items-center justify-content-between"
              >
                <div className="d-flex align-items-center gap-2">
                  {getStatusIcon(selectedOrder.status)}
                  <strong>Current Status: {selectedOrder.status.replace('_', ' ').toUpperCase()}</strong>
                </div>
                <div>
                  {getStatusActions(selectedOrder) && (
                    <Dropdown>
                      <Dropdown.Toggle variant="outline-dark" size="sm">
                        Update Status
                      </Dropdown.Toggle>
                      <Dropdown.Menu>
                        {getStatusActions(selectedOrder).map((action, index) => (
                          <Dropdown.Item
                            key={index}
                            onClick={() => {
                              handleStatusChange(selectedOrder.id, action.status);
                              setSelectedOrder({...selectedOrder, status: action.status});
                            }}
                            className={`text-${action.variant}`}
                          >
                            {action.icon} {action.label}
                          </Dropdown.Item>
                        ))}
                      </Dropdown.Menu>
                    </Dropdown>
                  )}
                </div>
              </Alert>

              <Row className="mb-4">
                {/* Customer Information */}
                <Col md={6}>
                  <Card className="h-100">
                    <Card.Header className="bg-light">
                      <h6 className="mb-0"><FaEnvelope className="me-2" />Customer Information</h6>
                    </Card.Header>
                    <Card.Body>
                      <p><strong>Name:</strong> {selectedOrder.customer}</p>
                      <p><strong><FaPhone className="me-1" />Phone:</strong> {selectedOrder.phone}</p>
                      <p><strong><FaEnvelope className="me-1" />Email:</strong> {selectedOrder.email}</p>
                      <p><strong>Order Date:</strong> {new Date(selectedOrder.date).toLocaleDateString()}</p>
                      <p><strong>Order Time:</strong> {selectedOrder.timeline && selectedOrder.timeline.length > 0 ? 
                        new Date(selectedOrder.timeline[0].time).toLocaleTimeString() : 
                        'No timeline available'
                      }</p>
                    </Card.Body>
                  </Card>
                </Col>

                {/* Delivery & Payment Information */}
                <Col md={6}>
                  <Card className="h-100">
                    <Card.Header className="bg-light">
                      <h6 className="mb-0"><FaMapMarkerAlt className="me-2" />Delivery & Payment</h6>
                    </Card.Header>
                    <Card.Body>
                      <p><strong><FaMapMarkerAlt className="me-1" />Address:</strong><br />
                        <small>{selectedOrder.fullAddress || `${selectedOrder.address?.street}, ${selectedOrder.address?.area}, ${selectedOrder.address?.city} - ${selectedOrder.address?.pincode}`}</small>
                      </p>
                      <p><strong><FaCreditCard className="me-1" />Payment Method:</strong> {selectedOrder.paymentMethod}</p>
                      <p><strong>Payment Status:</strong> 
                        <Badge 
                          bg={selectedOrder.paymentStatus === 'Completed' ? 'success' : 
                              selectedOrder.paymentStatus === 'Pending' ? 'warning' : 'danger'}
                          className="ms-1"
                        >
                          {selectedOrder.paymentStatus}
                        </Badge>
                      </p>
                      <p><strong>Delivery Fee:</strong> ₹{selectedOrder.deliveryFee}</p>
                    </Card.Body>
                  </Card>
                </Col>
              </Row>

              {/* Order Items */}
              <Card className="mb-4">
                <Card.Header className="bg-light">
                  <h6 className="mb-0"><FaBox className="me-2" />Order Items ({selectedOrder.items.length} items)</h6>
                </Card.Header>
                <Card.Body>
                  <Table responsive>
                    <thead className="table-light">
                      <tr>
                        <th>Item</th>
                        <th>Quantity</th>
                        <th>Price</th>
                        <th>Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedOrder.items.map((item, index) => (
                        <tr key={index}>
                          <td>
                            <div className="d-flex align-items-center">
                              <div className="me-3">
                                <div 
                                  style={{
                                    width: '40px',
                                    height: '40px',
                                    backgroundColor: '#f8f9fa',
                                    borderRadius: '8px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                  }}
                                >
                                  <FaBox />
                                </div>
                              </div>
                              <div>
                                <div className="fw-semibold">{item.name}</div>
                                <small className="text-muted">ID: {item.id}</small>
                              </div>
                            </div>
                          </td>
                          <td className="align-middle">
                            <Badge bg="secondary">{item.quantity}</Badge>
                          </td>
                          <td className="align-middle">₹{parseFloat(item.price || 0).toFixed(2)}</td>
                          <td className="align-middle">
                            <strong>₹{(parseFloat(item.price || 0) * parseInt(item.quantity || 1)).toFixed(2)}</strong>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot className="table-light">
                      <tr>
                        <th colSpan="3">Subtotal</th>
                        <th>₹{(parseFloat(selectedOrder.total || 0) - parseFloat(selectedOrder.deliveryFee || 0)).toFixed(2)}</th>
                      </tr>
                      <tr>
                        <th colSpan="3">Delivery Fee</th>
                        <th>₹{parseFloat(selectedOrder.deliveryFee || 0).toFixed(2)}</th>
                      </tr>
                      <tr className="table-warning">
                        <th colSpan="3">Total Amount</th>
                        <th>₹{parseFloat(selectedOrder.total || 0).toFixed(2)}</th>
                      </tr>
                    </tfoot>
                  </Table>
                </Card.Body>
              </Card>

              {/* Order Timeline */}
              <Card>
                <Card.Header className="bg-light">
                  <h6 className="mb-0"><FaTruck className="me-2" />Order Timeline</h6>
                </Card.Header>
                <Card.Body>
                  <OrderTimeline 
                    status={selectedOrder.status}
                    timeline={selectedOrder.timeline || []} 
                  />
                </Card.Body>
              </Card>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <div className="d-flex justify-content-between w-100">
            <div>
              {selectedOrder && getStatusActions(selectedOrder) && (
                <div className="d-flex gap-2">
                  {getStatusActions(selectedOrder).map((action, index) => (
                    <Button
                      key={index}
                      variant={action.variant}
                      size="sm"
                      onClick={() => {
                        handleStatusChange(selectedOrder.id, action.status);
                        setSelectedOrder({...selectedOrder, status: action.status});
                      }}
                    >
                      {action.icon} {action.label}
                    </Button>
                  ))}
                </div>
              )}
            </div>
            <Button variant="secondary" onClick={() => setShowModal(false)}>
              Close
            </Button>
          </div>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default OrderManagement;