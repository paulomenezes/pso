"use strict";
exports.__esModule = true;
var index_1 = require("./index");
var back_propagation_1 = require("./mlp/back-propagation");
var transfer_function_1 = require("./mlp/transfer-function");
var fs = require("fs");
var readFile = function (name) {
    var input = [];
    var output = [];
    var data = fs.readFileSync(name).toString().split('\n');
    data.forEach(function (line) {
        var inputLine = [];
        line.substr(line.indexOf(',') + 1).split(',').forEach(function (value) {
            inputLine.push(+value);
        });
        if (inputLine.length === 16) {
            input.push(inputLine);
            var outputLine = [];
            for (var i = 0; i < 26; i++) {
                outputLine[i] = 0;
            }
            outputLine[+line.substr(0, line.indexOf(','))] = 1;
            output.push(outputLine);
        }
    });
    return [input, output];
};
var trainingData = readFile('./mlp/data/training.txt');
var evaluate = function (position) {
    var values = [];
    var input = trainingData[0];
    var output = trainingData[1];
    var hiddenLayers = Math.max(0, Math.round(position.x));
    var trainingRate = Math.max(0, +position.y.toFixed(2));
    var momentumTerm = Math.max(0, +position.z.toFixed(2));
    console.log(hiddenLayers, trainingRate, momentumTerm);
    var network = new back_propagation_1.BackPropagation([16, hiddenLayers, 26], [transfer_function_1.TransferFunction.NONE, transfer_function_1.TransferFunction.SIGMOID, transfer_function_1.TransferFunction.SIGMOID]);
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
        if (count % 50 === 0) {
            console.log("Epoch " + count + " completed with error " + error);
        }
    } while (error > 0.1 && count <= maxCount);
    return error;
};
console.time('pso');
new index_1.PSO(evaluate);
console.timeEnd('pso');
