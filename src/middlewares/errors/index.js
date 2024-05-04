import EError from "../../services/errors/enums.js";

export default (error, req, res, next) => {
    req.logger.error(
        `Error recibido: ${error}, ${req.method} en ${req.url} - ${new Date().toLocaleDateString()}`
    )
    req.logger.error(
        `Causa del error: ${error.cause}, ${req.method} en ${req.url} - ${new Date().toLocaleDateString()}`
    )
    
    switch (error.code) {
        case EError.INVALID_TYPES_ERROR:
            req.logger.error(
                `Error de tipeos inválidos. Detalles ${error}, ${req.method} en ${req.url} - ${new Date().toLocaleDateString()}`
            )
            res.status(400).json({ status: "error", error: error.name, message: error.message });
            break;
    
        default:
            req.logger.error(
                `Error no contemplado: ${error}, ${req.method} en ${req.url} - ${new Date().toLocaleDateString()}`
            )
            
            res.status(500).json({ status: "error", error: "error no contemplado" });
            break;
    }
}
