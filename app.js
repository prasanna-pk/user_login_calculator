const express = require('express');
const path = require("path");
const dotenv = require('dotenv');
const cookieParser = require("cookie-parser");

dotenv.config({ path: './.env' })

const app = express();

app.use(cookieParser());

const publicDir = path.join(__dirname, './public')

app.use(express.static(publicDir))
app.use(express.urlencoded({ extended: 'false' }))
app.use(express.json())
app.set('view engine', 'hbs');

require("./app/routes/routes")(app);

app.listen(5000, () => {
    console.log("server started on port 5000")
})