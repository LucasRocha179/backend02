class Usuario {
  constructor(nome, nascimento, email, senha, isAdmin = true) {
    this.nome = this.validarNome(nome);
    this.nascimento = this.validarData(nascimento);
    this.email = this.validarEmail(email);
    this.userID = this.criaUserID(email);
    this.senha = this.validarSenha(senha);
    this.datacadastro = this.getData();
    this.isAdmin = isAdmin;
  }

  validarNome(nome) {
    if (!nome) {
      throw new Error("Campo nome é obrigatório");
    }
    return nome;
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
  console.log("requested findAllUsers");
  res.send(usuarios);
};

const find = (req, res) => {
  if (req.params.id == null) {
    return res.send({ message: "parametro vazio!" });
  }
  console.log(`requested findUser ${req.params.id}`);
  let found = false;
  const id = req.params.id;

  usuarios.map((valor) => {
    if (valor.userID == id) {
      found = true;
      console.log(`response whith code 200`);
      return res.send(valor);
    }
  });
  if (!found) {
    console.log(`response whith code 404`);
    return res.status(404).send({ message: "Não encontrado" });
  }
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
    res.status(201).send("usuario criado com sucesso!");
  } catch (e) {
    return res.status(400).send({ message: e.message });
  }
};

const update = (req, res) => {
  if (req.params.id == null) {
    return res.send({ message: "parametro vazio!" });
  }
  let found = false;
  const id = req.params.id;
  const user = req.body;

  usuarios.map((valor, index) => {
    if (valor.userID == id) {
      found = true;
      try {
        const usuario = new Usuario(
          user.nome,
          user.nascimento,
          user.email,
          user.senha
        );
        console.log(`LOG: ${usuario.nome} editado!`);
        usuarios[index] = usuario;
        res.status(201).send("usuario alterado com sucesso!");
      } catch (e) {
        return res.status(400).send({ message: e.message });
      }
    }
  });
  if (!found) {
    return res.status(404).send({ message: "Não encontrado" });
  }
};

const deleteUser = (req, res) => {
  if (req.params.id == null) {
    return res.send({ message: "parametro vazio!" });
  }
  let found = false;
  const id = req.params.id;

  usuarios.map((valor, index) => {
    if (valor.userID == id) {
      found = true;
      console.log(`LOG: Usuário ${valor.nome} excluído!`);
      usuarios.splice(index,1);
      res.status(200).send("usuario excluído com sucesso!");
    }
  });
  if (!found) {
    return res.status(404).send({ message: "Usuário não encontrado" });
  }
}

module.exports = {
  findAll,
  find,
  create,
  update,
  deleteUser,
};
