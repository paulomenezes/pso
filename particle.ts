import { Position } from './position';
import { Velocity } from './velocity';

export class Particle {
  position: Position;
  velocity: Velocity;
  fitness: number;

  getFitness(evaluate: (position: Position) => number) {
    this.calculateFitness(evaluate);
    return this.fitness;
  }

  calculateFitness(evaluate: (position: Position) => number) {
    const x = this.position.x;
    const y = this.position.y;

    this.fitness = evaluate(this.position);
  }
}
