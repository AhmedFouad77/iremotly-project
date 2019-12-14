//  The Main Settings
const express = require('express');
const fileUpload = require('express-fileUpload');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const port = 8080;
const app = express();
const path = require("path");
const userRouter = require('./routes/user.route');
const companyRouter = require('./routes/company.router');
const post = require('./routes/posts.router');
const db = mongoose.connection;
let db_url = 'mongodb://localhost:27017/iremotelyDB';
const cookieParser = require("cookie-parser");
const publicRouter = require("./routes/public.route");
const expressValidator = require('express-validator');
const feedUserRout = require("./routes/feedbackUser.route");
const flash = require("connect-flash");
const filterRouter = require("./routes/filter.route");
const session = require('express-session')
const companyCategory = require("./routes/companyCategory.route");
const multer = require("multer");

const server = require("http").createServer(app);
const chatRouter = require("./routes/chat.route");
var io = require('socket.io')(server);
const checkRole = require("./controllers/checkRole")

app.set("port", process.env.PORT || port);
app.set("views", __dirname + "/views");
app.set("view engine", "ejs");


//Chat files
require("./controllers/sockets/chat.server")(io);


app.use(cookieParser());
app.use(session({
    secret: "secret123",
    saveUninitialized: true,
    resave: true
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(express.static(path.join(__dirname, "public")));
app.use(fileUpload());
app.use(flash());




// Connect With MongoDB
mongoose.set('useCreateIndex', true);
mongoose.connect(db_url, {
    useNewUrlParser: true,
    useFindAndModify: false
});
mongoose.Promise = global.Promise;
db.on("error", console.error.bind(console, "MongoDB Error !!!"));


//Site Routers
app.use("/", publicRouter);
app.use('/user', userRouter);
app.use('/company', companyRouter);
app.use('/companyPost', post);
app.use('/feedBack', feedUserRout);
app.use('/filter', filterRouter);
app.use("/category", companyCategory);
app.use("/chat", chatRouter);
app.get('/popUp', (req, res) => {
    res.render("popup", {
        title: "Pop Up",
        user: null
    });
});


app.get('/jobsingle', (req, res) => {
    res.render("jobsingle", {
        title: "Find JOB",
        user: ''
    });
});
app.get('/chati', checkRole.checkUserRole, (req, res) => {
    res.render("messages", {
        title: "Chat App",
        user: req.UserRole,
        chatId: null,
        userId: req.UserRole._id,

    });
});


server.listen(port, () => {
    console.log('Server is running on port  :) ..' + port);
})