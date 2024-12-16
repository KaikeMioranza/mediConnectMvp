const ConnectionDB = require("../database/DBconnection");

class InsertTriagem {
  static async insertTriagemPaciente(req, res) {
    try {
      // Validação de campos obrigatórios
      const { nome, idade, peso, sintomas, sintomasdet, niveldor, historicomed, data } = req.body;

      if (!nome || !idade || !peso || !sintomas || !sintomasdet || !niveldor || !historicomed || !data) {
        return res.status(400).json({
          message:
            "Todos os campos (nome, idade, peso, sintomas, sintomasdet, niveldor, historicomed, data) são obrigatórios!",
        });
      }

      // Obter o pool de conexões
      const pool = ConnectionDB.postgresSql();

      // Query SQL e valores
      const query = `
        INSERT INTO triagem (nome, idade, peso, sintomas, sintomasdet, niveldor, historicomed, data)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
        RETURNING *;
      `;
      const values = [nome, idade, peso, sintomas, sintomasdet, niveldor, historicomed, data];

      console.log("Executando query com valores:", values);

      // Executar a query
      const result = await pool.query(query, values);

      // Verificar se a inserção foi bem-sucedida
      if (result.rowCount > 0) {
        console.log("Paciente inserido com sucesso:", result.rows[0]);
        return res.status(201).json({
          message: "Paciente inserido com sucesso!",
          paciente: result.rows[0],
        });
      } else {
        console.error("Nenhuma linha foi inserida!");
        return res.status(400).json({
          message: "Erro ao inserir paciente. Nenhuma linha foi afetada.",
        });
      }
    } catch (error) {
      // Tratativa de erros específicos
      if (error.code === "ECONNREFUSED") {
        console.error("Erro de conexão com o banco de dados:", error);
        return res.status(503).json({
          message: "Serviço indisponível: não foi possível conectar ao banco de dados.",
        });
      }

      if (error.code === "23505") {
        // Código de erro para violação de chave única (duplicidade)
        console.error("Erro de duplicidade ao inserir paciente:", error);
        return res.status(409).json({
          message: "Erro: Já existe um paciente com os dados fornecidos.",
        });
      }

      // Tratativa de erro genérica
      console.error("Erro inesperado ao inserir paciente:", error);
      return res.status(500).json({
        message: "Erro interno no servidor. Por favor, tente novamente mais tarde.",
        details: error.message, // Detalhes para debug (remover em produção)
      });
    }
  }
}

module.exports = InsertTriagem;
