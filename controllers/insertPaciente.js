const ConnectioDB = require("../database/DBconnection");

class InsertPaciente {
  static async insertPaciente(req, res) {
    try {
      // Validação de campos obrigatórios
      const { name, age, cpf, genero, numerosus } = req.body;
      if (!name || !age || !cpf || !genero || !numerosus) {
        return res.status(400).json({
          message: "Todos os campos (name, age, cpf, genero, numerosus) são obrigatórios!",
        });
      }

      // Obter o pool de conexões
      const pool = ConnectioDB.postgresSql();

      // Query de inserção
      const query = `
        INSERT INTO paciente (nome, idade, cpf, genero, numerosus)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING *;
      `;
      const values = [name, age, cpf, genero, numerosus];

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
          message: "Erro ao inserir Paciente. Nenhuma linha foi afetada.",
        });
      }
    } catch (error) {
      // Tratativa de erro específica para conexões ao banco
      if (error.code === "ECONNREFUSED") {
        console.error("Erro de conexão com o banco de dados:", error);
        return res.status(503).json({
          message: "Serviço indisponível: não foi possível conectar ao banco de dados.",
        });
      }

      // Tratativa de erro genérica
      console.error("Erro inesperado ao inserir paciente:", error);
      return res.status(500).json({
        message: "Erro interno no servidor. Por favor, tente novamente mais tarde.",
        details: error.message, // Enviar detalhes do erro para debug (remova em produção)
      });
    }
  }
}

module.exports = InsertPaciente;
