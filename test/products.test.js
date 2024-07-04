import * as chai from "chai";
import supertest from "supertest";
import path from "path";
import { fileURLToPath } from 'url';

const expect = chai.expect;
const requester = supertest("http://localhost:8080");

// Obtener la ruta del directorio actual
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

describe("test products", () => {
  describe("test crud product", function () {
    it("el endpoint GET /products debe mostrar productos correctamente", async () => {
      const { ok, statusCode, _body } = await requester.get("/products");

      expect(statusCode).to.equal(200);
    });

    it("el endpoint POST /products debe enviar un status 400 cuando no se le agrega título al producto", async () => {
      const productMock = {
        description: "test",
        price: "10",
        thumbnail: "test.png",
        code: "765564",
        stock: "10",
        category: "Lego",
        status: "Disponible"
      };

      const { statusCode, _body } = await requester
        .post("/products")
        .send(productMock);

      expect(statusCode).to.equal(400);
      expect(_body).to.have.property("error");
    });

    it("el endpoint POST /products debe crear un producto correctamente", async () => {
        const productMock = {
            title: "test",
            description: "test",
            price: "10",
            code: "2143153",
            stock: "10",
            category: "Lego",
            status: "Disponible"
        };
    
        const { statusCode, _body } = await requester
            .post("/products")
            .field("title", productMock.title)
            .field("description", productMock.description)
            .field("price", productMock.price)
            .field("code", productMock.code)
            .field("stock", productMock.stock)
            .field("category", productMock.category)
            .field("status", productMock.status)
            .attach("thumbnail", path.resolve(__dirname, "uploads/test.png"));
    
        expect(statusCode).to.equal(201);
        expect(_body.payload).to.have.property("_id");
    });
    
  });
});

