import { UserRepository } from "../../../repositories/user.repository.js";

export class UserManagerMongo {
    constructor(){
        this.repository = new UserRepository();
    }

    async findById(id) {
        return await this.repository.findById(id);
    }

    async findByEmail(email) {
        return await this.repository.findByEmail(email);
    }

    async createOne(obj) {
        return await this.repository.createOne(obj);
    }

    async findAll() {
        return await this.repository.findAll();
    }

    async updateUser(id, update) {
        try {
            const updatedUser = await this.repository.updateOne(id, update);
            return updatedUser;
        } catch (error) {
            console.error(
                "Error al actualizar un usuario:", error
            );
            throw error;
        }
    }
    
    async deleteUser(id) {
        try {
            const deletedUser = await this.repository.deleteOne(id);
            return deletedUser;
        } catch (error) {
            console.error("Error al eliminar un usuario:", error);
            throw error;
        }
    }

    async find(criteria) {
        return await this.repository.find(criteria);
    }
    
}
