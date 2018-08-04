//
//
// Server.js
// 2018 @auther piteredo
// This Program is MIT license.
//
//
let fs = require("fs");
let http = require("http");
let server = http.createServer();

server.on("request", function(req, res){
  let url = req.url;
  let tmp = url.split(".");
  let ext = tmp[tmp.length - 1];
  let path = "."+url;
  switch(ext){
    case 'js':
      fs.readFile(path,function(err,data){
        res.writeHead(200,{"Content-Type":"text/javascript"});
        res.end(data,'utf-8');
      });
      break;
    case '/':
      fs.readFile('./index.html',function(err,data){
        res.writeHead(200,{"Content-Type":"text/html"});
        let output = fs.readFileSync("./index.html", "utf-8");
        res.end(output);
      })
      break;
  }
}).listen(3000);
let io = require("socket.io").listen(server);


let userList = {};

io.sockets.on("connection", function(socket){

  socket.on("newConnection", function(relPosX, relPosY, dir){
    //console.log("newConnection");

    let id = socket.id;
    let data = {id: socket.id, x: relPosX, y: relPosY, dir: dir};
    io.to(socket.id).emit("newConTo", socket.id, userList);
    userList[socket.id] = data;
    socket.broadcast.emit("newConBroadcast", data);
  });


  socket.on("updatePosition", function(relPosX, relPosY, dir){
    //console.log("updatePosition");

    userList[socket.id].x = relPosX;
    userList[socket.id].y = relPosY;
    userList[socket.id].dir = dir;
    console.log(userList[socket.id]);
    socket.broadcast.emit("updatePosition", userList[socket.id]);
  });


  socket.on("disconnect", function(){
    if(userList[socket.id]){ //if必要？
      //console.log("disconnect");
      socket.broadcast.emit("disconnected", socket.id);
      delete userList[socket.id];
    }
  });
});
