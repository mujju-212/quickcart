import React, { useState, useEffect } from 'react';
import { Card, Table, Button, Spinner, Badge, Form, InputGroup, Modal, Row, Col, Alert } from 'react-bootstrap';
import { FaEye, FaEdit, FaSearch, FaFilter, FaSort, FaUser } from 'react-icons/fa';

const Users = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');
  
  // Modal states
  const [showViewModal, setShowViewModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  
  // Edit form state
  const [editForm, setEditForm] = useState({
    name: '',
    email: '',
    phone: '',
    role: '',
    status: ''
  });
  const [updateError, setUpdateError] = useState('');
  const [updateSuccess, setUpdateSuccess] = useState('');

  useEffect(() => {
    loadUsers();
  }, []);

  useEffect(() => {
    filterAndSortUsers();
  }, [users, searchTerm, roleFilter, statusFilter, sortBy, sortOrder]);

  const loadUsers = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:5001/api/analytics/users', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        credentials: 'include'
      });
      
      const data = await response.json();
      console.log('Users API response:', data);
      
      if (data.success && data.data) {
        console.log('Loaded users:', data.data.length);
        setUsers(data.data);
      } else {
        console.error('Failed to load users:', data.message);
      }
    } catch (error) {
      console.error('Error loading users:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterAndSortUsers = () => {
    let result = [...users];

    // Search filter
    if (searchTerm) {
      result = result.filter(user => 
        user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.phone?.includes(searchTerm)
      );
    }

    // Role filter
    if (roleFilter !== 'all') {
      result = result.filter(user => user.role === roleFilter);
    }

    // Status filter
    if (statusFilter !== 'all') {
      result = result.filter(user => user.status === statusFilter);
    }

    // Sort
    result.sort((a, b) => {
      let aValue, bValue;

      switch (sortBy) {
        case 'name':
          aValue = a.name?.toLowerCase() || '';
          bValue = b.name?.toLowerCase() || '';
          break;
        case 'orders':
          aValue = a.orderCount || 0;
          bValue = b.orderCount || 0;
          break;
        case 'spent':
          aValue = a.totalSpent || 0;
          bValue = b.totalSpent || 0;
          break;
        case 'date':
          aValue = new Date(a.joinedAt || 0);
          bValue = new Date(b.joinedAt || 0);
          break;
        default:
          aValue = a[sortBy] || '';
          bValue = b[sortBy] || '';
      }

      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    setFilteredUsers(result);
  };

  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
  };

  const handleViewUser = (user) => {
    setSelectedUser(user);
    setShowViewModal(true);
  };

  const handleEditUser = (user) => {
    setSelectedUser(user);
    setEditForm({
      name: user.name || '',
      email: user.email || '',
      phone: user.phone || '',
      role: user.role || 'customer',
      status: user.status || 'active'
    });
    setUpdateError('');
    setUpdateSuccess('');
    setShowEditModal(true);
  };

  const handleUpdateUser = async (e) => {
    e.preventDefault();
    setUpdateError('');
    setUpdateSuccess('');

    try {
      const response = await fetch(`http://localhost:5001/api/users/${selectedUser.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        credentials: 'include',
        body: JSON.stringify(editForm)
      });

      const data = await response.json();

      if (data.success) {
        setUpdateSuccess('User updated successfully!');
        setTimeout(() => {
          setShowEditModal(false);
          loadUsers(); // Reload users list
        }, 1500);
      } else {
        setUpdateError(data.message || 'Failed to update user');
      }
    } catch (error) {
      console.error('Error updating user:', error);
      setUpdateError('Failed to update user. Please try again.');
    }
  };

  return (
    <div>
      <div className="mb-4">
        <h2 style={{ color: '#333', fontWeight: 'bold' }}>Users Management</h2>
        <p className="text-muted">Manage registered users ({filteredUsers.length} of {users.length} total)</p>
      </div>

      {/* Search and Filters */}
      <Card className="shadow-sm border-0 mb-3" style={{ borderRadius: '15px' }}>
        <Card.Body>
          <Row className="g-3">
            <Col md={4}>
              <InputGroup>
                <InputGroup.Text>
                  <FaSearch />
                </InputGroup.Text>
                <Form.Control
                  placeholder="Search by name, email, or phone..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </InputGroup>
            </Col>
            <Col md={2}>
              <InputGroup>
                <InputGroup.Text>
                  <FaFilter />
                </InputGroup.Text>
                <Form.Select
                  value={roleFilter}
                  onChange={(e) => setRoleFilter(e.target.value)}
                >
                  <option value="all">All Roles</option>
                  <option value="admin">Admin</option>
                  <option value="customer">Customer</option>
                </Form.Select>
              </InputGroup>
            </Col>
            <Col md={2}>
              <Form.Select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </Form.Select>
            </Col>
            <Col md={2}>
              <InputGroup>
                <InputGroup.Text>
                  <FaSort />
                </InputGroup.Text>
                <Form.Select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                >
                  <option value="name">Name</option>
                  <option value="orders">Orders</option>
                  <option value="spent">Total Spent</option>
                  <option value="date">Join Date</option>
                </Form.Select>
              </InputGroup>
            </Col>
            <Col md={2}>
              <Form.Select
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value)}
              >
                <option value="asc">Ascending</option>
                <option value="desc">Descending</option>
              </Form.Select>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      <Card className="shadow-sm border-0" style={{ borderRadius: '15px' }}>
        <Card.Body>
          {loading ? (
            <div className="text-center py-5">
              <Spinner animation="border" variant="warning" />
              <p className="mt-2 text-muted">Loading users...</p>
            </div>
          ) : filteredUsers.length === 0 ? (
            <div className="text-center py-5">
              <i className="fas fa-users fa-3x text-muted mb-3"></i>
              <h5>No users found</h5>
              <p className="text-muted">
                {searchTerm || roleFilter !== 'all' || statusFilter !== 'all'
                  ? 'Try adjusting your filters'
                  : 'No users registered yet'}
              </p>
            </div>
          ) : (
            <Table responsive hover>
              <thead>
                <tr style={{ backgroundColor: '#f8f9fa' }}>
                  <th style={{ cursor: 'pointer' }} onClick={() => handleSort('name')}>
                    User Name {sortBy === 'name' && (sortOrder === 'asc' ? '↑' : '↓')}
                  </th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Role</th>
                  <th style={{ cursor: 'pointer' }} onClick={() => handleSort('orders')}>
                    Orders {sortBy === 'orders' && (sortOrder === 'asc' ? '↑' : '↓')}
                  </th>
                  <th style={{ cursor: 'pointer' }} onClick={() => handleSort('spent')}>
                    Total Spent {sortBy === 'spent' && (sortOrder === 'asc' ? '↑' : '↓')}
                  </th>
                  <th>Status</th>
                  <th style={{ cursor: 'pointer' }} onClick={() => handleSort('date')}>
                    Joined {sortBy === 'date' && (sortOrder === 'asc' ? '↑' : '↓')}
                  </th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user) => (
                  <tr key={user.id}>
                    <td style={{ fontWeight: '500' }}>{user.name}</td>
                    <td>{user.email || '-'}</td>
                    <td>{user.phone}</td>
                    <td>
                      <Badge bg={user.role === 'admin' ? 'danger' : 'secondary'}>
                        {user.role.toUpperCase()}
                      </Badge>
                    </td>
                    <td>
                      <div className="d-flex align-items-center gap-1">
                        <Badge bg="info">{user.totalOrders || 0}</Badge>
                        {user.totalOrders > user.orderCount && (
                          <small className="text-muted" title={`${user.totalOrders - user.orderCount} cancelled`}>
                            ({user.orderCount} completed)
                          </small>
                        )}
                      </div>
                    </td>
                    <td style={{ fontWeight: '500', color: '#28a745' }}>
                      ₹{user.totalSpent.toLocaleString()}
                    </td>
                    <td>
                      <Badge bg={user.status === 'active' ? 'success' : 'secondary'}>
                        {user.status.toUpperCase()}
                      </Badge>
                    </td>
                    <td>{new Date(user.joinedAt).toLocaleDateString('en-IN')}</td>
                    <td>
                      <Button 
                        variant="outline-primary" 
                        size="sm" 
                        className="me-1"
                        onClick={() => handleViewUser(user)}
                      >
                        <FaEye />
                      </Button>
                      <Button 
                        variant="outline-warning" 
                        size="sm"
                        onClick={() => handleEditUser(user)}
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

      {/* View User Modal */}
      <Modal show={showViewModal} onHide={() => setShowViewModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>
            <FaUser className="me-2" />
            User Details
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedUser && (
            <div>
              <Row className="mb-3">
                <Col md={6}>
                  <p><strong>Name:</strong> {selectedUser.name}</p>
                  <p><strong>Email:</strong> {selectedUser.email || 'Not provided'}</p>
                  <p><strong>Phone:</strong> {selectedUser.phone}</p>
                </Col>
                <Col md={6}>
                  <p>
                    <strong>Role:</strong>{' '}
                    <Badge bg={selectedUser.role === 'admin' ? 'danger' : 'secondary'}>
                      {selectedUser.role.toUpperCase()}
                    </Badge>
                  </p>
                  <p>
                    <strong>Status:</strong>{' '}
                    <Badge bg={selectedUser.status === 'active' ? 'success' : 'secondary'}>
                      {selectedUser.status.toUpperCase()}
                    </Badge>
                  </p>
                  <p><strong>Joined:</strong> {new Date(selectedUser.joinedAt).toLocaleDateString('en-IN')}</p>
                </Col>
              </Row>
              <hr />
              <Row className="g-3">
                <Col md={4}>
                  <Card className="bg-light">
                    <Card.Body className="text-center">
                      <h3 className="text-primary">{selectedUser.totalOrders || 0}</h3>
                      <p className="text-muted mb-0">Total Orders</p>
                    </Card.Body>
                  </Card>
                </Col>
                <Col md={4}>
                  <Card className="bg-light">
                    <Card.Body className="text-center">
                      <h3 className="text-success">{selectedUser.orderCount || 0}</h3>
                      <p className="text-muted mb-0">Completed Orders</p>
                    </Card.Body>
                  </Card>
                </Col>
                <Col md={4}>
                  <Card className="bg-light">
                    <Card.Body className="text-center">
                      <h3 className="text-success">₹{selectedUser.totalSpent.toLocaleString()}</h3>
                      <p className="text-muted mb-0">Total Spent</p>
                    </Card.Body>
                  </Card>
                </Col>
              </Row>
              {(selectedUser.totalOrders > selectedUser.orderCount) && (
                <Alert variant="info" className="mt-3 mb-0">
                  <small>
                    <strong>{selectedUser.totalOrders - selectedUser.orderCount}</strong> order(s) were cancelled
                  </small>
                </Alert>
              )}
              {selectedUser.lastLogin && (
                <p className="text-muted mt-3 mb-0">
                  <small>Last Login: {new Date(selectedUser.lastLogin).toLocaleString('en-IN')}</small>
                </p>
              )}
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowViewModal(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Edit User Modal */}
      <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>
            <FaEdit className="me-2" />
            Edit User
          </Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleUpdateUser}>
          <Modal.Body>
            {updateError && <Alert variant="danger">{updateError}</Alert>}
            {updateSuccess && <Alert variant="success">{updateSuccess}</Alert>}
            
            <Form.Group className="mb-3">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                value={editForm.name}
                onChange={(e) => setEditForm({...editForm, name: e.target.value})}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                value={editForm.email}
                onChange={(e) => setEditForm({...editForm, email: e.target.value})}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Phone</Form.Label>
              <Form.Control
                type="text"
                value={editForm.phone}
                onChange={(e) => setEditForm({...editForm, phone: e.target.value})}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Role</Form.Label>
              <Form.Select
                value={editForm.role}
                onChange={(e) => setEditForm({...editForm, role: e.target.value})}
              >
                <option value="customer">Customer</option>
                <option value="admin">Admin</option>
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Status</Form.Label>
              <Form.Select
                value={editForm.status}
                onChange={(e) => setEditForm({...editForm, status: e.target.value})}
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </Form.Select>
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowEditModal(false)}>
              Cancel
            </Button>
            <Button variant="primary" type="submit">
              Save Changes
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </div>
  );
};

export default Users;