//
//
// NetConnection.js
// 2018 @auther piteredo
// This Program is MIT license.
//
//
phina.define("NetConnection", {

	userList: {},//except I

	init: function(map, myCha){
		this.socketio = io.connect('http://localhost:3000');
		this.map = map;
		this.myCha = myCha;
		this._connect();
	},

	//以下、変数記述ちゃんとする
	_connect: function(){
		let relPos = this.myCha.getRelPosition();
		this.socketio.emit("newConnection", relPos.x, relPos.y, this.myCha.dir);

		this.socketio.on("newConTo", function(myId, userList){
			this.myCha.id = myId;
			for(let i in userList){
				this.userList[userList[i].id] = userList[i];
				this.userList[userList[i].id].cha = Character(this.map, this.userList[userList[i].id].x, this.userList[userList[i].id].y);
				this.userList[userList[i].id].cha.addChildTo(this.map);
			}
		}.bind(this));

		this.socketio.on("newConBroadcast", function(newChaData){
			this.userList[newChaData.id] = newChaData;
			this.userList[newChaData.id].cha = Character(this.map, this.userList[newChaData.id].x, this.userList[newChaData.id].y);
			this.userList[newChaData.id].cha.addChildTo(this.map);
		}.bind(this));

		this.myCha.$watch("relPos", function(newPos, oldPos){
			this.socketio.emit("updatePosition", newPos.x, newPos.y, this.myCha.dir);
		}.bind(this));

		this.socketio.on("updatePosition", function(updatedChaData){
				this.userList[updatedChaData.id].id = updatedChaData.id;
				this.userList[updatedChaData.id].x = updatedChaData.x;
				this.userList[updatedChaData.id].y = updatedChaData.y;
				this.userList[updatedChaData.id].dir = updatedChaData.dir;
				this.userList[updatedChaData.id].cha.walkNoLoop(updatedChaData.x, updatedChaData.y, updatedChaData.dir);


		}.bind(this));

		this.socketio.on("disconnected", function(deleatedChaId){
				this.map.removeChild(this.userList[deleatedChaId].cha);
				delete this.userList[deleatedChaId];
		}.bind(this));
	}
});
