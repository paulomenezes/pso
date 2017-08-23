"use strict";
exports.__esModule = true;
var particle_1 = require("./particle");
var position_1 = require("./position");
var velocity_1 = require("./velocity");
var SWARM_SIZE = 100;
var MAX_ITERATION = 10000;
var PROBLEM_DIMENSION = 2;
var C1 = 2.0;
var C2 = 2.0;
var W_UPPERBOUND = 1.0;
var W_LOWERBOUND = 0.0;
var LOC_X_LOW = 1;
var LOC_X_HIGH = 4;
var LOC_Y_LOW = -1;
var LOC_Y_HIGH = 1;
var VEL_LOW = -1;
var VEL_HIGH = 1;
var ERR_TOLERANCE = 0.001;
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
        for (var i = 0; i < SWARM_SIZE; i++) {
            var posX = LOC_X_LOW + Math.random() * LOC_X_HIGH - LOC_X_LOW;
            var posY = LOC_Y_LOW + Math.random() * LOC_Y_HIGH - LOC_Y_LOW;
            var velX = VEL_LOW + Math.random() * VEL_HIGH - VEL_LOW;
            var velY = VEL_LOW + Math.random() * VEL_HIGH - VEL_LOW;
            particle = new particle_1.Particle();
            particle.position = new position_1.Position(posX, posY);
            particle.velocity = new velocity_1.Velocity(velX, velY);
            this.swarm.push(particle);
        }
    };
    PSO.prototype.updateFitness = function () {
        var _this = this;
        this.swarm.forEach(function (particle, index) {
            _this.fitnessValueList[index] = particle.getFitness();
        });
    };
    PSO.prototype.getMinPos = function (list) {
        var pos = 0;
        var minValue = list[0];
        for (var i = 0; i < list.length; i++) {
            if (list[i] < minValue) {
                pos = i;
                minValue = list[i];
            }
        }
        return pos;
    };
    PSO.prototype.evaluate = function (position) {
        var result = 0;
        var x = position.x; // the "x" part of the location
        var y = position.y; // the "y" part of the location
        result =
            Math.pow(2.8125 - x + x * Math.pow(y, 4), 2) +
                Math.pow(2.25 - x + x * Math.pow(y, 2), 2) +
                Math.pow(1.5 - x + x * y, 2);
        return result;
    };
    PSO.prototype.execute = function () {
        this.initializeSwam();
        this.updateFitness();
        for (var i = 0; i < SWARM_SIZE; i++) {
            this.pBest[i] = this.fitnessValueList[i];
            this.pBestLocation.push(this.swarm[i].position);
        }
        var t = 0;
        var w = 0;
        var err = 9999;
        while (t < MAX_ITERATION && err > ERR_TOLERANCE) {
            // Update pBest
            for (var i = 0; i < SWARM_SIZE; i++) {
                if (this.fitnessValueList[i] < this.pBest[i]) {
                    this.pBest[i] = this.fitnessValueList[i];
                    this.pBestLocation[i] = this.swarm[i].position;
                }
            }
            // Update gBest
            var bestParticleIndex = this.getMinPos(this.fitnessValueList);
            if (t === 0 || this.fitnessValueList[bestParticleIndex] < this.gBest) {
                this.gBest = this.fitnessValueList[bestParticleIndex];
                this.gBestLocation = this.swarm[bestParticleIndex].position;
            }
            w = W_UPPERBOUND - t / MAX_ITERATION * (W_UPPERBOUND - W_LOWERBOUND);
            for (var i_1 = 0; i_1 < SWARM_SIZE; i_1++) {
                var r1 = Math.random();
                var r2 = Math.random();
                var p = this.swarm[i_1];
                // Update velocity
                var newVel = [];
                newVel[0] =
                    w * p.velocity.x +
                        r1 * C1 * (this.pBestLocation[i_1].x - p.position.x) +
                        r2 * C2 * (this.gBestLocation.x - p.position.x);
                newVel[1] =
                    w * p.velocity.y +
                        r1 * C1 * (this.pBestLocation[i_1].y - p.position.y) +
                        r2 * C2 * (this.gBestLocation.y - p.position.y);
                var velocity = new velocity_1.Velocity(newVel[0], newVel[1]);
                p.velocity = velocity;
                // Update position
                var newPos = [];
                newPos[0] = p.position.x - newVel[0];
                newPos[1] = p.position.y - newVel[1];
                var position = new position_1.Position(newPos[0], newPos[1]);
                p.position = position;
            }
            err = this.evaluate(this.gBestLocation) - 0;
            console.log('Interation', t);
            console.log('Best X', this.gBestLocation.x);
            console.log('Best Y', this.gBestLocation.y);
            console.log('Value', this.evaluate(this.gBestLocation));
            t++;
            this.updateFitness();
        }
        console.log('\nSolution found in interaction', t - 1);
        console.log('Best X', this.gBestLocation.x);
        console.log('Best Y', this.gBestLocation.y);
        console.log('Error', err);
    };
    return PSO;
}());
new PSO();
