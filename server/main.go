package main

import (
    "flag"
    "log"
    "net/http"
)

var addr = flag.String("addr", ":8000", "http service address")

/*
   We'll be able to remove the serverHome function later because
   the server will be running via npm.
*/
func serveHome(w http.ResponseWriter, r *http.Request) {
    log.Println(r.URL)
    if r.URL.Path != "/" {
        http.Error(w, "Not found", http.StatusNotFound)
        return
    }
    if r.Method != "GET" {
        http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
        return
    }
    http.ServeFile(w, r, "home.html")
}


func main() {
    flag.Parse()
    hub := newHub()
    go hub.run()
    http.HandleFunc("/", serveHome)
    http.HandleFunc("/ws", func(w http.ResponseWriter, r *http.Request) {
        serveWs(hub, w, r)
    })
    err := http.ListenAndServe(*addr, nil)
    if err != nil {
        log.Fatal("ListenAnd :wqa
    }
}
