//
//
// phina.extention.js
// 2018 @auther piteredo
// This Program is MIT license.
//
//

//extention of phina.js(4 way -> 8 way)
phina.geom.Vector2.prototype.getDirection = function(){
  var angle = this.toDegree();
  if(angle>=337.5 || angle<22.5) return "right";
  else if(angle<67.5) return "right_down";
  else if(angle<112.5) return "down";
  else if(angle<157.5) return "left_down";
  else if(angle<202.5) return "left";
  else if(angle<247.5) return "left_up";
  else if(angle<292.5) return "up";
  else if(angle<337.5) return "right_up";
}

phina.geom.Vector2.ZERO = phina.geom.Vector2(0, 0);
phina.geom.Vector2.RIGHT = phina.geom.Vector2(1, -1);
phina.geom.Vector2.RIGHT_DOWN = phina.geom.Vector2(1, 0);
phina.geom.Vector2.DOWN = phina.geom.Vector2(1, 1);
phina.geom.Vector2.LEFT_DOWN = phina.geom.Vector2(0, 1);
phina.geom.Vector2.LEFT = phina.geom.Vector2(-1, 1);
phina.geom.Vector2.LEFT_UP = phina.geom.Vector2(-1, 0);
phina.geom.Vector2.UP = phina.geom.Vector2(-1, -1);
phina.geom.Vector2.RIGHT_UP = phina.geom.Vector2(0, -1);

/*
// relative(local) pos -> abusolute(global) pos
phina.display.DisplayElement.prototype.relPosToAbsPos = function(rpX, rpY){
  /*const ROOT_OBJ_NAME = "MainScene";
  let childObj = this;
  let result = Vector2(rpX, rpY);
  let i = 0;
  while(childObj.parent.className != ROOT_OBJ_NAME){
    result.add(childObj.parent.position);
    childObj = childObj.parent;
    i++;
    if(i>100) break;
  }
  return result;
}*/
