const https = require('http');

let todo = [
  { id: 1, task: "Do Assignments", dueDate: "2025-07-20", },
  { id: 2, task: "Submit Home Work", dueDate: "2025-07-20", },
  { id: 3, task: "Science Project", dueDate: "2025-08-02", }
];

const server = https.createServer((req, res) => {
  res.setHeader('Content-Type', 'application/json');

  const urlParts = req.url.split('/');
  const path = req.url;
  const method = req.method;
  const id = parseInt(urlParts[2]);

  if (method === 'GET' && path === '/todo') {
    res.writeHead(200);
    res.end(JSON.stringify(todo));
  }

  else if (method === 'POST' && path === '/todo') {
    let body = '';
    req.on('data', chunk => {
      body += chunk;
    });

    req.on('end', () => {
      const addTodo = JSON.parse(body);
      addTodo.id = todo.length + 1;
      todo.push(addTodo);
      res.writeHead(201);
      res.end("New data added");
    });
  }

  else if (method === 'PUT' && urlParts[1] === 'todo' && !isNaN(id)) {
    let body = '';
    req.on('data', chunk => {
      body += chunk;
    });

    req.on('end', () => {
      const updatedTodo = JSON.parse(body);
      const task = todo.find(u => u.id === id);

      if (task) {
        task.name = updatedTodo.name;
        res.writeHead(200);
        res.end(JSON.stringify(task));
      } else {
        res.writeHead(404);
        res.end(JSON.stringify({ message: 'User not found' }));
      }
    });
  }

  else if (method === 'DELETE' && urlParts[1] === 'todo' && !isNaN(id)) {
    const index = todo.findIndex(u => u.id === id);

    if (index !== -1) {
      todo.splice(index, 1);
      res.writeHead(200);
      res.end(JSON.stringify({ message: 'Task deleted successfully' }));
    } else {
      res.writeHead(404);
      res.end(JSON.stringify({ message: 'User not found' }));
    }
  }

  else {
    res.writeHead(404);
    res.end(JSON.stringify({ message: 'Route not found' }));
  }
});

server.listen(4000, () => {
  console.log('Server is running on http://localhost:4000', todo);
});