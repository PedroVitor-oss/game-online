const express = require("express");
const path = require('path');
const app = express();

const server = require("http").createServer(app);
const io = require("socket.io")(server);

app.use(express.static(path.join(__dirname,"public")));
app.set("views",path.join(__dirname,'public'));
app.engine('html',require('ejs').renderFile);
app.set("view engine",'html');

app.use('/',(req,res)=>{
    res.render('home.html');
})
let jogadores = []
io.on('connection', socket=>{
    let postion = {x:0,y:100};
    socket.position = postion;
    socket.direcao = 0

    jogadores.push({
        position:socket.position,
        direcao:socket.direcao,
        id:socket.id});

    socket.emit("carregarJogadore",jogadores);
    socket.on("atualizar",()=>{
        socket.emit("carregarJogadore",jogadores);
    })
    socket.on("movUp",()=>{
        socket.position.y-=10;
        socket.direcao = 1;
        socket.emit("newPosi",socket.position);
    })
    socket.on("movDOWN",()=>{
        socket.position.y+=10;
        socket.direcao = 0;
        socket.emit("newPosi",socket.position);
    })
    socket.on("movLEFT",()=>{
        socket.position.x-=10;
        socket.direcao = 2;
        socket.emit("newPosi",socket.position);
    })
    socket.on("movRIGHT",()=>{
        socket.position.x+=10;
        socket.direcao = 3;
        socket.emit("newPosi",socket.position);
    })

    socket.on("disconnect",()=>{
        console.log("desconected socket");
        let index;
        for(j of jogadores){
            if(j.id == socket.id){
               index =  jogadores.indexOf(j);
            }
        }
        jogadores.splice(index, 1)
    })
    console.log("socket conectado: ",socket.id);
})
server.listen(process.env.PORT||3000,console.log('aberto no localhost 3000'));