import { IEventCollision } from 'matter'
import Phaser from 'phaser'



export default class HelloWorldScene extends Phaser.Scene {
	constructor() {
		super('hello-world')
	}

	preload() {
		this.load.image('ball', 'assets/ball.png')
		this.load.image('ball2', 'assets/ball2.png')
		// this.load.setBaseURL('https://labs.phaser.io')

		this.load.image('sky', 'assets/space3.png')
		this.load.image('logo', 'assets/sprites/phaser3-logo.png')
		this.load.image('red', 'assets/particles/red.png')
		
	}
	//1. change sprite to ball
	//2. group per type
	//3. ball overlap with all group

	getBall(x: number, y: number) {
		// const particles = this.add.particles('red')
		// const emitter1 = particles.createEmitter({
		// 	speed: 100,
		// 	scale: { start: 1, end: 0 },
		// 	blendMode: 'ADD',
		// })


		const logo1 = this.matter.add.image(x, y, 'ball', null, {
            shape: {
                type: 'circle',
                radius: 25
            },
            plugin: {
                attractors: [ //Only to its group and only when spawning and only when close
                    function(bodyA, bodyB){
						if(bodyA) {

						}
						if(Math.abs(bodyA.position.x - bodyB.position.x) > 80 || Math.abs(bodyA.position.y - bodyB.position.y) > 80) {
							return null;
						}
						// var fort={
                        // 	x: (bodyA.position.x - bodyB.position.x) * 0.000001,
                        // 	y: (bodyA.position.y - bodyB.position.y) * 0.000001
                    	// }	
						return {
							x: (bodyA.position.x - bodyB.position.x) * 1e-6,
							y: (bodyA.position.y - bodyB.position.y) * 1e-6,
					  	};
			  
					  	// apply force to both bodies
					  	// Body.applyForce(bodyA, bodyA.position, Matter.Vector.neg(force));
					  	// Body.applyForce(bodyB, bodyB.position, force);
					}
					
                ]
            }
        }).setName('ball')
		// logo1.setDamping(true).setDrag(1, 1).setFriction(2, 2)

		
        // loog.setDrag(0.975).setDamping(true).setBounce(1).setCollideWorldBounds(true).setCircle(200).setScale(.2).setInteractive();
		logo1.setBounce(0.5)
		// logo1.setCollideWorldBounds(true)

		// emitter1.startFollow(logo1)

		return logo1;
	}

	getBall2(x: number, y: number) {
		// const particles = this.add.particles('red')
		// const emitter1 = particles.createEmitter({
		// 	speed: 100,
		// 	scale: { start: 1, end: 0 },
		// 	blendMode: 'ADD',
		// })

		const logo1 = this.matter.add.image(x, y, 'ball2').setScale(2)
		// logo1.setDamping(true).setDrag(1, 1).setFriction(2, 2)
		logo1.setCircle(50)
		
        // loog.setDrag(0.975).setDamping(true).setBounce(1).setCollideWorldBounds(true).setCircle(200).setScale(.2).setInteractive();
		logo1.setBounce(0.5)
		// logo1.setCollideWorldBounds(true)

		// emitter1.startFollow(logo1)

		return logo1;
	}

	create() {
		this.matter.enableAttractorPlugin();
		
		// this.log('start')
		this.matter.world.setBounds(0, 0, 800, 600, 32, true, true, false, true);
		this.add.image(400, 300, 'sky')


		const ballsList = []
		const ballsList2 = []
		const balls = this.matter.world.nextGroup(true);
		const balls2 = this.matter.world.nextGroup(true);
		const balls3 = this.matter.world.nextGroup(true);
		
		this.getBall(100, 100).setCollisionGroup(balls)
		// this.getBall(105, 105).setCollisionGroup(balls)

		
		// const particles = this.add.particles('red')


		this.input.on('pointerdown', function (pointer)
        {
			const ball = this.getBall(pointer.x, pointer.y).setCollisionGroup(balls2)
			ball.setOnCollide((collisionData) => {
				// Check if the collision involves two balls
				if (collisionData.bodyA.gameObject instanceof Phaser.GameObjects.Image) {
					// const newX = (collisionData.bodyB.position.x + collisionData.bodyA.position.x)/2
					// const newY = (collisionData.bodyB.position.y + collisionData.bodyA.position.y)/2
					if(collisionData.bodyB.gameObject) {
						collisionData.bodyB.gameObject.destroy()
					}
					collisionData.bodyA.gameObject.destroy()
					this.getBall2(collisionData.bodyB.position.x, collisionData.bodyB.position.y).setCollisionGroup(balls3)
				  	console.log('Balls touched!');
				}
			  });
			ballsList.push(ball)
			
			// for(var b of balls) {
			// 	this.matter.add.collider(b, ball);
			// }

			
		
			// this.matter.add.overlap(logo, logo1, () => {
			// 	const newX = (logo.x + logo1.x)/2
			// 	const newY = (logo.y + logo1.y)/2
			// 	logo.destroy()
			// 	logo1.destroy()
			// 	const logo2 = this.matter.add.image(newX, newY, 'ball')
			// 	logo2.setScale(1.5,1.5)
			// 	logo2.setVelocity(100, 200)
			// 	logo2.setBounce(1, 1)
			// 	logo2.setCollideWorldBounds(true)
			// 	emitter1.startFollow(logo2)
			// 	emitter.startFollow(logo2)
            // }, null, this);

        }, this);

		// this.matter.add.collider(balls);

        // O
		
	}
}
