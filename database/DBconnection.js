require('dotenv').config
const { Pool } = require('pg');

class ConnectionDB {

static postgresSql(){
      return new Pool({
      connectionString: process.env.URIDATABASE, // URL do banco de dados no Heroku
      ssl: {
        rejectUnauthorized: false, // Necessário para conexões SSL no Heroku
      },
    });
}
}
module.exports = ConnectionDB;