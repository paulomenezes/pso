"use strict";
exports.__esModule = true;
var Particle = (function () {
    function Particle() {
    }
    Particle.prototype.getFitness = function (evaluate) {
        this.calculateFitness(evaluate);
        return this.fitness;
    };
    Particle.prototype.calculateFitness = function (evaluate) {
        var x = this.position.x;
        var y = this.position.y;
        this.fitness = evaluate(this.position);
    };
    return Particle;
}());
exports.Particle = Particle;
