module.exports = (err, req, res, next) => {
  console.error('❌ ERROR GLOBAL:', err);
  res.status(err.status || 500).json({
    error: err.message || 'Error interno del servidor'
  });
};