import express from 'express';
import mongoose from "mongoose";
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import handlebars from 'express-handlebars';
import path from 'path';
import session from 'express-session';
import MongoStore from 'connect-mongo';
import passport from 'passport';
import cookieParser from 'cookie-parser';
import initializePassport from './config/passport.config.js';
import utils from './utils.js';
import router from './routes/index.js';
import dotenv from 'dotenv';
import UserDTO from './dao/dto/user.dto.js';
import { Server } from 'socket.io';
import { chatMM } from './routes/chat.router.js';
import errorHandler from './middlewares/errors/index.js';
import { addLogger } from './utils/logger.js';

dotenv.config();

const { passportCall } = utils;

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const app = express();
const PORT = process.env.PORT

// Middleware para Loggers
app.use(addLogger)

// Configuración de Handlebars
app.engine("handlebars", handlebars.engine())
app.set("views", path.join(__dirname, 'views'))
app.set('view engine', "handlebars")
app.use(express.static(path.join(__dirname, "public")))

// Middleware para manejar solicitudes JSON
app.use(express.json());
app.use(cookieParser())
app.use(express.urlencoded({ extended: true }));

const mongooseUrl = process.env.MONGOOSE_URL;

// Middleware de sesión con Passport
app.use(session({
    store: MongoStore.create({
        mongoUrl: mongooseUrl,
        ttl: 60 * 60 
    }),
    secret: "12345678",
    resave: false,
    saveUninitialized: false
}));

// Configuración de Passport
initializePassport();
app.use(passport.initialize());
app.use(passport.session());

// Endpoint para cerrar sesión
app.get("/logout", (req, res) => {
    req.logout();
    res.redirect("/login");
});

// Rutas de autenticación
app.get('/current', passportCall('login', ['premium', 'admin']), (req, res) => {
    if (req.isAuthenticated()) {
        const userDTO = new UserDTO(req.user);
        res.render('current', { user: userDTO });
    } else {
        res.redirect('/login');
    }
});

// Manejo de errores para rutas de inicio de sesión fallidas
app.get("/failregister", (req, res) => {
    req.logger.error(
        `Fallo en el registro!, ${req.method} en ${req.url} - ${new Date().toLocaleDateString()}`
    )
    res.status(400).send({ error: "Fallo en el registro" })
});

app.get("/faillogin", (req, res) => {
    req.logger.error(
        `Login fallido!, ${req.method} en ${req.url} - ${new Date().toLocaleDateString()}`
    )
    res.status(400).send({ error: "Fallo en el login" })
});

app.use(router);

// Manejo de errores
app.use((err, req, res, next) => {
    req.logger.fatal(
        `Algo se rompió!, ${req.method} en ${req.url} - ${new Date().toLocaleDateString()}`
    )
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

const httpServer = app.listen(PORT, () => {
    console.log (`Server is running on port ${PORT}`)
})

// Socket.io
const io = new Server(httpServer);

const users = {}

io.on("connection", (socket) => {
    socket.on("newUser", (username) => {
        users[socket.id] = username
        io.emit("userConnected", username)
    })

    socket.on("chatMessage", async (data) => {
        const { username, message } = data;
        try {
            await chatMM.addChat(username, message);
            io.emit("message", { username, message });
        } catch (error) {
            console.error(
                "Error al procesar el mensaje del chat!", error
            )
        }
    });

    socket.on("disconnect", () => {
        const username = users[socket.id]
        delete users[socket.id]
        io.emit("userDisconnected", username)
    })
})

const environment = async () => {
    await mongoose.connect(mongooseUrl)
        .then(() => {
            console.log("Conectado a la base de datos")
        })
        .catch(error => {
            console.error("Error al conectarse", error)
        })
}

app.use(errorHandler);

environment();
