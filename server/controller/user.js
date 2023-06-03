const db = require('../db/db.js');

const signIn = (req, res) => {
    const { username, password } = req.body;
    const user = db.users.find((user) => user.username === username && user.password === password);

    if (!user) {
        return res.status(401).json({ message: 'Invalid username or password' });
    }

    const token = username + '-' + Date.now().toString();

    return res.status(200).json({ token });
};

module.exports = { signIn };