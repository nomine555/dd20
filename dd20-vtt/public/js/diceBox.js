function DiceBox(container) {
    this.simulationRunning = false;
    this.canvasContainer = container;
    this.diceArr = [];
    this.diceBackColor = '#202020';
    this.diceFontColor = '#aaaaaa';
    this.pixelRatio = 1;

    this.scene = new THREE.Scene();

    this.renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true,
        devicePixelRatio: 0.5
    });

    this.renderer.setClearColor(0x000000, 0);
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.canvasContainer.appendChild(this.renderer.domElement);


    this._reinit();

    var box = this;
    window.addEventListener("resize", function () {
        box._reinit();
    });

    var ambient = new THREE.AmbientLight('#707070', 2);
    this.scene.add(ambient);

    this.world = new CANNON.World();

    this.world.gravity.set(0, -9.82 * 20, 0);
    this.world.broadphase = new CANNON.NaiveBroadphase();
    this.world.solver.iterations = 16;

    DiceManager.setWorld(this.world);

    //Floor
    var floorBody = new CANNON.Body({mass: 0, shape: new CANNON.Plane(), material: DiceManager.floorBodyMaterial});
    floorBody.quaternion.setFromAxisAngle(new CANNON.Vec3(1, 0, 0), -Math.PI / 2);
    this.world.add(floorBody);

    //Walls
    this.topWall = new CANNON.Body({mass: 0, shape: new CANNON.Plane(), material: DiceManager.barrierBodyMaterial});
    this.topWall.quaternion.setFromAxisAngle(new CANNON.Vec3(1, 0, 0), 0);
    this.topWall.position.set(0, 0, -this.tableH / 2 * 0.96);
    this.world.add(this.topWall);

    this.bottomWall = new CANNON.Body({mass: 0, shape: new CANNON.Plane(), material: DiceManager.barrierBodyMaterial});
    this.bottomWall.quaternion.setFromAxisAngle(new CANNON.Vec3(1, 0, 0), Math.PI);
    this.bottomWall.position.set(0, 0, this.tableH / 2 * 0.96);
    this.world.add(this.bottomWall);

    this.leftWall = new CANNON.Body({mass: 0, shape: new CANNON.Plane(), material: DiceManager.barrierBodyMaterial});
    this.leftWall.quaternion.setFromAxisAngle(new CANNON.Vec3(0, 1, 0), Math.PI/2);
    this.leftWall.position.set(-this.tableW / 2 * 0.96, 0, 0);
    this.world.add(this.leftWall);

    this.rightWall = new CANNON.Body({mass: 0, shape: new CANNON.Plane(), material: DiceManager.barrierBodyMaterial});
    this.rightWall.quaternion.setFromAxisAngle(new CANNON.Vec3(0, 1, 0), -Math.PI/2);
    this.rightWall.position.set(this.tableW / 2 * 0.96, 0, 0);
    this.world.add(this.rightWall);

    this.renderer.render(this.scene, this.camera);

    this._animate();
}

