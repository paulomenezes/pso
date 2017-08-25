import { Position } from './position';
import { PSO } from './pso';
import { Genetic } from './genetic';

import { BackPropagation } from './mlp/back-propagation';
import { TransferFunction } from './mlp/transfer-function';

import * as fs from 'fs';

const readFile = (name: string) => {
  let input: number[][] = [];
  let output: number[][] = [];

  const data = fs.readFileSync(name).toString().split('\n');
  data.forEach(line => {
    let inputLine: number[] = [];
    line.substr(0, line.length - 3).split(',').forEach(value => {
      inputLine.push(+value);
    });

    if (inputLine.length === 18) {
      input.push(inputLine);

      let outputLine: number[] = [];
      for (var i = 0; i < 2; i++) {
        outputLine[i] = 0;
      }

      if (+line.substr(line.length - 1, 1) === 2) {
        outputLine[0] = 1;
      } else {
        outputLine[1] = 1;
      }

      //outputLine[+line.substr(0, line.indexOf(','))] = 1;
      output.push(outputLine);
    }
  });

  return [input, output];
};

const trainingData = readFile('./data/german.training.txt');

const evaluate = (position: number[]) => {
  let values: number[] = [];

  let input: number[][] = trainingData[0];
  let output: number[][] = trainingData[1];

  const hiddenLayers = Math.round(position[0]);
  const trainingRate = +position[1].toFixed(2);
  const momentumTerm = +position[2].toFixed(2);

  let network = new BackPropagation([18, hiddenLayers, 2], [TransferFunction.NONE, TransferFunction.SIGMOID, TransferFunction.SIGMOID]);

  const maxCount = 100;
  const size = input.length;

  let error = 0.0;
  let count = 0;

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
new Genetic(evaluate);
