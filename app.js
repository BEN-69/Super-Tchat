var express = require('express'),
    app = express(),
    server = require('http').createServer(app),
    io = require('socket.io').listen(server),
    ent = require('ent'), // Permet de bloquer les caractères HTML (sécurité équivalente à htmlentities en PHP)
    fs = require('fs');


app.use(express.static('public')) // Gestion des fichiers statiques

    .get('/', function(request, response)
    {
        response.sendFile(__dirname + '/views/index.html');
    })

    // On redirige vers la todolist si la page demandée n'est pas trouvée
    .use(function(request, response, next)
    {
        response.redirect('/');
    });

io.sockets.on('connection', function (socket) {

    //pseudo par defaut
    socket.pseudo = "Anonymous"

    /**
     * Log de connexion des utilisateurs
     */
    console.log(socket.pseudo+'a user connected');

    // Dès qu'on nous donne un pseudo, on le stocke en variable de session et on informe les autres personnes
    socket.on('nouveau_client', function(pseudo) {
        pseudo = ent.encode(pseudo);
        socket.pseudo = pseudo;
        let avatar = 'http://imgc.allpostersimages.com/images/P-473-488-90/68/6896/2GOJ100Z/posters/despicable-me-2-minions-movie-poster.jpg';
        socket.avatar = avatar;

     //   socket.broadcast.emit('nouveau_client', pseudo);
        if (socket.pseudo !== "Anonymous") {
            var client_notification = {
                text:  pseudo + ' a rejoint le Chat !',
                type: 'login'
            };
            socket.broadcast.emit('client_notification', client_notification);
        }

    });

    // Dès qu'on reçoit un message, on récupère le pseudo de son auteur et on le transmet aux autres personnes
    socket.on('message', function (message) {
        message = ent.encode(message);
        io.emit('message', {avatar: socket.avatar ,pseudo: socket.pseudo, message: message});
    });


    /**
     * Déconnexion d'un utilisateur '
     */
    socket.on('disconnect', function () {

        console.log(socket.pseudo+'a user disconnected');
        if (socket.pseudo !== "Anonymous") {

            var client_notification = {
                text:  socket.pseudo + ' a quitté le Chat !',
                type: 'logout'
            };

            socket.broadcast.emit('client_notification', client_notification);

        }
    });
});

server.listen(8080);
