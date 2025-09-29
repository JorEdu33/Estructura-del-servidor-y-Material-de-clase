const express = require('express');
const router = express.Router();
const controller = require('../controllers/students.controller');

router.post('/registrar-estudiante', controller.registrarEstudiante);
router.post('/registrar-ejercicio', controller.registrarEjercicio);

module.exports = router;