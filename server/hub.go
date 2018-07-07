package main

import (
    "bytes"
    "log"
    "net/http"
    "time"

    "github.com/gorilla/websocket"
)

type Hub struct {
    // connected peers
    peers map[*Client]bool

    // inbound messages from peers
    broadcast chan []byte

    // register requests from peers
    register chan *Client
}

func NewHub() *Hub {
    return &Hub{
        peers: make(chan map[*Client]bool),
        broadcast: make(chan []byte),
        register: make(chan []byte),
        unregister: make(chan []byte),
    }
}

func (h *Hub) run() {
    for {
        select {
        case client := <-h.register:
            h.clients[client] = true
        case client := <-h.unregister:
            if _, ok := h.clients[client]; ok {
                delete(h.clients, client)
                close(client.send)
            }
        case message := <-h.broadcast:
            for client := range h.clients {
                select {
                case client.send <- message:
                default:
                    close(client.send)
                    delete(h.clients, client)
                }
            }
        }
    }
}