const express = require('express');
const cors = require('cors');
const mysql = require('mysql2');

const app = express();
app.use(cors({
  origin: 'http://localhost:8080'
}));

app.use(express.json());

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'trabalho_final_senac'
});

db.connect(err => {
  if (err) {
    console.error('Erro ao conectar no banco:', err);
    return;
  }
  console.log('Conectado ao MySQL');
});

app.get('/assets', (req, res) => {
  const sql = `
    SELECT 
      i.codigo,
      i.nome,
      i.imagem,
      i.descricaoItem,
      m.descricaoMarca     AS marca,
      i.modelo,
      e.descricaoEmpresa  AS empresa,
      s.descricaoSetor    AS setor,
      st.nomeStatus       AS status
    FROM item i
    LEFT JOIN marca m   ON m.idMarca   = i.idMarca
    LEFT JOIN setor s   ON s.idSetor   = i.idSetor
    LEFT JOIN status st ON st.IdStatus = i.IdStatus 
    LEFT JOIN empresa e ON e.idEmpresa = i.idEmpresa
  `;

  db.query(sql, (err, results) => {
    if (err) {
      return res.status(500).json(err);
    }
    res.json(results);
  });
});

app.listen(3000, () => {
  console.log('API rodando em http://localhost:3000');
});
