window.addEventListener('load', function () {

    // WebRTC
    var RTCSessionDescription = window.RTCSessionDescription;
    var RTCPeerConnection = window.webkitRTCPeerConnection;
    var RTCIceCandidate = window.RTCIceCandidate;

    var pc_config = {'iceServers': [{'url': 'stun:stun.l.google.com:19302'}]};
    var pc_constraints = {'optional': [{'DtlsSrtpKeyAgreement': true}]};
    
    var pc_send, pc_receive;  // RTCPeerConnection
    var send_channel, receive_channel;  // RTCDataChannel

    // DOM elements
    var input = document.getElementById('input');
    var output = document.getElementById('content');
    var state = document.getElementById('status'); 
    var userlist = document.getElementById('userlist');

    // websocket connection to signaling server
    var socket = io(document.location.host, {'session': 'data'});

    // session details
    // username is stored in sessionStorage
    var available_peers = [];
    var user_name;
    var peer_name; 

    // syntactic sugar for array membership
    Array.prototype.includes = function(value){
        for (var i=0; i<=this.length; i++)
            if (this[i] == value)
                return true;
        return false;
    }

    /*
     * Encodes apersands, left angle-brackets, and quotes to their html equivalents.
     * @param: string
     */
    function sanitize_input(string) {
        return string.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;');
    }

    /*
     * Add message to user output.
     * @param msg: string, text message to peer
     */
    function add_message(msg) {
        output.insertAdjacentHTML('afterbegin', 
                        "<p><span>" + santize_input(msg) + "</span></p>");
    }


    /*
     * Add user to user list.
     * @param user: string, username of user
     */
    function add_user(user) {
        console.log("Available peers: ", available_peers);
        if (!available_peers.includes(user) && user != user_name){
            console.log("Adding user to user list", user);
            available_peers.push(user);
            userlist.add(new Option(user));
        }
    }


    /*
     * Remove user from user list.
     * @param user: string, username of user
     */
    function remove_user(user){
        for (var i=0; i <= available_peers.length; i++)
            if (userlist[i] !== undefined)
                if (userlist[i].text == user)
                    userlist.remove(i)

        var index = available_peers.indexOf(user);
        available_peers.splice(index, 1);
        console.log("Available peers: ", available_peers);
    }
    

    /*
     * Set local session description and send the offer.
     * @param: desc, local session description
     */
    function setlocalsdp_createoffer(desc){
        console.log("Attempting to set local description.");
        pc_send.setLocalDescription(desc);
    }


    /*
     * Set remote description and send the answer.
     * @param: desc, remote sessions description
     */
    function setlocalsdp_createanswer(desc){
        console.log("Attempting to set the remote description.");
        pc_receive.setLocalDescription(desc);
    }


    /*
     * Error message when creating offer.
     * @param: event, error that occured when creating offer
     */
    function createoffer_error(event){
        console.log('Error calling createOffer(...)', event.message);
    }


    /*
     * Handling ICE candidates for send channel.
     * @param: event
     */
    function send_handleicecandidate(event){
        console.log('Handling ICE candidates: ', event.candidate);
        if (event.candidate){
            var candidate = event.candidate;
            var message = {
                is_sender: "true",
                destination: peer_name,
                sdpMid: candidate.sdpMid,
                sdpMLineIndex: candidate.sdpMLineIndex,
                candidate: candidate.candidate
            }
            socket.emit('ice candidate', message);
        } else {
            console.log("End of ICE candidates.");
        }
    }

    /*
     * Handling ICE Candidates for receive channel.
     * @param: event
     */
    function receive_handleicecandidate(event){
        console.log('Handling ICE Candidates: ', event.candidate);
        if (event.candidate){
            var candidate = event.candidate;
            var message = {
                is_sender: "false",
                destination: user_name,
                sdpMid: candidate.sdpMid,
                sdpMLineIndex: candidate.sdpMLineIndex,
                candidate: candidate.candidate
            }
        } else {
            console.log("End of ICE Candidates.");
        }
    }

    function obtained_receive_channel() {
        console.log("Obtained data channel for receiving data.");
    }

    function datachannel_opened() {
        console.log("DataChannel has been opened.");
    }

    /*
     * caller setup communication channel with callee peer.
     * creates a new RTCPeerConnection object as well as the initial offer.
     * @param: (string) peer_name, name of peer to chat with
     */
    function start_sending_communication(peer_name){
        peer_name = peer_name;
        console.log("Attempting to setup peer communication with", peer_name);

        if (pc_send != null){
            send_channel.close();
            pc_send.close();
            pc_send = null;
        }

        try{
            pc_send = new RTCPeerConnection(null, {optional: []});
            pc_send.onicecandidate = send_handleicecandidate;
            try {
                send_channel = pc_send.createDataChannel('sendchannel', 
                                {reliable: false});
                send_channel.ondatachannel = datachannel_opened;
            } catch(e) {
                console.log('Unable to create data channel.');
                console.log('Send channel creation failed with exception:', e);
                return;
            }
            console.log('created data channel');
        } catch(e) {
            alert('Unable to create RTCPeerConnection.');
            console.log('Peer creation failed with exception:', e.message);
            return;
        }
        // create offer and set local description
        console.log('Successfully created send channel.');
        pc_send.createOffer().then(
            setlocalsdp_createoffer
        ).then(function(){
            // afterwards, send offer to signaling server
            console.log('Sending offer to signaling server.'); 
            var message = {
                source: user_name,
                destination: peer_name,
                jsep: pc_send.localDescription
            };
            socket.emit('jsep', message);
        }).catch(function(e){
            console.log('Failed to create offer with error: ', e);
        });

    }

    /*
     * callee setup receiving channel with peer caller
     * @param: peer_name (string), name of caller who sent offer
     * @param: desc (JSON), session description of remote caller
     */
    function start_receiving_communication(peer_name, desc){
        if (pc_receive != null){
            receive_channel.close(); 
            pc_receive.close()
            pc_receive = null;
        }
        console.log("Attempting to create recieving channel.");
        try {
            pc_receive = new RTCPeerConnection(null, {optional: []});
            pc_receive.ondatachannel = obtained_receive_channel;
            pc_receive.onicecandidate = receive_handleicecandidate; 
            try {
                // create recieve data channel
                receive_channel = pc_receive.createDataChannel('receveichanel',
                                {'reliable': false});                       
            } catch(e) {
                console.log("Unable to create data channel.");
                console.log("Receive channel creation failed with exception", e);
            }
            console.log("Successfully created receive data channel");
        } catch(e) {
            console.log("Unable to create pc_receive");
            console.log("Creating RTCPeerConnectoin failed with exception:", e);
        }
        // create answer and set the remote description
        console.log("Successfully created pc_receive");
        pc_receive.setRemoteDescription(desc);
        pc_receive.createAnswer().then(
            setlocalsdp_createanswer
        ).then(function(){
            console.log("Sending answer to signaling server.");
            var message = {
               source: user_name,
               destination: peer_name,
               jsep: pc_receive.localDescription
            }
            socket.emit('jsep', message);
        }).catch(function(e){
            console.log("Failed to create answer with", e);
        });
    }


    /*
     * connection/disconnection handlers
     */
    socket.on('connect', function(){
        console.log('connected to signaling server');
        input.removeAttribute('disabled');
        }).on('disconnect', function(){
        console.log('disconnected from signaling server');
        input.setAttribute('disabled', 'disabled');
    });


    /*
     * socket session handler 
     */
    socket.on('session', function(message){
        if (window.sessionStorage['token'] == undefined) {
            var token = message.token;
            window.sessionStorage.setItem('token', token);
            user_name = token;
            socket.emit('session', {
                'token': message.token
            });
        } else { 
            var token = window.sessionStorage['token'];
            user_name = token;
            socket.emit('session', {
                'token': token
            });                   
        }                    
    });


    /*
     * handler for inital greeting message from server
     */
    socket.on('greeting', function(message){ 
        add_message(message);
    });


    /*
     * Signaling server sending list of available peers upon 
     * inital connection to server.  
     */
    socket.on('available peers', function(request){
        console.log("Received list of available peers:", request.available_peers);
        var peers = request.available_peers;
        for (var i = 0; i <= peers.length; i++)
            add_user(peers[i]); 
    });

    /*
     * Handler notifying when other peers connect to signaling server.
     */
    socket.on('peer connected', function(message){
        console.log("New peer connected:", message.peer);
        add_user(message.peer);
    });


    /*
     * Handler notifying when other peers disconnect from signaling server.
     */
    socket.on('peer disconnected', function(message){
        console.log("Peer disconnected:", message); 
        remove_user(message.peer);
    });

    
    /*
     * Handler for various errors detected by signaling server.
     */
    socket.on('error', function(error){
        console.log('ERROR:', error.message); 
    });


    /*
     * Handler for recieving offers from caller.
     */
    socket.on('offer', function(offer){
         // check to-whom this offer is for, and route it to them
         console.log("Received offer from", offer.source);
         console.log("With SDP:", offer.jsep);
         start_receiving_communication(offer.source, offer.jsep);
    });


    /*
     * Handler for recieving answers from callee.
     */
    socket.on('answer', function(answer){
        console.log("Received an answer from", answer.source);
        console.log("Containing info:", answer);
    });
    
    window.beforeunload = function(){
         socket.close();
    };


    input.onkeypress = function(e) {
       if (e.keyCode == 13) {
           var selected_user = userlist.selectedIndex;
           if (selected_user != -1){
               // create offer for selected user
               peer_name = userlist[selected_user].text;
               start_sending_communication(peer_name);

               return false;
           } else {
               alert('Select a peer to connect with.');
           }
       }
    };
});
