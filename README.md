# 🐾 Proyecto Final – Backend III

Este proyecto corresponde al entregable final del curso **Backend III**, donde desarrollamos una API RESTful con Node.js, Express y MongoDB. En esta etapa final, se incorporaron pruebas funcionales, documentación Swagger y la dockerización del sistema.

---

## ✅ Objetivos cumplidos

- [x] Documentación de rutas con **Swagger** (`/api/users`)
- [x] Pruebas funcionales para `adoption.router.js`
- [x] Dockerización completa del proyecto
- [x] Imagen subida a Docker Hub
- [x] README con enlace a la imagen

---

## 📦 Imagen Docker

La imagen del proyecto se encuentra publicada en Docker Hub y puede ser utilizada con el siguiente enlace:

🔗 [https://hub.docker.com/r/juanmaromerop/mi-servidor-node](https://hub.docker.com/r/juanmaromerop/mi-servidor-node)


---

## 📝 ¿Qué hicimos paso a paso?

### 🔸 1. Desarrollo de la API

Comenzamos construyendo una API usando Node.js y Express. Se implementaron rutas, modelos y controladores para manejar:

- **Usuarios**
- **Mascotas**
- **Solicitudes de adopción**

La base de datos se conectó usando **MongoDB con Mongoose**.

---

### 🔸 2. Documentación con Swagger

Se documentaron todos los endpoints del módulo **`/api/users`** utilizando Swagger. Esto permite visualizar y probar la API desde el navegador.

#### 📍 Para acceder a la documentación:

Una vez corriendo el servidor:

http://localhost:8080/api/users


---

### 🔸 3. Pruebas funcionales

Se crearon pruebas funcionales para **todos los endpoints** del archivo `adoption.router.js` usando:

- `Mocha` (framework de testing)
- `Chai` (aserciones)
- `Supertest` (simulación de requests)

#### ▶ Para correr los tests:

```bash
npm test


---

## 🐳 Uso de Docker en el proyecto

En este proyecto, Docker se utilizó para:

- Empaquetar la API de Node.js en una imagen portátil
- Asegurar que se ejecute de manera consistente en cualquier entorno
- Facilitar la distribución del proyecto a través de Docker Hub

---

### ⚙️ Cómo se construyó la imagen

1. Se creó un archivo llamado `Dockerfile` en la raíz del proyecto con el siguiente contenido:

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 3000
CMD ["node", "src/app.js"]
