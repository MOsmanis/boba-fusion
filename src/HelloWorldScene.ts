import { IEventCollision } from 'matter'
import Phaser from 'phaser'



export default class HelloWorldScene extends Phaser.Scene {
	active: any = null;
	activeTimer: any = null;
	ballsList: any[] = []
	ballsList2: any[] = []
	balls: any;
	balls2: any;
	ballsTouch: any;

	constructor() {
		super('hello-world')
	}

	preload() {
		this.balls = this.matter.world.nextGroup();
		this.balls2 = this.matter.world.nextGroup();
		this.ballsTouch = this.matter.world.nextGroup(true);
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
						if(bodyB.gameObject !=null && bodyB.gameObject.name!='active') {
							return null;
						}
						if(Math.abs(bodyA.position.x - bodyB.position.x) > 80 || Math.abs(bodyA.position.y - bodyB.position.y) > 80) {
							return null;
						}
						// var fort={
                        // 	x: (bodyA.position.x - bodyB.position.x) * 0.000001,
                        // 	y: (bodyA.position.y - bodyB.position.y) * 0.000001
                    	// }	
						return {
							x: (bodyA.position.x - bodyB.position.x) * 0.00005,
							y: (bodyA.position.y - bodyB.position.y) * 0.00005,
					  	};
			  
					  	// apply force to both bodies
					  	// Body.applyForce(bodyA, bodyA.position, Matter.Vector.neg(force));
					  	// Body.applyForce(bodyB, bodyB.position, force);
					}
					
                ]
            }
        }).setName('active')
		// logo1.setDamping(true).setDrag(1, 1).setFriction(2, 2)
        // loog.setDrag(0.975).setDamping(true).setBounce(1).setCollideWorldBounds(true).setCircle(200).setScale(.2).setInteractive();
	
		// logo1.setCollideWorldBounds(true)

		// emitter1.startFollow(logo1)
		this.active = logo1

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

		
		
		// this.getBall(100, 100).setCollisionGroup(this.balls)
		// this.getBall(105, 105).setCollisionGroup(this.balls)

		
		// const particles = this.add.particles('red')


		this.input.on('pointerdown', function (pointer)
        {
			if(this.active!=null) {
				return;
			}
			const ball = this.getBall(pointer.x, pointer.y).setCollisionGroup(this.balls)
			ball.setOnCollide((collisionData) => {
				if (collisionData.bodyA.gameObject instanceof Phaser.GameObjects.Image &&
					this.ballsList.includes(collisionData.bodyA.gameObject)) {
					collisionData.bodyB.gameObject.setCollisionGroup(this.ballsTouch)
					collisionData.bodyA.gameObject.setCollisionGroup(this.ballsTouch)
				}
			  });
			
			var timer = this.time.addEvent({
				delay: 2000,                // ms
				callback: ()=>{
					this.ballsList.push(this.active);
					this.activeTimer = null;
					this.active.setName('')
					this.active=null;
					console.log('timer callback')
				},
				args: [],
				loop: false,
				repeat: 0,
				startAt: 0,
				timeScale: 1,
				paused: false
			});
			this.activeTimer = timer
			
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

	update() {
		// if (this.active != null && this.active.body != null) {
		// 	if(this.active.body.velocity.x <0.1 && this.active.body.velocity.y <0.1) {
		// 		this.active = null;
		// 		console.log('active is null')
		// 	}
		// }
		if(this.active!=null) {
			const size = this.ballsList.length;
			for(let i = 0; i<size; i++){
				var b = this.ballsList[i]
				console.log('x ' + this.active.x + ' y ' + this.active.y)
				if(Math.abs(b.x-this.active.x)<5 && Math.abs(b.y-this.active.y)<5) {
					const ball = this.getBall2(this.active.x, this.active.y).setCollisionCategory(this.balls2).setName('active')
					this.ballsList2.push(ball)
					this.ballsList.splice(i,1)
					b.destroy()
					this.active.destroy()
					this.active = ball;
				  	console.log('Balls touched!');
					this.time.removeEvent(this.activeTimer);
					this.activeTimer.reset({
						delay: 2000,                // ms
						callback: ()=>{
							this.ballsList2.push(this.active);
							this.activeTimer = null;
							this.active.setName('')
							this.active=null;
							console.log('timer callback')
						},
						args: [],
						loop: false,
						repeat: 0,
						startAt: 0,
						timeScale: 1,
						paused: false
					})
					this.time.addEvent(this.activeTimer)

					break;
				}
			}
		}
		if(this.activeTimer!=null) {
			console.log('timer left = '  + this.activeTimer.getRemaining())
		}
		
	}

}
