import { Particle } from './particle';
import { Position } from './position';
import { Velocity } from './velocity';

const SWARM_SIZE = 30;
const MAX_ITERATION = 100;
const PROBLEM_DIMENSION = 2;
const C1 = 2.0;
const C2 = 2.0;
const W_UPPERBOUND = 1.0;
const W_LOWERBOUND = 0.0;

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
      const posX = Math.random() * 3.0 + 1.0;
      const posY = Math.random() * 2.0 - 1.0;

      const velX = Math.random() * 2.0 - 1.0;
      const velY = Math.random() * 2.0 - 1.0;

      particle = new Particle();
      particle.position = new Position(posX, posY);
      particle.velocity = new Velocity(velX, velY);

      this.swarm.push(particle);
    }
  }

  execute() {
    this.initializeSwam();

    this.swarm.forEach(particle => {
      this.fitnessValueList.push(particle.getFitness());
    });

    for (var i = 0; i < this.swarm.length; i++) {
      this.pBest[i] = this.fitnessValueList[i];
      this.pBestLocation.push(this.swarm[i].position);
    }

    let t = 0;
    let w = 0;
    let err = 9999;

    while (t < 100) {
      for (var i = 0; i < this.swarm.length; i++) {
        this.pBest[i] = this.fitnessValueList[i];
        this.pBestLocation[i] = this.swarm[i].position;
      }

      let bestParticleIndex = 0;
      if (t === 0 || this.fitnessValueList[bestParticleIndex] < this.gBest) {
        this.gBest = this.fitnessValueList[bestParticleIndex];
        this.gBestLocation = this.swarm[bestParticleIndex].position;
      }

      t++;
    }
  }
}

new PSO();
