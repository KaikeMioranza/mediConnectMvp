const ConnectionDB = require("../database/DBconnection");

class InsertMedic {
  static async insertMedic(req, res) {
    try {
      // Validação de campos obrigatórios
      const { name, age, cpf, crm, date } = req.body;
      if (!name || !age || !cpf || !crm || !date) {
        return res.status(400).json({
          message: "Todos os campos (name, age, cpf, crm, date) são obrigatórios!",
        });
      }

      // Obter o pool de conexões
      const pool = ConnectionDB.postgresSql();

      // Query SQL e valores
      const query = `
        INSERT INTO medico (nome, idade, cpf, crm, date)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING *;
      `;
      const values = [name, age, cpf, crm, date];

      console.log("Executando query com valores:", values);

      // Executar a query
      const result = await pool.query(query, values);

      // Verificar se a inserção foi bem-sucedida
      if (result.rowCount > 0) {
        console.log("Médico inserido com sucesso:", result.rows[0]);
        return res.status(201).json({
          message: "Médico inserido com sucesso!",
          medico: result.rows[0],
        });
      } else {
        console.error("Nenhuma linha foi inserida!");
        return res.status(400).json({
          message: "Erro ao inserir médico. Nenhuma linha foi afetada.",
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
        console.error("Erro de duplicidade ao inserir médico:", error);
        return res.status(409).json({
          message: "Erro: Já existe um médico com os dados fornecidos.",
        });
      }

      // Tratativa de erro genérica
      console.error("Erro inesperado ao inserir médico:", error);
      return res.status(500).json({
        message: "Erro interno no servidor. Por favor, tente novamente mais tarde.",
        details: error.message, // Detalhes para debug (remover em produção)
      });
    }
  }
}

module.exports = InsertMedic;
