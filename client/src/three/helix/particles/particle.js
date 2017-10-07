
export const PARTICLE_TYPES = {
  DEFAULT: 'SPRITE',
  SPRITE: 'SPRITE',
  CUBE: 'CUBE'
};

class HelixParticle {
  constructor(options) {
    this.parent = options.parent;
    this.color = options.color || Math.random() * 0x00ffff;
  }
}

export default HelixParticle;
