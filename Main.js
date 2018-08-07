//
//
// Main.js
// 2018 @auther piteredo
// This Program is MIT license.
//
//
phina.globalize();

const SCREEN_WIDTH = 640;
const SCREEN_HEIGHT = 960;
const BACKGROUND_COLOR = "rgb(221, 220, 214)";

phina.main(function() {
   var app = GameApp({
      startLabel: 'main',
      width: SCREEN_WIDTH,
      height: SCREEN_HEIGHT,
      assets: ASSETS,
   });
   app.run();
});
