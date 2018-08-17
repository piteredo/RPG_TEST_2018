//
//
// UiLayer.js
// 2018 @auther piteredo
// This Program is MIT license.
//
//
phina.define('UiLayer', {
	superClass: 'Layer',

	init: function(uiSet){
		this.superInit();
		this.child(uiSet);
	}
});
