const express = require('express');
const fs = require('fs').promises; // Importa o módulo fs para trabalhar com promessas

const app = express();
app.use(express.json());

const HTTP_OK_STATUS = 200;
const PORT = process.env.PORT || '3001';
const crypto = require('crypto');
// não remova esse endpoint, e para o avaliador funcionar
app.get('/', (_request, response) => {
  response.status(HTTP_OK_STATUS).send();
});

app.listen(PORT, () => {
  console.log('Online');
});

// Endpoint GET /talker
app.get('/talker', async (_request, response) => {
  try {
    const talkers = await fs.readFile('src/talker.json', 'utf-8');
    const talkerslist = JSON.parse(talkers);

    if (talkerslist.length > 0) {
      response.status(HTTP_OK_STATUS).send(talkerslist);
    } else {
      response.status(HTTP_OK_STATUS).send([]);
    }
  } catch (error) {
    // Em caso de erro na leitura do arquivo, retorna um array vazio
    response.status(500).send({ message: 'Erro ao ler palestrantes cadastrados' });
  }
});

app.get('/talker/:id', async (request, response) => {
  try {
    const talkers = await fs.readFile('src/talker.json', 'utf-8');
    const talkersList = JSON.parse(talkers);
    const { id } = request.params;
    const talker = talkersList.find((talk) => talk.id === parseInt(id, 10));

    if (talker) {
      response.status(200).send(talker);
    } else {
      response.status(404).send({ message: 'Pessoa palestrante não encontrada' });
    }
  } catch (error) {
    response.status(500).send({ message: 'Erro ao processar a requisição' });
  }
});

app.post('/login', (request, response) => {
  // Gera um token aleatório de 16 caracteres
  const token = crypto.randomBytes(8).toString('hex');
  response.status(200).send({ token });
});
