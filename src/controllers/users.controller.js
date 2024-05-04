import { UserManagerMongo } from '../dao/services/managers/UserManagerMongo.js';
import jwt from "jsonwebtoken";
import utils from "../utils.js";
import UserDTO from '../dao/dto/user.dto.js'; // Importa el UserDTO

export class UserController {
    constructor(){
        this.usersService = new UserManagerMongo();
    }

    postSignup = async (req, res) => {
        res.redirect("/login"); 
    }
    
    postLogin = async (req, res) => {
        const { email, password } = req.body;
        try {
            let user = await this.usersService.findByEmail(email);
            req.logger.debug(
                `Usuario encontrado: ${user}, ${req.method} en ${req.url} - ${new Date().toLocaleDateString()}`
            )
            
            if (!user) {
                return res
                    .status(401)
                    .send({ status: 'error', message: 'El usuario no existe' });
            }
            const isValid = utils.isValidatePassword(user, password);
            req.logger.debug(
                `Contraseña válida: ${isValid}, ${req.method} en ${req.url} - ${new Date().toLocaleDateString()}`
            )
    
            if (!isValid) {
                return res
                    .status(401)
                    .redirect('/faillogin');
            }
    
            // Crear una instancia de UserDTO y pasar el objeto de usuario
            
            const userDTO = new UserDTO(user);
            const tokenUser = {
                _id: user._id, 
                email: user.email,
                first_name: user.first_name,
                role: user.role,
                cart: user.cart,
                password: user.password
            }
    
            const token = jwt.sign(tokenUser, "12345678", {expiresIn: "1d"});
            req.logger.debug(
                `Token JWT generado: ${token}, ${req.method} en ${req.url} - ${new Date().toLocaleDateString()}`
            )
    
            res
                .cookie("coderCookieToken", token, {
                    maxAge: 60 * 60 * 1000 * 24,
                    httpOnly: true,
                })
                .send({status: "success", user: userDTO}); // Enviar el usuario formateado como respuesta
                
        } catch (error) {
            req.logger.error(
                `${error}, ${req.method} en ${req.url} - ${new Date().toLocaleDateString()}`
            )

            res.status(500).send({ status: "error", message: "Error en el servidor" });
        }
    }
    
    getSignOut = async (req, res) => {
        req.session.destroy(() => {
            res.redirect("/login");
        });
    }

}

