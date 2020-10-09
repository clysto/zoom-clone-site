const { createProxyMiddleware } = require('http-proxy-middleware');

const API_SERVER = 'http://localhost:8000';

module.exports = function (app) {
  app.use(
    '/api',
    createProxyMiddleware({
      target: API_SERVER,
      changeOrigin: true,
      pathRewrite: {
        '^/api': '',
      },
    })
  );
};
