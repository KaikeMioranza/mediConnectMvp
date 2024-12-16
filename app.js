require('dotenv').config()
const express = require('express');
const InsertMedic = require('./controllers/insertMedic');
const InsertPaciente = require('./controllers/insertPaciente');
const InsertTriagem = require('./controllers/insertTriagem');
const login = require('./controllers/login');
const port = 3000;
const app = express();

app.use(express.json())


app.post('/login_paciente',login.loginPaciente)

app.post('/login_medico',login.loginDr)

app.post('/add_triagem',InsertTriagem.insertTriagemPaciente)

app.post('/add_paciente',InsertPaciente.insertPaciente)

app.post('/add_medic',InsertMedic.insertMedic)

app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.listen(port, () => {
    console.log(`Server is running on port ${port}`)
})