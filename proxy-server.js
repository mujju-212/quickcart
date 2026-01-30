const http = require('http');
const httpProxy = require('http-proxy');

// Create proxy instances
const apiProxy = httpProxy.createProxyServer({
  target: 'http://localhost:5001',
  changeOrigin: true
});

const frontendProxy = httpProxy.createProxyServer({
  target: 'http://localhost:3000',
  changeOrigin: true,
  ws: true
});

// Create server
const server = http.createServer((req, res) => {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }

  // Route API requests and backend static images to backend
  // Note: /static/js is React's build files, /static/images is backend's product images
  if (req.url.startsWith('/api') || req.url.startsWith('/static/images')) {
    console.log('Proxying to Backend:', req.url);
    apiProxy.web(req, res, (err) => {
      console.error('Backend Proxy Error:', err);
      res.writeHead(502);
      res.end('Bad Gateway');
    });
  } else {
    // Route all other requests (including /static/js, /static/css) to frontend
    console.log('Proxying to Frontend:', req.url);
    frontendProxy.web(req, res, (err) => {
      console.error('Frontend Proxy Error:', err);
      res.writeHead(502);
      res.end('Bad Gateway');
    });
  }
});

// Handle WebSocket upgrade for React dev server
server.on('upgrade', (req, socket, head) => {
  frontendProxy.ws(req, socket, head);
});

const PORT = 8090;
server.listen(PORT, () => {
  console.log('🚀 Proxy Server running on port ' + PORT);
  console.log('📡 Frontend (React): http://localhost:3000');
  console.log('🔌 Backend (Flask): http://localhost:5001');
  console.log('🌐 Access both through: http://localhost:' + PORT);
});
