//
//
// Map.js
// 2018 @auther piteredo
// This Program is MIT license.
//
//
phina.define('Map', {
	superClass: 'DisplayElement',

	MAP_CHIP_LENGTH: 12, //same as MAP_LAYOUT.
	MAP_LAYOUT: [
		[0,0,0,0,0,0,0,0,0,0,0,0],
		[0,0,0,0,0,0,0,0,0,0,0,0],
		[0,0,0,0,0,0,0,0,0,0,0,0],
		[0,0,1,1,0,0,0,0,0,0,0,0],
		[0,0,0,1,0,0,0,0,0,0,0,0],
		[0,0,0,0,0,0,0,0,0,0,0,0],
		[0,0,0,0,0,0,0,0,0,0,0,0],
		[0,0,0,0,0,0,0,0,0,0,0,0],
		[0,0,0,0,0,0,0,0,0,1,0,0],
		[0,0,0,0,0,0,0,0,0,0,0,0],
		[0,0,0,0,0,0,0,0,0,0,0,0],
		[0,0,0,0,0,0,0,0,0,0,0,0],
	],
	MAP_CHIP_WIDTH: 28 * 2, //Twice of height = ratio 2:1
	MAP_CHIP_HEIGHT: 28,
	MAP_CHIP_PADDING: 2.2,
	MAP_CHIP_FLOOR_COLOR: {r:166, g:148, b:37, range:10},
	MAP_CHIP_WALL_COLOR: {r:82, g:78, b:77, range:10},

	init: function(){
		this.superInit();
		this.grid = this._createGrid();
		this.map = this._createMap();
		this.map.addChildTo(this);
	},

	_createGrid: function(){
    return Grid({ // width = min of map_width & map_height
      width: this.MAP_CHIP_HEIGHT * this.MAP_CHIP_LENGTH,
      columns: this.MAP_CHIP_LENGTH
    });
  },

	_createMap: function(){
		let mapArr = DisplayElement();
		(this.MAP_CHIP_LENGTH).times(function(y){
			let tempArr = DisplayElement().addChildTo(mapArr);
			(this.MAP_CHIP_LENGTH).times(function(x){

				let mapChipType = this.MAP_LAYOUT[y][x]; // 0 or 1
				let mapChip = this._createMapChip(mapChipType);
				mapChip.relPos = Vector2(x, y);
				mapChip.absPos = Vector2(
					this.grid.span( this._topToQuarter(mapChip.relPos).x ),
					this.grid.span( this._topToQuarter(mapChip.relPos).y )
				);
				mapChip.isWalkable = this._calcIsWalkable(mapChipType);
				mapChip.setPosition(mapChip.absPos.x, mapChip.absPos.y);
				mapChip.addChildTo(tempArr);

			}.bind(this));
		}.bind(this));
		return mapArr;
	},

	_createMapChip: function(mapChipType){
		let mapChip = DisplayElement();
		let shape = this._createMapChipShape();
		this._attachMapChipColor(shape, mapChipType);
		shape.addChildTo(mapChip);
		return mapChip;
	},

	_createMapChipShape: function(){
		let mapChip = DisplayElement();
		let w = this.MAP_CHIP_WIDTH;
		let h = this.MAP_CHIP_HEIGHT;
		let p = this.MAP_CHIP_PADDING;
		let shape = PathShape({ stroke: null })
      .addPath(0 , (-h/2)+p) //origin: 0.5, 0.5
      .addPath((w/2)-p , 0)
      .addPath(0 , (h/2)-p)
      .addPath((-w/2)+p , 0)
      .addPath(0 , (-h/2)+p);
		return shape;
	},

	_attachMapChipColor: function(mapChip, mapChipType){
		let colorData = null;
		switch(mapChipType){
			case 0: colorData = this.MAP_CHIP_FLOOR_COLOR; break;
			case 1:	colorData = this.MAP_CHIP_WALL_COLOR; break;
		}
    let r = colorData.r;
    let g = colorData.g;
    let b = colorData.b;
    let range = colorData.range || 0;
    let rn_a = (3).map(function(){
      return Math.randint(-range, range);
    });
    let color = "rgb({r},{g},{b})".format({
      r: r + rn_a[0],
      g: g + rn_a[1],
      b: b + rn_a[2]
    });
    mapChip.fill = color;
	},

	_topToQuarter: function(topViewPos){
	  var w = 2; //ratio width=2 : height=1
	  var h = 1;
	  var vx_x = w/2;
		var vx_y = h/2;
		var vy_x = w/2 * -1;
		var vy_y = h/2;
		var x = (topViewPos.x * vx_x) + (topViewPos.y * vy_x);
		var y = (topViewPos.x * vx_y) + (topViewPos.y * vy_y);
		var pos = {x: x , y: y};
		return pos;
	},

	_calcIsWalkable: function(mapChipType){
		// 0=true 1=false(wall)
		return mapChipType == 0;
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
