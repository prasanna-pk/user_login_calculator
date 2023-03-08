/*
Models module for the application - to access the database and perform read/write operations.
*/

const Math = require('mathjs');
const db = require('./db');
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
// constructor
const User = class {

}


User.create = (userdata, result) => {

  db.query('SELECT email FROM users WHERE email = ?', [userdata.email], async (err, res) => {
    if (err) {
      result(err, null);
      return;
    }

    if (res.length > 0) {
      result('Email already exists', null);
      return;
    }
    else if (userdata.password !== userdata.password_confirm) {
      result('Password and confirm password does not match', null);
      return;
    }

    let hashedPassword = await bcrypt.hash(userdata.password, 8);
    userdata.password = hashedPassword;
    delete userdata.password_confirm;
    db.query('INSERT INTO users SET?', userdata, (err, res) => {
      if (err) {
        result(err, null);
        return;
      } else {
        result(null, res);
        return;
      }
    })
  })
};

User.login = (userdata, result) => {

  var email = userdata.email;
  var password = userdata.password;

  db.query('SELECT * FROM users WHERE email = ?', [email], async (err, res) => {

    if (err) {
      result(err, null);
      return;
    }

    if (res.length == 0) {
      result('Email not found', null);
      return;
    }
    else if (await bcrypt.compare(password, res[0].password)) {
      let token = jwt
        .sign({
          exp: Math.floor(Date.now() / 1000) + (60 * 60), //token with 1 hour expiry
          data: email,
        }, 'secret');

      result(null, token);
      return;
    }
    else {
      result('Incorrect password', null);
      return;
    }

  });
}

User.calculator_page = (email, result) => {

  db.query('SELECT * FROM calculations where email = ? ORDER BY ID DESC LIMIT 5', [email], (err, db_res) => {
    if (err) {
      result(err, null);
      return;
    }
    else {
      result(null, {
        exp_history: db_res
      });
      return;
    }
  });
}

User.solve = (userdata, result) => {
  var calculation = userdata.calculation;
  var exp_result = Math.evaluate(calculation);
  var email = userdata.email;

  db.query('INSERT INTO calculations SET ?', { calculation: calculation, email: email, result: exp_result }, (err, res) => {
    if (err) {
      result(err, null);
      return;
    }
    else {
      db.query('SELECT * FROM calculations where email = ? ORDER BY ID DESC LIMIT 5', [email], (err, db_res) => {
        if (err) {
          result(err, null);
          return;
        }
        else {
          result(null, {
            exp_result: exp_result,
            exp_history: db_res
          });
          return;
        }
      });
    }
  })
}


User.update_calc = (userdata, result) => {

  var calculation = userdata.calculation;
  var email = userdata.email;
  var ID = userdata.ID;
  var exp_result = Math.evaluate(calculation);

  db.query('Update calculations SET ? where ID = ?', [{ calculation: calculation, result: exp_result }, ID], (err, res) => {
    if (err) {
      result(err, null);
      return;
    }
    else {
      db.query('SELECT * FROM calculations where email = ? ORDER BY ID DESC LIMIT 5', [email], (err, db_res) => {
        if (err) {
          result(err, null);
          return;
        }
        else {
          result(null, {
            exp_result: exp_result,
            exp_history: db_res
          });
          return;
        }
      });
    }
  });
};


User.delete_calc = (ID, email, result) => {

  db.query('delete from calculations where ID = ?', [ID], (err, res) => {
    if (err) {
      result(err, null);
      return;
    } else {
      db.query('SELECT * FROM calculations where email = ? ORDER BY ID DESC LIMIT 5', [email], (err, db_res) => {
        if (err) {
          result(err, null);
          return;
        }
        else {
          result(null, {
            exp_history: db_res
          });
          return;
        }
      });
    }
  })
};

module.exports = User;