const express = require('express');
const cors = require('cors');

const { v4: uuid } = require('uuid');

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

app.get('/repositories', (request, response) => {
    response.json(repositories);
});

app.post('/repositories', (request, response) => {
    const { title, url, techs } = request.body;

    console.log(request.body);
    const repository = {
        id: uuid(),
        title: title,
        url: url,
        techs: techs,
        likes: 0,
    };

    repositories.push(repository);

    return response.json(repository);
});

app.put('/repositories/:id', (request, response) => {
    const { id } = request.params;
    const { title, url, techs, likes } = request.body;

    const repoFound = repositories.findIndex((repo) => repo.id === id);

    if (repoFound >= 0) {
        repositories[repoFound] = {
            id: id,
            title: title,
            url: url,
            techs: techs,
            likes: repositories[repoFound].likes,
        };
    } else {
        return response.status(400).json({ message: 'Repository not found' });
    }
    return response.json(repositories[repoFound]);
});

app.delete('/repositories/:id', (request, response) => {
    const { id } = request.params;

    const repoFound = repositories.findIndex((repo) => repo.id === id);

    if (repoFound >= 0) {
        console.log(`Repositorio encontrado!`);
        console.log(repositories[repoFound]);
        repositories.splice(repoFound, 1);
    } else {
        return response
            .status(400)
            .json({ message: 'Repository does not exists' });
    }

    return response.status(204).send();
});

app.post('/repositories/:id/like', (request, response) => {
    const { id } = request.params;
    const repoFound = repositories.findIndex((repo) => repo.id === id);

    if (repoFound < 0) {
        return response.status(400).send();
    }

    repositories[repoFound].likes++;
    return response.json(repositories[repoFound]);
});

module.exports = app;
