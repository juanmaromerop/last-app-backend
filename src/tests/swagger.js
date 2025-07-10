import swaggerJSDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Backend-lll",
      version: "1.0.0",
      description: "Documentación para mostrar los endpoints del módulo Users",
      termsOfService: "https://mi-page.com/terminos",
      contact: {
        name: "Juan Manuel Team",
        url: "https://mi-page.com",
        email: "contacto@mi-dominio.com",
      },
      license: {
        name: "MIT",
        url: "https://opensource.org/licenses/MIT",
      },
    },
    servers: [
      {
        url: "http://localhost:8080",
        description: "Servidor Local",
      },
      {
        url: "https://mi-page.com",
        description: "Servidor de Producción",
      },
    ],
    components: {
      schemas: {
        User: {
          type: "object",
          properties: {
            _id: {
              type: "string",
              example: "64a3f8b72f5a23c4c8e733a9",
            },
            first_name: {
              type: "string",
              example: "Juan",
            },
            last_name: {
              type: "string",
              example: "Romero",
            },
            email: {
              type: "string",
              example: "juan@example.com",
            },
            age: {
              type: "integer",
              example: 30,
            },
            role: {
              type: "string",
              example: "user",
            },
          },
        },
        UserUpdate: {
          type: "object",
          properties: {
            first_name: { type: "string", example: "Juan Actualizado" },
            last_name: { type: "string", example: "Romero" },
            email: { type: "string", example: "nuevo@email.com" },
            age: { type: "integer", example: 32 },
            role: { type: "string", example: "admin" },
          },
        },
      },
    },
  },
  apis: ["./src/routes/*.js"], // Asegurate de que las rutas estén bien ubicadas
};

const swaggerSpec = swaggerJSDoc(options);

export const setupSwagger = (app) => {
  app.use("/api-doc", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
};
