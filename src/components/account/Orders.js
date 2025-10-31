import React, { useState } from 'react';
import { Card, Badge, Button, Row, Col } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { getProductImage, getImagePlaceholder } from '../../utils/helpers';
import OrderTimeline from '../order/OrderTimeline';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

const Orders = ({ orders }) => {
  const navigate = useNavigate();
  const [selectedOrder, setSelectedOrder] = useState(null);

  const getStatusColor = (status) => {
    const statusLower = status?.toLowerCase() || 'pending';
    switch (statusLower) {
      case 'delivered': return 'success';
      case 'processing': return 'info';
      case 'shipped': return 'primary';
      case 'cancelled': return 'danger';
      case 'pending': return 'warning';
      default: return 'secondary';
    }
  };

  const generateInvoice = (order) => {
    const doc = new jsPDF();
    
    // Ensure autoTable is available
    if (typeof doc.autoTable === 'undefined') {
      console.error('autoTable is not available on jsPDF instance');
      autoTable(doc, { html: '#dummy' }); // Initialize if needed
    }
    
    // ===== PROFESSIONAL HEADER WITH LOGO =====
    // Yellow gradient-like header background
    doc.setFillColor(255, 224, 27);
    doc.rect(0, 0, 210, 45, 'F');
    
    // Logo Box - Yellow rounded square (matching navbar)
    doc.setFillColor(255, 224, 27);
    doc.roundedRect(15, 10, 16, 16, 2, 2, 'F');
    doc.setDrawColor(50, 50, 50);
    doc.setLineWidth(0.5);
    doc.roundedRect(15, 10, 16, 16, 2, 2, 'S');
    
    // Draw Lightning Bolt Icon using lines (black)
    doc.setDrawColor(0, 0, 0);
    doc.setFillColor(0, 0, 0);
    doc.setLineWidth(1.5);
    
    // Lightning bolt shape - using filled polygon
    // Top point
    const bolt = [
      [23, 13],    // Top point
      [21.5, 17],  // Left middle
      [23.5, 17],  // Right middle (zigzag)
      [20, 23],    // Bottom left
      [22, 18],    // Right middle point
      [20.5, 18],  // Left middle (zigzag)
      [23, 13]     // Back to top
    ];
    
    // Draw the lightning bolt using lines to create filled shape
    doc.lines([
      [bolt[1][0] - bolt[0][0], bolt[1][1] - bolt[0][1]], // to point 1
      [bolt[2][0] - bolt[1][0], bolt[2][1] - bolt[1][1]], // to point 2
      [bolt[3][0] - bolt[2][0], bolt[3][1] - bolt[2][1]], // to point 3
      [bolt[4][0] - bolt[3][0], bolt[4][1] - bolt[3][1]], // to point 4
      [bolt[5][0] - bolt[4][0], bolt[5][1] - bolt[4][1]], // to point 5
      [bolt[0][0] - bolt[5][0], bolt[0][1] - bolt[5][1]]  // back to start
    ], bolt[0][0], bolt[0][1], [1, 1], 'F');
    
    // Company Name
    doc.setFontSize(26);
    doc.setTextColor(0, 0, 0);
    doc.setFont(undefined, 'bold');
    doc.text('QuickCart', 35, 20);
    
    // Tagline
    doc.setFontSize(9);
    doc.setFont(undefined, 'normal');
    doc.setTextColor(50, 50, 50);
    doc.text('Your One-Stop Shop for Everything', 35, 26);
    
    // Company Contact Info (right side)
    doc.setFontSize(8);
    doc.setTextColor(0, 0, 0);
    doc.text('www.quickcart.com', 150, 15);
    doc.text('support@quickcart.com', 150, 20);
    doc.text('+91 123 456 7890', 150, 25);
    
    // Decorative line under header
    doc.setDrawColor(200, 200, 200);
    doc.setLineWidth(0.3);
    doc.line(15, 48, 195, 48);
    
    // ===== INVOICE TITLE & INFO SECTION =====
    doc.setFillColor(245, 245, 245);
    doc.rect(15, 55, 180, 25, 'F');
    
    doc.setFontSize(18);
    doc.setFont(undefined, 'bold');
    doc.setTextColor(0, 0, 0);
    doc.text('TAX INVOICE', 20, 65);
    
    // Invoice details box (right side)
    doc.setFontSize(9);
    doc.setFont(undefined, 'bold');
    doc.setTextColor(80, 80, 80);
    doc.text('Invoice Details:', 140, 62);
    
    doc.setFont(undefined, 'normal');
    doc.setFontSize(9);
    doc.text(`Invoice Date:`, 140, 68);
    doc.text(`${new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}`, 168, 68);
    
    doc.text(`Order ID:`, 140, 73);
    doc.text(`#${order.id}`, 168, 73);
    
    doc.text(`Order Date:`, 140, 78);
    // Use order.created_at if available, otherwise use order.date
    const orderDate = order.created_at || order.date;
    doc.text(`${new Date(orderDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}`, 168, 78);
    
    // ===== BILLING INFORMATION SECTION =====
    const billingStartY = 88;
    
    // Bill To Box
    doc.setFillColor(255, 250, 220);
    doc.roundedRect(15, billingStartY, 85, 35, 2, 2, 'F');
    doc.setDrawColor(255, 224, 27);
    doc.setLineWidth(0.5);
    doc.roundedRect(15, billingStartY, 85, 35, 2, 2, 'S');
    
    doc.setFontSize(10);
    doc.setFont(undefined, 'bold');
    doc.setTextColor(0, 0, 0);
    doc.text('BILL TO:', 18, billingStartY + 7);
    
    doc.setFontSize(9);
    doc.setFont(undefined, 'normal');
    const customerName = order.customer || 'Guest User';
    const customerPhone = order.phone || 'N/A';
    const customerAddress = order.address || 'N/A';
    
    doc.setFont(undefined, 'bold');
    doc.text(customerName, 18, billingStartY + 14);
    doc.setFont(undefined, 'normal');
    doc.text(`Phone: ${customerPhone}`, 18, billingStartY + 20);
    
    const addressLines = doc.splitTextToSize(`Address: ${customerAddress}`, 78);
    let yPos = billingStartY + 26;
    addressLines.forEach(line => {
      if (yPos < billingStartY + 33) {
        doc.text(line, 18, yPos);
        yPos += 5;
      }
    });
    
    // Ship To Box (Same as Bill To for now)
    doc.setFillColor(240, 255, 240);
    doc.roundedRect(110, billingStartY, 85, 35, 2, 2, 'F');
    doc.setDrawColor(76, 175, 80);
    doc.setLineWidth(0.5);
    doc.roundedRect(110, billingStartY, 85, 35, 2, 2, 'S');
    
    doc.setFontSize(10);
    doc.setFont(undefined, 'bold');
    doc.setTextColor(0, 0, 0);
    doc.text('SHIP TO:', 113, billingStartY + 7);
    
    doc.setFontSize(9);
    doc.setFont(undefined, 'bold');
    doc.text(customerName, 113, billingStartY + 14);
    doc.setFont(undefined, 'normal');
    doc.text(`Phone: ${customerPhone}`, 113, billingStartY + 20);
    
    const shipAddressLines = doc.splitTextToSize(`Address: ${customerAddress}`, 78);
    yPos = billingStartY + 26;
    shipAddressLines.forEach(line => {
      if (yPos < billingStartY + 33) {
        doc.text(line, 113, yPos);
        yPos += 5;
      }
    });
    
    const tableStartY = billingStartY + 43;
    
    // ===== ITEMS TABLE SECTION =====
    const tableData = order.items?.map((item, index) => [
      index + 1,
      item.name || 'Product',
      Number(item.quantity) || 1,
      `Rs ${(Number(item.price) || 0).toFixed(2)}`,
      `Rs ${((Number(item.price) || 0) * (Number(item.quantity) || 1)).toFixed(2)}`
    ]) || [];
    
    doc.autoTable({
      startY: tableStartY,
      head: [['#', 'Item Description', 'Qty', 'Unit Price', 'Amount']],
      body: tableData,
      theme: 'grid',
      headStyles: { 
        fillColor: [255, 224, 27], 
        textColor: 0,
        fontStyle: 'bold',
        fontSize: 10,
        halign: 'center'
      },
      styles: { 
        fontSize: 9,
        cellPadding: 4,
        lineColor: [220, 220, 220],
        lineWidth: 0.3
      },
      columnStyles: {
        0: { cellWidth: 15, halign: 'center' },
        1: { cellWidth: 85, halign: 'left' },
        2: { cellWidth: 20, halign: 'center' },
        3: { cellWidth: 35, halign: 'right' },
        4: { cellWidth: 35, halign: 'right', fontStyle: 'bold' }
      },
      alternateRowStyles: {
        fillColor: [250, 250, 250]
      },
      margin: { left: 15, right: 15 }
    });
    
    // ===== PAYMENT SUMMARY SECTION =====
    const finalY = doc.lastAutoTable.finalY + 8;
    const subtotal = Number(order.subtotal) || order.items?.reduce((sum, item) => sum + ((Number(item.price) || 0) * (Number(item.quantity) || 1)), 0) || 0;
    const deliveryFee = Number(order.deliveryFee) || (subtotal >= 99 ? 0 : 29);
    const handlingFee = Number(order.handlingFee) || 5;
    const discount = Number(order.discount) || 0;
    const total = Number(order.total) || (subtotal + deliveryFee + handlingFee - discount);
    
    // Summary Box
    doc.setFillColor(245, 245, 245);
    doc.roundedRect(125, finalY, 70, 45, 2, 2, 'F');
    doc.setDrawColor(200, 200, 200);
    doc.setLineWidth(0.3);
    doc.roundedRect(125, finalY, 70, 45, 2, 2, 'S');
    
    doc.setFontSize(9);
    doc.setFont(undefined, 'normal');
    doc.setTextColor(80, 80, 80);
    
    let summaryY = finalY + 8;
    doc.text('Subtotal:', 128, summaryY);
    doc.text(`Rs ${subtotal.toFixed(2)}`, 190, summaryY, { align: 'right' });
    
    summaryY += 7;
    doc.text('Delivery Fee:', 128, summaryY);
    doc.text(deliveryFee === 0 ? 'FREE' : `Rs ${deliveryFee.toFixed(2)}`, 190, summaryY, { align: 'right' });
    
    summaryY += 7;
    doc.text('Handling Fee:', 128, summaryY);
    doc.text(`Rs ${handlingFee.toFixed(2)}`, 190, summaryY, { align: 'right' });
    
    if (discount > 0) {
      summaryY += 7;
      doc.setTextColor(0, 150, 0);
      doc.text('Discount:', 128, summaryY);
      doc.text(`- Rs ${discount.toFixed(2)}`, 190, summaryY, { align: 'right' });
      doc.setTextColor(80, 80, 80);
    }
    
    // Total line
    summaryY += 3;
    doc.setDrawColor(255, 224, 27);
    doc.setLineWidth(0.5);
    doc.line(128, summaryY, 192, summaryY);
    
    summaryY += 7;
    doc.setFillColor(255, 224, 27);
    doc.rect(125, summaryY - 5, 70, 10, 'F');
    doc.setFont(undefined, 'bold');
    doc.setFontSize(11);
    doc.setTextColor(0, 0, 0);
    doc.text('TOTAL AMOUNT:', 128, summaryY);
    doc.text(`Rs ${total.toFixed(2)}`, 190, summaryY, { align: 'right' });
    
    // Payment Information Box
    doc.setFillColor(240, 248, 255);
    doc.roundedRect(15, finalY, 105, 25, 2, 2, 'F');
    doc.setDrawColor(100, 149, 237);
    doc.setLineWidth(0.3);
    doc.roundedRect(15, finalY, 105, 25, 2, 2, 'S');
    
    doc.setFontSize(9);
    doc.setFont(undefined, 'bold');
    doc.setTextColor(0, 0, 0);
    doc.text('PAYMENT INFORMATION', 18, finalY + 7);
    
    doc.setFont(undefined, 'normal');
    doc.setFontSize(9);
    doc.setTextColor(80, 80, 80);
    const paymentMethodText = typeof order.paymentMethod === 'object' && order.paymentMethod ? 
      (order.paymentMethod.method || order.paymentMethod.type || 'Cash on Delivery') : 
      (order.paymentMethod || 'Cash on Delivery');
    doc.text(`Payment Method: ${paymentMethodText}`, 18, finalY + 14);
    
    const paymentStatus = order.paymentStatus || 'Pending';
    const statusColor = paymentStatus === 'Paid' ? [0, 150, 0] : [200, 100, 0];
    doc.setTextColor(...statusColor);
    doc.setFont(undefined, 'bold');
    doc.text(`Status: ${paymentStatus.toUpperCase()}`, 18, finalY + 20);
    
    // ===== FOOTER SECTION =====
    const footerY = 270;
    
    // Decorative line
    doc.setDrawColor(255, 224, 27);
    doc.setLineWidth(1);
    doc.line(15, footerY, 195, footerY);
    
    doc.setFontSize(10);
    doc.setFont(undefined, 'bold');
    doc.setTextColor(0, 0, 0);
    doc.text('Thank you for shopping with QuickCart!', 105, footerY + 6, { align: 'center' });
    
    doc.setFontSize(8);
    doc.setFont(undefined, 'normal');
    doc.setTextColor(100, 100, 100);
    doc.text('For any queries, reach us at: support@quickcart.com | +91 123 456 7890', 105, footerY + 11, { align: 'center' });
    doc.text('www.quickcart.com | Fast Delivery - Quality Products - Great Prices', 105, footerY + 15, { align: 'center' });
    
    doc.save(`QuickCart_Invoice_${order.id}.pdf`);
  };

  if (!selectedOrder) {
    return (
      <Card>
        <Card.Header>
          <h5 className="mb-0">
            <i className="fas fa-shopping-bag me-2"></i>
            My Orders
          </h5>
        </Card.Header>
        <Card.Body>
          {orders.length === 0 ? (
            <div className="text-center py-5">
              <i className="fas fa-shopping-bag fa-4x text-muted mb-3"></i>
              <h5>No orders yet</h5>
              <p className="text-muted">Your order history will appear here</p>
              <Button 
                variant="warning"
                onClick={() => navigate('/')}
              >
                Start Shopping
              </Button>
            </div>
          ) : (
            <div className="orders-list">
              {orders.map((order, orderIndex) => {
                const subtotal = Number(order.subtotal) || order.items?.reduce((sum, item) => sum + ((Number(item.price) || 0) * (Number(item.quantity) || 1)), 0) || 0;
                const deliveryFee = Number(order.deliveryFee) || (subtotal >= 99 ? 0 : 29);
                const handlingFee = Number(order.handlingFee) || 5;
                const total = Number(order.total) || (subtotal + deliveryFee + handlingFee);
                
                return (
                  <Card 
                    key={order.id || `order-${orderIndex}`} 
                    className="mb-3 border shadow-sm"
                    style={{ cursor: 'pointer', transition: 'all 0.2s' }}
                    onMouseEnter={(e) => e.currentTarget.style.boxShadow = '0 4px 8px rgba(0,0,0,0.15)'}
                    onMouseLeave={(e) => e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.12)'}
                    onClick={() => setSelectedOrder(order)}
                  >
                    <Card.Body>
                      <Row className="align-items-center">
                        <Col md={2}>
                          <div className="d-flex align-items-center">
                            {order.items && order.items[0] && (
                              <img 
                                src={getProductImage(order.items[0])}
                                alt={order.items[0].name}
                                style={{ width: '60px', height: '60px', objectFit: 'cover' }}
                                className="rounded"
                                onError={(e) => {
                                  e.target.src = getImagePlaceholder(60, 60, 'Item');
                                }}
                              />
                            )}
                            {order.items && order.items.length > 1 && (
                              <Badge 
                                bg="secondary" 
                                className="ms-2"
                                style={{ fontSize: '0.7rem' }}
                              >
                                +{order.items.length - 1}
                              </Badge>
                            )}
                          </div>
                        </Col>
                        <Col md={3}>
                          <div>
                            <h6 className="mb-1" style={{ fontSize: '0.95rem' }}>Order #{order.id}</h6>
                            <p className="text-muted small mb-0">
                              {new Date(order.date).toLocaleDateString('en-IN', { 
                                day: '2-digit', 
                                month: 'short', 
                                year: 'numeric' 
                              })}
                            </p>
                          </div>
                        </Col>
                        <Col md={2}>
                          <Badge bg={getStatusColor(order.status)} className="px-3 py-2">
                            {order.status?.toUpperCase() || 'PENDING'}
                          </Badge>
                        </Col>
                        <Col md={2}>
                          <div className="text-center">
                            <div className="text-muted small">Total Amount</div>
                            <div className="fw-bold fs-5">Rs{total.toFixed(2)}</div>
                          </div>
                        </Col>
                        <Col md={3} className="text-end">
                          <Button 
                            variant="outline-primary" 
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedOrder(order);
                            }}
                          >
                            View Details <i className="fas fa-arrow-right ms-1"></i>
                          </Button>
                        </Col>
                      </Row>
                    </Card.Body>
                  </Card>
                );
              })}
            </div>
          )}
        </Card.Body>
      </Card>
    );
  }

  const subtotal = Number(selectedOrder.subtotal) || selectedOrder.items?.reduce((sum, item) => sum + ((Number(item.price) || 0) * (Number(item.quantity) || 1)), 0) || 0;
  const deliveryFee = Number(selectedOrder.deliveryFee) || (subtotal >= 99 ? 0 : 29);
  const handlingFee = Number(selectedOrder.handlingFee) || 5;
  const total = Number(selectedOrder.total) || (subtotal + deliveryFee + handlingFee);

  return (
    <Card>
      <Card.Header className="d-flex justify-content-between align-items-center">
        <div>
          <Button 
            variant="link" 
            className="p-0 me-3 text-decoration-none"
            onClick={() => setSelectedOrder(null)}
          >
            <i className="fas fa-arrow-left"></i> Back to Orders
          </Button>
          <span className="ms-2 fw-bold">Order #{selectedOrder.id}</span>
        </div>
        <div className="d-flex align-items-center gap-2">
          <Button 
            variant="outline-primary" 
            size="sm"
            onClick={() => generateInvoice(selectedOrder)}
          >
            <i className="fas fa-file-invoice me-1"></i> Download Invoice
          </Button>
          <Badge bg={getStatusColor(selectedOrder.status)} className="px-3 py-2">
            {selectedOrder.status?.toUpperCase() || 'PENDING'}
          </Badge>
        </div>
      </Card.Header>
      <Card.Body>
        <Row>
          <Col md={8}>
            <Card className="mb-3">
              <Card.Body>
                <h6 className="mb-3">
                  <i className="fas fa-info-circle me-2 text-primary"></i>
                  Order Information
                </h6>
                <Row>
                  <Col md={6}>
                    <div className="mb-3">
                      <small className="text-muted d-block">Order Date & Time</small>
                      <div className="fw-semibold">
                        {new Date(selectedOrder.date).toLocaleDateString('en-IN', {
                          day: '2-digit',
                          month: 'short',
                          year: 'numeric'
                        })}
                      </div>
                      <small className="text-muted">
                        {new Date(selectedOrder.date).toLocaleTimeString('en-IN', {
                          hour: '2-digit',
                          minute: '2-digit',
                          hour12: true
                        })}
                      </small>
                    </div>
                  </Col>
                  <Col md={6}>
                    <div className="mb-3">
                      <small className="text-muted d-block">Contact Number</small>
                      <div className="fw-semibold">
                        <i className="fas fa-phone me-2 text-primary"></i>
                        {selectedOrder.phone || 'N/A'}
                      </div>
                    </div>
                  </Col>
                  <Col md={6}>
                    <div className="mb-3">
                      <small className="text-muted d-block">Payment Method</small>
                      <div className="fw-semibold">
                        {typeof selectedOrder.paymentMethod === 'object' && selectedOrder.paymentMethod ? 
                          (selectedOrder.paymentMethod.method || selectedOrder.paymentMethod.type || 'Cash on Delivery') :
                          (selectedOrder.paymentMethod || 'Cash on Delivery')
                        }
                      </div>
                    </div>
                  </Col>
                  <Col md={6}>
                    <div className="mb-2">
                      <small className="text-muted d-block">Payment Status</small>
                      <Badge bg={selectedOrder.paymentStatus?.toLowerCase() === 'completed' ? 'success' : 'warning'}>
                        {selectedOrder.paymentStatus || 'Pending'}
                      </Badge>
                    </div>
                  </Col>
                </Row>
              </Card.Body>
            </Card>

            {/* Order Timeline */}
            <Card className="mb-3">
              <Card.Body>
                <h6 className="mb-3">
                  <i className="fas fa-clock me-2 text-warning"></i>
                  Order Status Timeline
                </h6>
                <OrderTimeline 
                  status={selectedOrder.status} 
                  timeline={selectedOrder.timeline || []}
                />
              </Card.Body>
            </Card>

            <Card className="mb-3">
              <Card.Body>
                <h6 className="mb-3">
                  <i className="fas fa-box me-2 text-success"></i>
                  Items Ordered ({selectedOrder.items?.length || 0})
                </h6>
                {selectedOrder.items && selectedOrder.items.map((item, index) => (
                  <div key={item.id || item.product_id || `item-${index}`} className="d-flex justify-content-between align-items-center py-3 border-bottom">
                    <div className="d-flex align-items-center flex-grow-1">
                      <img 
                        src={getProductImage(item)} 
                        alt={item.name}
                        style={{ width: '60px', height: '60px', objectFit: 'cover' }}
                        className="rounded me-3"
                        onError={(e) => {
                          e.target.src = getImagePlaceholder(60, 60, 'Item');
                        }}
                      />
                      <div>
                        <div className="fw-semibold">{item.name}</div>
                        <div className="text-muted small">{item.size}</div>
                        <div className="text-muted small">Quantity: {item.quantity}</div>
                      </div>
                    </div>
                    <div className="text-end">
                      <div className="fw-semibold">Rs{((Number(item.price) || 0) * (Number(item.quantity) || 1)).toFixed(2)}</div>
                      <div className="text-muted small">Rs{(Number(item.price) || 0).toFixed(2)} each</div>
                    </div>
                  </div>
                ))}
              </Card.Body>
            </Card>
            <Card className="mb-3">
              <Card.Body>
                <h6 className="mb-3">
                  <i className="fas fa-map-marker-alt me-2 text-danger"></i>
                  Delivery Address
                </h6>
                <div className="bg-light p-3 rounded">
                  <div className="fw-semibold">{selectedOrder.customer || selectedOrder.user_name || 'Guest User'}</div>
                  <div className="text-muted">{selectedOrder.phone || 'N/A'}</div>
                  <div className="mt-2">
                    {typeof selectedOrder.delivery_address === 'object' && selectedOrder.delivery_address ? (
                      <>
                        {selectedOrder.delivery_address.house && <div>{selectedOrder.delivery_address.house}</div>}
                        {selectedOrder.delivery_address.area && <div>{selectedOrder.delivery_address.area}</div>}
                        {selectedOrder.delivery_address.city && <div>{selectedOrder.delivery_address.city}</div>}
                        {selectedOrder.delivery_address.pincode && <div>PIN: {selectedOrder.delivery_address.pincode}</div>}
                      </>
                    ) : (
                      <div>{selectedOrder.delivery_address || selectedOrder.address || 'N/A'}</div>
                    )}
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Col>
          <Col md={4}>
            <Card className="sticky-top" style={{ top: '100px', zIndex: 1 }}>
              <Card.Header className="bg-light">
                <h6 className="mb-0">
                  <i className="fas fa-receipt me-2"></i>
                  Order Summary
                </h6>
              </Card.Header>
              <Card.Body>
                <div className="d-flex justify-content-between mb-2">
                  <span className="text-muted">Subtotal</span>
                  <span>Rs{subtotal.toFixed(2)}</span>
                </div>
                <div className="d-flex justify-content-between mb-2">
                  <span className="text-muted">Delivery Fee</span>
                  <span className="text-success fw-semibold">{deliveryFee === 0 ? 'FREE' : `Rs${deliveryFee.toFixed(2)}`}</span>
                </div>
                <div className="d-flex justify-content-between mb-2">
                  <span className="text-muted">Handling Fee</span>
                  <span>Rs{handlingFee.toFixed(2)}</span>
                </div>
                <hr />
                <div className="d-flex justify-content-between fw-bold fs-5 mb-3">
                  <span>Total Paid</span>
                  <span className="text-success">Rs{total.toFixed(2)}</span>
                </div>
                <Button 
                  variant="warning" 
                  className="w-100 mb-2"
                  onClick={() => generateInvoice(selectedOrder)}
                >
                  <i className="fas fa-download me-2"></i>
                  Download Invoice
                </Button>
                <Button 
                  variant="outline-secondary" 
                  className="w-100"
                  onClick={() => setSelectedOrder(null)}
                >
                  <i className="fas fa-arrow-left me-2"></i>
                  Back to Orders
                </Button>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Card.Body>
    </Card>
  );
};

export default Orders;
