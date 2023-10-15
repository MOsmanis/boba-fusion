import Phaser from 'phaser'
import Level from './Level'

//TODO add spawn line
//TODO add walls
//TODO other levels
//TODO animated bobas
export default class BobaFusionScene extends Phaser.Scene {
	level1 = new Level('level1', 'assets/ball.png', 12.5, 0.5)
	level2 = new Level('level2', 'assets/ball2.png', 25, 1)

	bobaCollissionGroup: number = 0;
	bobaMergeCollissionGroup: number = 0;

	constructor() {
		super('BobaFusion')
	}

	preload() {
		this.bobaCollissionGroup = this.matter.world.nextGroup();
		this.bobaMergeCollissionGroup = this.matter.world.nextGroup(true);
		this.load.image(this.level1.name, this.level1.imagePath)
		this.load.image(this.level2.name, this.level2.imagePath)

		this.load.image('sky', 'assets/space3.png')
		this.load.image('logo', 'assets/sprites/phaser3-logo.png')
		this.load.image('red', 'assets/particles/red.png')
	}

	spawnBoba(x: number, y: number, level: Level): Phaser.Physics.Matter.Image {
		// const particles = this.add.particles('red')
		// const emitter1 = particles.createEmitter({
		// 	speed: 100,
		// 	scale: { start: 1, end: 0 },
		// 	blendMode: 'ADD',
		// })
		const boba = this.matter.add.image(x, y, level.name).setName(level.name).setScale(level.scale)
		boba.setBounce(0)
		boba.setCircle(level.radius)
		boba.setCollisionGroup(this.bobaCollissionGroup)

		return boba;
	}

	create() {
		// this.matter.world.setBounds(0, 0, 350, 750, 32, true, true, false, true);
		this.matter.world.setBounds()

		var polygon = new Phaser.Geom.Polygon([
			0, 0,
			0, 100,
			100, 100,
			100, 80
		]);

		// var bar = '0 0 0 100 100 100 100 0';
		
		// var bar = [0,0,0,100,100,100,100,0]
		
		
		// add enclosing side bars
		// var poly = this.add.polygon(0, 0, bar, 0x00ffff, 0.2);
		// this.matter.add.gameObject(poly, {
			// 		shape: { type: 'fromVerts', verts: bar, flagInternal: true },
			// 		isStatic: true,
			// 		angle: 0.3
			// 	}
			// );
		var bar = [[0,0],[0,1000],[10,1000],[10,0]]
		var poly = this.add.polygon(0, 300, bar, 0x00ffff, 0.2);
		this.matter.add.gameObject(poly, {
				isStatic: true,
				angle: -0.2
			}
		);

		var poly2 = this.add.polygon(350, 300, bar, 0x00ffff, 0.2);
		this.matter.add.gameObject(poly2, {
				isStatic: true,
				angle: 0.2
			}
		);


		this.add.image(0, 0, 'sky')

		this.input.on('pointerup', function (this: BobaFusionScene,pointer: Phaser.Input.Pointer) {
			const ball: Phaser.Physics.Matter.Image = this.spawnBoba(pointer.x, pointer.y, this.level1)
			this.level1.bobas.push(ball)
        }, this);
	}

	update() {
		this.mergeBobas(this.level1, this.level2);
	}

	private mergeBobas(level: Level, nextLevel: Level) {
		const size = level.bobas.length;
		for (let i = 0; i < size; i++) {
			if (!(i in level.bobas)) {
				break;
			}
			var a: Phaser.GameObjects.Image = level.bobas[i];
			for (let j = i + 1; j < size; j++) {
				if (!(j in level.bobas)) {
					break;
				}
				var b: Phaser.GameObjects.Image = level.bobas[j];
				const mergeRadius = level.radius/3
				if (Math.abs(b.x - a.x) < mergeRadius && Math.abs(b.y - a.y) < mergeRadius) {
					const ball = this.spawnBoba(a.x, a.y, nextLevel);
					nextLevel.bobas.push(ball);
					level.bobas.splice(j, 1); //TODO rewrite to filter
					level.bobas.splice(i, 1);
					b.destroy();
					a.destroy();

					break;
				}

				const magnetRadius = level.radius * 2 + mergeRadius
				if (Math.abs(b.x - a.x) < magnetRadius && Math.abs(b.y - a.y) < magnetRadius) {
					b.body.gameObject.setBounce(0);
					a.body.gameObject.setBounce(0);
					b.body.gameObject.setCollisionGroup(this.bobaMergeCollissionGroup);
					a.body.gameObject.setCollisionGroup(this.bobaMergeCollissionGroup);

					b.setX(b.x + ((a.x - b.x) * 0.1));
					b.setY(b.y + ((a.y - b.y) * 0.1));

					break;
				}
			}
		}
	}
	// private getActiveTimerConfig(bobaList: Phaser.GameObjects.Image[]): Phaser.Types.Time.TimerEventConfig {
	// 	return {
	// 		delay: 2000,
	// 		callback: () => {
	// 			if (this.activeBoba != null) {
	// 				bobaList.push(this.activeBoba);
	// 				this.activeBoba.setName('');
	// 				this.activeBoba = null;
	// 			}
	// 			this.activeTimer = null;
	// 			console.log('timer callback');
	// 		},
	// 		args: [],
	// 		loop: false,
	// 		repeat: 0,
	// 		startAt: 0,
	// 		timeScale: 1,
	// 		paused: false
	// 	};
	// }
}
