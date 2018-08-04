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
		let mapSize = this.map.getMapSize();
		let mapChipSize = this.map.getMapChipSize();
		let posX = this._calcCenterPosition(mapSize, mapChipSize, SCREEN_WIDTH);
		let posY = this._calcCenterPosition(mapSize, mapChipSize, SCREEN_HEIGHT) - 150;
		this.map.setPosition(posX, posY);
		this.map.addChildTo(parent);
	},

	_calcCenterPosition: function(mapSize, mapChipSize, scereenSize){
		return (scereenSize / 2) - (mapSize / 2) + (mapChipSize /2); //汎用化する or 不要？
	},

	_displayCharacter: function(parent, map){
		this.myCha.addChildTo(parent);
	},

	_displayController: function(parent){
		this.controller.setPosition(130, 820);
		this.controller.addChildTo(parent);
	},
});