DiceBox.prototype._reinit = function () {
    this.canvasWidth = this.canvasContainer.clientWidth;
    this.canvasHeight = this.canvasContainer.clientHeight;
    this.tableW = (this.canvasWidth / this.canvasHeight) * 28;
    this.tableH = 28;

    this.renderer.setSize(this.canvasWidth, this.canvasHeight);
    this.renderer.setPixelRatio(this.pixelRatio)

    var cameraY = this.tableH / 2 / Math.tan(20 * Math.PI / 180 / 2);

    if (this.camera) {
        this.scene.remove(this.camera);
    }

    this.camera = new THREE.PerspectiveCamera(20, this.tableW / this.tableH, 1, cameraY * 1.3);
    this.camera.position.set(0, cameraY, 0);
    this.camera.lookAt(0, 0, 0);

    this.scene.add(this.camera);

    if (this.light) {
        this.scene.remove(this.light);
    }

    this.light = new THREE.SpotLight(0xefdfd5, 0.7);
    this.light.position.x = -Math.max(this.tableW, this.tableH) / 2;
    this.light.position.y = Math.max(this.tableW, this.tableH) * 2;
    this.light.position.z = - Math.max(this.tableW, this.tableH) / 2;
    this.light.distance = Math.max(this.tableW, this.tableH) * 5;
    this.light.target.position.set(0, 0, 0);
    this.light.castShadow = true;
    this.light.shadow.camera.near = 5;
    this.light.shadow.camera.far = Math.max(this.tableW, this.tableH) * 2;
    this.light.shadow.mapSize.width = 2024;
    this.light.shadow.mapSize.height = 2024;
    this.scene.add(this.light);

    if (this.desk) {
        this.scene.remove(this.desk);
    }

    // Desk
    var deskMaterial = new THREE.ShadowMaterial();
    deskMaterial.opacity = 0.6;
    var deskGeometry = new THREE.PlaneGeometry(this.tableW, this.tableH, 1, 1);
    this.desk = new THREE.Mesh(deskGeometry, deskMaterial);
    this.desk.receiveShadow  = true;
    this.desk.rotation.x = -Math.PI / 2;
    this.scene.add(this.desk);

    if (this.topWall) {
        this.topWall.position.set(0, 0, -this.tableH / 2 * 0.96);
        this.bottomWall.position.set(0, 0, this.tableH / 2 * 0.96);
        this.leftWall.position.set(-this.tableW / 2 * 0.96, 0, 0);
        this.rightWall.position.set(this.tableW / 2 * 0.96, 0, 0);
    }

    this.renderer.render(this.scene, this.camera);
}

DiceBox.prototype._animate = function () {

    if(!this.simulationRunning)
        {return}

    requestAnimationFrame(this._animate.bind(this));

    this.world.step(1.0 / 60.0);

    for (var i in this.diceArr) {
        this.diceArr[i].die.updateMeshFromBody();
    }

    this.renderer.render(this.scene, this.camera);
}


