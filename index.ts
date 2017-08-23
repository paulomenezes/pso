import { Particle } from './particle';
import { Position } from './position';
import { Velocity } from './velocity';

const SWARM_SIZE = 100;
const MAX_ITERATION = 10000;
const C1 = 2.0;
const C2 = 2.0;
const W_UPPERBOUND = 1.0;
const W_LOWERBOUND = 0.0;

const LOC_X_LOW = 1;
const LOC_X_HIGH = 4;
const LOC_Y_LOW = -1;
const LOC_Y_HIGH = 1;
const VEL_LOW = -1;
const VEL_HIGH = 1;

const ERR_TOLERANCE = 0.001;

class PSO {
  swarm: Particle[] = [];
  pBest: number[] = [];
  pBestLocation: Position[] = [];

  gBest: number;
  gBestLocation: Position;

  fitnessValueList: number[] = [];

  constructor() {
    this.execute();
  }

  initializeSwam() {
    let particle;

    for (var i = 0; i < SWARM_SIZE; i++) {
      const posX = LOC_X_LOW + Math.random() * LOC_X_HIGH - LOC_X_LOW;
      const posY = LOC_Y_LOW + Math.random() * LOC_Y_HIGH - LOC_Y_LOW;

      const velX = VEL_LOW + Math.random() * VEL_HIGH - VEL_LOW;
      const velY = VEL_LOW + Math.random() * VEL_HIGH - VEL_LOW;

      particle = new Particle();
      particle.position = new Position(posX, posY);
      particle.velocity = new Velocity(velX, velY);

      this.swarm.push(particle);
    }
  }

  updateFitness() {
    this.swarm.forEach((particle, index) => {
      this.fitnessValueList[index] = particle.getFitness();
    });
  }

  getMinPos(list: number[]) {
    let pos = 0;
    let minValue = list[0];

    for (let i = 0; i < list.length; i++) {
      if (list[i] < minValue) {
        pos = i;
        minValue = list[i];
      }
    }

    return pos;
  }

  evaluate(position: Position) {
    let result = 0;
    let x = position.x; // the "x" part of the location
    let y = position.y; // the "y" part of the location

    result =
      Math.pow(2.8125 - x + x * Math.pow(y, 4), 2) +
      Math.pow(2.25 - x + x * Math.pow(y, 2), 2) +
      Math.pow(1.5 - x + x * y, 2);

    return result;
  }

  execute() {
    this.initializeSwam();
    this.updateFitness();

    for (var i = 0; i < SWARM_SIZE; i++) {
      this.pBest[i] = this.fitnessValueList[i];
      this.pBestLocation.push(this.swarm[i].position);
    }

    let t = 0;
    let w = 0;
    let err = 9999;

    while (t < MAX_ITERATION && err > ERR_TOLERANCE) {
      // Update pBest
      for (var i = 0; i < SWARM_SIZE; i++) {
        if (this.fitnessValueList[i] < this.pBest[i]) {
          this.pBest[i] = this.fitnessValueList[i];
          this.pBestLocation[i] = this.swarm[i].position;
        }
      }

      // Update gBest
      let bestParticleIndex = this.getMinPos(this.fitnessValueList);
      if (t === 0 || this.fitnessValueList[bestParticleIndex] < this.gBest) {
        this.gBest = this.fitnessValueList[bestParticleIndex];
        this.gBestLocation = this.swarm[bestParticleIndex].position;
      }

      w = W_UPPERBOUND - t / MAX_ITERATION * (W_UPPERBOUND - W_LOWERBOUND);

      for (let i = 0; i < SWARM_SIZE; i++) {
        let r1 = Math.random();
        let r2 = Math.random();

        let p = this.swarm[i];

        // Update velocity
        let newVel = [];
        newVel[0] =
          w * p.velocity.x +
          r1 * C1 * (this.pBestLocation[i].x - p.position.x) +
          r2 * C2 * (this.gBestLocation.x - p.position.x);

        newVel[1] =
          w * p.velocity.y +
          r1 * C1 * (this.pBestLocation[i].y - p.position.y) +
          r2 * C2 * (this.gBestLocation.y - p.position.y);

        let velocity = new Velocity(newVel[0], newVel[1]);
        p.velocity = velocity;

        // Update position
        let newPos = [];
        newPos[0] = p.position.x - newVel[0];
        newPos[1] = p.position.y - newVel[1];

        let position = new Position(newPos[0], newPos[1]);
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
  }
}

new PSO();
