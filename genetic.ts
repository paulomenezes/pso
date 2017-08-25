const POPULATION_SIZE = 20;
const MAX_ITERATION = 15;
const LOC_X_LOW = 1;
const LOC_X_HIGH = 100;
const LOC_Y_LOW = 0.001;
const LOC_Y_HIGH = 1;
const LOC_Z_LOW = 0;
const LOC_Z_HIGH = 1;

export class Genetic {
  population: number[][] = [];
  fitnessValueList: number[] = [];

  constructor(evaluate: (values: number[]) => number) {
    this.evaluate = evaluate;
    this.execute();
  }

  initializePopulation() {
    for (var i = 0; i < POPULATION_SIZE; i++) {
      const hiddenLayers = LOC_X_LOW + Math.random() * LOC_X_HIGH - LOC_X_LOW;
      const trainingRate = LOC_Y_LOW + Math.random() * LOC_Y_HIGH - LOC_Y_LOW;
      const momentumTerm = LOC_Z_LOW + Math.random() * LOC_Z_HIGH - LOC_Z_LOW;

      this.population.push([hiddenLayers, trainingRate, momentumTerm]);
    }
  }

  updateFitness() {
    this.population.forEach((values, index) => {
      this.fitnessValueList[index] = this.evaluate(values);
    });
  }

  evaluate(values: number[]) {
    return 0;
  }

  execute() {
    let t = 0;
    let err = 999;
    let solution = -1;

    this.initializePopulation();

    do {
      this.updateFitness();
      // console.log(this.population);

      this.fitnessValueList.forEach((fitness, index) => {
        if (fitness < err) {
          err = fitness;
          solution = index;
        }
      });

      this.selection();
      this.mutation();
    } while (t < MAX_ITERATION && err > 0.1);

    console.log('solution', t, err, this.population[solution]);
  }

  selection() {
    let newPopulation = [];

    for (var i = 0; i < POPULATION_SIZE / 2; i++) {
      const random1 = Math.floor((POPULATION_SIZE - 1) * Math.random());
      const random2 = Math.floor((POPULATION_SIZE - 1) * Math.random());

      const better = this.fitnessValueList[random1] > this.fitnessValueList[random2] ? random1 : random2;

      let parent = this.population[better];
      parent[0] = this.minMax(parent[0] + (-1 + Math.random() * 2), LOC_X_LOW, LOC_X_HIGH);
      parent[1] = this.minMax(parent[1] + (-1 + Math.random() * 2), LOC_Y_LOW, LOC_Y_HIGH);
      parent[2] = this.minMax(parent[2] + (-1 + Math.random() * 2), LOC_Z_LOW, LOC_Z_HIGH);

      newPopulation.push(parent);
    }

    for (var i = 0; i < POPULATION_SIZE / 2; i++) {
      if (Math.random() > 0.2) {
        const random1 = Math.floor((newPopulation.length - 1) * Math.random());
        const random2 = Math.floor((newPopulation.length - 1) * Math.random());

        let newParent = [];
        newParent[0] = this.minMax((newPopulation[random1][0] + newPopulation[random2][0]) / 2, LOC_X_LOW, LOC_X_HIGH);
        newParent[1] = this.minMax((newPopulation[random1][1] + newPopulation[random2][1]) / 2, LOC_Y_LOW, LOC_Y_HIGH);
        newParent[2] = this.minMax((newPopulation[random1][2] + newPopulation[random2][2]) / 2, LOC_Z_LOW, LOC_Z_HIGH);

        newPopulation.push(newParent);
      } else {
        newPopulation.push(this.population[i]);
      }
    }

    this.population = newPopulation;
  }

  mutation() {
    for (var i = 0; i < this.population.length; i++) {
      if (Math.random() < 0.2) this.population[i][0] = this.minMax(this.population[i][0] + (-1 + Math.random() * 2), LOC_X_LOW, LOC_X_HIGH);
      if (Math.random() < 0.2) this.population[i][1] = this.minMax(this.population[i][0] + (-1 + Math.random() * 2), LOC_Y_LOW, LOC_Y_HIGH);
      if (Math.random() < 0.2) this.population[i][2] = this.minMax(this.population[i][0] + (-1 + Math.random() * 2), LOC_Z_LOW, LOC_Z_HIGH);
    }
  }

  minMax(value: number, min: number, max: number) {
    return Math.min(Math.max(value, min), max);
  }
}

// new Genetic((values: number[]) => {
//   return Math.random();
// });
