import Phaser from 'phaser'

//TODO animated bobas
export default class BobaFusionScene extends Phaser.Scene {
	active: Phaser.Physics.Matter.Image | null = null;
	activeTimer: Phaser.Time.TimerEvent | null = null;
	ballsList: Phaser.GameObjects.Image[] = []
	ballsList2: Phaser.GameObjects.Image[] = []
	bobaCollissionGroup: number = 0;
	bobaMergeCollissionGroup: number = 0;

	constructor() {
		super('BobaFusion')
	}

	preload() {
		this.bobaCollissionGroup = this.matter.world.nextGroup();
		this.bobaMergeCollissionGroup = this.matter.world.nextGroup(true);
		this.load.image('ball', 'assets/ball.png')
		this.load.image('ball2', 'assets/ball2.png')
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
		const logo1 = this.matter.add.image(x, y, 'ball').setName('active')
		logo1.setBounce(0)
		logo1.setCircle(25, {             
            plugin: {
                attractors: [ //Only to its group and only when spawning and only when close
                    function(bodyA: MatterJS.BodyType, bodyB: MatterJS.BodyType) {
						if(bodyB.gameObject !=null && bodyB.gameObject.name!='active') {
							return null;
						}
						if(Math.abs(bodyA.position.x - bodyB.position.x) > 80 || Math.abs(bodyA.position.y - bodyB.position.y) > 80) {
							return null;
						}
						return {
							x: (bodyA.position.x - bodyB.position.x) * 0.0003,
							y: (bodyA.position.y - bodyB.position.y) * 0.0003,
					  	};
			  
					  	// apply force to both bodies
					  	// Body.applyForce(bodyA, bodyA.position, Matter.Vector.neg(force));
					  	// Body.applyForce(bodyB, bodyB.position, force);
					}
					
                ]
            }
        })
		logo1.setCollisionGroup(this.bobaCollissionGroup)
		this.active = logo1

		return logo1;
	}

	getBall2(x: number, y: number) {
		const logo1 = this.matter.add.image(x, y, 'ball2').setScale(2)
		logo1.setCircle(50)
		logo1.setBounce(0)
		logo1.setCollisionCategory(this.bobaCollissionGroup).setName('active')
		
		return logo1;
	}

	create() {
		this.matter.enableAttractorPlugin();
		
		this.matter.world.setBounds(0, 0, 800, 600, 32, true, true, false, true);
		this.add.image(400, 300, 'sky')

		this.input.on('pointerdown', function (this: BobaFusionScene,pointer: Phaser.Input.Pointer) {
			if(this.active!=null) {
				return;
			}
			const ball: Phaser.Physics.Matter.Image = this.getBall(pointer.x, pointer.y)
			ball.setOnCollide((collisionData: Phaser.Types.Physics.Matter.MatterCollisionData) => {//TODO boba bounces away too much, check proximity in update() 
				if (this.ballsList.includes(collisionData.bodyA.gameObject)) {
					collisionData.bodyB.gameObject.setBounce(0)	
					collisionData.bodyA.gameObject.setBounce(0)
					collisionData.bodyB.gameObject.setCollisionGroup(this.bobaMergeCollissionGroup)
					collisionData.bodyA.gameObject.setCollisionGroup(this.bobaMergeCollissionGroup)
				}
			  });
			
			var timer = this.time.addEvent({
				delay: 2000,               
				callback: () => {
					if (this.active!=null) {
						this.ballsList.push(this.active);
						this.active.setName('')
						this.active=null;
					}
					this.activeTimer = null;
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
        }, this);
	}

	update() {
		if(this.active!=null) {
			const size = this.ballsList.length;
			for(let i = 0; i<size; i++){
				var b = this.ballsList[i]
				if(Math.abs(b.x-this.active.x)<5 && Math.abs(b.y-this.active.y)<5) {
					const ball = this.getBall2(this.active.x, this.active.y)
					this.ballsList2.push(ball)
					this.ballsList.splice(i,1)
					b.destroy()
					this.active.destroy()
					this.active = ball;
				  	console.log('Balls touched!');
					if (this.activeTimer!=null) {
						this.time.removeEvent(this.activeTimer);
						this.activeTimer.reset({
							delay: 2000,                
							callback: ()=>{
								if(this.active!=null) {
									this.ballsList2.push(this.active);
									this.active.setName('')
									this.active=null;
								}
								this.activeTimer = null;
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
					}

					break;
				}
			}
		}
		if(this.activeTimer!=null) {
			console.log('timer left = '  + this.activeTimer.getRemaining())
		}
		
	}

}
