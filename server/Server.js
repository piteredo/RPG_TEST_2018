//
//
// Server.js
// 2018 @auther piteredo
// This Program is MIT license.
//
//
//let Enemy = require("./Enemy.js");

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


let playerList = {};
let timer;
io.sockets.on("connection", function(socket){

  //ちゃんとする
  /*
  let count = 1;
  function npcWalk(){
    let dirArr = [
      {dir:"left", x:-1, y:1},
      {dir:"up", x:-1, y:-1},
      {dir:"right", x:1, y:-1},
      {dir:"down", x:1, y:1}
    ];
    let id = "degsfhxzfght";
    playerList[id].isAnimating = true;
    playerList[id].dir = dirArr[count%4].dir;
    socket.broadcast.emit("updateIsAnimating", playerList[id]);
    playerList[id].isWalking = true;
    //playerList[id].dir = dir;
    playerList[id].nextX = playerList[id].x + dirArr[count%4].x;
    playerList[id].nextY = playerList[id].y + dirArr[count%4].y;
    //playerList[id].x++;
    //playerList[id].y++;
    socket.broadcast.emit("updateIsWalking", playerList[id]);
    count++;
  }
  if(Object.keys(playerList).length == 0){
    console.log("create npc");
    let npcData = {
      id: "degsfhxzfght",
      x: 8,
      y: 4,
      dir: "down",
      isAnimating: false,
      isWalking: false
    };
    playerList["degsfhxzfght"] = npcData;
    timer = setInterval(npcWalk, 1000);
  }
  */
  if(Object.keys(playerList).length == 0){
    let d = {
      id: "degsfhxzfght",
      x: 8,
      y: 4,
      dir: "down",
      isAnimating: false,
      isWalking: false
    };
    let enemy = new Enemy();
    //console.log(enemy.getName());
  }

  socket.on("newConnection", function(x, y, dir, isAnimating, isWalking){
    let id = socket.id;
    let data = {
      id: id,
      x: x,
      y: y,
      dir: dir,
      isAnimating: isAnimating,
      isWalking: isWalking
    };

    io.to(id).emit("newConTo", id, playerList);
    playerList[id] = data;
    socket.broadcast.emit("newConBroadcast", data);
  });

  socket.on("updateIsAnimating", function(boo, dir){
    playerList[socket.id].isAnimating = boo;
    playerList[socket.id].dir = dir;
    socket.broadcast.emit("updateIsAnimating", playerList[socket.id]);
  });

  socket.on("updateIsWalking", function(boo, nowX, nowY, nextX, nextY, dir){
    let id = socket.id;
    playerList[id].isWalking = boo;
    playerList[id].dir = dir;
    playerList[id].nextX = nextX;
    playerList[id].nextY = nextY;
    playerList[id].x = nowX;
    playerList[id].y = nowY;
    socket.broadcast.emit("updateIsWalking", playerList[id]);
  });

  socket.on("disconnect", function(){
    let id = socket.id;
    delete playerList[id];
    socket.broadcast.emit("disconnected", id);
  });
});
