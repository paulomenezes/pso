"use strict";
exports.__esModule = true;
var POPULATION_SIZE = 20;
var MAX_ITERATION = 15;
var LOC_X_LOW = 1;
var LOC_X_HIGH = 100;
var LOC_Y_LOW = 0.001;
var LOC_Y_HIGH = 1;
var LOC_Z_LOW = 0;
var LOC_Z_HIGH = 1;
var Genetic = (function () {
    function Genetic(evaluate) {
        this.population = [];
        this.fitnessValueList = [];
        this.evaluate = evaluate;
        this.execute();
    }
    Genetic.prototype.initializePopulation = function () {
        for (var i = 0; i < POPULATION_SIZE; i++) {
            var hiddenLayers = LOC_X_LOW + Math.random() * LOC_X_HIGH - LOC_X_LOW;
            var trainingRate = LOC_Y_LOW + Math.random() * LOC_Y_HIGH - LOC_Y_LOW;
            var momentumTerm = LOC_Z_LOW + Math.random() * LOC_Z_HIGH - LOC_Z_LOW;
            this.population.push([hiddenLayers, trainingRate, momentumTerm]);
        }
    };
    Genetic.prototype.updateFitness = function () {
        var _this = this;
        this.population.forEach(function (values, index) {
            _this.fitnessValueList[index] = _this.evaluate(values);
        });
    };
    Genetic.prototype.evaluate = function (values) {
        return 0;
    };
    Genetic.prototype.execute = function () {
        var t = 0;
        var err = 999;
        var solution = -1;
        this.initializePopulation();
        do {
            this.updateFitness();
            // console.log(this.population);
            this.fitnessValueList.forEach(function (fitness, index) {
                if (fitness < err) {
                    err = fitness;
                    solution = index;
                }
            });
            this.selection();
            this.mutation();
        } while (t < MAX_ITERATION && err > 0.1);
        console.log('solution', t, err, this.population[solution]);
    };
    Genetic.prototype.selection = function () {
        var newPopulation = [];
        for (var i = 0; i < POPULATION_SIZE / 2; i++) {
            var random1 = Math.floor((POPULATION_SIZE - 1) * Math.random());
            var random2 = Math.floor((POPULATION_SIZE - 1) * Math.random());
            var better = this.fitnessValueList[random1] > this.fitnessValueList[random2] ? random1 : random2;
            var parent_1 = this.population[better];
            parent_1[0] = this.minMax(parent_1[0] + (-1 + Math.random() * 2), LOC_X_LOW, LOC_X_HIGH);
            parent_1[1] = this.minMax(parent_1[1] + (-1 + Math.random() * 2), LOC_Y_LOW, LOC_Y_HIGH);
            parent_1[2] = this.minMax(parent_1[2] + (-1 + Math.random() * 2), LOC_Z_LOW, LOC_Z_HIGH);
            newPopulation.push(parent_1);
        }
        for (var i = 0; i < POPULATION_SIZE / 2; i++) {
            if (Math.random() > 0.2) {
                var random1 = Math.floor((newPopulation.length - 1) * Math.random());
                var random2 = Math.floor((newPopulation.length - 1) * Math.random());
                var newParent = [];
                newParent[0] = this.minMax((newPopulation[random1][0] + newPopulation[random2][0]) / 2, LOC_X_LOW, LOC_X_HIGH);
                newParent[1] = this.minMax((newPopulation[random1][1] + newPopulation[random2][1]) / 2, LOC_Y_LOW, LOC_Y_HIGH);
                newParent[2] = this.minMax((newPopulation[random1][2] + newPopulation[random2][2]) / 2, LOC_Z_LOW, LOC_Z_HIGH);
                newPopulation.push(newParent);
            }
            else {
                newPopulation.push(this.population[i]);
            }
        }
        this.population = newPopulation;
    };
    Genetic.prototype.mutation = function () {
        for (var i = 0; i < this.population.length; i++) {
            if (Math.random() < 0.2)
                this.population[i][0] = this.minMax(this.population[i][0] + (-1 + Math.random() * 2), LOC_X_LOW, LOC_X_HIGH);
            if (Math.random() < 0.2)
                this.population[i][1] = this.minMax(this.population[i][0] + (-1 + Math.random() * 2), LOC_Y_LOW, LOC_Y_HIGH);
            if (Math.random() < 0.2)
                this.population[i][2] = this.minMax(this.population[i][0] + (-1 + Math.random() * 2), LOC_Z_LOW, LOC_Z_HIGH);
        }
    };
    Genetic.prototype.minMax = function (value, min, max) {
        return Math.min(Math.max(value, min), max);
    };
    return Genetic;
}());
exports.Genetic = Genetic;
// new Genetic((values: number[]) => {
//   return Math.random();
// });
