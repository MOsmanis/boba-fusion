import Phaser from 'phaser'

//TODO animated bobas
export default class BobaFusionScene extends Phaser.Scene {
	
	level1Bobas: Phaser.GameObjects.Image[] = []
	level2Bobas: Phaser.GameObjects.Image[] = []
	level3Bobas: Phaser.GameObjects.Image[] = []
	level4Bobas: Phaser.GameObjects.Image[] = []
	level5Bobas: Phaser.GameObjects.Image[] = []
	level6Bobas: Phaser.GameObjects.Image[] = []

	bobas: { [id: string] : Phaser.GameObjects.Image[] } = {
		'level1': this.level1Bobas,
		'level2': this.level2Bobas,
		'level3': this.level3Bobas,
		'level4': this.level4Bobas,
		'level5': this.level5Bobas,
		'level6': this.level6Bobas,
	};
	bobaCollissionGroup: number = 0;
	bobaMergeCollissionGroup: number = 0;

	constructor() {
		super('BobaFusion')
	}

	preload() {
		this.bobaCollissionGroup = this.matter.world.nextGroup();
		this.bobaMergeCollissionGroup = this.matter.world.nextGroup(true);
		this.load.image('level1', 'assets/ball.png')
		this.load.image('level2', 'assets/ball2.png')
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
		const logo1 = this.matter.add.image(x, y, 'level1').setName('level1').setScale(0.2)
		logo1.setBounce(0)
		logo1.setCircle(5, {        
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
		logo1.on(Phaser.Animations.Events.ANIMATION_UPDATE, (sys: Phaser.Scenes.Systems, time: number, delta: number) =>{
			console.log('update')
		})

		return logo1;
	}

	getBall2(x: number, y: number) {
		const logo1 = this.matter.add.image(x, y, 'level2').setScale(0.5)
		logo1.setCircle(12.50)
		logo1.setBounce(0)
		logo1.setCollisionCategory(this.bobaCollissionGroup)
		
		return logo1;
	}

	create() {
		this.matter.enableAttractorPlugin();
		
		this.matter.world.setBounds(0, 0, 800, 600, 32, true, true, false, true);
		this.add.image(400, 300, 'sky')

		this.input.on('pointerdown', function (this: BobaFusionScene,pointer: Phaser.Input.Pointer) {
			const ball: Phaser.Physics.Matter.Image = this.getBall(pointer.x, pointer.y)
			ball.setOnCollide((collisionData: Phaser.Types.Physics.Matter.MatterCollisionData) => {//TODO boba bounces away too much, check proximity in update() 
				if (this.level1Bobas.includes(collisionData.bodyA.gameObject)) {
					collisionData.bodyB.gameObject.setBounce(0)	
					collisionData.bodyA.gameObject.setBounce(0)
					collisionData.bodyB.gameObject.setCollisionGroup(this.bobaMergeCollissionGroup)
					collisionData.bodyA.gameObject.setCollisionGroup(this.bobaMergeCollissionGroup)
				}
			  });
			this.level1Bobas.push(ball)
			
        }, this);
	}

	update() {
		const size = this.level1Bobas.length;
		for(let i = 0; i<size; i++) {
			var a: Phaser.GameObjects.Image= this.level1Bobas[i]
			for(let j = i+1; j<size; j++) {
				var b: Phaser.GameObjects.Image = this.level1Bobas[j]
				// if(Math.abs(b.x-a.x)<80 && Math.abs(b.y-a.y)<80) {
				// 	a.body.gameObject.setBounce(0)
				// 	b.body.gameObject.setBounce(0)
				// 	a.body.gameObject.setCollisionGroup(this.bobaMergeCollissionGroup)
				// 	b.body.gameObject.setCollisionGroup(this.bobaMergeCollissionGroup)
				// }
				if(Math.abs(b.x-a.x)<20 && Math.abs(b.y-a.y)<20) {
					const ball = this.getBall2(a.x, a.y)
					this.level2Bobas.push(ball)
					this.level1Bobas.splice(j,1)//TODO rewrite to filter
					this.level1Bobas.splice(i,1)
					b.destroy()
					a.destroy()

					break;
				}
				if(Math.abs(b.x - a.x) < 80 && Math.abs(b.y - a.y) < 80) {
					b.body.gameObject.setBounce(0)	
					a.body.gameObject.setBounce(0)
					b.body.gameObject.setCollisionGroup(this.bobaMergeCollissionGroup)
					a.body.gameObject.setCollisionGroup(this.bobaMergeCollissionGroup)
					b.setX(b.x + ((a.x - b.x) * 0.1))
					b.setY(b.y + ((a.y - b.y) * 0.1))
					break;
				}
			}
		}

		// const size2 = this.level2Bobas.length;
		// for(let i = 0; i<size2-1; i++) {
		// 	var a = this.level2Bobas[i]
		// 	for(let j = i; j<size-1; j++) {
		// 		var b = this.level2Bobas[j]
		// 		if(Math.abs(b.x-a.x)<20 && Math.abs(b.y-a.y)<20) {
		// 			const ball = this.getBall2(a.x, a.y)
		// 			this.level3Bobas.push(ball)
		// 			this.level2Bobas.splice(i,1)
		// 			this.level2Bobas.splice(j,1)
		// 			b.destroy()
		// 			a.destroy()

		// 			break;
		// 		}
		// 	}
		// }
		
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
