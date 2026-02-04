import express from 'express';
import mysql from 'mysql2/promise'; // use a versão promise para async/await

const app = express();

// Conexão com MySQL usando async/await
const db = await mysql.createConnection({
  host: 'localhost',
  user: 'manager',
  password: '1985#D-base_',
  database: 'trabalho_final_senac',
});

console.log('Conectado ao MySQL');

// Rota de teste
app.get('/test', async (req, res) => {
  try {
    const [rows] = await db.execute('SELECT NOW() AS data_atual');
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Iniciar servidor
const PORT = 3000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Servidor de teste rodando em http://0.0.0.0:${PORT}`);
});
