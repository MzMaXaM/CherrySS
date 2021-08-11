// import Phaser from 'phaser'

import eventsCenter from "./EventCentre.js"

let tochinGround

class GamePlayScreen extends Phaser.Scene
{
    constructor (){
        super({key: 'GamePlayScreen'})
    }
//=========================================================================================================
//-----------------------------------------PRELOAD------------------------------------------------------
    preload (){
        this.load.image('tileSet', './assets/yellow64x64.png')
        this.load.image('springBack1', './assets/bg_spring_Trees_1.png')
        this.load.image('springBack2', './assets/bg_spring_Trees_2.png')
        this.load.tilemapTiledJSON('FirstMap', './assets/mapFirst.json')
        this.load.atlas('bCoin', './assets/bronze_coin.png', './assets/bronze_coin_atlas.json')
        this.load.atlas('cherry', './assets/cherry.png', './assets/cherry_atlas.json')
        this.load.atlas('water', './assets/water.png', './assets/water_atlas.json')
    }
    //===================================================================================================
    //------------------------------------CREATE-------------------------------------------------------  
    create (){
        this.matter.world.setBounds(0, 0, 3120, 720);
        //----------------------------Temp Background
        //----------------------planning to add Parallax Effect Background
        const wit = 780/2
        this.add.image(wit+60, 310, 'springBack1')
        this.add.image(3*wit+60, 310, 'springBack2')
        this.add.image(5*wit+60, 310, 'springBack1')
        this.add.image(7*wit+60, 310, 'springBack2')

        //-----------------------------------------------------------------

        this.cursors = this.input.keyboard.createCursorKeys()

        this.createMap()
        this.createWater()
        this.createPlayer()
        this.createCoins()

        this.scene.run('ui-scene')
        this.player.setOnCollide((data)=>{
            tochinGround=true
        })

        this.cameras.main.setBounds(0,0,3120,520)
        this.cameras.main.startFollow(this.player)
    }
    //===========================================================================================



    //---------------------------Water----------------------------------------------
    createWater(){
        this.anims.create({
            key: 'water',
            frames: this.anims.generateFrameNames('water', {
                start: 1,
                end: 14
            }),
            frameRate: 8,
            repeat: -1
        })

        this.water = this.add.group({
            classType: 'water'
        })
        this.waterLayer = this.map.getObjectLayer('Water')
        
        this.waterLayer.objects.forEach(waterObj=>{
            this.aWater = this.add.sprite(waterObj.x+65, waterObj.y+8, 'water')
            this.aWater.setOrigin(0)
            this.aWater.anims.play('water')
        })
    }
    //----------------------------Map--------------------------------------------------
    createMap(){
        this.map = this.make.tilemap({ key: 'FirstMap' })
        this.tileset = this.map.addTilesetImage('base64', 'tileSet')
        this.ground = this.map.createLayer('Ground', this.tileset)
        this.map.setCollisionByProperty({type: 'c'}, true)
        this.matter.world.convertTilemapLayer(this.ground)
    }
    


    //----------------------------------Coins-----------------------------------------------
    createCoins(){
        //------------------------CoinAnimations
        this.anims.create({
            key: 'coin1',
            frames: this.anims.generateFrameNames('bCoin', {
                prefix: 'bronze_coin_round_blank_',
                start: 1,
                end: 6
            }),
            frameRate: 8,
            repeat: -1
        })
        //Creating coins group from Tiled
        this.bCoins = this.add.group({
            classType: 'bCoin'
        })
        this.bCoinsLayer = this.map.getObjectLayer('Coins')
        //set the setting forEach Coin
        this.bCoinsLayer.objects.forEach(coinObj=>{
            this.bCoin = this.add.sprite(coinObj.x+coinObj.width*0.5, coinObj.y, 'bCoin')
            this.bCoin.scale = 0.7
            this.aCoin = this.matter.add.polygon(coinObj.x+coinObj.width*0.5, coinObj.y, 1, 12)
            this.cCoin = this.matter.add.gameObject(this.bCoin, this.aCoin)
                .setStatic(true)
                .setSensor(true)
            this.cCoin.anims.play('coin1')

            this.cCoin.setOnCollide((data)=>{
                this.setTheScore()
                this.gameObj = data.bodyB.gameObject
                this.gameObj.destroy()
            })
            })
    }


    //---------------------------------------Score----------------------------------
    setTheScore(){
        if(!this.count){this.count = 0}
        this.count ++
        eventsCenter.emit('update-count', this.count)
    }
    //--------------------------------------temp-lives----------------------------------
    setLives(){
        if(!this.count){this.count = 3}
        this.count --
        if (this.count==0){
            this.scene.start('WelcomeScreen')
            this.scene.stop('ui-scene')
        }else{
            eventsCenter.emit('update-lives', this.count)
        }
    }

    onEvent(){
        this.player.play('playFall', true)
    }

    //-----------------------------Player-----------------------------------------
    createPlayer(){
        //create the player phisics
        this.player = this.add.sprite(150, 250, 'cherry', 'idle-1')
        this.square = this.matter.add.rectangle(100, 300, 90, 75, { 
            chamfer: { radius: 20 }
        })
        
        this.matter.add.gameObject(this.player,this.square)
            .setFriction(0.001)
            .setBounce(0.2)
            .setFixedRotation()


        //creating the animations for the player

        this.anims.create({
            key: 'playIdle',
            frames: this.anims.generateFrameNames('cherry', {
                prefix: 'idle-',
                zeroPad: 1,
                start: 1,
                end: 8
            }),
            frameRate: 4,
            repeat: -1
        })
        this.anims.create({
            key: 'playRun',
            frames: this.anims.generateFrameNames('cherry', {
                prefix: 'run-',
                zeroPad: 1,
                start: 1,
                end: 12
            }),
            frameRate: 18,
            repeat: -1
        })
        this.anims.create({
            key: 'playJump',
            frames: this.anims.generateFrameNames('cherry', {
                prefix: 'jump_',
                zeroPad: 1,
                start: 1,
                end: 2
            }),
            frameRate: 8,
            repeat: 4
        })
        this.anims.create({
            key: 'playFall',
            frames: this.anims.generateFrameNames('cherry', {
                prefix: 'falling_',
                zeroPad: 1,
                start: 1,
                end: 2
            }),
            frameRate: 8,
            repeat: -1
        })
    }



//========================================================================================================
//--------------------------UPDATE-----------------------------------
    update (t, dt){
        const speed = 2
        // if (this.cursors.down.isDown && !this.player.body.onFloor()){
        //     this.player.setVelocityY(350)
        //     this.player.play('playFall', true)
        // }

        if (!tochinGround){
            // this.player.play('playFall', true)
            this.time.delayedCall(450, this.onEvent, [], this)
        }

        if (this.cursors.left.isDown) {
            this.player.setVelocityX(-speed)
            this.player.setFlipX(true)
            if (tochinGround) {
                this.player.play('playRun', true)
            }
        } else if (this.cursors.right.isDown) {
            this.player.setVelocityX(speed)
            this.player.setFlipX(false)
            if (tochinGround) {
                this.player.play('playRun', true)
            }
        } else {
            this.player.setVelocityX(0)
            if (tochinGround) {
                this.player.play('playIdle', true)
            }
        }
        // if (this.cursors.up.isDown && this.player.body.onFloor()) {
        if (this.cursors.up.isDown && tochinGround ) {
            this.player.setVelocityY(-7.5)
            tochinGround = false
            this.player.play('playJump', false)
        }

        if(this.player.y>650){
            this.setLives()
            this.player.y=250
            this.player.x=150
        }
    }
}

export default GamePlayScreen
