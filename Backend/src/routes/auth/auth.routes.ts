//src/routes/auth/auth.routes.ts
import { Router } from "express";
import { register, login, getUserProfile, me, updateUserField } from "../../controllers/auth/auth.controller"; 
import { validateRegister } from "../../middlewares/auth/validateRegister"; 
import { validateLogin } from "../../middlewares/auth/validateLogin";
import { checkPhoneExists } from "../../controllers/auth/auth.controller";
import { isAuthenticated } from "../../middlewares/auth/isAuthenticated";
import { deleteIncompleteUserController } from "../../controllers/auth/auth.controller";

//foto de perfil eliminar/actualizar
import {deleteProfilePhoto,uploadProfilePhoto,upload,} from "../../controllers/auth/authPerfilUsuarioRenter/fotoPerfil.controller";
import { authMiddleware } from "../../middlewares/auth/authMiddleware";

const router = Router();

// Rutas de Usuario (Nombre, Perfil)
router.put("/user/update", authMiddleware, updateUserField);

// Rutas de Autenticación Local
router.post("/register", validateRegister, register);
router.post("/login", validateLogin, login);
router.get("/me", isAuthenticated, me);
router.get("/user-profile/:idUsuario", getUserProfile);

// Rutas de Foto de Perfil
router.post(
  "/upload-profile-photo",
  authMiddleware,
  upload.single("fotoPerfil"),
  uploadProfilePhoto
);
router.delete("/delete-profile-photo", authMiddleware, deleteProfilePhoto);

// Otras utilidades
router.delete("/delete-incomplete-user", deleteIncompleteUserController);
router.post("/check-phone", checkPhoneExists);

export default router;