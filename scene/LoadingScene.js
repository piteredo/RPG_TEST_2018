//
//
// LoadingScene.js
// 2018 @auther piteredo
// This Program is MIT license.
//
//
phina.define('LoadingScene', {
	superClass: 'phina.display.DisplayScene',

	BACKGROUND_COLOR: BACKGROUND_COLOR,
	GAUGE_WIDTH: 120,
	GAUGE_HEIGHT: 12,
	GAUGE_BG_COLOR: "rgb(201, 200, 194)",
	GAUGE_COLOR: "rgb(171, 170, 154)",
	GAUGE_ANIMATION_TIME: 300, // if 0 -> 1000(default)
	GAUGE_POS_X: SCREEN_WIDTH / 2,
	GAUGE_POS_Y: SCREEN_HEIGHT / 2,
	LABEL_TEXT: "loading...",
	LABEL_COLOR: "rgb(171, 170, 154)",
	LABEL_FONT_SIZE: 25,
	LABEL_FONT_WEIGHT: "bold",
	LABEL_MARGIN_TOP: 25, // margin-top from loader
	LABEL_POS_X: SCREEN_WIDTH / 2,
	LABEL_POS_Y: SCREEN_HEIGHT / 2 + 25,

	init: function(options){
		options = ({
			backgroundColor: this.BACKGROUND_COLOR
		}).$safe(options, phina.game.LoadingScene.defaults);
		this.superInit(options);

		let gauge = this._createGauge().addChildTo(this);
		let label = this._createLabel().addChildTo(this);
		let loader = phina.asset.AssetLoader();
		this._load(options, gauge, label, loader);
	},

	_createGauge: function(){
		var gauge = Gauge({
			value: 0,
			width: this.GAUGE_WIDTH,
			height: this.GAUGE_HEIGHT,
			fill: this.GAUGE_BG_COLOR,
			stroke: false,
			gaugeColor: this.GAUGE_COLOR,
			padding: 0,
		})
		.setPosition(this.GAUGE_POS_X, this.GAUGE_POS_Y);
		gauge.animationTime = this.GAUGE_ANIMATION_TIME;
		return gauge;
	},

	_createLabel: function(){
		var label = Label({
			text: this.LABEL_TEXT,
			fill: this.LABEL_COLOR,
			fontSize: this.LABEL_FONT_SIZE,
			fontWeight: this.LABEL_FONT_WEIGHT
		})
		.setPosition(this.LABEL_POS_X, this.LABEL_POS_Y);
		return label;
	},

	_load: function(options, gauge, label, loader){
		loader.onprogress = function(e) {
			gauge.value = e.progress * 100;
		}.bind(this);
		gauge.onfull = function() {
			this.flare('loaded'); // call "onLoaded" of phina.game.GameApp -> MainScene
		}.bind(this);

		loader.load(options.assets); // start "load" of phina.asset.AssetLoader
	}
});
