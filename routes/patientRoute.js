const authenticateJWT = require('../middlewares/auth.js');
const user=require('../controllers/patientController.js')
const { Router } = require("express");
const router = Router({ strict: true });

router.get('/:id', authenticateJWT, user.getAllAppointment);
router.put('/:id', authenticateJWT, user.editAppointment);
router.delete('/:id', authenticateJWT, user.deleteAppointment);
router.post('/', authenticateJWT, user.bookAppointment);


module.exports = router;