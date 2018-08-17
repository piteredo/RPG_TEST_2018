//
//
// assets.js
// 2018 @auther piteredo
// This Program is MIT license.
//
//
const ASSETS = {
	image: {
		"tomapiko": "https://rawgit.com/phi-jp/phina.js/develop/assets/images/tomapiko_ss.png",
		"nasupiyo": "https://rawgit.com/phinajs/phina.js/develop/assets/images/character/nasupiyo.png"
	},

	spritesheet: {
		"tomapiko_ss": {
			"frame": {
				"width": 64,
				"height": 64,
				"cols": 6,
				"rows": 3,
			},
			"animations": {
				"right_down": {
					"frames": [7, 8, 6],
					"next": "right_down",
					"frequency": 4,
				},
				"down": {
					"frames": [7, 8, 6],
					"next": "down",
					"frequency": 4,
				},
				"left_down": {
					"frames": [7, 8, 6],
					"next": "left_down",
					"frequency": 4,
				},
				"left": {
					"frames": [13, 14, 12],
					"next": "left",
					"frequency": 4,
				},
				"left_up": {
					"frames": [10, 11, 9],
					"next": "left_up",
					"frequency": 4,
				},
				"up": {
					"frames": [10, 11, 9],
					"next": "up",
					"frequency": 4,
				},
				"right_up": {
					"frames": [10, 11, 9],
					"next": "right_up",
					"frequency": 4,
				},
				"right": {
					"frames": [16, 17, 15],
					"next": "right",
					"frequency": 4,
				}
			}
		},

		"nasupiyo_ss": {
			"frame": {
				"width": 64,
				"height": 64,
				"cols": 6,
				"rows": 3,
			},
			"animations": {
				"right_down": {
					"frames": [7, 8, 6],
					"next": "right_down",
					"frequency": 4,
				},
				"down": {
					"frames": [7, 8, 6],
					"next": "down",
					"frequency": 4,
				},
				"left_down": {
					"frames": [7, 8, 6],
					"next": "left_down",
					"frequency": 4,
				},
				"left": {
					"frames": [16, 17, 15],
					"next": "left",
					"frequency": 4,
				},
				"left_up": {
					"frames": [10, 11, 9],
					"next": "left_up",
					"frequency": 4,
				},
				"up": {
					"frames": [10, 11, 9],
					"next": "up",
					"frequency": 4,
				},
				"right_up": {
					"frames": [10, 11, 9],
					"next": "right_up",
					"frequency": 4,
				},
				"right": {
					"frames": [13, 14, 12],
					"next": "right",
					"frequency": 4,
				}
			}
		}
	}
};
