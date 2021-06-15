const express = require('express');
const http = require('http');
const socketio = require('socket.io');
const api = require('./api')
const faker = require('faker');

const app = express();

const server = http.createServer(app);

const io = socketio(server, {
    cors: {
        origin: '*'
    }
});

io.on('connection', socket => {
    socket.on('client_message', data => {
        console.log(data);
        io.emit('message_from_server', {message: 'Hello from express!!!'});
    });
});


const createPerson = () => {
    return {
        firstName: faker.name.firstName(),
        lastName: faker.name.lastName(),
        age: faker.datatype.number({
            min: 1,
            max: 100
        })
    }
}

setInterval(() => {
    io.emit('new_person', {person: createPerson()});
}, 50);


app.use((req, res, next) => {
    req.io = io;
    next();
});

app.use('/api', api);

app.get('/', (req, res) => {
    res.json({foo: 'bar'});
});

app.get('/person', (req, res) => res.json(createPerson()));


server.listen(4000, () => console.log('server started'));