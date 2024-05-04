import { ProductManagerMongo } from '../dao/services/managers/ProductManagerMongo.js';
import { CartManagerMongo } from '../dao/services/managers/CartManagerMongo.js';
import { UserRepository } from '../repositories/user.repository.js';

export class CartController {
    constructor(){
        this.productsService = new ProductManagerMongo();
        this.cartsService = new CartManagerMongo();
        this.userService = new UserRepository();
    }
    getCarts = async (req, res) => {
        try {
            let result = await this.cartsService.getCarts()
            res.send ({result: "success", payload: result})
        } catch (error){
            req.logger.error(
                `Error al cargar los carritos! ${error}, ${req.method} en ${req.url} - ${new Date().toLocaleDateString()}`
            )
        }
    }

    getCartById = async (req, res) => {
        try {
            const { cid } = req.params;
            const cart = await this.cartsService.getCartById(cid);
            
            const productsDetails = [];
            let totalPrice = 0; // Inicializamos el total en 0
            
            for (const product of cart.products) {
                const productDetails = await this.productsService.getProduct(product.productId);
                const productWithQuantity = { ...productDetails, quantity: product.quantity }; 
                productsDetails.push(productWithQuantity);
                
                // Calculamos el subtotal de cada producto y lo sumamos al total
                const subtotal = productDetails.price * product.quantity;
                totalPrice += subtotal;
            }
            req.logger.debug(
                `${productsDetails}, ${req.method} en ${req.url} - ${new Date().toLocaleDateString()}`
            )
            
            res.render("carts", { cart, productsDetails, totalPrice, cartId: cart._id }); // Pasamos el total a la vista
        } catch (error) {
            req.logger.error(
                `error al obtener el carrito ${error}, ${req.method} en ${req.url} - ${new Date().toLocaleDateString()}`
            )
            res.status(500).send({ error: error.message });
        }
    }
    
    addCart = async (req, res) => {
        let result = await this.cartsService.addCart ()
        res.send ({result: "success", payload: result})
    }
    
    addToCart = async (req, res) => {
        try {
            let { cid, pid } = req.params;
            
            let result = await this.cartsService.addToCart (cid, pid)
            
            res.send ({result: "success", payload: result})
        } catch (error) {
            req.logger.error(
                `error al agregar producto al carrito ${error}, ${req.method} en ${req.url} - ${new Date().toLocaleDateString()}`
            )
        }
        
    }
    
    updateProductQuantity = async (req, res) => {
        try {
            const { cid, pid } = req.params;
            const { quantity } = req.body;
            const result = await this.cartsService.updateProductQuantity(cid, pid, quantity);
            res.send({ result: "success", payload: result });
        } catch (error) {
            req.logger.error(
                `error al actualizar la cantidad del producto en el carrito ${error}, ${req.method} en ${req.url} - ${new Date().toLocaleDateString()}`
            )
            res.status(500).send({ error: error.message });
        }
    }

    updateCart = async (req, res) => {
        try {
            const { cid } = req.params;
            const result = await this.cartsService.updateCart(cid);
            res.send({ result: "success", payload: result });
        } catch (error) {
            req.logger.error(
                `error al actualizar el carrito ${error}, ${req.method} en ${req.url} - ${new Date().toLocaleDateString()}`
            )
            res.status(500).send({ error: error.message });
        }
    }

    deleteProduct = async(req, res) => {
        let {cid, pid} = req.params 
        let result = await this.cartsService.deleteProduct(pid, cid) 
        res.send ({result:"success", payload: result})
    }

    deleteAllProducts = async(req, res) => {
        try {
            const { cid } = req.params;
            const result = await this.cartsService.deleteAllProducts(cid);
            res.send({ result: "success", payload: result });
        } catch (error) {
            req.logger.error(
                `error al eliminar todos los productos del carrito ${error}, ${req.method} en ${req.url} - ${new Date().toLocaleDateString()}`
            )
            res.status(500).send({ error: error.message });
        }
    }

    checkout = async(req, res) => {
        try {
            const { cid } = req.params;
            req.logger.debug(
                `cart ID: ${cid}, ${req.method} en ${req.url} - ${new Date().toLocaleDateString()}`
            ) // Verificamos que se haya obtenido correctamente el ID del carrito
    
            const cart = await this.cartsService.getCartById(cid);
            req.logger.debug(
                `Cart details: ${cart}, ${req.method} en ${req.url} - ${new Date().toLocaleDateString()}`
            ) // Verificamos los detalles del carrito obtenidos
    
            const ticket = await this.cartsService.checkout(cart);
    
            // Redirigir al usuario a la ruta de compra exitosa con el ID del ticket
            res.redirect(`${cid}/purchase`);
        } catch (error) {
            req.logger.error(
                `error al procesar la compra ${error}, ${req.method} en ${req.url} - ${new Date().toLocaleDateString()}`
            )
            res.status(500).send({ error: error.message });
        }
    }
    
    getPurchase = async (req, res) => {
        try {
            const { cid } = req.params;
            res.json({ message: `Compra exitosa para el carrito ${cid}!` });
        } catch (error){
            req.logger.error(
                `error en la confirmación de compra ${error}, ${req.method} en ${req.url} - ${new Date().toLocaleDateString()}`
            )
        }
    }

    getUserCartId = async (req, res) => {
        try {
            // Obtener el ID de usuario del usuario autenticado
            const userId = req.user._id;
            req.logger.debug(
                `ID del usuario: ${userID}, ${req.method} en ${req.url} - ${new Date().toLocaleDateString()}`
            )
    
            // Buscar al usuario en la base de datos por su ID
            const user = await this.userService.findById(userId);
    
            // Si se encuentra el usuario, devolver su cartId
            if (user) {
                req.logger.debug(
                    `Cart ID del usuario: ${user.cart}, ${req.method} en ${req.url} - ${new Date().toLocaleDateString()}`
                )
                res.status(200).json({ cartId: user.cart });
            } else {
                res.status(404).json({ error: 'Usuario no encontrado' });
            }
        } catch (error) {
            req.logger.error(
                `Error al obtener el cartId del usuario ${error}, ${req.method} en ${req.url} - ${new Date().toLocaleDateString()}`
            )
            res.status(500).json({ error: 'Error interno del servidor' });
        }
    }

}