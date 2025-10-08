const express = require('express');
const router = express.Router();
const controller = require('../controllers/students.controller');

router.post('/registrar-estudiante', controller.registrarEstudiante);
router.post('/registrar-ejercicio', controller.registrarEjercicio);
router.post('/registrar-ejercicio', controller.registrarEjercicio);
router.post('/asignar-ceros', controller.asignarCeros);

module.exports = router;