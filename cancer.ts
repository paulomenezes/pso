import { Position } from './position';
import { PSO } from './pso';

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

    if (inputLine.length === 9) {
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

const trainingData = readFile('./mlp/data/training.breast.txt');

const evaluate = (position: Position) => {
  let values: number[] = [];

  let input: number[][] = trainingData[0];
  let output: number[][] = trainingData[1];

  const hiddenLayers = Math.round(position.x);
  const trainingRate = +position.y.toFixed(2);
  const momentumTerm = +position.z.toFixed(2);
  console.log(hiddenLayers, trainingRate, momentumTerm);

  let network = new BackPropagation([9, hiddenLayers, 2], [TransferFunction.NONE, TransferFunction.SIGMOID, TransferFunction.SIGMOID]);

  const maxCount = 500;
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

  return error;
};

new PSO(evaluate);
