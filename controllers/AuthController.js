const User = require("../models/user");
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const AuthController = class {
    async login(req, res) {
        if (!req.body.password || !req.body.email) return res.status(422).json({ message: 'The email & password is required!' });

        const user = await this.authenticate(req.body.email, req.body.password);
        if (user) {
            return res.json(user);
        }

        res.status(401).json({ message: 'Email or password is incorrect' })
    }

    async register(req, res) {
        const email = req.body.email;
        const password = req.body.password;

        await User.create({ email, password: bcrypt.hashSync(password, 10) })
        res.send({ success: true })
    }

    logout(req, res) {
        let token = req.headers.authorization;
        if (token) {
            $redis.set(`jwtBlackList:${token}`, token, 'EX', 60 * 60 * 24 * 30)
        }
        res.cookie('sorarehelper', '', { expires: new Date(1), path: '/', sameSite: 'none', secure: true })
        res.json({ 'message': 'Success' });
    }

    async authenticate(email, password) {
        const user = await User.findOne({
            where: {
                email,
                enabled: 1,
                is_logged_in: false
            }
        })
        if (user && bcrypt.compareSync(password, user.password)) {
            const token = jwt.sign({ sub: user.id }, process.env.JWT_SECRET, { expiresIn: '30d' });
            User.update(
                { is_logged_in: true },
                { where: { id: user.id } }
            )
            return {
                email: user.email,
                token
            };
        }
        return null;
    }
}

module.exports = new AuthController();