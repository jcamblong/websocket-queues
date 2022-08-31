const TicketControl = require("../models/ticket-control");


const ticketControl = new TicketControl();

const socketController = (socket) => {

    socket.emit( 'last-ticket', ticketControl.last );
    socket.emit( 'actual-state', ticketControl.last4 );
    socket.emit('pending-tickets', ticketControl.tickets.length );

    socket.on('next-ticket', ( payload, callback ) => {

        const next = ticketControl.next();
        callback( next );

        socket.broadcast.emit('pending-tickets', ticketControl.tickets.length );
    })

    socket.on('get-ticket', ( { desk }, callback ) => {

        if( !desk ){
            return callback({
                ok: false,
                msg: "El escritorio es obligatorio"
            });
        }
        
        const ticket = ticketControl.getTicket( desk );
        
        //TODO: Notificar cambio en los ultimos 4
        socket.broadcast.emit( 'actual-state', ticketControl.last4 );
        socket.emit('pending-tickets', ticketControl.tickets.length );
        socket.broadcast.emit('pending-tickets', ticketControl.tickets.length );


        if( !ticket ) {
            callback({
                ok: false,
                msg: 'Ya no hay tickets pendientes'
            });
        } else {
            callback({
                ok: true,
                ticket
            })
        }
    })

}

module.exports = {
    socketController
}