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
    line.substr(line.indexOf(',') + 1).split(',').forEach(value => {
      inputLine.push(+value);
    });

    if (inputLine.length === 16) {
      input.push(inputLine);

      let outputLine: number[] = [];
      for (var i = 0; i < 26; i++) {
        outputLine[i] = 0;
      }

      outputLine[+line.substr(0, line.indexOf(','))] = 1;
      output.push(outputLine);
    }
  });

  return [input, output];
};

const trainingData = readFile('./data/letter.small.txt');

const evaluate = (position: Position) => {
  let values: number[] = [];

  let input: number[][] = trainingData[0];
  let output: number[][] = trainingData[1];

  const hiddenLayers = Math.max(1, Math.round(position.x));
  const trainingRate = Math.max(0, +position.y.toFixed(2));
  const momentumTerm = Math.max(0, +position.z.toFixed(2));
  console.log(hiddenLayers, trainingRate, momentumTerm);

  let network = new BackPropagation([16, hiddenLayers, 26], [TransferFunction.NONE, TransferFunction.SIGMOID, TransferFunction.SIGMOID]);

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

    if (count % 50 === 0) {
      console.log(`Epoch ${count} completed with error ${error}`);
    }
  } while (error > 0.1 && count <= maxCount);

  return error;
};

console.time('pso');
new PSO(evaluate);
console.timeEnd('pso');
