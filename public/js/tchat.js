// Connexion à socket.io
var socket = io.connect('http://localhost:8080');
$('#formulaire_chat').hide();
$('#change_pseudo').hide();


// On demande le pseudo, on l'envoie au serveur et on l'affiche dans le titre
// Lorsqu'on envoie le formulaire, on transmet le message et on l'affiche sur la page
$('#formulaire_pseudo').submit(function () {
    var pseudo = $('#pseudo').val();
    if(pseudo.length > 0){
        socket.emit('nouveau_client', pseudo);
        $('#formulaire_pseudo').fadeOut();
        $('#change_pseudo').fadeIn();
        $('#formulaire_chat').fadeIn();
    }else{
        alert('Veuillez saisir votre pseudo')
    }

    return false; // Permet de bloquer l'envoi "classique" du formulaire
});


// Quand on reçoit un message, on l'insère dans la page
socket.on('message', function(data) {
    insereMessage(data)
})

/**
 * Quand un nouveau client se connecte, on affiche l'information
 */
socket.on('client_notification', function (data) {
    $('#zone_notification').append($('<li class="' + data.type + '">').html(data.text));
});

// Lorsqu'on envoie le formulaire, on transmet le message et on l'affiche sur la page
$('#formulaire_chat').submit(function () {

    var message = $('#message').val();
    if(message.length>0){
        socket.emit('message', message); // Transmet le message aux autres
        $('#message').val('').focus(); // Vide la zone de Chat et remet le focus dessus
    }else {
        alert('Veuillez saisir votre message')
    }

    return false; // Permet de bloquer l'envoi "classique" du formulaire
});


function insereMessage(data) {
    $('#zone_chat').prepend(' <div class="zone_message center-block">\n' +
        '        <div class="row">\n' +
        '            <div class="col-xs-8 col-md-6">\n' +
        '                <img src="'+data.avatar+'" class="message-photo">\n' +
        '                <h4 class="message-name">'+data.pseudo+'</h4>\n' +
        '            </div>\n' +
        '            <div class="col-xs-4 col-md-6 text-right message-date">Date here</div>\n' +
        '        </div>\n' +
        '        <div class="col-xs-6 col-md-10">\n' +data.message +'</div>\n' +
        '    </div>'
    );
}