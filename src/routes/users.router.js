import { Router } from "express";
import passport from "passport";
import { UserController } from '../controllers/users.controller.js';
import upload from "../config/upload.js";
import utils from "../utils.js";

const { passportCall } = utils;

const UsersRouter = Router();
const {
    postSignup,
    postLogin,
    getSignOut,
    recuperoPass,
    getRecover,
    getResetPassword,
    postResetPassword,
    uploadDocuments,
    getUsers,
    editUserRole,
    deleteUser,
    deleteInactiveUsers,
} = new UserController();

UsersRouter.post("/signup", passport.authenticate("signup", { 
    failureRedirect: "/failregister" 
}), postSignup);
UsersRouter.post('/login', postLogin);
UsersRouter.get("/signout", getSignOut);
UsersRouter.get("/recover-password", getRecover);
UsersRouter.post("/recover-password", recuperoPass);
UsersRouter.get("/reset-password", getResetPassword);
UsersRouter.post("/reset-password", postResetPassword);
UsersRouter.post('/:userId/documents', upload.array('documents'), uploadDocuments);

// Rutas protegidas por el rol admin

UsersRouter.get("/users", passportCall('login', 'admin'), getUsers);
UsersRouter.put("/:id", passportCall('login', 'admin'), editUserRole);
UsersRouter.delete("/:id", passportCall('login', 'admin'), deleteUser);
UsersRouter.delete("/users/inactive", passportCall('login', 'admin'), deleteInactiveUsers);

export default UsersRouter;
