 const lblNewTicket = document.querySelector('#lblNewTicket');
 const buttonCreate = document.querySelector('button');

const socket = io();

socket.on('connect', () => {

    buttonCreate.disabled = false;
});

socket.on('disconnect', () => {

    buttonCreate.disabled = true;
});

socket.on('last-ticket', ( last ) => {
    lblNewTicket.innerText = 'Ticket ' + last;
})

buttonCreate.addEventListener('click', () => {

    socket.emit('next-ticket', null, ( ticket ) => {
        lblNewTicket.innerText =  ticket;
    } );
})