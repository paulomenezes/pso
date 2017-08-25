import { Particle } from './particle';
import { Position } from './position';
import { Velocity } from './velocity';

const SWARM_SIZE = 20;
const MAX_ITERATION = 100;
const C1 = 1.496;
const C2 = 1.496;
const W_UPPERBOUND = 1.0;
const W_LOWERBOUND = 0.0;

const LOC_X_LOW = 1;
const LOC_X_HIGH = 100;
const LOC_Y_LOW = 0.001;
const LOC_Y_HIGH = 1;
const LOC_Z_LOW = 0;
const LOC_Z_HIGH = 1;
const VEL_LOW = -1;
const VEL_HIGH = 1;

const ERR_TOLERANCE = 0.1;

export class PSO {
  swarm: Particle[] = [];
  pBest: number[] = [];
  pBestLocation: Position[] = [];

  gBest: number;
  gBestLocation: Position;

  fitnessValueList: number[] = [];

  constructor(evaluate: (position: Position) => number) {
    this.evaluate = evaluate;
  }

  initializeSwam() {
    let particle;

    for (var i = 0; i < SWARM_SIZE; i++) {
      const posX = LOC_X_LOW + Math.random() * LOC_X_HIGH - LOC_X_LOW;
      const posY = LOC_Y_LOW + Math.random() * LOC_Y_HIGH - LOC_Y_LOW;
      const posZ = LOC_Z_LOW + Math.random() * LOC_Z_HIGH - LOC_Z_LOW;

      const velX = VEL_LOW + Math.random() * VEL_HIGH - VEL_LOW;
      const velY = VEL_LOW + Math.random() * VEL_HIGH - VEL_LOW;
      const velZ = VEL_LOW + Math.random() * VEL_HIGH - VEL_LOW;

      particle = new Particle();
      particle.position = new Position(posX, posY, posZ);
      particle.velocity = new Velocity(velX, velY, velZ);

      this.swarm.push(particle);
    }
  }

  updateFitness() {
    this.swarm.forEach((particle, index) => {
      this.fitnessValueList[index] = particle.getFitness(this.evaluate);
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
    return 0;
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

      w = 0.7298; // W_UPPERBOUND - t / MAX_ITERATION * (W_UPPERBOUND - W_LOWERBOUND);

      for (let i = 0; i < SWARM_SIZE; i++) {
        let r1 = Math.random();
        let r2 = Math.random();

        let p = this.swarm[i];

        // Update velocity
        let newVel = [];
        newVel[0] = w * p.velocity.x + r1 * C1 * (this.pBestLocation[i].x - p.position.x) + r2 * C2 * (this.gBestLocation.x - p.position.x);

        newVel[1] = w * p.velocity.y + r1 * C1 * (this.pBestLocation[i].y - p.position.y) + r2 * C2 * (this.gBestLocation.y - p.position.y);

        newVel[2] = w * p.velocity.z + r1 * C1 * (this.pBestLocation[i].z - p.position.z) + r2 * C2 * (this.gBestLocation.z - p.position.z);

        let velocity = new Velocity(newVel[0], newVel[1], newVel[2]);
        p.velocity = velocity;

        // Update position
        let newPos = [];
        newPos[0] = p.position.x + newVel[0];
        newPos[1] = p.position.y + newVel[1];
        newPos[2] = p.position.z + newVel[2];

        let position = new Position(newPos[0], newPos[1], newPos[2]);
        p.position = position;
      }

      err = this.evaluate(this.gBestLocation);

      // console.log('Interation', t);
      // console.log('Best X', this.gBestLocation.x);
      // console.log('Best Y', this.gBestLocation.y);
      // console.log('Best Z', this.gBestLocation.z);
      // console.log('Value', this.evaluate(this.gBestLocation));

      t++;
      this.updateFitness();
    }

    console.log('\nSolution found in interaction', t - 1);
    console.log('Hidden layers', this.gBestLocation.x);
    console.log('Training rate', this.gBestLocation.y);
    console.log('Momentum', this.gBestLocation.z);
    console.log('Error', err);

    return this.gBestLocation;
  }
}
