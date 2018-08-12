//
//
// NetConnection.js
// 2018 @auther piteredo
// This Program is MIT license.
//
//
phina.define("NetConnection", {

	chaList: {},

	init: function(map, myCha, layerSet){
		this.socketio = io.connect('http://localhost:3000');
		this.map = map;
		this.myCha = myCha;
		this.layerSet = layerSet;
		this._connect();
	},

	_connect: function(){
		let x = this.myCha.getRelPosition().x;
		let y = this.myCha.getRelPosition().y;
		let dir = this.myCha.getDirection();
		let isAnimating = this.myCha.getIsAnimating();
		let isWalking = this.myCha.getIsWalking();

		this.socketio.emit("newConnection", x, y, dir, isAnimating, isWalking);

		this.socketio.on("newConTo", function(myId, chaList){
			this.myCha.id = myId;
			for(let i in chaList){
				let cha = chaList[i];
				this.chaList[cha.id] = cha;
				cha.cha = Character(this.map, cha.x, cha.y, cha.dir);
				this.layerSet.childToMainLayer(cha.cha);
			}
		}.bind(this));

		this.socketio.on("newConBroadcast", function(chaData){
			let cha = chaData
			this.chaList[cha.id] = cha;
			cha.cha = Character(this.map, cha.x, cha.y, cha.dir);
			this.layerSet.childToMainLayer(cha.cha);
		}.bind(this));


		this.myCha.$watch("isAnimating", function(newBoo, oldBoo){
			this.socketio.emit("updateIsAnimating", newBoo, this.myCha.dir);
		}.bind(this));

		this.socketio.on("updateIsAnimating", function(chaData){
			let id = chaData.id;
			this.chaList[id].isAnimating = chaData.isAnimating;
			this.chaList[id].dir = chaData.dir;
			//
			if(chaData.isAnimating) this.chaList[id].cha.animation(chaData.dir);
			else this.chaList[id].cha.animationEnd();
		}.bind(this));


		this.myCha.$watch("isWalking", function(newBoo, oldBoo){
			let nextRelPos = this.myCha.calcNextRelPosition(this.myCha.relPos, this.myCha.dir);
			this.socketio.emit("updateIsWalking", newBoo, this.myCha.relPos.x, this.myCha.relPos.y, nextRelPos.x, nextRelPos.y, this.myCha.dir);
		}.bind(this));

		this.socketio.on("updateIsWalking", function(chaData){
			let id = chaData.id;
			this.chaList[id].dir = chaData.dir;
			//
			if(chaData.isWalking){
				this.chaList[id].cha.walk(chaData.nextX, chaData.nextY);
			}
			else{
				this.chaList[id].cha.relPos = Vector2(chaData.x, chaData.y);
				this.chaList[id].cha.dir = chaData.dir;
			}
		}.bind(this));


		this.socketio.on("disconnected", function(id){
				this.layerSet.removeChildMainLayer(this.chaList[id].cha);
				delete this.chaList[id];
		}.bind(this));
	}
});
