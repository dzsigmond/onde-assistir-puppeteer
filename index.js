import express from 'express';
import cors from 'cors';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// ROTA DEFINIDA AQUI
app.post('/extracao', async (req, res) => {
  try {
    const { urls } = req.body;
    if (!urls || !Array.isArray(urls)) {
      return res.status(400).json({ error: 'Parâmetro "urls" inválido' });
    }

    // Simulação de retorno básico
    const resultados = urls.map((url) => ({
      url,
      canais: ['Globo', 'SporTV'],
    }));

    res.json({ resultados });
  } catch (e) {
    res.status(500).json({ error: 'Erro interno no servidor' });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
