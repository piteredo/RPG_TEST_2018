//
//
// MainLayer.js
// 2018 @auther piteredo
// This Program is MIT license.
//
//
phina.define('MainLayer', {
	superClass: 'Layer',

	childrenList: [],

	init: function(mapClass){
		this.superInit();
		this.map = mapClass;
	},

	attachChildrenList: function(childrenList){
		this.childrenList = childrenList;
		this._childAll(this.childrenList);
	},

	_childAll: function(childrenList){
		for(var i in childrenList){
			let child = childrenList[i];
			this.child(child);
		};
	},

	update: function(){
		for(let i in this.childrenList){
			let child = this.childrenList[i];
			let tile = this.map.getTile(child.tp.x, child.tp.y);
			if(tile.visible && !child.visible) /*this.child(child);*/ child.visible = true;
			else if(!tile.visible && child.visible) /*this.remove(child);*/ child.visible = false;
		}
	},

	searchChildExistance: function(tpX, tpY){
		for(var i in this.childrenList){
			let child = this.childrenList[i];
			if(child.tp.x == tpX && child.tp.y == tpY){
				return child;
				break;
			}
		};
		return false;
	}
});
