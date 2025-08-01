import express from 'express';
import cors from 'cors';
import puppeteer from 'puppeteer-core';
import chromium from 'chrome-aws-lambda';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.post('/extracao', async (req, res) => {
  const { urls } = req.body;

  if (!urls || !Array.isArray(urls)) {
    return res.status(400).json({ error: 'Parâmetro "urls" inválido' });
  }

  let browser = null;
  const resultados = [];

  try {
    browser = await puppeteer.launch({
      args: chromium.args,
      executablePath: await chromium.executablePath,
      headless: chromium.headless,
      defaultViewport: chromium.defaultViewport,
    });

    const page = await browser.newPage();

    for (const url of urls) {
      try {
        await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 15000 });

        const canal = await page.evaluate(() => {
          const el = document.querySelector('div[class^="styles_informations__"]');
          return el ? el.innerText.trim() : 'Indefinido';
        });

        resultados.push({ url, canal });
      } catch (err) {
        resultados.push({ url, canal: 'Erro ao acessar: ' + err.message });
      }
    }
  } catch (err) {
    return res.status(500).json({ error: 'Erro ao iniciar o navegador: ' + err.message });
  } finally {
    if (browser) await browser.close();
  }

  res.json({ resultados });
});

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
