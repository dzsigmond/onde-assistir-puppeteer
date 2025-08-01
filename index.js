import express from 'express';
import bodyParser from 'body-parser';
import extrairRouter from './routes/extrair.js';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use('/extrair', extrairRouter);

app.get('/', (req, res) => {
  res.send('API está funcionando!');
});

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
