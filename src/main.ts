import Phaser from 'phaser'

import BobaFusionScene from './BobaFusionScene'

const config: Phaser.Types.Core.GameConfig = {
	type: Phaser.AUTO,
	parent: 'app',
	width: 350,
	height: 750,
	physics: {
		// default: 'arcade',
		// arcade: {
		// 	gravity: { y: 100 },
		// },
		default: 'matter',
		matter: {
			// enableSleeping: true,
			// gravity: {
			// 	y: 0
			// },
			// debug: {
			// 	showBody: true,
			// 	showStaticBody: true
			// }
		}
	},
	scene: [BobaFusionScene],
}

export default new Phaser.Game(config)
