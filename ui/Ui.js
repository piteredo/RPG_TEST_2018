//
//
// Ui.js
// 2018 @auther piteredo
// This Program is MIT license.
//
//
phina.define("Ui", {
	superClass: "DisplayElement",

	init: function(targetObj) {
		this.superInit();

		this._initController(targetObj);
	},

	_initController: function(targetObj){
		this.controller = Controller(targetObj).addChildTo(this);
		this.controller.setPosition(130, 820);
	},
});
