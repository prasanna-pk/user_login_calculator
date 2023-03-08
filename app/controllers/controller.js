const User = require("../models/models");

exports.index_page = (req, res) => {
    res.render("index")
};

exports.register_page = (req, res) => {
    res.render("register")
};

exports.login_page = (req, res) => {
    res.render("login")
};

exports.calculator = (req, res) => {
    User.calculator_page(req.email, (err, data) => {
        if (err) {
            return res
                .render('calculator', {
                    message: err
                })
        }
        else {
            return res.render('calculator', {
                expression: null,
                result: null,
                message: "Login successful",
                data: data.exp_history
            });
        }
    })
};

exports.create = (req, res) => {
    const { name, email, password, password_confirm } = req.body;

    var userdata = {
        name: name,
        email: email,
        password: password,
        password_confirm: password_confirm
    }

    User.create(userdata, (err, data) => {
        if (err) {
            return res.render('register', {
                message: err
            })
        }
        else {
            return res.render('login', {
                message: 'User registered! Please login to continue'
            })
        }
    })
};

exports.login = (req, res) => {
    const { email, password } = req.body;

    var userdata = {
        email: email,
        password: password
    };

    User.login(userdata, (err, token) => {
        if (err) {
            return res
                .render('login', {
                    message: err
                })
        }
        else {
            return res
                .cookie("access_token", token, {
                    httpOnly: true
                })
                .render('calculator', {
                    message: 'Login successful'
                })
        }
    });
};

exports.logout = (req, res) => {
    return res
        .clearCookie("access_token")
        .render('index', {
            message: 'Logout successful'
        })
};

exports.solve = (req, res) => {

    const { exp, result } = req.body;

    var userdata = {
        email: req.email,
        calculation: exp,
    };

    if (exp == '') {
        User.calculator_page(req.email, (err, data) => {
            if (err) {
                return res
                    .render('calculator', {
                        message: err
                    })
            }
            else {
                return res.render('calculator', {
                    expression: null,
                    result: null,
                    message: "Please enter valid values.",
                    data: data.exp_history
                });
            }
        })
        return;
    }

    User.solve(userdata, (err, data) => {
        if (err) {
            return res
                .render('calculator', {
                    message: err
                })
        }
        else {
            return res.render('calculator', {
                expression: exp,
                result: data.exp_result,
                message: "Solved",
                data: data.exp_history
            });
        }
    });
};

exports.update_calc = (req, res) => {

    const { exp, result } = req.body;

    var userdata = {
        email: req.email,
        calculation: exp,
        ID: req.params.ID
    };

    User.update_calc(userdata, (err, data) => {
        if (err) {
            return res
                .render('calculator', {
                    message: err
                })
        }
        else {
            return res.render('calculator', {
                expression: exp,
                result: data.exp_result,
                message: "Record updated",
                data: data.exp_history
            });
        }
    })
};

exports.delete_calc = (req, res) => {

    const ID = req.params.ID;

    User.delete_calc(ID, req.email, (err, data) => {
        if (err) {
            return res
                .render('calculator', {
                    message: err
                })
        }
        else {
            return res.render('calculator', {
                expression: null,
                result: null,
                message: "Record deleted",
                data: data.exp_history
            });
        }
    })
};  