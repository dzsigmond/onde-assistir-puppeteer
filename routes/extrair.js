// routes/extrair.js
import express from 'express';
import puppeteer from 'puppeteer-core';
import chromium from 'chrome-aws-lambda';

const router = express.Router();

router.post('/', async (req, res) => {
  const { urls } = req.body;

  if (!Array.isArray(urls)) {
    return res.status(400).json({ erro: 'Formato inválido. Envie uma lista de URLs.' });
  }

  let browser = null;
  const resultados = [];

  try {
    browser = await puppeteer.launch({
      args: chromium.args,
      executablePath: await chromium.executablePath || '/usr/bin/chromium-browser',
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
        resultados.push({ url, canal: 'Erro: ' + err.message });
      }
    }

    await browser.close();

    res.json(resultados);

  } catch (err) {
    if (browser) await browser.close();
    return res.status(500).json({ erro: 'Erro ao iniciar browser: ' + err.message });
  }
});

export default router;
