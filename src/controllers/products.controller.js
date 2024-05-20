import { ProductManagerMongo } from '../dao/services/managers/ProductManagerMongo.js';
import CustomError from '../services/errors/CustomError.js';
import EError from '../services/errors/enums.js';
import { generateErrorInfo } from '../services/errors/info-products.js';
import productModel from '../dao/models/product.model.js';


export class ProductController {
    constructor(){
        this.productsService = new ProductManagerMongo();
    }
    getHome = (req, res) => {
        res.redirect('/products?page=1');
    }

    getLogin = (req, res) => {
        res.render("login");
    }

    getSignup = (req, res) => {
        res.render("signup");
    }

    getProducts = async (req, res) => {
        try {
            const page = req.query.page ? parseInt(req.query.page) : 1;
            const limit = req.query.limit ? parseInt(req.query.limit) : 10;
            const sortOrder = req.query.sort ? req.query.sort : null;
            const category = req.query.category ? req.query.category : null;
            const status = req.query.status ? req.query.status : null;
    
            // Verificar si el usuario está autenticado y obtener su ID de carrito
            let cartId = null;
            if (req.isAuthenticated()) {
                const user = req.user;
                cartId = user.cart ? user.cart : null;
            }
    
            const result = await this.productsService.getProducts(page, limit, sortOrder, category, status);
    
            result.prevLink = result.hasPrevPage ? `/products?page=${result.prevPage}` : '';
            result.nextLink = result.hasNextPage ? `/products?page=${result.nextPage}` : '';
            result.isValid = !(page <= 0 || page > result.totalPages);
    
            res.render('products', { user: req.user, products: result.docs, cartId, ...result });
    
        } catch (error) {
            req.logger.error(
                `error al obtener los productos: ${error}, ${req.method} en ${req.url} - ${new Date().toLocaleDateString()}`
            )
            
        }
    }    
    
    getProductById = async (req, res) => {
        let { pid } = req.params;
        let result = await this.productsService.getProduct(pid);
        res.send({ result: "success", payload: result });
    }
    
    addProduct = async (req, res, next) => {
        try {
            let { title, description, price, thumbnail, code, stock, category, status } = req.body;
            const owner = req.user._id;
            req.logger.debug(
                `Datos recibidos para agregar el producto: ${req.body}, ${req.method} en ${req.url} - ${new Date().toLocaleDateString()}`
            )
            
            if (!title || !description || !price || !thumbnail || !code || !stock || !category || !status) {
                const err = new CustomError(
                    "error creando el producto",
                    generateErrorInfo({ title, description, price, thumbnail, code, stock, category, status }),
                    "error al intentar crear el producto",
                    EError.INVALID_TYPES_ERROR
                );
                return next(err);
            }
            let result = await this.productsService.addProduct({ title, description, price, thumbnail, code, stock, category, status, owner });
            req.logger.info(
                `Producto agregado con éxito: ${result}, ${req.method} en ${req.url} - ${new Date().toLocaleDateString()}`
            )
            
            res.send({ result: "success", payload: result });
        } catch (error) {
            req.logger.error(
                `Error al agregar el producto: ${error}, ${req.method} en ${req.url} - ${new Date().toLocaleDateString()}`
            )
            res.status(500).send({ error: "Error interno del servidor" });
        }
    }
    
    
    updateProduct = async (req, res) => {
        try {
            let { pid } = req.params;
            let updatedProduct = req.body;
            let result = await this.productsService.updateProduct(pid, updatedProduct);
            res.send({ result: "success", payload: result });
        } catch (error) {
            req.logger.error(
                `Error al actualizar el producto: ${error}, ${req.method} en ${req.url} - ${new Date().toLocaleDateString()}`
            )
            
            res.status(500).send({ error: error.message });
        }
    }
    
    async deleteProduct(req, res) {
        try {
            const pid = req.params.pid;
            const userId = req.user._id;
            const userRole = req.user.role;

            const product = await productModel.findById(pid);
            if (!product) {
                return res.status(404).send({ error: 'Producto no encontrado' });
            }

            console.log(`Product Owner: ${product.owner}`);

            if (userRole === 'admin' || (userRole === 'premium' && product.owner.equals(userId))) {
                await productModel.findByIdAndDelete(pid);
                return res.status(200).send({ result: 'success', message: 'Producto eliminado' });
            } else {
                return res.status(403).send({ error: 'No tiene permiso para eliminar este producto' });
            }
        } catch (error) {
            console.error('Error al eliminar el producto:', error);
            res.status(500).send({ error: 'Error al eliminar el producto' });
        }
    }
}