DiceBox.prototype.throwDice = function (dice, callback) {

    this.simulationRunning = true;
    this._animate();

    for (var i in dice) {
        var die;

        if (dice[i].type == 'd4') {
            die = new DiceD4({
                size: 1.5,
                fontColor: dice[i].fontColor ? dice[i].fontColor : this.diceFontColor,
                backColor: dice[i].backColor ? dice[i].backColor : this.diceBackColor
            });
        }
        if (dice[i].type == 'd6') {
            die = new DiceD6({
                size: 1.5,
                fontColor: dice[i].fontColor ? dice[i].fontColor : this.diceFontColor,
                backColor: dice[i].backColor ? dice[i].backColor : this.diceBackColor
            });
        }
        if (dice[i].type == 'd8') {
            die = new DiceD8({
                size: 1.5,
                fontColor: dice[i].fontColor ? dice[i].fontColor : this.diceFontColor,
                backColor: dice[i].backColor ? dice[i].backColor : this.diceBackColor
            });
        }
        if (dice[i].type == 'd10') {
            die = new DiceD10({
                size: 1.5,
                fontColor: dice[i].fontColor ? dice[i].fontColor : this.diceFontColor,
                backColor: dice[i].backColor ? dice[i].backColor : this.diceBackColor
            });
        }

        if (dice[i].type == 'd11') {
            die = new DiceD11({
                size: 1.5,
                fontColor: dice[i].fontColor ? dice[i].fontColor : this.diceFontColor,
                backColor: dice[i].backColor ? dice[i].backColor : this.diceBackColor
            });
        }

        if (dice[i].type == 'd13') {
            die = new DiceD13({
                size: 0.5,
                fontColor: dice[i].fontColor ? dice[i].fontColor : this.diceFontColor,
                backColor: dice[i].backColor ? dice[i].backColor : this.diceBackColor
            });
        }

        if (dice[i].type == 'd100') {
            die = new DiceD100({
                size: 1.5,
                fontColor: dice[i].fontColor ? dice[i].fontColor : this.diceFontColor,
                backColor: dice[i].backColor ? dice[i].backColor : this.diceBackColor
            });
        }
        if (dice[i].type == 'd12') {
            die = new DiceD12({
                size: 1.5,
                fontColor: dice[i].fontColor ? dice[i].fontColor : this.diceFontColor,
                backColor: dice[i].backColor ? dice[i].backColor : this.diceBackColor
            });
        }
        if (dice[i].type == 'd20') {
            die = new DiceD20({
                size: 1.5,
                fontColor: dice[i].fontColor ? dice[i].fontColor : this.diceFontColor,
                backColor: dice[i].backColor ? dice[i].backColor : this.diceBackColor
            });
        }

        this.scene.add(die.getObject());
        this.diceArr.push({
            die: die,
            result: dice[i].result,
            new: true,
            time: Math.floor(Date.now() / 1000)
        });
        
    }

    for (var i = this.diceArr.length -1 ; i >= 0 ; i--) {        
            if((this.diceArr[i].time + 3) < Math.floor(Date.now() / 1000)) {
                var die = this.diceArr[i].die;
                this.scene.remove(die.object);
                if (die.object.body) {
                    this.world.remove(die.object.body);
                }
                this.diceArr.splice(i,1);
            }
        }   

    var diceValues = [];
    for (var i = 0; i < this.diceArr.length; i++) {
        if(this.diceArr[i].new) {
        var yRand = Math.random() * 5;
        this.diceArr[i].die.getObject().position.x = -this.tableW/2 + 4.5 - (i % 3) * 1.5;
        this.diceArr[i].die.getObject().position.y = 4 + Math.floor(i / 3) * 1.5;
        this.diceArr[i].die.getObject().position.z = -this.tableH/2 + 2.5 + (i % 3) * 1.5;
        this.diceArr[i].die.getObject().quaternion.x = (Math.random()*90-45) * Math.PI / 180;
        this.diceArr[i].die.getObject().quaternion.z = (Math.random()*90-45) * Math.PI / 180;
        this.diceArr[i].die.updateBodyFromMesh();
        var rand = Math.random() * 5;
        this.diceArr[i].die.getObject().body.velocity.set(23 + rand, 33 + yRand, 14 + rand);
        this.diceArr[i].die.getObject().body.angularVelocity.set(20 * Math.random() -10, 20 * Math.random() -10, 20 * Math.random() -10);
        this.diceArr[i].new = false;
        }
        diceValues.push({dice: this.diceArr[i].die, value: this.diceArr[i].result});
    }

    this.renderer.render(this.scene, this.camera);

    DiceManager.prepareValues(diceValues, function () {
        for (var i = 0; i < diceValues.length; i++) {
            diceValues[i].stableCount = 0;
        }

        var throwRunning = true;

        var check = function() {
            var allStable = true;
            for (var i = 0; i < diceValues.length; i++) {
                if (diceValues[i].dice.isFinished()) {
                    diceValues[i].stableCount++;
                } else {
                    diceValues[i].stableCount = 0;
                }

                if (diceValues[i].stableCount < 50) {
                    allStable = false;
                }
            }


            if (allStable) {
                DiceManager.world.removeEventListener('postStep', check);

                for (let i = 0; i < diceValues.length; i++) {
                    diceValues[i].dice.shiftUpperValue(diceValues[i].value);
                    diceValues[i].dice.setVectors(diceValues[i].vectors);
                    diceValues[i].dice.simulationRunning = false;
                }

                throwRunning = false;
                callback();
            }
        };

        DiceManager.world.addEventListener('postStep', check);
    });
}

DiceBox.prototype.check_old_dice = function () {
   
    for (var i = this.diceArr.length -1 ; i >= 0 ; i--) {
            if((this.diceArr[i].time + 3) < Math.floor(Date.now() / 1000)) {
                var die = this.diceArr[i].die;
                this.scene.remove(die.object);
                if (die.object.body) {
                    this.world.remove(die.object.body);
                }
                this.diceArr.splice(i,1);
            }
        }  
    this.renderer.render(this.scene, this.camera);
}

DiceBox.prototype.clear = function (callback) {

    this.simulationRunning = true;
    this._animate();

    for (var i = 0; i < this.diceArr.length; i++) {
        var die = this.diceArr[i].die;

        this.scene.remove(die.object);
        if (die.object.body) {
            this.world.remove(die.object.body);
        }
    }

    this.diceArr = [];
    this.renderer.render(this.scene, this.camera);
    var diceValues = [];
    DiceManager.prepareValues(diceValues, function () {
        var throwRunning = true;
        var check = function() {
                DiceManager.world.removeEventListener('postStep', check);
                throwRunning = false;
                callback();
        };
        DiceManager.world.addEventListener('postStep', check);
    });

}

DiceBox.prototype.reInit = function () {
    this._reinit();
}

