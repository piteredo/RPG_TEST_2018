//
//
// Map.js
// 2018 @auther piteredo
// This Program is MIT license.
//
//
phina.define('Map', {
	superClass: 'DisplayElement',

	MAP_CHIP_LENGTH: 12, //same this.MAP_CHIP_LENGTH as this.MAP_LAYOUT.
	MAP_LAYOUT: [
		[1,1,1,1,1,1,1,1,1,1,1,1],
		[1,0,0,0,0,0,0,0,0,0,0,1],
		[1,0,0,0,0,0,0,0,0,0,0,1],
		[1,0,0,0,0,0,0,0,0,0,0,1],
		[1,0,0,0,0,0,0,0,0,0,0,1],
		[1,0,0,0,0,0,0,0,0,0,0,1],
		[1,0,0,0,0,0,0,0,0,0,0,1],
		[1,0,0,0,0,0,0,0,0,0,0,1],
		[1,0,0,0,0,0,0,0,0,0,0,1],
		[1,0,0,0,0,0,0,0,0,0,0,1],
		[1,0,0,0,0,0,0,0,0,0,0,1],
		[1,1,1,1,1,1,1,1,1,1,1,1],
	],
	MAP_CHIP_WIDTH: 28 * 2,
	MAP_CHIP_HEIGHT: 28,
	MAP_CHIP_PADDING: 2.2,
	MAP_CHIP_FLOOR_COLOR: {r:166, g:148, b:37, range:10},
	MAP_CHIP_WALL_COLOR: {r:0, g:164, b:151, range:10},

	init: function(){
		this.superInit();

		this.grid = this._createGrid();
		this.map = this._createMap().addChildTo(this);
	},

	_createGrid: function(){
    let grid = Grid({
      width: Math.min( this.MAP_CHIP_WIDTH * this.MAP_CHIP_LENGTH , this.MAP_CHIP_HEIGHT * this.MAP_CHIP_LENGTH ),
      columns: this.MAP_CHIP_LENGTH
    });
    return grid;
  },

	_createMap: function(){
		let mapArr = DisplayElement();
		(this.MAP_CHIP_LENGTH).times(function(y){
			let tempArr = DisplayElement().addChildTo(mapArr);
			(this.MAP_CHIP_LENGTH).times(function(x){

				let isWalkable = this._calcIsWalkable(this.MAP_LAYOUT[y][x]);
				let mapChip = this._createMapChip(isWalkable);

				let ratio = this.MAP_CHIP_WIDTH.ratio(this.MAP_CHIP_HEIGHT);
		    let ratio_w = ratio[0];
		    let ratio_h = ratio[1];

				let absX = this.grid.span(x);
				let absY = this.grid.span(y);
				mapChip.relPos = Vector2(x, y);

				let pos_qua = mapChip.relPos.toQuarter( ratio_w , ratio_h );
				let xx = this.grid.span( pos_qua.x );
    		let yy = this.grid.span( pos_qua.y );

				mapChip.absPos = Vector2(xx, yy);

				mapChip.isWalkable = isWalkable;
				mapChip.setPosition(xx, yy);
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

	/*
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
	*/

	_createMapChipShape: function(){
		let mapChip = DisplayElement();
		let w = this.MAP_CHIP_WIDTH;
		let h = this.MAP_CHIP_HEIGHT;
		let p = this.MAP_CHIP_PADDING;
		let shape = PathShape({ stroke: null })
      .addPath(0, (-h / 2) + p)
      .addPath((w / 2) - p , 0)
      .addPath(0, (h / 2) - p)
      .addPath((-w / 2) + p, 0)
      .addPath(0, (-h / 2) + p);
		  //origin: 0.5, 0.5
		return shape;
	},

	_attachMapChipColor: function(mapChip, isWalkable){
		let c = null;
		if(isWalkable) c = this.MAP_CHIP_FLOOR_COLOR;
		else c = this.MAP_CHIP_WALL_COLOR;

    var r = c.r;
    var g = c.g;
    var b = c.b;
    var range = c.range || 0;
    var rn_a = (3).map(function(){
      return Math.randint( -range , range );
    });
    let color = "rgb({r},{g},{b})".format({
      r: r + rn_a[0],
      g: g + rn_a[1],
      b: b + rn_a[2]
    });

    mapChip.fill = color;
	},

	getMapHeight: function(){
		return this.MAP_CHIP_HEIGHT * this.MAP_CHIP_LENGTH;
	},

	getMapChipHeight: function(){
		return this.MAP_CHIP_HEIGHT;
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


Number.prototype.$method("ratio", function(value){
  var self = target = 1;
  if(this > value) self = this / value;
  else target = value / this;
  return [self , target];
});


phina.geom.Vector2.prototype.toQuarter = function(ratio_w , ratio_h){
  var w = ratio_w;
  var h = ratio_h
  var vx_x = w/2;
	var vx_y = h/2;
	var vy_x = w/2 * -1;
	var vy_y = h/2;
	var x = (this.x * vx_x) + (this.y * vy_x);
	var y = (this.x * vx_y) + (this.y * vy_y);
	var pos = {x: x , y: y};
	return pos;
};
