const authenticateJWT = require('../middlewares/auth');
const doctor=require('../controllers/doctorController')

const { Router } = require("express");
const router = Router({ strict: true });


router.post('/', authenticateJWT, doctor.addAppointment);
router.get('/:id', authenticateJWT, doctor.getAppointment);
router.put('/:id', authenticateJWT, doctor.updateUser);
router.delete('/:id', authenticateJWT, doctor.deleteAppointment);

router.post('/availability/', authenticateJWT, doctor.addAvailability);
router.get('/availability/:id', authenticateJWT, doctor.getAvailability);
router.put('/availability/:id', authenticateJWT, doctor.updateAvailability);
router.delete('/availability/:id', authenticateJWT, doctor.deleteAvailability);


module.exports = router;