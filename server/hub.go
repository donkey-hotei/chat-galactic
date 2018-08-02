package main

import (
	"encoding/json"
	"log"
	"time"
)

/*
 * Hub maintains the set of active peers and broadcasts changes to
 * the peer set to all active peers.
 */
type Hub struct {
	// Set of registered peers..
	peerset map[*Client]bool
	// Inbound messages from the peerset.
	broadcast chan []byte
	// Register requests from the peerset.
	register chan *Client
	// Unregister requests from peerset.
	unregister chan *Client
}

func newHub() *Hub {
	return &Hub{
		broadcast:  make(chan []byte),
		register:   make(chan *Client),
		unregister: make(chan *Client),
		peerset:    make(map[*Client]bool),
	}
}

/*
 * Structs whose purpose is to be marshalled into JSON.
 */
/*

   PeerListMesssage:

   {
       type: 'peers',
       uuid: '23ea5-3eaa5 ...'
       peers: [
           {
               uuid: '4eff-fe34 ...'
               name: 'planet-pete'
           }
       ]
   }

*/
type PeerListMessage struct {
	Type  string         `json:"type"`
	Uuid  string         `json:"uuid"`
	Peers []*PeerMessage `json:"peers"`
}

/*

   PeerMessage:

   {
       'type': 'register' | 'unregister'
       'uuid': '2a23-5426 ...'
       'name': 'sarah-saturn'
   }
*/
type PeerMessage struct {
	Type string `json:"type"`
	Uuid string `json:"uuid"`
	Name string `json:"name"`
}

/*

   SIPMessage:

       {
           'type': 'offer' | 'answer'
           'uuid': '34a8-2328 ...',
           'data': {
               'destination': '890a-23f2 ...'
               'sdp': 'm=application 32416 udp wb'
           }
       }

*/
type SIPMessage struct {
	Type  string `json:"type"`
	Uuid  string `json:"uuid"`
	Value string `json:"value"`
}

/*
 * Broadcast message to all active peers.
 */
func (h *Hub) Broadcast(message []byte) {
	log.Printf("Broadcasting %s to %d peers.", message, len(h.peerset))
	for client := range h.peerset {
		select {
		case client.send <- message:
		default:
			close(client.send)
			delete(h.peerset, client)
		}
	}
}

/*
 *  Events exchanged by the hub between active peers.
 */

/*
 * Peer registers with the hub. Hub sends newly registered peer
 * uniquely identifying information generated server-side.
 */
func (h *Hub) Register(client *Client) []byte {
	msg_struct := &PeerMessage{"register", client.uuid, client.name}
	message, _ := json.Marshal(msg_struct)
	client.send <- message
	return message
}

/*
 * Peer's connection to hub closes. Hub tells all other peers.
 */
func (h *Hub) Unregister(client *Client) []byte {
	msg_struct := &PeerMessage{"unregister", client.uuid, client.name}
	message, _ := json.Marshal(msg_struct)
	h.Broadcast(message)
	return message
}

/*
 * Builds a PeerListMessage of all active peers.
 */
func (h *Hub) peerlist() []byte {
	peers := make([]*PeerMessage, 0)
	for client, _ := range h.peerset {
		peers = append(peers, &PeerMessage{
			"peer",
			client.uuid,
			client.name,
		})
	}
	msg := &PeerListMessage{"peers", "", peers}
	m, _ := json.Marshal(msg)
	return m
}

/*
 * Run the Hub.
 */
func (h *Hub) run() {
	for {
		select {
		case client := <-h.register:
			h.peerset[client] = true
			h.Register(client)
			time.Sleep(time.Second)
			h.Broadcast(h.peerlist())
		case client := <-h.unregister:
			if _, ok := h.peerset[client]; ok {
				delete(h.peerset, client)
			}
			h.Unregister(client)
			time.Sleep(time.Second)
			h.Broadcast(h.peerlist())
		case message := <-h.broadcast:
			h.Broadcast(message)
		}
	}
}
