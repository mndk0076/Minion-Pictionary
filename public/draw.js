let socket = io.connect();
let gameArea = $('#game-area');
let login = $('#login');
let username = $('#username');
let userForm = $('#user-form');
let form = $('#form-user');
let playersList = $('#playersList');
let playersOnline = $('#playersOnline');
let guessWord= $('#guess-word');
let guessForm = $('#guess-form');
let guessChat = $('#guess');
let exit = $('#exit');
let error= $('#error');

gameArea.hide();
//form.hide();

function setup(){
    let canvas = createCanvas(730, 470);
    background(51);
    canvas.parent('sketch-holder');

    socket.on('data', newDrawing);
}
function newDrawing(data){
    noStroke()
    fill(255,0,100);
    ellipse(data.x, data.y, 15,15);
}

function mouseDragged(){
    ///console.log(mouseX + ',' + mouseY);

    let data = {
        x: mouseX,
        y: mouseY
    }

    socket.emit('data', data);

    noStroke()
    fill(255);
    if (mouseIsPressed === true) {
        ellipse(mouseX, mouseY, 15,15);
    }
}

userForm.submit(function(e) {
    e.preventDefault();
    
    if(username.val() ==  ""){
        error.html('*Please enter a username');
    }else{
        socket.emit('add player', username.val());
        form.hide();
        gameArea.show();
    }
});

guessForm.submit(function(e){
    e.preventDefault();

    socket.emit('guess word', guessWord.val());
    guessForm[0].reset();
});

$('#reset').click(function() {
    setup();
    socket.emit('reset');
});

$('#exit').click(function() {
    socket.emit('disconnect');
    socket.disconnect();
    gameArea.hide();
    form.show();
});

socket.on('timer', function (data) {
    $('#counter').html(data.countdown);
});

socket.on('reset', function () {
    $('#word').html('');
    setup();
});

socket.on('word', function (data) {
    $('#word').html(data);
});

socket.on('players list', function (data) {
    var userList = '';

    for (i = 0; i < data.length; i++) {
        if(data[i] != null){
            userList += data[i] + '<br>';
        }
    }

    playersOnline.html(data.length);
    playersList.html(userList);
});

socket.on('guess', function (data) {
    var guessList = '';

    for (i = 0; i < data.length; i++) {
        if(data[i] != null){
            guessList += data[i] + '<br>';
        }
    }
    guessWord.html('');
    guessChat.html(guessList);
});

socket.on('nextDrawer', function (data) {
    $('#next-drawer').html(data);
});