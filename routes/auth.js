const express = require('express');
const AuthController = require('../controllers/AuthController');
const { validationResult, checkSchema } = require('express-validator');
const register = require('../validations/register');

const router = express.Router();

router.post("/login", (req, res) => AuthController.login(req, res))
router.post("/register", checkSchema(register), (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(422).json({
            success: false,
            message: errors.array({ onlyFirstError: true })[0].msg
        });
    }

    AuthController.register(req, res)
})
router.post("/logout", (req, res) => AuthController.logout(req, res))


module.exports = router;