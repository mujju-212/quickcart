import React from 'react';
import './OrderTimeline.css';

const OrderTimeline = ({ status, timeline = [] }) => {
  // Define order statuses in sequence
  const orderStatuses = [
    {
      key: 'pending',
      label: 'Order Placed',
      icon: 'fas fa-shopping-cart',
      description: 'Your order has been received'
    },
    {
      key: 'confirmed',
      label: 'Confirmed',
      icon: 'fas fa-check-circle',
      description: 'Order confirmed by seller'
    },
    {
      key: 'preparing',
      label: 'Preparing',
      icon: 'fas fa-box',
      description: 'Your order is being prepared'
    },
    {
      key: 'out_for_delivery',
      label: 'Out for Delivery',
      icon: 'fas fa-shipping-fast',
      description: 'Your order is on the way'
    },
    {
      key: 'delivered',
      label: 'Delivered',
      icon: 'fas fa-check-double',
      description: 'Order successfully delivered'
    }
  ];

  // Get current status index
  const currentStatusIndex = orderStatuses.findIndex(s => s.key === status?.toLowerCase());
  const isCancelled = status?.toLowerCase() === 'cancelled';

  // Merge timeline data with status definitions
  const getTimelineData = (statusItem, index) => {
    const timelineEntry = timeline.find(t => t.status?.toLowerCase() === statusItem.key);
    const isCompleted = isCancelled ? false : (currentStatusIndex >= index);
    const isCurrent = currentStatusIndex === index;
    
    return {
      ...statusItem,
      completed: isCompleted,
      current: isCurrent,
      timestamp: timelineEntry?.timestamp || null,
      notes: timelineEntry?.notes || null
    };
  };

  if (isCancelled) {
    return (
      <div className="order-timeline">
        <div className="timeline-item cancelled">
          <div className="timeline-icon">
            <i className="fas fa-times-circle"></i>
          </div>
          <div className="timeline-content">
            <h6 className="timeline-title">Order Cancelled</h6>
            <p className="timeline-description">This order has been cancelled</p>
            {timeline.find(t => t.status === 'cancelled')?.timestamp && (
              <span className="timeline-date">
                {new Date(timeline.find(t => t.status === 'cancelled').timestamp).toLocaleString('en-IN')}
              </span>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="order-timeline">
      {orderStatuses.map((statusItem, index) => {
        const data = getTimelineData(statusItem, index);
        
        return (
          <div 
            key={statusItem.key} 
            className={`timeline-item ${data.completed ? 'completed' : ''} ${data.current ? 'current' : ''}`}
          >
            <div className="timeline-icon">
              <i className={statusItem.icon}></i>
            </div>
            <div className="timeline-content">
              <h6 className="timeline-title">{statusItem.label}</h6>
              <p className="timeline-description">{statusItem.description}</p>
              {data.timestamp && (
                <span className="timeline-date">
                  {new Date(data.timestamp).toLocaleString('en-IN', {
                    day: '2-digit',
                    month: 'short',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </span>
              )}
              {data.notes && (
                <p className="timeline-notes">
                  <i className="fas fa-info-circle me-1"></i>
                  {data.notes}
                </p>
              )}
            </div>
            {index < orderStatuses.length - 1 && (
              <div className={`timeline-line ${data.completed ? 'completed' : ''}`}></div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default OrderTimeline;