import * as chai from "chai";
import supertest from "supertest";
import path from "path";
import { fileURLToPath } from 'url';

const expect = chai.expect;
const requester = supertest("http://localhost:8080");

// Obtener la ruta del directorio actual
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

describe("test carts", () => {
  describe("test crud cart", function () {
    let cartId;
    let productId;

    before(async function () {
      // Crear un producto de prueba
      const productMock = {
        title: "test",
        description: "test",
        price: 10,
        code: "097087",
        stock: 10,
        category: "Lego",
        status: "Disponible"
      };

      const createProductResponse = await requester
        .post("/products")
        .field("title", productMock.title)
        .field("description", productMock.description)
        .field("price", productMock.price)
        .field("code", productMock.code)
        .field("stock", productMock.stock)
        .field("category", productMock.category)
        .field("status", productMock.status)
        .attach("thumbnail", path.resolve(__dirname, "uploads/test.png"));

      productId = createProductResponse.body.payload && createProductResponse.body.payload._id;

      if (!productId) {
        throw new Error("Error creating product");
      }

      // Crear un carrito de prueba
      const createCartResponse = await requester.post("/carts");

      cartId = createCartResponse.body.payload && createCartResponse.body.payload._id;

      if (!cartId) {
        throw new Error("Error creating cart");
      }

      // Agregar el producto al carrito
      const addProductResponse = await requester.post(`/carts/${cartId}/${productId}`).send();

    });

    it("el endpoint POST /carts debe crear un carrito correctamente", async () => {
      const { statusCode, body } = await requester.post("/carts").send();

      expect(statusCode).to.equal(200);
      expect(body).to.have.property("result", "success");
      expect(body.payload).to.have.property("_id");
    });

    it("el endpoint POST /carts/:cid/:pid debe agregar un producto al carrito correctamente", async () => {
      const { statusCode, body } = await requester.post(`/carts/${cartId}/${productId}`).send();

      expect(statusCode).to.equal(200);
      expect(body).to.have.property("result", "success");
      expect(body.payload).to.equal("Producto agregado exitosamente");
    });

    it("el endpoint DELETE /carts/:cid debe eliminar todos los productos de un carrito correctamente", async () => {
      const { statusCode, body } = await requester.delete(`/carts/${cartId}`).send();

      expect(statusCode).to.equal(200);
      expect(body).to.have.property("result", "success");
      expect(body.payload).to.equal("Todos los productos fueron eliminados del carrito exitosamente");
    });
  });
});



