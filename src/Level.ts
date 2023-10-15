export default class Level {
    bobas: Phaser.GameObjects.Image[] = []

    name: string
    imagePath: string
    radius: number
    scale: number
    
    constructor(
        name: string, 
        imagePath: string, 
        radius: number, 
        scale: number
    ) {
        this.name = name
        this.imagePath = imagePath
        this.radius = radius
        this.scale = scale
    }
}