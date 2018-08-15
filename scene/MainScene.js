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

		this._initLayerSet();
		this._initMap();
		this._initMyPlayer();
		this._initEnemys();
		this._initUi();
		this._initCamera();
		//this._initNetConnection();
	},

	_initLayerSet: function(){
		this.layerSet = LayerSet().addChildTo(this);
	},

	_initMap: function(){
		this.map = Map();
		this.layerSet.setMapDataToLayer(this.map);
	},

	_initMyPlayer: function(){
		let tp = this._calcRandomTilePos();
		this.myPlayer = Player(this.map, tp.x, tp.y);
		this.layerSet.childToMainLayer(this.myPlayer);
	},

	_calcRandomTilePos: function(){
		let tileLength = this.map.getTileLength();
		let tpX = Math.randint(0, tileLength-1);
		let tpY = Math.randint(0, tileLength-1);
		return Vector2(15, 15);
	},

	_initEnemys: function(){
		//this.enemy = Enemy(this.map, 10, 10);
		//this.layerSet.childToMainLayer(this.enemy);

		let e1 = Enemy(this.map, Math.randint(0, 10), Math.randint(0, 10));
		this.layerSet.childToMainLayer(e1);
		let e2 = Enemy(this.map, Math.randint(0, 10), Math.randint(0, 10));
		this.layerSet.childToMainLayer(e2);
		let e3 = Enemy(this.map, Math.randint(0, 10), Math.randint(0, 10));
		this.layerSet.childToMainLayer(e3);
	},

	_initUi: function(){
		this.ui = Ui(this.myPlayer);
		this.layerSet.childToUiLayer(this.ui);
	},

	_initCamera: function(){
		this.camera = Camera(this.layerSet, this.myPlayer).addChildTo(this);
	},

	//_initNetConnection: function(){
		//this.nc = NetConnection(this.map, this.myPlayer, this.layerSet);
	//}
});
