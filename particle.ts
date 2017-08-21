import { Position } from './position';
import { Velocity } from './velocity';

export class Particle {
  position: Position;
  velocity: Velocity;
  fitness: number;

  getFitness() {
    this.calculateFitness();
    return this.fitness;
  }

  calculateFitness() {
    const x = this.position.x;
    const y = this.position.y;

    this.fitness =
      Math.pow(2.8125 - x + x * Math.pow(y, 4), 2) +
      Math.pow(2.25 - x + x * Math.pow(y, 2), 2) +
      Math.pow(1.5 - x + x * y, 2);
  }
}
