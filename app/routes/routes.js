const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const Math = require('mathjs');

module.exports = app => {
    const users = require("../controllers/controller");

    const authorization = (req, res, next) => {
        const token = req.cookies.access_token;
        if (!token) {
            return res.render('login', {
                message: 'Please login first!'
            })
        }
        try {
            const data = jwt.verify(token, "secret");
            req.email = data.data;
            return next();
        } catch {
            return res.render('login', {
                message: 'Please login first!'
            })
        }
    };

    app.get("/", users.index_page)
    
    app.get("/register", users.register_page)
    
    app.get("/login", users.login_page)
    
    app.post("/auth/login", users.login);
    
    app.post("/auth/register", users.create)
    
    app.get("/logout", authorization, users.logout);
    
    app.get("/calculator", authorization, users.calculator);
    
    app.post("/solve", authorization, users.solve);
    
    app.post("/update_calc/:ID", authorization, users.update_calc);
    
    app.post("/delete_calc/:ID", authorization, users.delete_calc);
}