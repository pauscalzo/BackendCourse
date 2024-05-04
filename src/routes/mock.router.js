import express from 'express';
import { generateProducts } from '../utils-mock.js';

const MockRouter = express.Router()

MockRouter.get("/", async (req, res) => {
    try {
        req.logger.debug(
            `generando datos de prueba..., ${req.method} en ${req.url} - ${new Date().toLocaleDateString()}`
        )
        let productsMock = [];
        for (let i = 0; i < 100; i++) {
            productsMock.push(generateProducts());   
        }
        req.logger.debug(
            `Datos de prueba generados: ${productsMock}, ${req.method} en ${req.url} - ${new Date().toLocaleDateString()}`
        )
        res.send({ status: "success", payload: productsMock});
    } catch (error) {
        req.logger.error(
            `Error al generar datos de prueba: ${error}, ${req.method} en ${req.url} - ${new Date().toLocaleDateString()}`
        )
        res.status(500).send({ error: "Error interno del servidor" });
    }
});

export default MockRouter;