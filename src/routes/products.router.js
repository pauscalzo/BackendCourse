import express from 'express';
import { ProductController } from '../controllers/products.controller.js';
import utils from '../utils.js';
import upload from '../../src/config/upload.js'; 

const { passportCall } = utils;

const ProductsRouter = express.Router();

const {
    getHome,
    getLogin,
    getSignup,
    getProducts,
    getProductById,
    addProduct,
    updateProduct,
    deleteProduct
} = new ProductController();

ProductsRouter.get('/', getHome);

ProductsRouter.get("/login", getLogin);

ProductsRouter.get("/signup", getSignup);

ProductsRouter.get('/products', getProducts);

ProductsRouter.get('/:pid', getProductById);

// Protegemos las rutas POST, PUT y DELETE con los roles "premium" y "admin"

ProductsRouter.post("/products", upload.single('thumbnail'), passportCall('login', ['premium', 'admin']), addProduct);

ProductsRouter.put("/:pid", passportCall('login', ['premium', 'admin']), updateProduct);

ProductsRouter.delete("/:pid", passportCall('login', ['premium', 'admin']), deleteProduct);


export default ProductsRouter;