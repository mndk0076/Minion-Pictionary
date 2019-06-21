let express = require('express');
let socket = require('socket.io');
let app = express();
let server = app.listen(3000);

players = [];
connections = [];
guessWords = [];

app.use(express.static('public'));

console.log("Server is running...");

let io = socket(server);

io.sockets.on('connection', newConnection);

function newConnection(socket){
    console.log("new connection: " + socket.id);
    console.log('Connected: %s sockets connected', connections.length);

    let words = ["Banana", "House", "Boat", "Car", "Apple", "Shoes", "School", "Basketball", "Church",
                 "Dancing", "Snake", "Monkey", "Dog", "Ice cream", "Pizza", "Horse", "Cow"];
    let ids = [];
    ids.push(socket.id);
    connections.push(socket);

    socket.on('data', dataMsg);
    socket.on('add player', addPlayer);
    socket.on('disconnect', disconnect);
    socket.on('guess word', guess);
    socket.on('reset', reset);

	function addPlayer (data) {
        socket.username = data;

        console.log(socket.username);
        players.push(socket.username);
        
        updatePlayers();
    }

    function disconnect (data) {
        socket.username = data;
        console.log(data);
        console.log('dis: '+socket.username);
		players.splice(players.indexOf(socket.username), 1);
		updatePlayers();
		connections.splice(connections.indexOf(socket), 1)
		io.emit('disconnected', socket.username);
    }
    
    function guess (data){
        guessWords.push(data);
        updateGuessWords();
    }

    function dataMsg(data){
        socket.broadcast.emit('data', data);
        console.log(data);
    }
   
    function reset (data) {
        countdown = 10;
        io.sockets.emit('timer', { countdown: countdown });
        io.sockets.emit('nextDrawer', players[Math.floor(Math.random() * players.length)]);
        timer();
    }

    function timer(){
        var countdown = 10
        let  timer = setInterval(function() {
            countdown--;
            io.sockets.emit('timer', { countdown: countdown });
            if(countdown <= 0){
                clearInterval(timer);
                io.sockets.emit('reset');
                io.sockets.emit('nextDrawer', players[Math.floor(Math.random() * players.length)]);
                guessWords = [];
                updateGuessWords();
            }
        }, 1000);
    }
    function updatePlayers() {
        io.sockets.emit('players list', players);
	}
    function updateGuessWords() {
        io.emit('guess', guessWords);
	}
}