import React from 'react';
import { Card, Nav } from 'react-bootstrap';
import { FaTachometerAlt, FaTags, FaBoxes, FaPercent, FaImage, FaUsers, FaShoppingCart } from 'react-icons/fa';

const AdminSidebar = ({ activeTab, setActiveTab }) => {
  const menuItems = [
    { key: 'dashboard', label: 'Dashboard', icon: FaTachometerAlt },
    { key: 'orders', label: 'Order Management', icon: FaShoppingCart },
    { key: 'categories', label: 'Categories', icon: FaTags },
    { key: 'products', label: 'Products', icon: FaBoxes },
    { key: 'offers', label: 'Offers', icon: FaPercent },
    { key: 'banners', label: 'Banners', icon: FaImage },
    { key: 'users', label: 'Users', icon: FaUsers }
  ];

  return (
    <Card className="shadow-sm border-0 sticky-top" style={{ borderRadius: '15px', top: '20px' }}>
      <Card.Body className="p-3">
        <Nav variant="pills" className="flex-column">
          {menuItems.map((item) => {
            const IconComponent = item.icon;
            const isActive = activeTab === item.key;
            return (
              <Nav.Item key={item.key} className="mb-2">
                <Nav.Link 
                  onClick={() => setActiveTab(item.key)}
                  className={`d-flex align-items-center ${isActive ? 'text-dark' : 'text-secondary'}`}
                  style={{ 
                    backgroundColor: isActive ? '#ffe01b' : 'transparent',
                    fontWeight: isActive ? '600' : '500',
                    cursor: 'pointer',
                    borderRadius: '10px',
                    padding: '12px 16px',
                    transition: 'all 0.3s ease',
                    border: isActive ? '2px solid #ffe01b' : '2px solid transparent'
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive) {
                      e.target.style.backgroundColor = '#f8f9fa';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive) {
                      e.target.style.backgroundColor = 'transparent';
                    }
                  }}
                >
                  <IconComponent className="me-3" size={18} />
                  <span>{item.label}</span>
                </Nav.Link>
              </Nav.Item>
            );
          })}
        </Nav>
      </Card.Body>
    </Card>
  );
};

export default AdminSidebar;