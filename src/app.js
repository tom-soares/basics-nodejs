const express = require('express');
const cors = require('cors');
const { uuid } = require('uuidv4');

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

function validateId(request, response, next) {
	const { id } = request.params;

	const findIndex = repositories.findIndex(repository => repository.id === id);

	if (findIndex < 0) {
		return response.status(400).json({ error: 'Repository not found' });
	}

	return next();
}

app.use('/repositories/:id', validateId);

app.get('/repositories', (request, response) => {
	response.json(repositories);
});

app.post('/repositories', (request, response) => {
	const { title, url, techs } = request.body;

	const repository = {
		id: uuid(),
		title,
		url,
		techs,
		likes: 0,
	};

	repositories.push(repository);

	return response.json(repository);
});

app.put('/repositories/:id', (request, response) => {
	const { title, url, techs } = request.body;
	const { id } = request.params;

	const findIndex = repositories.findIndex(repository => repository.id === id);

	repositories[findIndex] = {
		id,
		title,
		url,
		techs,
		likes: repositories[findIndex].likes,
	};

	return response.json(repositories[findIndex]);
});

app.delete('/repositories/:id', (request, response) => {
	const { id } = request.params;

	const findIndex = repositories.findIndex(repository => repository.id === id);

	repositories.splice(findIndex, 1);

	return response.status(204).send();
});

app.post('/repositories/:id/like', (request, response) => {
	const { id } = request.params;

	const repository = repositories.find(repository => repository.id === id);

	repository.likes += 1;

	return response.json(repository);
});

module.exports = app;
