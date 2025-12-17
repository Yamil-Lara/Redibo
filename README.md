# 🚗 RediBo

![Next.js](https://img.shields.io/badge/Next.js-15.x-black)
![React](https://img.shields.io/badge/React-19.x-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue)
![Express](https://img.shields.io/badge/Express-5.x-green)
![Prisma](https://img.shields.io/badge/Prisma-ORM-purple)
![Tailwind](https://img.shields.io/badge/Tailwind-4.x-cyan)
![Status](https://img.shields.io/badge/Status-Finalizado-green)

**RediBo** es una plataforma web integral para el **alquiler y gestión de vehículos**, desarrollada para la materia de Ingeniería de Software "IdSW" de la Universidad Mayor de San Simón "UMSS". Diseñada para conectar a dueños de vehículos (Hosts) con conductores (Drivers/Renters) mediante una experiencia segura y eficiente.

Integra geolocalización en tiempo real, notificaciones SSE, pagos digitales y un sistema de autenticación robusto con validación en dos pasos (2FA).

---

## 📌 Tabla de Contenidos
- [Características](#-características)
- [Tecnologías](#-tecnologías)
- [Instalación](#-instalación)
- [Estructura del Proyecto](#-estructura-del-proyecto)
- [Contribución](#-contribución)
- [Licencia](#-licencia)
- [Contacto](#-contacto)

---

## ✨ Características

### 🔐 Seguridad y Autenticación
- Registro y Login con **Google OAuth** y credenciales locales.
- **Verificación en 2 Pasos (2FA)** mediante correo electrónico.
- Gestión de sesiones con JWT y Passport.

### 🚗 Gestión de Vehículos (Hosts)
- CRUD completo de vehículos con carga de imágenes **(Cloudinary)**.
- Panel de administración para visualizar ganancias y estado de la flota.
- Aprobación de solicitudes de renta.

### 🗺️ Experiencia del Usuario (Mapas y Renta)
- **Mapa Interactivo:** Visualización de autos disponibles en tiempo real usando **Leaflet**.
- **Filtros Avanzados:** Búsqueda por precio, tipo de vehículo y ubicación.
- **Sistema de Reservas:** Flujo completo desde la solicitud hasta la confirmación y pago.

### 💳 Pagos y Notificaciones
- Pasarela de pagos integrada (Tarjeta y QR).
- **Notificaciones en tiempo real (SSE)** para actualizaciones de estado de reserva.
- Generación de comprobantes de pago.

---

## 🧰 Tecnologías
### Frontend (Client-Side)
- **Framework:** Next.js 15 (App Router)
- **Core:** React 18, TypeScript
- **Estilos:** Tailwind CSS 4
- **Mapas:** React Leaflet
- **HTTP Client:** Axios
- **UI Components:** Heroicons, React Icons, SweetAlert2

### Backend (Server-Side)
- **Framework:** Express.js
- **Lenguaje:** TypeScript
- **ORM:** Prisma
- **Base de Datos:** PostgreSQL
- **Servicios:** Cloudinary (Imágenes), Nodemailer/SendGrid (Emails)
- **Seguridad:** Bcrypt, Helmet, CORS

---

## 🚀 Instalación

### 🔹 Prerrequisitos
- Node.js (v18 o superior)
- PNPM (Gestor de paquetes recomendado para el Backend)
- PostgreSQL (Base de datos local o en la nube)
- Git

##
## ⚙️ Configuración del Backend

### 1️⃣ Clonar el repositorio
```
git clone https://github.com/Yamil-Lara/redibo
```

##

### 2️⃣ Instalar dependencias del Servidor
Windows
```
cd Backend
pnpm install
```

##

### 3️⃣ Configurar Variables de Entorno (Backend)
Crea un archivo `.env` en la carpeta Backend basándote en `.env.example`:
```
DATABASE_URL="postgresql://user:password@localhost:5432/redibo_db"
PORT=3001
JWT_SECRET="tu_secreto"
CLOUDINARY_CLOUD_NAME="..."
# ...otras variables requeridas
```

##

### 4️⃣ Inicializar Base de Datos
```
npx prisma generate
npx prisma migrate dev
```

##

### 5️⃣ Ejecutar el Backend
```
pnpm dev
```
El servidor correrá en http://localhost:3001

##
## 💻 Configuración del Frontend

### 1️⃣ Instalar dependencias del Cliente
Abre una nueva terminal y navega a la carpeta del frontend:
```
cd Frontend/my-app
npm install
```

##

### 2️⃣ Ejecutar el Cliente
```
npm run dev
```
La aplicación estará disponible en http://localhost:3000

---

### 📂 Estructura del Proyecto
```
Redibo/
│
├── Backend/                 # API RESTful con Express
│   ├── prisma/              # Esquemas y migraciones de DB
│   ├── src/
│   │   ├── controllers/     # Lógica de los endpoints
│   │   ├── routes/          # Definición de rutas API
│   │   ├── services/        # Lógica de negocio
│   │   └── index.ts         # Punto de entrada del servidor
│
├── Frontend/
│   └── my-app/              # Aplicación Next.js
│       ├── public/          # Assets estáticos
│       ├── src/
│       │   ├── app/         # App Router (Páginas)
│       │   ├── components/  # Componentes reutilizables
│       │   ├── hooks/       # Custom Hooks
│       │   └── libs/        # Servicios de API (Axios)
```

---

### 🤝 Contribución
1. Fork del proyecto
2. Crear rama:
```bash
git checkout -b feature/NuevaFuncionalidad
```
3. Commit:
```bash
git commit -m "Añadir nueva funcionalidad"
```
4. Push:
```bash
git push origin feature/NuevaFuncionalidad
```
5. Abrir Pull Request

---

### 📄 Licencia
Este proyecto se distribuye bajo la Licencia de la [Universidad Mayor de San Simón](https://www.umss.edu.bo/tramites).

---

### 📞 Contacto
Desarrollado por [ [Yamil Lara](https://yamil-lara.github.io) / _Equipo "SpeedCode"_ / [UMSS](https://https://www.umss.edu.bo/) ]
### 📧 Email: Yamillara7@gmail.com
