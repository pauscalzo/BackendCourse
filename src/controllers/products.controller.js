import { ProductManagerMongo } from '../dao/services/managers/ProductManagerMongo.js';
import CustomError from '../services/errors/CustomError.js';
import EError from '../services/errors/enums.js';
import { generateErrorInfo } from '../services/errors/info-products.js';

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
            req.logger.error(`error al obtener los productos: ${error}, ${req.method} en ${req.url} - ${new Date().toLocaleDateString()}`);
        }
    }    
    
    getProductById = async (req, res) => {
        let { pid } = req.params;
        let result = await this.productsService.getProduct(pid);
        res.send({ result: "success", payload: result });
    }
    
    addProduct = async (req, res, next) => {
        try {
            const { title, description, price, code, stock, category, status } = req.body;
            const thumbnail = req.file ? `/uploads/${req.file.filename}` : null; // Obtener la ruta del archivo subido

            req.logger.debug(
                `Datos recibidos para agregar el producto: ${JSON.stringify({ title, description, price, thumbnail, code, stock, category, status })}, ${req.method} en ${req.url} - ${new Date().toLocaleDateString()}`
            );

            console.log(`Ruta de la imagen subida: ${thumbnail}`);

            if (!title || !description || !price || !thumbnail || !code || !stock || !category || !status) {
                const err = new CustomError(
                    "Error creando el producto",
                    generateErrorInfo({ title, description, price, thumbnail, code, stock, category, status }),
                    "Error al intentar crear el producto",
                    EError.INVALID_TYPES_ERROR
                );
                return next(err);
            }

            const newProduct = {
                title,
                description,
                price,
                thumbnail,
                code,
                stock,
                category,
                status
            };

            let result = await this.productsService.addProduct(newProduct);

            req.logger.info(
                `Producto agregado con éxito: ${JSON.stringify(result)}, ${req.method} en ${req.url} - ${new Date().toLocaleDateString()}`
            );

            res.send({ result: "success", payload: result });
        } catch (error) {
            req.logger.error(
                `Error al agregar el producto: ${error}, ${req.method} en ${req.url} - ${new Date().toLocaleDateString()}`
            );
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
            req.logger.error(`Error al actualizar el producto: ${error}, ${req.method} en ${req.url} - ${new Date().toLocaleDateString()}`);
            res.status(500).send({ error: error.message });
        }
    }
    
    deleteProduct = async (req, res) => {
        let { pid } = req.params;
        let result = await this.productsService.deleteProduct(pid);
        res.send({ result: "success", payload: result });
    }   
}


