const express = require("express");
const app = express();
const usuario = require("./router/usuario.router");

app.get("/", (req, res) => {
  res.send("Seja bem-vindo!");
})

const port = 3000;

app.use(express.json());

app.use("/usuario", usuario);

app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
})