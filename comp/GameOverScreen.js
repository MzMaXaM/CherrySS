class GameOver extends Phaser.Scene
{
    constructor ()
    {
        super({key: 'GameOver'})
    }

    preload ()
    {
        this.load.image('logo', './assets/logo.png')
        this.load.image('play', './assets/play.png')
    }
      
    create ()
    {
        const logo = this.add.image(500, 180, 'logo')
        this.tweens.add({
            targets: logo,
            y: 200,
            duration: 2000,
            yoyo: true,
            loop: -1
        });
        const play = this.add.image(500, 440, 'play')
        play.setTint(0xff0000, 0x00ff00, 0x0000ff, 0xff0000)
        play.setInteractive({ cursor: 'hand' })
        play.on('pointerdown', ()=>{this.scene.start('GamePlayScreen')})
    }
}

export default GameOver