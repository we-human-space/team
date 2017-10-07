import dat from 'dat.gui';
import { START_POSITIONS } from './animator';

class ControlsView {
  constructor(controls) {
    this.gui = new dat.GUI();
    let gui = this.gui;
    gui.helix = gui.addFolder('Helix');
    gui.helix.structure = gui.helix.addFolder('structure');
    gui.helix.structure.add(controls.model, 'numberOfPoints', 2, 250).step(1);
    gui.helix.structure.add(controls.model, 'radius', 0, 10);
    gui.helix.structure.add(controls.model, 'density', 0, 500);
    gui.helix.structure.add(controls.model, 'spread', 0, 10);
    gui.helix.structure.add(controls.model, 'phase', 0, 10);
    gui.helix.particles = gui.helix.addFolder('particles');
    gui.helix.particles.add(controls.model.particleOptions, 'type', ['CUBE', 'SPRITE']);
    gui.helix.particles.add(controls.model.particleOptions, 'wobbling', 0, 5);
    gui.helix.particles.add(controls.model.particleOptions.rotation, 'step', 0, 0.5, 'rotation step');
    gui.helix.position = gui.helix.addFolder('position');
    gui.helix.position.add(controls.model.position, 'x', 0, 10);
    gui.helix.position.add(controls.model.position, 'y', 0, 10);
    gui.helix.position.add(controls.model.position, 'z', 0, 10);
    gui.helix.position.add(controls.model.position, 'offset', -300, 300);
    gui.helix.animation = gui.helix.addFolder('animation');
    gui.helix.animation.add(controls.model.animation, 'delay', 0, 100);
    gui.helix.animation.add(controls.model.animation, 'startPosition', START_POSITIONS);
    gui.helix.animation.add(controls.model.animation, 'animate').onChange(() => { controls.helix.animate = controls.model.animation.animate; });
    gui.helix.revolution = gui.helix.addFolder('revolution');
    gui.helix.revolution.add(controls.model.revolution, 'x', -0.1, 1).onChange(() => controls.updateRevolution());
    gui.helix.revolution.add(controls.model.revolution, 'y', -0.1, 0.1).onChange(() => controls.updateRevolution());
    gui.helix.revolution.add(controls.model.revolution, 'z', -0.1, 0.1).onChange(() => controls.updateRevolution());
    gui.helix.revolution.add(controls.model.revolution, 'stop').onChange(() => controls.updateRevolution());
    gui.helix.revolution.add(controls.model.revolution, 'reset');
    gui.helix.revolution.add(controls.model.revolution, 'resetAll');
    gui.helix.add(controls, 'redraw');
  }
}

export default ControlsView;
