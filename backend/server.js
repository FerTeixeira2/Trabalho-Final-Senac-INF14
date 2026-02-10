const express = require('express');
const cors = require('cors');
const mysql = require('mysql2');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const app = express();
app.use(cors({ origin: 'http://localhost:8080' }));
app.use(express.json());

// ================= PASTA DE UPLOAD =================
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}
app.use('/uploads', express.static(uploadDir));

// ================= MULTER =================
const storage = multer.diskStorage({
  destination: (_, __, cb) => cb(null, uploadDir),
  filename: (_, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, Date.now() + ext);
  },
});
const upload = multer({ storage });

// ================= CONEXÃO MYSQL =================
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

// ================= ROTAS =================

// 🔹 LISTAR ATIVOS
app.get('/assets', (req, res) => {
  const sql = `
    SELECT 
      i.codigo,
      i.nome,
      i.descricaoItem,
      i.imagem,
      m.descricaoMarca AS marca,
      i.modelo,
      e.descricaoEmpresa AS empresa,
      s.descricaoSetor AS setor,
      st.nomeStatus AS status,
      g.descricaoGrupo AS grupo,
      sg.descricaoSubgrupo AS subgrupo,
      u.nomeUsuario AS responsavel,
      i.ondeEsta
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
    if (err) {
      console.error(err);
      return res.status(500).json(err);
    }
    res.json(results);
  });
});

// ================= LOOKUPS =================

app.get('/brands', (_, res) => {
  db.query('SELECT descricaoMarca FROM marca', (err, r) => {
    if (err) return res.status(500).json(err);
    res.json(r.map(i => i.descricaoMarca));
  });
});

app.get('/companies', (_, res) => {
  db.query('SELECT descricaoEmpresa FROM empresa', (err, r) => {
    if (err) return res.status(500).json(err);
    res.json(r.map(i => i.descricaoEmpresa));
  });
});

app.get('/sectors', (_, res) => {
  db.query('SELECT descricaoSetor FROM setor', (err, r) => {
    if (err) return res.status(500).json(err);
    res.json(r.map(i => i.descricaoSetor));
  });
});

app.get('/groups', (_, res) => {
  db.query('SELECT descricaoGrupo FROM grupo', (err, r) => {
    if (err) return res.status(500).json(err);
    res.json(r.map(i => i.descricaoGrupo));
  });
});

app.get('/subgroups', (_, res) => {
  db.query('SELECT descricaoSubgrupo FROM subgrupo', (err, r) => {
    if (err) return res.status(500).json(err);
    res.json(r.map(i => i.descricaoSubgrupo));
  });
});

app.get('/status', (_, res) => {
  db.query('SELECT nomeStatus FROM status', (err, r) => {
    if (err) return res.status(500).json(err);
    res.json(r.map(i => i.nomeStatus));
  });
});

// ================= UPLOAD DE IMAGEM =================

app.post('/upload', upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'Nenhuma imagem enviada' });
  }

  const imageUrl = `http://localhost:3000/uploads/${req.file.filename}`;
  res.json({ imageUrl });
});

// ================= CADASTRAR ATIVO =================

app.post('/assets', (req, res) => {
  const item = req.body;

  const sql = `
    INSERT INTO item
    (
      codigo,
      nome,
      descricaoItem,
      idMarca,
      modelo,
      idUsuario,
      idSetor,
      idEmpresa,
      idGrupo,
      idSubgrupo,
      imagem,
      data,
      IdStatus,
      ondeEsta
    )
    VALUES (
      ?, ?, ?,
      (SELECT idMarca FROM marca WHERE descricaoMarca = ?),
      ?,
      1,
      (SELECT idSetor FROM setor WHERE descricaoSetor = ?),
      (SELECT idEmpresa FROM empresa WHERE descricaoEmpresa = ?),
      (SELECT idGrupo FROM grupo WHERE descricaoGrupo = ?),
      (SELECT idSubgrupo FROM subgrupo WHERE descricaoSubgrupo = ?),
      ?,
      NOW(),
      (SELECT IdStatus FROM status WHERE nomeStatus = ?),
      ?
    )
  `;

  const values = [
    item.code,                // codigo
    item.name,                // nome
    item.description,         // descricaoItem
    item.brand,               // marca
    item.model,               // modelo
    item.sector,              // setor
    item.company,             // empresa
    item.group,               // grupo
    item.subgroup,            // subgrupo
    item.imageUrl || null,    // imagem
    item.status === 'active' ? 'Ativo' : 'Baixado', // status
    item.ondeEsta             // ondeEsta
  ];

  db.query(sql, values, (err, result) => {
    if (err) {
      console.error('Erro ao cadastrar ativo:', err);
      return res.status(500).json({ error: err.sqlMessage });
    }

    res.json({
      message: 'Ativo cadastrado com sucesso',
      id: result.insertId,
    });
  });
});

// ================= SERVIDOR =================

app.listen(3000, () => {
  console.log('API rodando em http://localhost:3000');
});
