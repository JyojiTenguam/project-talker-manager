const express = require('express');
const fs = require('fs').promises; // Importa o módulo fs para trabalhar com promessas
const path = require('path');
const crypto = require('crypto');

const app = express();
app.use(express.json());
const HTTP_OK_STATUS = 200;
const PORT = process.env.PORT || '3001';
app.get('/', (_request, response) => {
  response.status(HTTP_OK_STATUS).send();
});
const talkersFilePath = path.join(__dirname, 'talker.json');
app.get('/talker', async (_request, response) => {
  try {
    const talkers = await fs.readFile(talkersFilePath, 'utf-8');
    const talkersList = JSON.parse(talkers);
    if (talkersList.length > 0) {
      response.status(HTTP_OK_STATUS).send(talkersList);
    } else {
      response.status(HTTP_OK_STATUS).send([]);
    }
  } catch (error) {
    response.status(500).send({ message: 'Erro ao ler palestrantes cadastrados' });
  }
});

app.get('/talker/:id', async (request, response) => {
  try {
    const talkers = await fs.readFile(talkersFilePath, 'utf-8');
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

function validateLogin(request, response, next) {
  const { email, password } = request.body;
  if (!email) {
    return response.status(400).send({ message: 'O campo "email" é obrigatório' });
  }
  const emailRegex = /\S+@\S+\.\S+/;
  if (!emailRegex.test(email)) {
    return response.status(400).send({ message: 'O "email" deve ter o formato "email@email.com"' });
  }
  if (!password) {
    return response.status(400).send({ message: 'O campo "password" é obrigatório' });
  }
  if (password.length < 6) {
    return response.status(400).send({ message: 'O "password" deve ter pelo menos 6 caracteres' });
  }
  next();
}

app.post('/login', validateLogin, (request, response) => {
  const token = crypto.randomBytes(8).toString('hex');
  response.status(200).send({ token });
});

function validateToken(request, response, next) {
  const { authorization } = request.headers;
  if (!authorization) {
    return response.status(401).json({ message: 'Token não encontrado' });
  }
  if (authorization.length !== 16) {
    return response.status(401).json({ message: 'Token inválido' });
  }
  next();
}

function validateName(request, response, next) {
  const { name } = request.body;
  if (!name) {
    return response.status(400).json({ message: 'O campo "name" é obrigatório' });
  }
  if (name.length < 3) {
    return response.status(400).json({ message: 'O "name" deve ter pelo menos 3 caracteres' });
  }
  next();
}

function validateAge(request, response, next) {
  const { age } = request.body;
  if (!age) {
    return response.status(400).json({ message: 'O campo "age" é obrigatório' });
  }
  if (typeof age !== 'number') {
    return response.status(400).json({ 
      message: 'O campo "age" deve ser um número inteiro igual ou maior que 18',
    });
  }
  if (!Number.isInteger(age) || age < 18) {
    return response.status(400).json({ 
      message: 'O campo "age" deve ser um número inteiro igual ou maior que 18',
    });
  }
  next();
}

function validateTalkPresence(talk, response) {
  if (!talk) {
    response.status(400).json({ message: 'O campo "talk" é obrigatório' });
    return false;
  }
  return true;
}

function validateWatchedAt(watchedAt, response) {
  if (!watchedAt) {
    response.status(400).json({ message: 'O campo "watchedAt" é obrigatório' });
    return false;
  } if (!/^\d{2}\/\d{2}\/\d{4}$/.test(watchedAt)) {
    response.status(400).json({ message: 'O campo "watchedAt" deve ter o formato "dd/mm/aaaa"' });
    return false;
  }
  return true;
}

function isRateProvided(rate, response) {
  if (rate === undefined || rate === '') {
    response.status(400).json({ message: 'O campo "rate" é obrigatório' });
    return false;
  }
  return true;
}

function isRateNumber(rate, response) {
  if (typeof rate !== 'number') {
    response.status(400).json({ message: 'O campo "rate" deve ser um número' });
    return false;
  }
  return true;
}

function isRateInteger(rate, response) {
  if (!Number.isInteger(rate)) {
    response.status(400).json({ message: 'O campo "rate" deve ser um número inteiro entre 1 e 5' });
    return false;
  }
  return true;
}

function isRateInRange(rate, response) {
  if (rate < 1 || rate > 5) {
    response.status(400).json({
      message: 'O campo "rate" deve ser um número inteiro entre 1 e 5',
    });
    return false;
  }
  return true;
}

function validateRate(rate, response) {
  return isRateProvided(rate, response)
        && isRateNumber(rate, response)
        && isRateInteger(rate, response)
        && isRateInRange(rate, response);
}

function validateTalk(request, response, next) {
  const { talk } = request.body;
  if (!validateTalkPresence(talk, response)) return;
  if (!validateWatchedAt(talk.watchedAt, response)) return;
  if (!validateRate(talk.rate, response)) return;
  next();
}

app.post('/talker', validateToken, validateName,
  validateAge, validateTalk, async (request, response) => {
    try {
      const newTalker = request.body;
      const talkers = JSON.parse(await fs.readFile(talkersFilePath, 'utf-8'));
      newTalker.id = talkers.length + 1;
      talkers.push(newTalker);
      await fs.writeFile(talkersFilePath, JSON.stringify(talkers, null, 2));
      return response.status(201).json(newTalker);
    } catch (error) {
      response.status(500).send({ message: 'Erro ao cadastrar o palestrante' });
    }
  });
    
app.put('/talker/:id', validateToken, validateName,
  validateAge, validateTalk, async (request, response) => {
    const { id } = request.params;
    const updatedTalker = request.body;
    try {
      const talkers = JSON.parse(await fs.readFile(talkersFilePath, 'utf-8'));
      const talkerIndex = talkers.findIndex((talker) => talker.id === parseInt(id, 10));
      if (talkerIndex === -1) {
        return response.status(404).json({ message: 'Pessoa palestrante não encontrada' });
      }
      talkers[talkerIndex] = { 
        ...talkers[talkerIndex],
        ...updatedTalker, 
        id: talkers[talkerIndex].id,
      };
      await fs.writeFile(talkersFilePath, JSON.stringify(talkers, null, 2));
      return response.status(200).json(talkers[talkerIndex]);
    } catch (error) {
      return response.status(500).send({ message: 'Erro ao editar o palestrante' });
    }
  });
  
app.delete('/talker/:id', validateToken, async (request, response) => {
  const { id } = request.params;
  try {
    const talkers = JSON.parse(await fs.readFile(talkersFilePath, 'utf-8'));
    const talkerIndex = talkers.findIndex((talker) => talker.id === parseInt(id, 10));

    if (talkerIndex === -1) {
      return response.status(404).json({ message: 'Pessoa palestrante não encontrada' });
    }
    talkers.splice(talkerIndex, 1);
    await fs.writeFile(talkersFilePath, JSON.stringify(talkers, null, 2));
    return response.status(204).end();
  } catch (error) {
    return response.status(500).send({ message: 'Erro ao deletar o palestrante' }); 
  }
});

app.get('/talker/search', validateToken, async (request, response) => {
  const { q } = request.query;
  try {
    const talkers = JSON.parse(await fs.readFile(talkersFilePath, 'utf-8'));
    if (!q) {
      return response.status(200).json(talkers);
    }
    const filteredTalkers = talkers.filter((talker) =>
      talker.name.toLowerCase().includes(q.toLowerCase()));
    return response.status(200).json(filteredTalkers);
  } catch (error) {
    return response.status(500).send({ message: 'Erro ao buscar palestrantes' });
  }
});

app.listen(PORT, () => {
  console.log('Online');
});
