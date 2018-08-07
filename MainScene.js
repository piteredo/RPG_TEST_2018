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
		this.superInit({backgroundColor: BACKGROUND_COLOR});

		this._initClasses();
		this._displayMap(this);
		this._displayCharacter(this.map);
		this._displayController(this, this.myCha);
	},

	_initClasses: function(){
		this.map = Map();

		const MY_CHA_FIRST_POS = Vector2(Math.randint(1,this.map.getMapChipLength()-2), Math.randint(1,this.map.getMapChipLength()-2))
		this.myCha = Character(this.map, MY_CHA_FIRST_POS.x, MY_CHA_FIRST_POS.y);

		this.controller = Controller(this.myCha);
		this.nc = NetConnection(this.map, this.myCha);
	},

	_displayMap: function(parent){
		let mapHeight = this.map.getMapHeight();
		let mapChipHeight = this.map.getMapChipHeight();
		let posX = SCREEN_WIDTH / 2;
		let posY = SCREEN_HEIGHT / 2 - mapHeight / 2 + mapChipHeight / 2;
		this.map.setPosition(posX, posY);
		this.map.addChildTo(parent);
	},

	_displayCharacter: function(parent, map){
		this.myCha.addChildTo(parent);
	},

	_displayController: function(parent){
		this.controller.setPosition(130, 820);
		this.controller.addChildTo(parent);
	},
});
