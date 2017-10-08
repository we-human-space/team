import { START_POSITIONS } from './animator';
import { PARTICLE_TYPES } from './particles/particle';

function gui(parent, controls) {
  let v = parent;
  v.structure = v.addFolder('structure');
  v.structure.add(controls.model, 'numberOfPoints', 2, 250).step(1);
  v.structure.add(controls.model, 'radius', 0, 10);
  v.structure.add(controls.model, 'density', 0, 500);
  v.structure.add(controls.model, 'spread', 0, 10);
  v.structure.add(controls.model, 'phase', 0, 10);
  v.particles = v.addFolder('particles');
  v.particles.add(controls.model.particleOptions, 'type', PARTICLE_TYPES);
  v.particles.add(controls.model.particleOptions, 'wobbling', 0, 5);
  v.particles.add(controls.model.particleOptions.rotation, 'step', 0, 0.5, 'rotation step');
  v.position = v.addFolder('position');
  v.position.add(controls.model.position, 'x', 0, 10);
  v.position.add(controls.model.position, 'y', 0, 10);
  v.position.add(controls.model.position, 'z', 0, 10);
  v.position.add(controls.model.position, 'offset', -300, 300);
  v.animation = v.addFolder('animation');
  v.animation.add(controls.model.animation, 'delay', 0, 100);
  v.animation.add(controls.model.animation, 'startPosition', START_POSITIONS);
  v.animation.add(controls.model.animation, 'animate').onChange(() => { controls.helix.animate = controls.model.animation.animate; });
  v.revolution = v.addFolder('revolution');
  v.revolution.add(controls.model.revolution, 'x', -0.1, 0.1).onChange(() => controls.updateRevolution());
  v.revolution.add(controls.model.revolution, 'y', -0.1, 0.1).onChange(() => controls.updateRevolution());
  v.revolution.add(controls.model.revolution, 'z', -0.1, 0.1).onChange(() => controls.updateRevolution());
  v.revolution.add(controls.model.revolution, 'stop').onChange(() => controls.updateRevolution());
  v.revolution.add(controls.model.revolution, 'reset');
  v.revolution.add(controls.model.revolution, 'resetAll');
  v.add(controls, 'redraw');
  v.add(controls, 'remove');
  return v;
}

export default gui;
