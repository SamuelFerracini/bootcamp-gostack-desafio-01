const express = require("express");
const server = express();

server.use(express.json());

const projects = [];
let numberOfRequests = 0;

//Middleware checa se o projeto existe
function checkProject(req, res, next) {
  const project = projects.find(element => {
    return element.id == req.params.id;
  });
  if (!project) {
    return res.status(400).json({
      error: "Project does not exists"
    });
  }
  return next();
}

//Middleware conta número de requests
function logRequests(req, res, next) {
  numberOfRequests++;
  console.log(`O número de requisições é de: ${numberOfRequests}`);
  return next();
}

server.use(logRequests);

//Lista projetos
server.get("/projects", (req, res) => {
  return res.json(projects);
});

//Cria projeto
server.post("/projects", (req, res) => {
  const { id, title } = req.body;
  projects.push({
    id,
    title,
    tasks: []
  });
  return res.json(projects);
});

//Altera título do projeto
server.put("/projects/:id", checkProject, (req, res) => {
  const { id } = req.params;
  const { title } = req.body;

  const project = projects.find(element => element.id == id);

  project.title = title;

  return res.json(project);
});

//Deleta projeto
server.delete("/projects/:id", checkProject, (req, res) => {
  const { id } = req.params;
  const project = projects.find(element => element.id == id);

  projects.pop(project);
  return res.send();
});

server.post("/projects/:id/tasks", checkProject, (req, res) => {
  const { title } = req.body;
  const { id } = req.params;
  const project = projects.find(element => {
    return element.id == id;
  });
  project.tasks.push(title);
  return res.json(project);
});

server.listen(3333);
