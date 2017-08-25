"use strict";
exports.__esModule = true;
var genetic_1 = require("./genetic");
var back_propagation_1 = require("./mlp/back-propagation");
var transfer_function_1 = require("./mlp/transfer-function");
var fs = require("fs");
var readFile = function (name) {
    var input = [];
    var output = [];
    var data = fs.readFileSync(name).toString().split('\n');
    data.forEach(function (line) {
        var inputLine = [];
        line.substr(0, line.length - 3).split(',').forEach(function (value) {
            inputLine.push(+value);
        });
        if (inputLine.length === 18) {
            input.push(inputLine);
            var outputLine = [];
            for (var i = 0; i < 2; i++) {
                outputLine[i] = 0;
            }
            if (+line.substr(line.length - 1, 1) === 2) {
                outputLine[0] = 1;
            }
            else {
                outputLine[1] = 1;
            }
            //outputLine[+line.substr(0, line.indexOf(','))] = 1;
            output.push(outputLine);
        }
    });
    return [input, output];
};
var trainingData = readFile('./data/german.training.txt');
var evaluate = function (position) {
    var values = [];
    var input = trainingData[0];
    var output = trainingData[1];
    var hiddenLayers = Math.round(position[0]);
    var trainingRate = +position[1].toFixed(2);
    var momentumTerm = +position[2].toFixed(2);
    var network = new back_propagation_1.BackPropagation([18, hiddenLayers, 2], [transfer_function_1.TransferFunction.NONE, transfer_function_1.TransferFunction.SIGMOID, transfer_function_1.TransferFunction.SIGMOID]);
    var maxCount = 100;
    var size = input.length;
    var error = 0.0;
    var count = 0;
    do {
        count++;
        error = 0.0;
        for (var i = 0; i < size; i++) {
            error += network.train(input[i], output[i], trainingRate, momentumTerm);
        }
        error = error / size;
        // Show progress
        values.push(error);
        //if (count % 100 === 0) {
        //console.log(`Epoch ${count} completed with error ${error}`);
        //}
    } while (error > 0.1 && count <= maxCount);
    console.log(error, hiddenLayers, trainingRate, momentumTerm);
    return error;
};
// new PSO(evaluate);
new genetic_1.Genetic(evaluate);
