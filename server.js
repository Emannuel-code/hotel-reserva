const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const port = 3030;

app.use(cors());
app.use(bodyParser.json());
app.use(express.static('public'));

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '123456',
    database: 'icaraidb'
});

connection.connect((err) => {
    if (err) {
        console.error('Erro ao conectar: ' + err.stack);
        return;
    }
    console.log('Conectado como id ' + connection.threadId);
});

app.post('/api/reserva', (req, res) => {
    console.log('Recebendo reserva:', req.body); 
    const { checkin, checkout, adultos, criancas } = req.body;

    const sql = 'INSERT INTO reservas (checkin, checkout, adultos, criancas) VALUES (?, ?, ?, ?)';
    connection.query(sql, [checkin, checkout, adultos, criancas], (err, result) => {
        if (err) {
            console.error('Erro ao salvar a reserva:', err); 
            return res.status(500).send('Erro ao salvar a reserva.');
        }
        res.status(201).send('Reserva salva com sucesso!');
    });
});


app.post('/api/cadastro', (req, res) => {
    const { nome, email, telefone, cidade, mensagem } = req.body;
    console.log('Dados recebidos para cadastro:', req.body); 

    const sql = 'INSERT INTO clientes (nome, email, telefone, cidade, mensagem) VALUES (?, ?, ?, ?, ?)';
    connection.query(sql, [nome, email, telefone, cidade, mensagem], (err, result) => {
        if (err) {
            console.error('Erro ao cadastrar cliente:', err); 
            return res.status(500).send('Erro ao cadastrar cliente.');
        }
        res.status(201).send('Cadastro realizado com sucesso!');
    });
});

app.listen(port, () => {
    console.log(`Servidor rodando na porta ${port}`);
});
