import { Router } from "express";
import passport from "passport";
import { UserController } from '../controllers/users.controller.js';

const UsersRouter = Router();
const {
    postSignup,
    postLogin,
    getSignOut,
} = new UserController();

UsersRouter.post("/signup", passport.authenticate("signup", { 
    failureRedirect: "/failregister" 
}), postSignup);
UsersRouter.post('/login', postLogin);
UsersRouter.get("/signout", getSignOut);

export default UsersRouter;
