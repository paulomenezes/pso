"use strict";
exports.__esModule = true;
var Particle = (function () {
    function Particle() {
    }
    Particle.prototype.getFitness = function () {
        this.calculateFitness();
        return this.fitness;
    };
    Particle.prototype.calculateFitness = function () {
        var x = this.position.x;
        var y = this.position.y;
        this.fitness =
            Math.pow(2.8125 - x + x * Math.pow(y, 4), 2) +
                Math.pow(2.25 - x + x * Math.pow(y, 2), 2) +
                Math.pow(1.5 - x + x * y, 2);
    };
    return Particle;
}());
exports.Particle = Particle;
