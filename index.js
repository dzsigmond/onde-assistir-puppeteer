import express from 'express';
import bodyParser from 'body-parser';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());

// Nova rota: /extracao
app.post('/extracao', async (req, res) => {
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
    console.error('Erro no endpoint /extracao:', erro);
    res.status(500).json({ erro: 'Erro interno do servidor.' });
  }
});

// Função auxiliar para extrair canais da página HTML
function extrairOndeAssistir(html) {
  const regexSpan = /<span[^>]*>(.*?)<\/span>/g;
  const matches = [...html.matchAll(regexSpan)];
  const textos = matches.map((m) => m[1].trim()).filter((t) => t && t.length <= 32);

  if (textos.length > 0) {
    return textos.join(', ');
  }

  return null;
}

// Rota GET padrão
app.get('/', (req, res) => {
  res.send('API está funcionando!');
});

// Inicia servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
