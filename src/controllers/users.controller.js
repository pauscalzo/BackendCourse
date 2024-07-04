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

            // Actualizar last_connection en el login
            user.last_connection = new Date();
            await this.usersService.updateUser(user._id, user);

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
        try {
            // Obtener el token del usuario desde las cookies
            const token = req.cookies["coderCookieToken"];
            if (!token) {
                return res.status(401).send({ status: 'error', message: 'Usuario no autenticado' });
            }

            const decodedToken = jwt.verify(token, "12345678");
            let user = await this.usersService.findById(decodedToken._id);

            if (user) {
                // Actualizar last_connection en el logout
                user.last_connection = new Date();
                await this.usersService.updateUser(user._id, user);
            }

            req.session.destroy(() => {
                res.clearCookie("coderCookieToken");
                res.redirect("/login");
            });
        } catch (error) {
            req.logger.error(
                `${error}, ${req.method} en ${req.url} - ${new Date().toLocaleDateString()}`
            );
            res.status(500).send({ status: "error", message: "Error en el servidor" });
        }
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

    uploadDocuments = async (req, res) => {
        try {
            const { userId } = req.params;
            const user = await this.usersService.findById(userId);
            if (!user) {
                return res.status(404).send({ status: 'error', message: 'Usuario no encontrado' });
            }

            const documents = req.files.map(file => ({
                name: file.originalname,
                reference: file.path
            }));

            user.documents = user.documents.concat(documents);
            await this.usersService.updateUser(user._id, user);

            res.send({ status: 'success', message: 'Documentos subidos', documents: user.documents });
        } catch (error) {
            req.logger.error(`${error}, ${req.method} en ${req.url} - ${new Date().toLocaleDateString()}`);
            res.status(500).send({ status: 'error', message: 'Error en el servidor' });
        }
    }
    getUsers = async (req, res) => {
        try {
            const users = await this.usersService.findAll();
            const usersDTO = users.map(user => new UserDTO(user));
            
            // Preprocesar datos para la selección
            usersDTO.forEach(user => {
                user.isUserRole = user.role === 'user' ? 'selected' : '';
                user.isAdminRole = user.role === 'admin' ? 'selected' : '';
            });
    
            res.render('users', { users: usersDTO });
        } catch (error) {
            req.logger.error(`${error}, ${req.method} en ${req.url} - ${new Date().toLocaleDateString()}`);
            res.status(500).send({ status: 'error', message: 'Error en el servidor', error: error.message });
        }
    }
    

    editUserRole = async (req, res) => {
        const { id } = req.params;
        const { role } = req.body;
        console.log(`ID recibido: ${id}, Rol: ${role}`);
        try {
            const updatedUser = await this.usersService.updateUser(id, { role });
            if (!updatedUser) {
                return res.status(404).send({ status: 'error', message: 'Usuario no encontrado' });
            }
            res.send({ status: 'success', message: 'Rol actualizado', user: new UserDTO(updatedUser) });
        } catch (error) {
            req.logger.error(`${error}, ${req.method} en ${req.url} - ${new Date().toLocaleDateString()}`);
            res.status(500).send({ status: 'error', message: 'Error en el servidor' });
        }
    }
    
    deleteUser = async (req, res) => {
        const { id } = req.params;
        try {
            const deletedUser = await this.usersService.deleteUser(id);
            if (!deletedUser) {
                return res.status(404).send({ status: 'error', message: 'Usuario no encontrado' });
            }
            res.send({ status: 'success', message: 'Usuario eliminado' });
        } catch (error) {
            req.logger.error(`${error}, ${req.method} en ${req.url} - ${new Date().toLocaleDateString()}`);
            res.status(500).send({ status: 'error', message: 'Error en el servidor' });
        }
    } 

    deleteInactiveUsers = async (req, res) => {
        const TWO_DAYS_IN_MS = 2 * 24 * 60 * 60 * 1000; // 2 días en milisegundos
        try {
            const inactiveThreshold = new Date(Date.now() - TWO_DAYS_IN_MS);

            // Buscar usuarios que no han iniciado sesión desde hace más de 2 días
            const inactiveUsers = await this.usersService.find({
                last_connection: { $lt: inactiveThreshold },
            });

            if (inactiveUsers.length === 0) {
                return res.send({ status: 'error', message: 'No hay usuarios inactivos para eliminar.' });
            }

            // Eliminar usuarios inactivos
            for (let user of inactiveUsers) {
                await this.usersService.deleteUser(user._id);

                // Enviar correo de notificación
                const mailer = new MailingService();
                await mailer.sendSimpleMail({
                    from: "your-email@example.com",
                    to: user.email,
                    subject: "Notificación de Baja por Inactividad",
                    html: `<p>Hola ${user.first_name},</p>
                        <p>Tu cuenta ha sido eliminada debido a inactividad.</p>`,
                });

                console.log(`Usuario ${user.email} eliminado y notificación enviada.`);
            }

            res.send({ status: 'success', message: 'Usuarios inactivos eliminados y notificados.' });
        } catch (error) {
            console.error('Error al eliminar usuarios inactivos:', error);
            res.status(500).send({ status: 'error', message: 'Error en el servidor' });
        }
    }
}
