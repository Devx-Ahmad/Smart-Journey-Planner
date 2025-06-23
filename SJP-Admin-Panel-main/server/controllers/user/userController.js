const User = require('../../models/user/User');

const login = async (req, res) => {
    res.render('auth/login.ejs', { layout: false });
}

const signUp = async (req, res) => {
    res.render('auth/signup.ejs', { layout: false });
}

const postSignUp = async (req, res) => {
    const { name, password } = req.body;

    if (password.length < 7) {
        return res.render("auth/signup", { layout: false, error: "Password must be at least 7 characters long." });
    }

    const data = {
        name,
        password, // Remember to hash the password in production
    };

    await User.insertMany([data]);
    res.redirect(`/login`);
}

const allLogin = async (req, res) => {
    if (req.method === "GET") {
        res.render("auth/login", { layout: false });
    } else if (req.method === "POST") {
        try {
            const check = await User.findOne({ name: req.body.name });

            if (check && check.password === req.body.password) { // Add proper password hash comparison in production
                req.session.user = check; // Store user info in session
                res.redirect(`/home`);
            } else {
                res.render("auth/login", { layout: false, error: "Wrong Password!" });
            }
        } catch {
            res.render("auth/login", { layout: false, error: "Wrong Details!" });
        }
    }
}

const logout = (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return res.redirect('/home');
        }
        res.clearCookie('connect.sid');
        res.redirect('/login');
    });
}

module.exports = {
    login,
    signUp,
    postSignUp,
    allLogin,
    logout,
}
