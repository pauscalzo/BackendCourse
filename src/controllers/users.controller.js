import { UserManagerMongo } from '../dao/services/managers/UserManagerMongo.js';
import jwt from "jsonwebtoken";
import utils from "../utils.js";
import UserDTO from '../dao/dto/user.dto.js';
import MailingService from "../services/mailing.js";

export class UserController {
    constructor(){
        this.usersService = new UserManagerMongo();
    }

    postSignup = async (req, res) => {
        res.redirect("/login"); 
    }

    getRecover = async (req, res) => {
        console.log('Ruta /recover-password alcanzada');
        res.render("recoverPassword");
    }
    
    postLogin = async (req, res) => {
        const { email, password } = req.body;
        try {
            let user = await this.usersService.findByEmail(email);
            req.logger.debug(
                `Usuario encontrado: ${user}, ${req.method} en ${req.url} - ${new Date().toLocaleDateString()}`
            );
            
            if (!user) {
                return res
                    .status(401)
                    .send({ status: 'error', message: 'El usuario no existe' });
            }
            const isValid = utils.isValidatePassword(user, password);
            req.logger.debug(
                `Contraseña válida: ${isValid}, ${req.method} en ${req.url} - ${new Date().toLocaleDateString()}`
            );
    
            if (!isValid) {
                return res
                    .status(401)
                    .redirect('/faillogin');
            }
    
            const userDTO = new UserDTO(user);
            const tokenUser = {
                _id: user._id, 
                email: user.email,
                first_name: user.first_name,
                role: user.role,
                cart: user.cart,
                password: user.password
            };
    
            const token = jwt.sign(tokenUser, "12345678", {expiresIn: "1h"});
            req.logger.debug(
                `Token JWT generado: ${token}, ${req.method} en ${req.url} - ${new Date().toLocaleDateString()}`
            );
    
            res
                .cookie("coderCookieToken", token, {
                    maxAge: 60 * 60 * 1000 * 24,
                    httpOnly: true,
                })
                .send({status: "success", user: userDTO});
                
        } catch (error) {
            req.logger.error(
                `${error}, ${req.method} en ${req.url} - ${new Date().toLocaleDateString()}`
            );

            res.status(500).send({ status: "error", message: "Error en el servidor" });
        }
    }
    
    getSignOut = async (req, res) => {
        req.session.destroy(() => {
            res.redirect("/login");
        });
    }

    recuperoPass = async (req, res) => {
        const { email } = req.body;
        try {
            let user = await this.usersService.findByEmail(email);
            if (!user) {
                return res.status(401).send({ status: 'error', message: 'El usuario no existe' });
            }
    
            const token = jwt.sign({ email: user.email }, "secretKey", { expiresIn: '1h' });
    
            const mailer = new MailingService();
            const result = await mailer.sendSimpleMail({
                from: "Coder",
                to: user.email,
                subject: "Recupero de Contraseña",
                html: `<div><h1>Recuperación de contraseña</h1>
                       <p>Para resetear tu contraseña, haz clic en el siguiente enlace:</p>
                       <a href="http://localhost:8080/api/sessions/reset-password?token=${token}">Recuperar contraseña</a>
                       </div>`,
            });
    
            res.send({ status: 'success', message: 'Correo enviado' });
        } catch (error) {
            req.logger.error(`${error}, ${req.method} en ${req.url} - ${new Date().toLocaleDateString()}`);
            res.status(500).send({ status: 'error', message: 'Error en el servidor' });
        }
    };

    getResetPassword = (req, res) => {
        const { token } = req.query;
        res.render("resetPassword", { token });
    }

    postResetPassword = async (req, res) => {
        const { token, password } = req.body;
        try {
            const decoded = jwt.verify(token, "secretKey");
            const { email } = decoded;
            const user = await this.usersService.findByEmail(email);
            if (!user) {
                return res.status(401).send({ status: 'error', message: 'El usuario no existe' });
            }

            const isSamePassword = utils.isValidatePassword(user, password);
            if (isSamePassword) {
                return res.status(400).send({ status: 'error', message: 'La nueva contraseña no puede ser igual a la anterior' });
            }
    
            user.password = utils.createHash(password);
            await this.usersService.updateUser(user._id, user);
            res.send({ status: 'success', message: 'Contraseña actualizada' });
        } catch (error) {
            if (error.name === "TokenExpiredError") {
                return res.redirect(`/api/sessions/recover-password?error=El enlace ha expirado, solicita uno nuevo.`);
            } else {
                req.logger.error(`${error}, ${req.method} en ${req.url} - ${new Date().toLocaleDateString()}`);
                res.status(500).send({ status: 'error', message: 'Error en el servidor' });
            }
        }
    }
}






