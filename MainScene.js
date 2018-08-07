//
//
// MainScene.js
// 2018 @auther piteredo
// This Program is MIT license.
//
//
phina.define('MainScene', {
	superClass: 'DisplayScene',

	init: function(){
		this.superInit({
			backgroundColor: BACKGROUND_COLOR
		});

		this._initMap();
		this._initCharacter();
		this._initController();
		this._initNetConnection();
	},

	_initMap: function(){
		this.map = Map();
		let posX = SCREEN_WIDTH / 2;
		let posY = SCREEN_HEIGHT / 2 - 182;
		this.map.setPosition(posX, posY);
		this.map.addChildTo(this);
	},

	_initCharacter: function(){
		let pos = this._calcRandomPosition();
		this.myCha = Character(this.map, pos.x, pos.y);
		this.myCha.addChildTo(this.map);
	},

	_calcRandomPosition: function(){
		let x = Math.randint(0, this.map.getMapChipLength() - 1);
		let y = Math.randint(0, this.map.getMapChipLength() - 1);
		return Vector2(x, y);
	},

	_initController: function(){
		this.controller = Controller(this.myCha);
		this.controller.setPosition(130, 820);
		this.controller.addChildTo(this);
	},

	_initNetConnection: function(){
		this.nc = NetConnection(this.map, this.myCha);
	}
});
