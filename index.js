import express from 'express';
import extrairRoute from './routes/extrair.js';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use('/extrair', extrairRoute);

app.get('/', (req, res) => {
  res.send('API está no ar!');
});

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
