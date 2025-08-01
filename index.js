import express from 'express';
import cors from 'cors';
import chromium from 'chrome-aws-lambda';
import puppeteer from 'puppeteer-core';

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

    const browser = await puppeteer.launch({
      args: chromium.args,
      defaultViewport: chromium.defaultViewport,
      executablePath: await chromium.executablePath,
      headless: chromium.headless,
    });

    const page = await browser.newPage();

    const resultados = [];

    for (const url of urls) {
      await page.goto(url, { waitUntil: 'domcontentloaded' });

      // Lógica fictícia por enquanto
      resultados.push({
        url,
        canal: 'Globo, Premiere',
        horario: '21:30',
        mandante: 'Time A',
        visitante: 'Time B',
      });
    }

    await browser.close();

    res.json({ resultados });
  } catch (e) {
    console.error('Erro ao iniciar o navegador:', e);
    res.status(500).json({ error: 'Erro ao iniciar o navegador: ' + e.message });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
