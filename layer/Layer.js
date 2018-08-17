//
//
// Layer.js
// 2018 @auther piteredo
// This Program is MIT license.
//
//
phina.define('Layer', {
	superClass: 'DisplayElement',

	init: function(){
		this.superInit();
	},

	child: function(obj){
		obj.addChildTo(this);
		obj.setVisible(true);
	},

	remove: function(obj){
		obj.setVisible(false);
		this.removeChild(obj);
	},

	getRelPos: function(){
		return this.position;
	},
});
