import express from 'express';
import cors from 'cors';

const app = express();
app.use(cors());
app.use(express.json());

const PORT = 4000;

// Dados mock
let assets = [
  {
    codigo: 'A001',
    nome: 'Notebook Dell',
    descricaoItem: 'Notebook i7 16GB',
    imagem: '',
    marca: 'Dell',
    modelo: 'Inspiron',
    empresa: 'Empresa X',
    setor: 'TI',
    grupo: 'Computadores',
    subgrupo: 'Notebooks',
    status: 'Ativo'
  }
];

const brands = ['Dell', 'HP', 'Lenovo'];
const companies = ['Empresa X', 'Empresa Y', 'Empresa Z'];
const groups = ['Computadores', 'Periféricos'];
const subgroups = ['Notebooks', 'Desktops', 'Monitores'];
const sectors = ['TI', 'Financeiro', 'RH'];

// Endpoints
app.get('/assets', (req, res) => res.json(assets));
app.post('/assets', (req, res) => {
  const newAsset = req.body;
  assets.push(newAsset);
  res.status(201).json(newAsset);
});

app.get('/brands', (req, res) => res.json(brands));
app.get('/companies', (req, res) => res.json(companies));
app.get('/groups', (req, res) => res.json(groups));
app.get('/subgroups', (req, res) => res.json(subgroups));
app.get('/sectors', (req, res) => res.json(sectors));

app.listen(PORT, () => {
  console.log(`Mock server rodando em http://localhost:${PORT}`);
});
