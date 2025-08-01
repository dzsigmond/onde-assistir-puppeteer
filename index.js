// index.js
import express from 'express';
import bodyParser from 'body-parser';

// função local mesmo (sem subpasta)
import { extrairDados } from './extrair.js';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());

app.post('/extrair', async (req, res) => {
  try {
    const { urls } = req.body;
    if (!Array.isArray(urls)) {
      return res.status(400).json({ erro: 'Campo "urls" deve ser uma lista.' });
    }

    const resultados = await Promise.all(urls.map(extrairDados));
    res.json({ resultados });
  } catch (erro) {
    console.error(erro);
    res.status(500).json({ erro: 'Erro interno no servidor' });
  }
});

app.get('/', (req, res) => {
  res.send('API está funcionando!');
});

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
