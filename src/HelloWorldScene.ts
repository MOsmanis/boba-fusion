import Phaser from 'phaser'
import Level from './Level'

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
		// this.load.setBaseURL('https://labs.phaser.io')

		this.load.image('sky', 'assets/space3.png')
		this.load.image('logo', 'assets/sprites/phaser3-logo.png')
		this.load.image('red', 'assets/particles/red.png')
	}

	getBall(x: number, y: number): Phaser.Physics.Matter.Image {
		// const particles = this.add.particles('red')
		// const emitter1 = particles.createEmitter({
		// 	speed: 100,
		// 	scale: { start: 1, end: 0 },
		// 	blendMode: 'ADD',
		// })
		const logo1 = this.matter.add.image(x, y, 'level1').setName('level1').setScale(this.level1.scale)
		logo1.setBounce(0)
		logo1.setCircle(this.level1.radius, {        
            plugin: {
                // attractors: [
                //     function(bodyA: MatterJS.BodyType, bodyB: MatterJS.BodyType) {
				// 		if(bodyB.gameObject ==null || bodyB.gameObject.name!='level1') {
				// 			return null;
				// 		}
				// 		if(Math.abs(bodyA.position.x - bodyB.position.x) > 80 || Math.abs(bodyA.position.y - bodyB.position.y) > 80) {
				// 			return null;
				// 		}
				// 		return {
				// 			x: (bodyA.position.x - bodyB.position.x) * 0.0003,
				// 			y: (bodyA.position.y - bodyB.position.y) * 0.0003,
				// 	  	};
			  
				// 	  	// apply force to both bodies
				// 	  	// Body.applyForce(bodyA, bodyA.position, Matter.Vector.neg(force));
				// 	  	// Body.applyForce(bodyB, bodyB.position, force);
				// 	}
					
                // ]
            }
        })
		logo1.setCollisionGroup(this.bobaCollissionGroup)

		return logo1;
	}

	getBall2(x: number, y: number) {
		const logo1 = this.matter.add.image(x, y, this.level2.name).setScale(this.level2.scale)
		logo1.setCircle(this.level2.radius)
		logo1.setBounce(0)
		logo1.setCollisionCategory(this.bobaCollissionGroup)
		
		return logo1;
	}

	create() {
		this.matter.world.setBounds(0, 0, 800, 600, 32, true, true, false, true);
		this.add.image(400, 300, 'sky')

		this.input.on('pointerdown', function (this: BobaFusionScene,pointer: Phaser.Input.Pointer) {
			const ball: Phaser.Physics.Matter.Image = this.getBall(pointer.x, pointer.y)
			ball.setOnCollide((collisionData: Phaser.Types.Physics.Matter.MatterCollisionData) => {
				if (this.level1.bobas.includes(collisionData.bodyA.gameObject)) {
					collisionData.bodyB.gameObject.setBounce(0)	
					collisionData.bodyA.gameObject.setBounce(0)
					collisionData.bodyB.gameObject.setCollisionGroup(this.bobaMergeCollissionGroup)
					collisionData.bodyA.gameObject.setCollisionGroup(this.bobaMergeCollissionGroup)
				}
			  });
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
				// if(Math.abs(b.x-a.x)<80 && Math.abs(b.y-a.y)<80) {
				// 	a.body.gameObject.setBounce(0)
				// 	b.body.gameObject.setBounce(0)
				// 	a.body.gameObject.setCollisionGroup(this.bobaMergeCollissionGroup)
				// 	b.body.gameObject.setCollisionGroup(this.bobaMergeCollissionGroup)
				// }
				const mergeRadius = level.radius/3
				if (Math.abs(b.x - a.x) < mergeRadius && Math.abs(b.y - a.y) < mergeRadius) {
					const ball = this.getBall2(a.x, a.y);
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
