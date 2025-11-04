import React, { useState, useEffect } from 'react';
import { Card, Table, Badge, Button, Spinner, Modal, Alert, Row, Col, Dropdown } from 'react-bootstrap';
import { FaEye, FaEdit, FaCheck, FaTruck, FaBox, FaTimes, FaPhone, FaEnvelope, FaMapMarkerAlt, FaCreditCard } from 'react-icons/fa';
import analyticsService from '../../../services/analyticsService';
import orderService from '../../../services/orderService';
import OrderTimeline from '../../order/OrderTimeline';

const RecentOrders = () => {
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false); // Track if modal is in edit mode

  useEffect(() => {
    loadRecentOrders();
  }, []);

  const loadRecentOrders = async () => {
    setLoading(true);
    try {
      const response = await analyticsService.getDashboardStats();
      if (response.success && response.data && response.data.recentOrders) {
        setRecentOrders(response.data.recentOrders);
      }
    } catch (error) {
      console.error('Error loading recent orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleViewOrder = async (order, editMode = false) => {
    // Fetch full order details
    setIsEditMode(editMode);
    try {
      const fullOrder = await orderService.getOrderById(order.id);
      setSelectedOrder(fullOrder);
      setShowModal(true);
    } catch (error) {
      console.error('Error fetching order details:', error);
      // Fallback to using the basic order data
      setSelectedOrder(order);
      setShowModal(true);
    }
  };

  const getStatusBadgeVariant = (status) => {
    const statusMap = {
      'delivered': 'success',
      'pending': 'warning',
      'confirmed': 'info',
      'processing': 'primary',
      'cancelled': 'danger',
      'out_for_delivery': 'info'
    };
    return statusMap[status?.toLowerCase()] || 'secondary';
  };

  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
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
    const status = order?.status?.toLowerCase();
    
    switch (status) {
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
      setSelectedOrder({...selectedOrder, status: newStatus});
      loadRecentOrders(); // Reload the list
    } catch (error) {
      console.error('Error updating order status:', error);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  return (
    <>
      <Card className="shadow-sm border-0" style={{ borderRadius: '15px' }}>
        <Card.Header 
          style={{ 
            backgroundColor: '#fff', 
            borderBottom: '2px solid #ffd60a', 
            borderRadius: '15px 15px 0 0' 
          }}
        >
          <h5 className="mb-0" style={{ color: '#333', fontWeight: 'bold' }}>Recent Orders</h5>
        </Card.Header>
        <Card.Body>
          {loading ? (
            <div className="text-center py-5">
              <Spinner animation="border" variant="primary" />
              <p className="mt-2 text-muted">Loading recent orders...</p>
            </div>
          ) : recentOrders.length === 0 ? (
            <div className="text-center py-5">
              <i className="fas fa-inbox fa-3x text-muted mb-3"></i>
              <p className="text-muted">No orders yet</p>
            </div>
          ) : (
            <Table responsive hover>
              <thead>
                <tr style={{ backgroundColor: '#f8f9fa' }}>
                  <th>Order ID</th>
                  <th>Customer</th>
                  <th>Phone</th>
                  <th>Amount</th>
                  <th>Status</th>
                  <th>Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((order) => (
                  <tr key={order.id}>
                    <td style={{ fontWeight: '500' }}>{order.orderNumber}</td>
                    <td>{order.customerName}</td>
                    <td>{order.customerPhone || 'N/A'}</td>
                    <td style={{ fontWeight: 'bold', color: '#28a745' }}>₹{order.amount.toFixed(2)}</td>
                    <td>
                      <Badge 
                        bg={getStatusBadgeVariant(order.status)}
                        className="px-3 py-2"
                        style={{ borderRadius: '20px' }}
                      >
                        {order.status.toUpperCase()}
                      </Badge>
                    </td>
                  <td>{formatDate(order.date)}</td>
                  <td>
                    <Button 
                      variant="outline-primary" 
                      size="sm" 
                      className="me-1"
                      onClick={() => handleViewOrder(order, false)}
                      title="View Order Details"
                    >
                      <FaEye />
                    </Button>
                    <Button 
                      variant="outline-warning" 
                      size="sm"
                      onClick={() => handleViewOrder(order, true)}
                      title="Edit Order Status"
                    >
                      <FaEdit />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}
      </Card.Body>
    </Card>

    {/* Order Details Modal */}
    <Modal show={showModal} onHide={() => setShowModal(false)} size="xl">
      <Modal.Header closeButton style={{ 
        background: isEditMode ? 'linear-gradient(135deg, #ffc107 0%, #ffb300 100%)' : 'linear-gradient(135deg, #ffd700 0%, #f4c430 100%)', 
        borderBottom: '2px solid #ffcd00' 
      }}>
        <Modal.Title className="d-flex align-items-center gap-2" style={{ color: '#1a1a1a' }}>
          {isEditMode ? <FaEdit /> : <FaEye />} {isEditMode ? 'Edit Order' : 'Order Details'} - #{selectedOrder?.id}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {selectedOrder && (
          <div>
            {/* Status Alert */}
            <Alert 
              variant={getStatusBadgeVariant(selectedOrder.status)} 
              className="d-flex align-items-center justify-content-between"
            >
              <div className="d-flex align-items-center gap-2">
                {getStatusIcon(selectedOrder.status)}
                <strong>Current Status: {selectedOrder.status?.replace('_', ' ').toUpperCase()}</strong>
              </div>
              <div>
                {isEditMode && getStatusActions(selectedOrder) && (
                  <Dropdown>
                    <Dropdown.Toggle variant="outline-dark" size="sm">
                      Update Status
                    </Dropdown.Toggle>
                    <Dropdown.Menu>
                      {getStatusActions(selectedOrder).map((action, index) => (
                        <Dropdown.Item
                          key={index}
                          onClick={() => handleStatusChange(selectedOrder.id, action.status)}
                          className={`text-${action.variant}`}
                        >
                          {action.icon} {action.label}
                        </Dropdown.Item>
                      ))}
                    </Dropdown.Menu>
                  </Dropdown>
                )}
                {!isEditMode && (
                  <small className="text-muted">View-only mode</small>
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
                    <p><strong>Name:</strong> {selectedOrder.user_name || selectedOrder.customerName || 'N/A'}</p>
                    <p><strong><FaPhone className="me-1" />Phone:</strong> {selectedOrder.phone || selectedOrder.customerPhone || 'N/A'}</p>
                    <p><strong>Order Date:</strong> {formatDate(selectedOrder.created_at || selectedOrder.date)}</p>
                    <p><strong>Order Time:</strong> {selectedOrder.timeline && selectedOrder.timeline.length > 0 ? 
                      new Date(selectedOrder.timeline[0].timestamp).toLocaleTimeString() : 
                      new Date(selectedOrder.created_at || selectedOrder.date).toLocaleTimeString()
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
                    {selectedOrder.delivery_address && (
                      <p><strong><FaMapMarkerAlt className="me-1" />Address:</strong><br />
                        <small>{selectedOrder.delivery_address}</small>
                      </p>
                    )}
                    <p><strong><FaCreditCard className="me-1" />Payment Method:</strong> {selectedOrder.payment_method || 'COD'}</p>
                    <p><strong>Payment Status:</strong> 
                      <Badge 
                        bg={selectedOrder.payment_status === 'completed' ? 'success' : 
                            selectedOrder.payment_status === 'pending' ? 'warning' : 'danger'}
                        className="ms-1"
                      >
                        {selectedOrder.payment_status?.toUpperCase() || 'PENDING'}
                      </Badge>
                    </p>
                    <p><strong>Subtotal:</strong> ₹{selectedOrder.subtotal ? parseFloat(selectedOrder.subtotal).toFixed(2) : '0.00'}</p>
                    <p><strong>Delivery Fee:</strong> ₹{selectedOrder.delivery_fee ? parseFloat(selectedOrder.delivery_fee).toFixed(2) : '20.00'}</p>
                    <p className="mb-0"><strong>Total Amount:</strong> <span className="text-success fw-bold">₹{selectedOrder.total ? parseFloat(selectedOrder.total).toFixed(2) : '0.00'}</span></p>
                  </Card.Body>
                </Card>
              </Col>
            </Row>

            {/* Order Items - if available */}
            {selectedOrder.items && selectedOrder.items.length > 0 && (
              <Card className="mb-3">
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
                          <td>{item.product_name || item.name}</td>
                          <td className="text-center">{item.quantity}</td>
                          <td>₹{parseFloat(item.product_price || item.price).toFixed(2)}</td>
                          <td className="fw-bold">₹{parseFloat(item.total_price || (item.quantity * (item.product_price || item.price))).toFixed(2)}</td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot className="table-light">
                      <tr>
                        <td colSpan="3" className="text-end"><strong>Subtotal:</strong></td>
                        <td className="fw-bold">₹{selectedOrder.subtotal ? parseFloat(selectedOrder.subtotal).toFixed(2) : '0.00'}</td>
                      </tr>
                      <tr>
                        <td colSpan="3" className="text-end"><strong>Delivery Fee:</strong></td>
                        <td className="fw-bold">₹{selectedOrder.delivery_fee ? parseFloat(selectedOrder.delivery_fee).toFixed(2) : '20.00'}</td>
                      </tr>
                      <tr className="table-success">
                        <td colSpan="3" className="text-end"><strong>Total:</strong></td>
                        <td className="fw-bold text-success">₹{selectedOrder.total ? parseFloat(selectedOrder.total).toFixed(2) : '0.00'}</td>
                      </tr>
                    </tfoot>
                  </Table>
                </Card.Body>
              </Card>
            )}

            {/* Order Timeline - if available */}
            {selectedOrder.timeline && selectedOrder.timeline.length > 0 && (
              <Card>
                <Card.Header className="bg-light">
                  <h6 className="mb-0">Order Timeline</h6>
                </Card.Header>
                <Card.Body>
                  <OrderTimeline timeline={selectedOrder.timeline} />
                </Card.Body>
              </Card>
            )}
          </div>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={() => setShowModal(false)}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
    </>
  );
};

export default RecentOrders;