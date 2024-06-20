const express = require('express');
const fs = require('fs').promises; // Importa o módulo fs para trabalhar com promessas

const app = express();
app.use(express.json());

const HTTP_OK_STATUS = 200;
const PORT = process.env.PORT || '3001';

// não remova esse endpoint, e para o avaliador funcionar
app.get('/', (_request, response) => {
  response.status(HTTP_OK_STATUS).send();
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
    response.status(HTTP_OK_STATUS).send([]);
  }
});

app.listen(PORT, () => {
  console.log('Online');
});
