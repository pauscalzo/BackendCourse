import swaggerJSDoc from 'swagger-jsdoc';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import path from 'path';

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
//Documentación

const swaggerOptions = {
    definition: {
        openapi:"3.0.1",
        info: {
            title: "ecommerce backend",
            version: "1.0.0",
            description: "curso backend Paula Scalzo"
        }
    },
    apis: [`${path.join(__dirname, "../docs/**/*.yaml")}`]  
}

export const swaggerSpecs = swaggerJSDoc(swaggerOptions);