import express from 'express';
import puppeteer from 'puppeteer';

const router = express.Router();

router.post('/', async (req, res) => {
  const { urls } = req.body;

  if (!Array.isArray(urls)) {
    return res.status(400).json({ erro: 'Formato inválido. Envie uma lista de URLs.' });
  }

  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();

  let resultados = [];

  for (const url of urls) {
    try {
      await page.goto(url, { waitUntil: 'networkidle2' });

      const canal = await page.evaluate(() => {
        const el = document.querySelector('div.styles_informations__pXcxB');
        return el ? el.innerText.trim() : 'Indefinido';
      });

      resultados.push({ url, canal });

    } catch (err) {
      resultados.push({ url, canal: 'Erro ao acessar: ' + err.message });
    }
  }

  await browser.close();
  res.json(resultados);
});

export default router;
