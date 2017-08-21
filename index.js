"use strict";
exports.__esModule = true;
var particle_1 = require("./particle");
var position_1 = require("./position");
var velocity_1 = require("./velocity");
var PSO = (function () {
    function PSO() {
        this.swarm = [];
        this.pBest = [];
        this.pBestLocation = [];
        this.fitnessValueList = [];
        this.execute();
    }
    PSO.prototype.initializeSwam = function () {
        var particle;
        for (var i = 0; i < 30; i++) {
            var posX = Math.random() * 3.0 + 1.0;
            var posY = Math.random() * 2.0 - 1.0;
            var velX = Math.random() * 2.0 - 1.0;
            var velY = Math.random() * 2.0 - 1.0;
            particle = new particle_1.Particle();
            particle.position = new position_1.Position(posX, posY);
            particle.velocity = new velocity_1.Velocity(velX, velY);
            this.swarm.push(particle);
        }
    };
    PSO.prototype.execute = function () {
        var _this = this;
        this.initializeSwam();
        this.swarm.forEach(function (particle) {
            _this.fitnessValueList.push(particle.getFitness());
        });
        for (var i = 0; i < this.swarm.length; i++) {
            this.pBest[i] = this.fitnessValueList[i];
            this.pBestLocation.push(this.swarm[i].position);
        }
        var t = 0;
        var w = 0;
        var err = 9999;
        while (t < 100) {
            for (var i = 0; i < this.swarm.length; i++) {
                this.pBest[i] = this.fitnessValueList[i];
                this.pBestLocation[i] = this.swarm[i].position;
            }
            t++;
        }
    };
    return PSO;
}());
new PSO();
