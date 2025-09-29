const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  // Proxy para clientes (puerto 8001)
  app.use(
    '/api/v1/client',
    createProxyMiddleware({
      target: 'http://localhost:8001',
      changeOrigin: true,
    })
  );

  // Proxy para cuentas (puerto 8002)
  app.use(
    '/account',
    createProxyMiddleware({
      target: 'http://localhost:8002',
      changeOrigin: true,
    })
  );

  // Proxy para transacciones (puerto 8003 - asumiendo)
  app.use(
    '/transaction',
    createProxyMiddleware({
      target: 'http://localhost:8003',
      changeOrigin: true,
    })
  );
};