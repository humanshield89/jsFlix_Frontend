
class WebSocketManager {
    connection;
    constructor(window , onMessageReceived) {
        this.WebSocket = window.WebSocket || window.MozWebSocket;
        this.websocketSupported = !!window.WebSocket;
        this.requestedClosed = false;
        this.connectToSocket = this.connectToSocket.bind(this)
        this.socketSendMessage = this.socketSendMessage.bind(this)
        this.onMessageReceived = onMessageReceived;
        this.wasOpened = false;
        this.connectToSocket()
    }

    closeConnection(){
        this.requestedClosed = true;
        this.connection.close();
    }

   connectToSocket () {
        this.connection = new WebSocket('wss://wss.humanshield85.tk');

       this.connection.onopen =(event) => {
            console.log('connection was opened');
            this.wasOpened = true;
       };
       this.connection.onerror =  (error) => {
           console.log('error : '+error);
           this.connectToSocket();
       };
       this.connection.onClose = () => {
            // on close
           if(!this.requestedClosed){
               this.connectToSocket();
           }
       };
       this.connection.onmessage = (message) => {
           console.log('message received  : '+JSON.parse(message.data));
           this.onMessageReceived(JSON.parse(message.data))

       };
    }

    socketSendMessage(message){
            if(this.wasOpened){
                this.connection.send(message);
           }


    }
}

export default WebSocketManager;
