import { CartRepository } from '../../../repositories/cart.repository.js';

export class CartManagerMongo {
    constructor(){
        this.cartRepository = new CartRepository();
    }

    async getCarts(){
        try {
            return await this.cartRepository.getCarts();
        } catch (error) {
            console.error(
                "Error al mostrar carritos:", error
            )
            throw error;
        }
    }

    async getCartById(cid) {
        try {
            return await this.cartRepository.getCartById(cid);
        } catch (error) {
            console.error(
                "Error al obtener el carrito:", error
            )
            throw error;
        }
    }
    
    async addCart(){
        try {
            return await this.cartRepository.addCart();
        } catch (error) {
            console.error(
                "Error al agregar un nuevo carrito:", error
            )
            
            throw error;
        }
    }

    async addToCart(cid, pid) {
        try {
            return await this.cartRepository.addToCart(cid, pid);
        } catch (error) {
            console.error(
                "Error al agregar producto al carrito:", error
            )
            throw error;
        }
    }
    
    async updateCart(cart) {
        try {
            return await this.cartRepository.updateCart(cart);
        } catch (error) {
            console.error(
                "Error al actualizar el carrito:", error
            )
            throw error;
        }
    }

    async deleteProduct(pid, cid) {
        try {
            return await this.cartRepository.deleteProduct(pid, cid);
        } catch (error) {
            console.error(
                "Error al eliminar el producto del carrito:", error
            )
            throw error;
        }
    }

    async updateProductQuantity(cid, pid, quantity) {
        try {
            return await this.cartRepository.updateProductQuantity(cid, pid, quantity);
        } catch (error) {
            console.error(
                "Error al actualizar la cantidad del producto en el carrito:", error
            )
            throw error;
        }
    }

    async deleteAllProducts(cid) {
        try {
            return await this.cartRepository.deleteAllProducts(cid);
        } catch (error) {
            console.error(
                "Error al eliminar todos los productos del carrito:", error
            )
            throw error;
        }
    }

    async checkout(cart, userEmail) {
        try {
            return await this.cartRepository.checkout(cart, userEmail);
        } catch (error) {
            console.error(
                "Error al procesar la compra:", error
            )
            throw error;
        }
    }
}





