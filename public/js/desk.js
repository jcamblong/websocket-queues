// Referencias HTML
const lblDesk = document.querySelector('h1');
const buttonGetTicket = document.querySelector('button');
const lblTicket = document.querySelector('small');
const divAlert = document.querySelector('.alert');
const lblPendings = document.querySelector('#lblPendings');

const searchParams = new URLSearchParams( window.location.search );

if( !searchParams.has('desk')) {
    window.location = 'index.html';
    throw new Error('El escritorio es obligatorio');
}

const desk = searchParams.get('desk');
lblDesk.innerText = desk;

divAlert.style.display = 'none';

const socket = io();

socket.on('connect', () => {

    buttonGetTicket.disabled = false;
});

socket.on('disconnect', () => {

    buttonGetTicket.disabled = true;
});

socket.on('pending-tickets', ( pendings ) => {
    if( pendings === 0 ){
        lblPendings.style.display = 'none';
    } else {
        lblPendings.style.display = '';
        lblPendings.innerText = pendings;
    }
})

buttonGetTicket.addEventListener('click', () => {

    socket.emit( 'get-ticket', { desk }, ( { ok, ticket, msg } ) => {
        
        if( !ok ){
            lblTicket.innerText = 'Nadie';
            return divAlert.style.display = '';;
        }

        lblTicket.innerText = 'Ticket ' + ticket.number;
    })
    // socket.emit('next-ticket', null, ( ticket ) => {
    //     lblNewTicket.innerText =  ticket;
    // } );
})