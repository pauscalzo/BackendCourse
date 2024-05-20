import User from "../dao/models/user.model.js";

export class UserRepository {
    constructor(){
        this.model = User;
    }

    async findById(id) {
        try {
            const user = await this.model.findById(id);
            return user;
        } catch (error) {
            console.error(
                "Error al buscar usuario por ID:", error
            )
            throw error;
        }
    }

    async findByEmail(email) {
        try {
            const user = await this.model.findOne({ email });
            return user;
        } catch (error) {
            console.error(
                "Error al buscar usuario por email:", error
            )
            throw error;
        }
    }

    async createOne(obj) {
        try {
            const user = await this.model.create(obj);
            return user;
        } catch (error) {
            console.error(
                "Error al crear un usuario:", error
            )
            throw error;
        }
    }

    async updateOne(id, update) {
        try {
            const updatedUser = await this.model.findByIdAndUpdate(id, update, { new: true });
            return updatedUser;
        } catch (error) {
            console.error(
                "Error al actualizar un usuario:", error
            )
            throw error;
        }
    }
}


