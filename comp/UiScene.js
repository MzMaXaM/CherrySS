import eventsCenter from "./EventCentre.js"

export default class UIScene extends Phaser.Scene
{
	constructor()
	{
		super('ui-scene')
	}

	create()
	{
		this.score = this.add.text(140, 660, 'Score: 0', {
			fontFamily: 'Georgia, "Goudy Bookletter 1911", Times, serif',
			color: '#A52A2A',
			fontSize: 35
		})
    
    eventsCenter.on('update-score', this.updateScore, this)
    this.events.on(Phaser.Scenes.Events.SHUTDOWN, () => {
      eventsCenter.off('update-score', this.updateCount, this)
    })

		this.lives = this.add.text(940, 660, 'Lives: 3', {
			fontFamily: 'Georgia, "Goudy Bookletter 1911", Times, serif',
			color: '#A52A2A',
			fontSize: 35
		})
    
    eventsCenter.on('update-lives', this.updateLives, this)
    this.events.on(Phaser.Scenes.Events.SHUTDOWN, () => {
      eventsCenter.off('update-lives', this.updateLives, this)
    })
	}

	updateScore(count)
	{
		this.score.text = `Score: ${count}`
	}
	updateLives(count)
	{
		this.lives.text = `Lives: ${count}`
	}
}