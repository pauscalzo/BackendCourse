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

ProductsRouter.post("/products", upload.single('thumbnail'), addProduct);

ProductsRouter.put("/:pid", updateProduct);

ProductsRouter.delete("/:pid", deleteProduct);

export default ProductsRouter;
