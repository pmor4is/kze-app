// Criação da API para integrar ao postgree
// Inicialmente:
// npm install express cors dotenv body-parser pg
// npm install --save-dev nodemon
// nodemon: equivalente ao Live Server, que deve ser instalado em ambiente de desenvolvimento ("--save-dev")
// pg: permite conexão com o postgree
// dotenv: cria variáveis de ambiente para conexão com o banco de dados, portas
// cors: adiciona cabeçalho http, utilizado para habilitar solicitações entre sites
// body-parser: converte o body da requisição para vários formatos, inclusive json

// Associa variaveis as bibliotecas instaladas no npm
const express = require("express");
const cors = require("cors");
const bodyparser = require("body-parser");
const config = require("./config");
const { Client } = require("pg");
const app = express();

// Inicialização de middlewares
// middlewares: conecta apps, dados e usuários
app.use(express.json());
app.use(cors());
app.use(bodyparser.json());

var conString = config.urlConnection;
var client = new Client(conString);

// Função para verificar se há conexão com o banco de dados client, que é associado ao Postgrree
client.connect(function (err) {
  if (err) {
    return console.error("Couldn't connect to database", err);
  }
  client.query("SELECT NOW()", function (err, result) {
    if (err) {
      return console.error("Erro ao executar a query.", err);
    }
    console.log(result.rows[0]);
  });
});

// Rota "/": para verificar se a API está funcionando
app.get("/", (req, res) => {
  console.log("Response ok.");
  //Resposta para verificar se o servidor esta online
  res.send("Ok – Server online.");
});

// Criação da rota usuários
app.get("/notes", (req, res) => {
  try {
    // query: consulta
    // Função anônima que consulta o banco de dados, com tratamento de erro
    // Seleciona todas as colunas da tabela usuario
    client.query("SELECT * FROM Notes", function (err, result) {
      if (err) {
        // Retorna uma mensagem para a variavel err, se não tiver erro na consulta
        return console.error("Erro ao executar a qry de SELECT", err);
      }
      // Envia uma resposta caso a consulta tenha sucesso
      res.send(result.rows);
      console.log("Chamou get notes");
    });
    // Verifica se houve erro na resposta
  } catch (error) {
    console.log(error);
  }
});
 
// Criação de rota que filtra um usuário específico
// Primeiro paramentro: construção de rota com variavel.
// Segundo parâmetro: arrow function
app.get("/notes/:id", (req, res) => {
  try {
    // req.params.id: seleciona o id como parametro da resposta
    console.log("Get requisition /:id " + req.params.id);
    client.query(
      // $1: utilizado para passar parametro
      "SELECT * FROM Notes WHERE id = $1",
      [req.params.id],
      function (err, result) {
        if (err) {
          return console.error("Erro ao executar a qry de SELECT id", err);
        }
        if (result.rowCount == 0) {
          res.send(
            "Usuario com o codigo " +
              req.params.id +
              " não existe no banco de dados"
          );
        } else res.send(result.rows);
        //console.log(result;
      }
    );
  } catch (error) {
    console.log(error);
  }
});

//Se o verbo for delete, haverá uma lógica de programação para determinar o comportamento da rota
app.delete("/notes/:id", (req, res) => {
  try {
    console.log("DELETE requisition with id: " + req.params.id);
    const id = req.params.id;
    client.query(
      "DELETE FROM Notes WHERE id = $1",
      [id],
      function (error, result) {
        if (error) {
          return console.error("Error executing DELETE query", error);
        } else {
          if (result.rowCount == 0) {
            res.status(400).json({ info: "Register not found." });
          } else {
            res.status(200).json({ info: "Register deleted. Code id: ${id}" });
          }
        }
        console.log(result);
      }
    );
  } catch (error) {
    console.log(error);
  }
});

app.post("/notes", (req, res) => {
  try {
    console.log("Post requisition", req.body);
    const { notename, notetext } = req.body;
    client.query(
      "INSERT INTO Notes (notename, notetext) VALUES ($1, $2) RETURNING * ",
      [notename, notetext],
      function (err, result) {
        if (err) {
          return console.error("INSERT query error", err);
        }
        const { id } = result.rows[0];
        res.setHeader("id", '${id}');
        res.status(201).json(result.rows[0]);
        console.log(result);
      }
    );
  } catch (error) {
    console.error(error);
  }
});

app.put("/notes/:id", (req, res) => {
  try {
    console.log("Put requisition", req.body);
    const id = req.params.id;
    const { notename, notetext } = req.body;
    client.query(
      "UPDATE Notes SET notename=$1, notetext=$2, WHERE id =$3 ",
      [notename, notetext, id],
      function (err, result) {
        if (err) {
          return console.error("UPDATE query error", err);
        } else {
          res.setHeader("id", id);
          res.status(202).json({ identifier: id });
          console.log(result);
        }
      }
    );
  } catch (error) {
    console.error(error);
  }
});

// Se houver uma requisição, fica ouvindo na porta do .env
// Deve ser o ultimo a ser escrito
app.listen(config.port, () =>
  console.log("Servidor funcionando na porta " + config.port)
);

module.exports = app;