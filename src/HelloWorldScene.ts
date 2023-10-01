import Phaser from 'phaser'

export default class HelloWorldScene extends Phaser.Scene {
	constructor() {
		super('hello-world')
	}

	preload() {
		this.load.image('ball', 'assets/ball.png')
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

		const logo1 = this.matter.add.image(x, y, 'ball')
		// logo1.setDamping(true).setDrag(1, 1).setFriction(2, 2)
		logo1.setCircle(25)
		
        // loog.setDrag(0.975).setDamping(true).setBounce(1).setCollideWorldBounds(true).setCircle(200).setScale(.2).setInteractive();
		logo1.setBounce(0.5)
		// logo1.setCollideWorldBounds(true)

		// emitter1.startFollow(logo1)

		return logo1;
	}

	create() {
		
		// this.log('start')
		this.matter.world.setBounds(0, 0, 800, 600, 32, true, true, false, true);
		this.add.image(400, 300, 'sky')
		var balls = []


		
		// const particles = this.add.particles('red')


		this.input.on('pointerdown', function (pointer)
        {
			const ball = this.getBall(pointer.x, pointer.y)

			this.matter.overlap(ball, balls, (b, b2) => {
				console.log('overlap')
				// const newX = (b.x + b2.x)/2
				// const newY = (b.y + b2.y)/2
				// b.destroy()
				// b2.destroy()
				// const logo2 = this.getBall(newX, newY)
				// // logo2.setCollideWorldBounds(true)
				// balls.push(logo2)
			})	
			balls.push(ball)
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
