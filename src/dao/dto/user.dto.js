export default class UserDTO {
    constructor(user) {
        this.first_name = user.first_name;
        this.last_name = user.last_name;
        this._id = user._id;
        this.role = user.role;
        this.email = user.email;
        this.cart = user.cart;
        this.last_connection = user.last_connection;
        this.password = this.maskPassword(user.password);
    }

    maskPassword(password) {
        // Formatear la contraseña con cruces
        return '*'.repeat(password.length);
    }
}

