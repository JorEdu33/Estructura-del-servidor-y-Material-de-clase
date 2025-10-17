const express = require('express');
const router = express.Router();
const controller = require('../controllers/front.controller');

router.get('/grupos', controller.getGrupos);
router.get('/semanas/:grupo', controller.getSemanasPorGrupo);
router.get('/detalle/:semana/:codigo', controller.getDetallePorSemanaYCodigo);
router.delete('/detalle/:id', controller.deleteDetalleById);
router.post('/asignar-ceros', controller.asignarCeros);

module.exports = router;