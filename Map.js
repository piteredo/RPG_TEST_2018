//
//
// Map.js
// 2018 @auther piteredo
// This Program is MIT license.
//
//
phina.define('Map', {
	superClass: 'DisplayElement',

	MAP_CHIP_LENGTH: 20, //same this.MAP_CHIP_LENGTH as this.MAP_LAYOUT.
	MAP_LAYOUT: [
		[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
		[1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
		[1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
		[1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
		[1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
		[1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
		[1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
		[1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
		[1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
		[1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
		[1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
		[1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
		[1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
		[1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
		[1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
		[1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
		[1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
		[1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
		[1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
		[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]
	],
	MAP_CHIP_SIZE: 28, //X Y same
	MAP_CHIP_PADDING: 2.5,
	MAP_CHIP_FLOOR_COLOR: "rgb(180, 180, 180)",
	MAP_CHIP_WALL_COLOR: "rgb(70, 70, 70)",

	init: function(){
		this.superInit();

		this.map = this._createMap().addChildTo(this);
	},

	_createMap: function(){
		let mapArr = DisplayElement();
		(this.MAP_CHIP_LENGTH).times(function(y){
			let tempArr = DisplayElement().addChildTo(mapArr);
			(this.MAP_CHIP_LENGTH).times(function(x){

				let isWalkable = this._calcIsWalkable(this.MAP_LAYOUT[y][x]);
				let mapChip = this._createMapChip(isWalkable);
				let absX = this.MAP_CHIP_SIZE * x;
				let absY = this.MAP_CHIP_SIZE * y;
				mapChip.absPos = Vector2(absX, absY);
				mapChip.relPos = Vector2(x, y);
				mapChip.isWalkable = isWalkable;
				mapChip.setPosition(absX, absY);
				mapChip.addChildTo(tempArr);

			}.bind(this));
		}.bind(this));
		return mapArr;
	},

	_calcIsWalkable: function(mapChipInt){
		// 0=true 1=false(wall)
		return mapChipInt == 0;
	},

	_createMapChip: function(isWalkable){
		let mapChip = DisplayElement();
		let shape = this._createMapChipShape();
		this._attachMapChipColor(shape, isWalkable);
		shape.addChildTo(mapChip);
		return mapChip;
	},

	_createMapChipShape: function(){
		let mapChip = DisplayElement();
		let shape = RectangleShape({
			stroke: null,
			width: this.MAP_CHIP_SIZE - this.MAP_CHIP_PADDING,
			height: this.MAP_CHIP_SIZE - this.MAP_CHIP_PADDING
		});
		//shape.setOrigin(0.5, 0.5);
		return shape;
	},

	_attachMapChipColor: function(mapChip, isWalkable){
		if(isWalkable) mapChip.fill = this.MAP_CHIP_FLOOR_COLOR;
		else mapChip.fill = this.MAP_CHIP_WALL_COLOR;
	},

	getMapSize: function(){
		return this.MAP_CHIP_SIZE * this.MAP_CHIP_LENGTH;
	},

	getMapChipSize: function(){
		return this.MAP_CHIP_SIZE;
	},

	getAbsPosition: function(relPosX, relPosY){
		return this.map.children[relPosY].children[relPosX].absPos;
	},

	getMapChipLength: function(){
		return this.map.children.length;
	},

	getMapChipIsWalkable: function(relPosX, relPosY){
		return this.map.children[relPosY].children[relPosX].isWalkable;
	}
});
