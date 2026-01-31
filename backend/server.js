const express = require('express');
const cors = require('cors');
const mysql = require('mysql2');

const app = express();
app.use(cors({ origin: 'http://localhost:8080' }));
app.use(express.json());

// Conexão com o MySQL
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'trabalho_final_senac',
});

db.connect(err => {
  if (err) {
    console.error('Erro ao conectar no banco:', err);
    process.exit(1);
  }
  console.log('Conectado ao MySQL');
});

// ----- ROTAS -----

// ATIVOS
app.get('/assets', (req, res) => {
  const sql = `
    SELECT 
      i.codigo,
      i.nome,
      i.imagem,
      i.descricaoItem,
      m.descricaoMarca AS marca,
      i.modelo,
      e.descricaoEmpresa AS empresa,
      s.descricaoSetor AS setor,
      st.nomeStatus AS status,
      g.descricaoGrupo AS grupo,
      sg.descricaoSubgrupo AS subgrupo,
      u.nomeUsuario
    FROM item i
    LEFT JOIN marca m ON m.idMarca = i.idMarca
    LEFT JOIN setor s ON s.idSetor = i.idSetor
    LEFT JOIN status st ON st.IdStatus = i.IdStatus
    LEFT JOIN empresa e ON e.idEmpresa = i.idEmpresa
    LEFT JOIN grupo g ON g.idGrupo = i.idGrupo
    LEFT JOIN subgrupo sg ON sg.idSubgrupo = i.idSubgrupo
    LEFT JOIN usuario u ON u.idUsuario = i.idUsuario
  `;
  db.query(sql, (err, results) => {
    if (err) return res.status(500).json(err);
    res.json(results);
  });
});

// MARCAS
app.get('/brands', (req, res) => {
  db.query('SELECT descricaoMarca FROM marca', (err, results) => {
    if (err) return res.status(500).json(err);
    const brands = results.map(r => r.descricaoMarca);
    res.json(brands);
  });
});

// EMPRESAS
app.get('/companies', (req, res) => {
  db.query('SELECT descricaoEmpresa FROM empresa', (err, results) => {
    if (err) return res.status(500).json(err);
    const companies = results.map(r => r.descricaoEmpresa);
    res.json(companies);
  });
});

// SETORES
app.get('/sectors', (req, res) => {
  db.query('SELECT descricaoSetor FROM setor', (err, results) => {
    if (err) return res.status(500).json(err);
    const sectors = results.map(r => r.descricaoSetor);
    res.json(sectors);
  });
});

// GRUPOS
app.get('/groups', (req, res) => {
  db.query('SELECT descricaoGrupo FROM grupo', (err, results) => {
    if (err) return res.status(500).json(err);
    const groups = results.map(r => r.descricaoGrupo);
    res.json(groups);
  });
});

// SUBGRUPOS
app.get('/subgroups', (req, res) => {
  db.query('SELECT descricaoSubgrupo FROM subgrupo', (err, results) => {
    if (err) return res.status(500).json(err);
    const subgroups = results.map(r => r.descricaoSubgrupo);
    res.json(subgroups);
  });
});

// STATUS
app.get('/status', (req, res) => {
  db.query('SELECT nomeStatus FROM status', (err, results) => {
    if (err) return res.status(500).json(err);
    const status = results.map(r => r.nomeStatus);
    res.json(status);
  });
});

// ADICIONAR ATIVO
app.post('/assets', (req, res) => {
  const item = req.body;

  console.log('Dados recebidos no POST /assets:', item);

  const sql = `
    INSERT INTO item
      (codigo, nome, idMarca, modelo, idUsuario, idSetor, idEmpresa, idGrupo, idSubgrupo, imagem, data, IdStatus)
    VALUES (?, ?, 
      (SELECT idMarca FROM marca WHERE descricaoMarca = ?),
      ?, 
      ?, -- idUsuario fixo (1)
      (SELECT idSetor FROM setor WHERE descricaoSetor = ?),
      (SELECT idEmpresa FROM empresa WHERE descricaoEmpresa = ?),
      (SELECT idGrupo FROM grupo WHERE descricaoGrupo = ?),
      (SELECT idSubgrupo FROM subgrupo WHERE descricaoSubgrupo = ?),
      ?, -- imagem (URL/base64)
      NOW(),
      (SELECT IdStatus FROM status WHERE nomeStatus = ?)
    )
  `;

  const values = [
    item.code,
    item.description,
    item.brand,
    item.model,
    1, // idUsuario fixo como 1 (ADM)
    item.sector,
    item.company,
    item.group,
    item.subgroup,
    item.imageUrl || null,
    item.status === 'active' ? 'Ativo' : 'Inativo'
  ];

  db.query(sql, values, (err, result) => {
    if (err) {
      console.error('Erro ao inserir item:', err);
      return res.status(500).json({ error: 'Erro ao cadastrar ativo', details: err });
    }
    res.json({ message: 'Ativo cadastrado', id: result.insertId });
  });
});

// INICIAR SERVIDOR
app.listen(3000, () => {
  console.log('API rodando em http://localhost:3000');
});
