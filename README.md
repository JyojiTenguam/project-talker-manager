# 🗣️ Talker Manager

Uma API desenvolvida com Node.js para gerenciar palestrantes (talkers). Permite cadastrar, editar, buscar, deletar e listar informações sobre palestrantes através de requisições HTTP, simulando um sistema de gerenciamento com autenticação e persistência em arquivo JSON.

## ✨ Demonstração

> Projeto sem interface visual. A aplicação expõe endpoints RESTful que podem ser testados via ferramentas como Postman ou Insomnia.

## 📋 Índice

- [Sobre](#-sobre)
- [Habilidades desenvolvidas](#-habilidades-desenvolvidas)
- [Tecnologias utilizadas](#-tecnologias-utilizadas)
- [Como rodar o projeto](#-como-rodar-o-projeto)
- [Autor](#-autor)

## 💡 Sobre

Neste projeto foi desenvolvida uma API capaz de:

- Cadastrar pessoas palestrantes
- Editar e deletar registros
- Buscar por palestrantes
- Validar tokens e dados obrigatórios
- Persistir os dados em arquivo JSON

O objetivo é praticar o desenvolvimento de APIs com autenticação e operações CRUD sem uso de banco de dados.

## 🛠️ Habilidades desenvolvidas

- Criar uma API REST com Node.js e Express
- Implementar autenticação com token (simulado)
- Criar middlewares para validação de dados
- Manipular arquivos JSON como banco de dados
- Desenvolver endpoints GET, POST, PUT e DELETE
- Utilizar práticas de código assíncrono com `async/await`

## 🧪 Tecnologias utilizadas

- Node.js
- Express
- JavaScript ES6+
- Nodemon
- File System (`fs`)

## 🚀 Como rodar o projeto

1. Clone o repositório:

```bash
git clone https://github.com/tryber/project-talker-manager.git
```

2. Acesse a pasta do projeto

```bash
cd project-talker-manager
```

3. Instale as dependências

```bash
npm install
```

4. Inicie o servidor local:

```bash
npm start
```
>A aplicação abrirá no navegador em http://localhost:3001

## 👤 Autor

Este projeto foi desenvolvido como parte do curso de Desenvolvimento Web da Trybe, por Jyoji Tenguam.
