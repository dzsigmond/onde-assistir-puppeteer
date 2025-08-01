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

    const browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    const page = await browser.newPage();
    const resultados = [];

    for (const url of urls) {
      try {
        await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 15000 });

        const canal = await page.evaluate(() => {
          const el = document.querySelector('div[class^="styles_informations__"]');
          return el ? el.innerText.trim() : 'Indefinido';
        });

        resultados.push({ url, canal });
      } catch (erroInterno) {
        resultados.push({ url, canal: 'Erro interno ao extrair' });
      }
    }

    await browser.close();
    res.json({ resultados });

  } catch (erro) {
    res.status(500).json({ error: 'Erro ao iniciar o navegador: ' + erro.message });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
