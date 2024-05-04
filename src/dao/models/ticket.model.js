import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    quantity: { type: Number },
    price: { type: Number },
    subtotal: { type: Number } // Nuevo campo para almacenar el subtotal del producto
});

const ticketSchema = new mongoose.Schema({
    code: { type: String, unique: true },
    purchase_datetime: { type: Date, default: Date.now },
    purchaser: { type: String },
    products: [productSchema],
    totalAmount: { type: Number } // Nuevo campo para almacenar el monto total de la compra
});

const Ticket = mongoose.model('Ticket', ticketSchema);

export default Ticket;




