import cartModel from "../dao/models/cart.model.js";
import productModel from "../dao/models/product.model.js";
import Ticket from "../dao/models/ticket.model.js";
import { ProductManagerMongo } from "../dao/services/managers/ProductManagerMongo.js";
import User from "../dao/models/user.model.js";

export class CartRepository {
    constructor(){
        this.model = cartModel;
        this.productsService = new ProductManagerMongo();
        this.userService = User;
    }

    async getCarts(){
        try {
            return await this.model.find({}).populate('products');
        } catch (error) {
            console.error(
                "Error al mostrar carritos", error
            )
            throw error;
        }
    }

    async getCartById(cid) {
        try {
            return await this.model.findById(cid).populate('products');
        } catch (error) {
            console.error(
                "Error al obtener el carrito:", error
            )
            throw error;
        }
    }
    
    async addCart(userEmail) {
        const newCart = {
            products: [],
            userEmail: userEmail // Asignar el correo electrónico del usuario al carrito
        };
        return await this.model.create(newCart)
    }

    async addToCart(cid, pid) {
        try {
            const cartExists = await this.model.findOne({ _id: cid });
            if (!cartExists) {
                throw new Error(`No se encontró el carrito con id ${cid}`);
            }
    
            const productExists = await productModel.findOne({ _id: pid });
            if (!productExists) {
                throw new Error(`No se encontró el producto con id ${pid}`);
            }
    
            const existingProduct = cartExists.products.find(product => product.productId.toString() === pid.toString());
           
            if (existingProduct) {
                existingProduct.quantity++;
            } else {
                cartExists.products.push({
                    productId: pid,
                    product: productExists,
                    quantity: 1
                });
            }
    
            await cartExists.save(); 
            return "Producto agregado exitosamente";
        } catch (error) {
            console.error(
                "Error al agregar el producto al carrito:", error
            )
            throw error;
        }
    }
    
    async updateCart(cart) {
        try {
            await this.model.findByIdAndUpdate(cart._id, cart);
            return "Carrito actualizado exitosamente";
        } catch (error) {
            console.error(
                "Error al actualizar el carrito:", error
            )
            throw error;
        }
    }

    async deleteProduct(pid, cid) {
        try {
            const cart = await this.model.findById(cid);
            if (!cart) {
                throw new Error(`No se encontró el carrito con id ${cid}`);
            }
    
            const productIndex = cart.products.findIndex(product => product.productId.toString() === pid.toString());
            if (productIndex === -1) {
                throw new Error(`No se encontró el producto con id ${pid} en el carrito`);
            }
    
            cart.products.splice(productIndex, 1); 

            await this.updateCart(cart);

            return "Producto eliminado exitosamente del carrito";
        } catch (error) {
            console.error(
                "Error al eliminar el producto del carrito:", error
            )
            throw error;
        }
    }

    async updateProductQuantity(cid, pid, quantity) {
        try {
            const cart = await this.model.findById(cid);
            if (!cart) {
                throw new Error(`No se encontró el carrito con id ${cid}`);
            }

            const productIndex = cart.products.findIndex(product => product.productId.toString() === pid.toString());
            if (productIndex === -1) {
                throw new Error(`No se encontró el producto con id ${pid} en el carrito`);
            }

            cart.products[productIndex].quantity = quantity;

            await this.updateCart(cart);

            return "Cantidad de producto actualizada exitosamente";

        } catch (error) {
            console.error(
                "Error al actualizar la cantidad del producto en el carrito:", error
            )
            throw error;
        }
    }

    async deleteAllProducts(cid) {
        try {
            const cart = await this.model.findById(cid);
            if (!cart) {
                throw new Error(`No se encontró el carrito con id ${cid}`);
            }
    
            cart.products = []; 
    
            await this.updateCart(cart);
    
            return "Todos los productos fueron eliminados del carrito exitosamente";
        } catch (error) {
            console.error(
                "Error al eliminar todos los productos del carrito:", error 
            )
            throw error;
        }
    }

    async checkout(cartId) {
        try {
            function generateUniqueCode() {
                // Generar un código único usando la fecha actual, por ejemplo
                const timestamp = new Date().getTime();
                const random = Math.floor(Math.random() * 1000); // Número aleatorio entre 0 y 999
                return `${timestamp}-${random}`;
            }            
    
            // Obtener el carrito por su ID
            const cart = await this.getCartById(cartId);
            console.log(cart)
            console.log(cartId)
            console.log(cart._id)
    
            // Obtener el usuario asociado al carrito
            const user = await User.findOne({ cart: cart._id });
            if (!user) {
                throw new Error('No se encontró el usuario asociado al carrito');
            }
    
            // Obtener el correo electrónico del usuario
            const userEmail = user.email;
    
            // Filtrar los productos que tienen stock suficiente y los que no
            const productsInTicket = [];
            const productsInCart = [];
            let totalAmount = 0; // Inicializamos el monto total en 0
            for (const product of cart.products) {
                const productDetails = await productModel.findById(product.productId);
    
                if (productDetails.stock >= product.quantity) {
                    const subtotal = productDetails.price * product.quantity; // Calculamos el subtotal del producto
                    totalAmount += subtotal; // Sumamos el subtotal al monto total
                    productsInTicket.push({
                        productId: productDetails._id,
                        quantity: product.quantity,
                        price: productDetails.price,
                        subtotal: subtotal // Agregamos el subtotal al objeto del producto en el ticket
                    });
    
                    // Descontar el stock del producto
                    productDetails.stock -= product.quantity;
                    await productDetails.save();
                } else {
                    // Mantener el producto en el carrito con stock en 0
                    productsInCart.push({
                        productId: productDetails._id,
                        quantity: 0, // Establecer la cantidad en 0
                        price: productDetails.price,
                        subtotal: 0 // Establecer el subtotal en 0
                    });
                }
            }
    
            // Actualizar el carrito con los productos que tienen stock suficiente
            cart.products = productsInCart;
            await cart.save();
    
            // Generar el ticket con los productos que tienen stock y sus detalles
            const ticket = new Ticket({
                code: generateUniqueCode(), // Función para generar un código único
                purchaser: userEmail, // Email del usuario que realiza la compra
                products: productsInTicket, // Agregamos los productos al ticket
                totalAmount: totalAmount // Agregamos el monto total al ticket
            });
    
            // Guardar el ticket
            await ticket.save();
    
            return ticket;
        } catch (error) {
            console.error(
                "Error al procesar la compra:", error
            )
            throw error;
        }
    }    
}
