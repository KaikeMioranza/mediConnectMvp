const { Connection } = require('pg');
const ConnectionDB = require('../database/DBconnection');

require('dotenv').config()


class login {
    static async loginDr(req,res){
        
        const pool =  ConnectionDB.postgresSql();

        const query = `
        SELECT
            *
        FROM
            medico
        WHERE
            crm ='${req.body.crm}'
        `
        const result = await pool.query(query);
        if(result.rowCount > 0){
            console.log(result)
            res.status(200).json('Acesso permitido')
        }else{
            console.log(result)
            res.status(401).json('Acesso negado')
        }
        
    };
    static async loginPaciente(req,res){
        const pool =  ConnectionDB.postgresSql();
        const query = `
        SELECT
            *
        FROM
            paciente
        WHERE
            cpf = '${req.body.cpf}'
            or numerosus = '${req.body.numerosus}'
        `
        const result = await pool.query(query);

        if(result.rowCount > 0){
            console.log(result)
            res.status(200).json('Acesso permitido')
    }else{
        console.log(result)
        res.status(401).json('Acesso negado')
    }

};
}
module.exports = login;