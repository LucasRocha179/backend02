class Usuario {
  constructor(nome, nascimento, email, senha, isAdmin = true) {
    this.nome = nome;
    this.nascimento = this.validarData(nascimento);
    this.email = this.validarEmail(email);
    this.userID = this.criaUserID(email);
    this.senha = this.validarSenha(senha);
    this.datacadastro = this.getData();
    this.isAdmin = isAdmin;
  }

  validarData(data) {
    if (!this.isDataValida(data)) {
      throw new Error("Data de nascimento inválida. Use o formato DD/MM/AAAA.");
    }
    return data;
  }

  isDataValida(data) {
    const regex = /^(\d{2})\/(\d{2})\/(\d{4})$/;
    if (!regex.test(data)) {
      return false;
    }
    const [dia, mes, ano] = data.split("/");
    const dataObj = new Date(ano, mes - 1, dia);
    const dataValida =
      dataObj.getFullYear() == ano &&
      dataObj.getMonth() == mes - 1 &&
      dataObj.getDate() == dia;
    return dataValida;
  }

  criaUserID(email) {
    const encodedEmail = Buffer.from(email).toString("base64");
    return encodedEmail;
  }

  validarEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!regex.test(email)) {
      throw new Error("Endereço de email inválido.");
    }
    return email;
  }

  validarSenha(senha) {
    if (!senha) {
      throw new Error("Campo senha é obrigatório!");
    }
    return senha;
  }

  getData() {
    const date = new Date();
    return date.toLocaleDateString("pt-BR", {
      year: "numeric",
      month: "2-digit",
      day: "numeric",
    });
  }
}

const usuarios = [
  {
    nome: "UserExemplo",
    nascimento: "29/10/1992",
    email: "example@hotmail.com",
    userID: "ZXhhbXBsZUBob3RtYWlsLmNvbQ==",
    senha: "123456",
    datacadastro: "2023-03-12",
    isAdmin: true,
  },
];

const findAll = (req, res) => {
  console.log("findAllUsers");
  res.send(usuarios);
};

const find = (req, res) => {
  if (req.params.id == null) {
    return res.send({ message: "parametro vazio!" });
  }
  console.log(`findUser ${req.params.id}`);
  const id = req.params.id;
  res.send(usuarios[id]);
};

const create = (req, res) => {
  if (req.body.nome == null) {
    return res.send({ message: "request body vazio!" });
  }
  try {
    const user = req.body;
    const usuario = new Usuario(
      user.nome,
      user.nascimento,
      user.email,
      user.senha
    );
    usuarios.push(usuario);
    console.log(`LOG: ${usuario.datacadastro} novo usuário ${usuario.userID}`);
    res.send("usuario criado com sucesso!");
  } catch (e) {
    return res.send({ message: e.message });
  }
};

module.exports = {
  findAll,
  find,
  create,
};
