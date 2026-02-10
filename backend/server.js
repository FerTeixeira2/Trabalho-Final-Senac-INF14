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

// ================= LISTAR ATIVOS =================
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
    LEFT JOIN status st ON st.idStatus = i.idStatus
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

app.get('/sectors', (_, res) => {
  db.query('SELECT descricaoSetor FROM setor', (err, r) => {
    if (err) return res.status(500).json(err);
    res.json(r.map(i => i.descricaoSetor));
  });
});

app.get('/status', (_, res) => {
  db.query('SELECT nomeStatus FROM status', (err, r) => {
    if (err) return res.status(500).json(err);
    res.json(r.map(i => i.nomeStatus));
  });
});

// ================= CADASTRAR EMPRESA =================
app.post('/companies', (req, res) => {
  const { name, cnpj, description } = req.body;

  if (!name) {
    return res.status(400).json({ error: 'Nome da empresa é obrigatório' });
  }

  const sql = `
    INSERT INTO empresa (descricaoEmpresa, cnpjEmpresa, descricao)
    VALUES (?, ?, ?)
  `;

  db.query(
    sql,
    [name, cnpj || null, description || null],
    (err, result) => {
      if (err) {
        console.error('ERRO MYSQL:', err);
        return res.status(500).json({ error: err.sqlMessage });
      }

      res.status(201).json({
        message: 'Empresa cadastrada com sucesso',
        id: result.insertId,
      });
    }
  );
});

// ================= UPLOAD =================
app.post('/upload', upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'Nenhuma imagem enviada' });
  }

  res.json({
    imageUrl: `http://localhost:3000/uploads/${req.file.filename}`,
  });
});

// ================= CADASTRAR ATIVO =================
app.post('/assets', (req, res) => {
  const item = req.body;

  const sql = `
    INSERT INTO item (
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
      idStatus,
      ondeEsta
    )
    VALUES (
      ?, ?, ?,
      (SELECT idMarca FROM marca WHERE descricaoMarca = ? LIMIT 1),
      ?, 1,
      (SELECT idSetor FROM setor WHERE descricaoSetor = ? LIMIT 1),
      (SELECT idEmpresa FROM empresa WHERE descricaoEmpresa = ? LIMIT 1),
      (SELECT idGrupo FROM grupo WHERE descricaoGrupo = ? LIMIT 1),
      (SELECT idSubgrupo FROM subgrupo WHERE descricaoSubgrupo = ? LIMIT 1),
      ?, NOW(),
      (SELECT idStatus FROM status WHERE nomeStatus = ? LIMIT 1),
      ?
    )
  `;

  const values = [
    item.code,
    item.name,
    item.description,
    item.brand,
    item.model,
    item.sector,
    item.company,
    item.group,
    item.subgroup,
    item.imageUrl || null,
    item.status === 'active' ? 'Ativo' : 'Baixado',
    item.ondeEsta || null,
  ];

  db.query(sql, values, (err, result) => {
    if (err) {
      console.error('ERRO MYSQL:', err);
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
