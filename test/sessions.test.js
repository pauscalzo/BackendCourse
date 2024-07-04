import * as chai from "chai";
import supertest from "supertest";

const expect = chai.expect;
const requester = supertest("http://localhost:8080");

describe("test users", () => {
  describe("test user endpoints", function () {
    
    it("el endpoint POST /signup debe permitir el registro", async () => {
      const userMock = {
        first_name: "Jhon",
        last_name: "Doe",
        email: "prueba02@example.com",
        age: 30,
        password: "password123"
      };

      const { statusCode, headers, body } = await requester.post("/api/sessions/signup").send(userMock);

      expect(statusCode).to.equal(302);
      expect(headers.location).to.equal('/login');
    });

    it("el endpoint POST /login debe verificar que la contraseña sea válida", async () => {
      const userMock = {
        email: "prueba02@example.com",
        password: "password123"
      };

      // Crear un usuario de prueba
      await requester.post("/api/sessions/signup").send({
        first_name: "John",
        last_name: "Doe",
        email: "prueba03@example.com",
        age: 30,
        password: "password123"
      });

      const { statusCode, body } = await requester.post("/api/sessions/login").send(userMock);

      expect(statusCode).to.equal(200);
      expect(body).to.have.property("status", "success");
    });

    it("el endpoint POST /login no debe permitir iniciar sesión con un email no registrado", async () => {
      const userMock = {
        email: "nonexistent@example.com",
        password: "password123"
      };

      const { statusCode, body } = await requester.post("/api/sessions/login").send(userMock);

      expect(statusCode).to.equal(401);
      expect(body).to.have.property("status", "error");
      expect(body).to.have.property("message", "El usuario no existe");
    });
  });
});

