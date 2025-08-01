import express from 'express';
import cors from 'cors';
import puppeteer from 'puppeteer';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.post('/extracao', async (req, res) => {
  try {
    const { urls } = req.body;
    if (!urls || !Array.isArray(urls)) {
      return res.status(400).json({ error: 'Parâmetro "urls" inválido' });
    }

    const resultados = await Promise.all(urls.map(async (url) => {
      const navegador = await puppeteer.launch({ headless: true });
      const pagina = await navegador.newPage();
      await pagina.goto(url);

      // Simulação: você vai depois melhorar isso
      await navegador.close();

      return {
        url,
        canais: ['Globo', 'SporTV'],
      };
    }));

    res.json({ resultados });
  } catch (e) {
    res.status(500).json({ error: `Erro ao iniciar o navegador: ${e.message}` });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
