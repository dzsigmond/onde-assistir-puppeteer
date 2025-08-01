import express from 'express';
import bodyParser from 'body-parser';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());

// Rota POST diretamente em "/"
app.post('/', async (req, res) => {
  try {
    const { urls } = req.body;

    if (!urls || !Array.isArray(urls)) {
      return res.status(400).json({ erro: 'Formato inválido. Envie um array de URLs.' });
    }

    const resultados = await Promise.all(
      urls.map(async (url) => {
        try {
          const response = await fetch(url);
          const html = await response.text();
          const canais = extrairOndeAssistir(html);

          return { url, onde_assistir: canais || 'Indefinido' };
        } catch (erro) {
          return { url, erro: 'Erro ao processar a URL.' };
        }
      })
    );

    res.json(resultados);
  } catch (erro) {
    console.error('Erro no POST /:', erro);
    res.status(500).json({ erro: 'Erro interno do servidor.' });
  }
});

// Função de extração
function extrairOndeAssistir(html) {
  const regexSpan = /<span[^>]*>(.*?)<\/span>/g;
  const matches = [...html.matchAll(regexSpan)];
  const textos = matches.map((m) => m[1].trim()).filter((t) => t && t.length <= 32);

  return textos.length > 0 ? textos.join(', ') : null;
}

// Rota GET simples para teste
app.get('/', (req, res) => {
  res.send('API operacional na raiz /');
});

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
