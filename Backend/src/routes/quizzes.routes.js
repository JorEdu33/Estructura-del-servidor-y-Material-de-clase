const express = require('express');
const router = express.Router();
const P1 = require('../controllers/prac1.controller');
const P2 = require('../controllers/prac2.controller');
const P3 = require('../controllers/prac3.controller');
const P4 = require('../controllers/prac4.controller');
const P5 = require('../controllers/prac5.controller');
const P6 = require('../controllers/prac6.controller');


router.post('/evaluar-estadisticos', P1.evaluarEstadisticos);
router.post('/evaluar-ciclos', P1.evaluarCiclos);
router.post('/evaluar-expresion', P1.evaluarExpresion);

router.post('/evaluar-varianzas', P2.evaluarVarianzas);
router.post('/evaluar-t-una-muestra', P2.evaluarTUnaMuestra);
router.post('/ejer3_Prac2', P2.ejer3_Prac2);
router.post('/ejer4_Prac2', P2.ejer4_Prac2);

router.post('/ejer1-prac3-C1', P3.ejer1_prac3_C1);
router.post('/ejer2-prac3-C1', P3.ejer2_prac3_C1);
router.post('/ejer1-prac3-F3', P3.ejer1_prac3_F3);
router.post('/ejer2-prac3-F3', P3.ejer2_prac3_F3);

router.post('/ejer1-prac4-C1', P4.ejer1_prac4_C1);
router.post('/ejer2-prac4-C1', P4.ejer2_prac4_C1);
router.post('/ejer1-prac4-F3', P4.ejer1_prac4_F3);
router.post('/ejer2-prac4-F3', P4.ejer2_prac4_F3);

router.post('/ejer1-prac5-C1', P5.ejer1_prac5_C1);
router.post('/ejer2-prac5-C1', P5.ejer2_prac5_C1);
router.post('/ejer3-prac5-C1', P5.ejer3_prac5_C1);
router.post('/ejer1-prac5-F3', P5.ejer1_prac5_F3);
router.post('/ejer2-prac5-F3', P5.ejer2_prac5_F3);
router.post('/ejer3-prac5-F3', P5.ejer3_prac5_F3);

router.post('/ejer1-prac6-C1', P6.ejer1_prac6_C1);
router.post('/ejer2-prac6-C1', P6.ejer2_prac6_C1);
router.post('/ejer1-prac6-F3', P6.ejer1_prac6_F3);
router.post('/ejer2-prac6-F3', P6.ejer2_prac6_F3);

module.exports = router;