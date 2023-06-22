const ApiController = require("../controllers/ApiController")
const express = require('express');

const router = express.Router();

router.post('/tel-notif', (req, res) => ApiController.sendTelNotif(req, res))
router.get('/me', (req, res) => {
    res.json({ success: true })
})

module.exports = router;