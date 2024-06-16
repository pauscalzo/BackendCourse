import { Router } from "express";
import passport from "passport";
import { UserController } from '../controllers/users.controller.js';
import upload from "../config/upload.js";

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

export default UsersRouter;
