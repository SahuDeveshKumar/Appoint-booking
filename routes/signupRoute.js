const { Router } = require("express");
const router = Router({ strict: true });
const signupController=require('../controllers/registerController')

router.get('/',signupController.getDepartments)
router.post('/',signupController.signup)

module.exports=router;