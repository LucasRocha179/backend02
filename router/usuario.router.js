const router = require("express").Router();
const usuario = require("../controller/usuario.controller");

router.get("/find/:id", usuario.find);
router.get("/findAll", usuario.findAll);
router.post("/create", usuario.create);

module.exports = router;