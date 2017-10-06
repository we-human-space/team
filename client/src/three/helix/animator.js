import THREE from 'three.js';

export const ANIMATIONS = {
  DEFAULT: 'DEFAULT',
  PARTICLES: 'PARTICLES'
};

export const START_POSITIONS = {
  TOP: 'TOP',
  BOTTOM: 'BOTTOM'
};

class HelixAnimator {
  constructor() {
    this.animations = [];
  }

  activate() {
    this.animations.forEach((a) => {
      if(a.cb) a.cb();
    });
  }

  animate(helix, type) {
    var animation = {
      type: type || ANIMATIONS.DEFAULT,
      delay: helix.animation.delay,
      progress: {
        strand: 0,
        i: helix.animation.startPosition === START_POSITIONS.TOP ? helix.numberOfPoints - 1 : 0
      },
      cb: null
    };

    this.animations.push(animation);

    switch(animation.type){
    case ANIMATIONS.DEFAULT:
      this.default_animation(helix, animation, this.animations.length - 1);
      break;
    case ANIMATIONS.PARTICLES:
      this.particles_animation(helix, animation, this.animations.length - 1);
      break;
    default:
      this.default_animation(helix, animation, this.animations.length - 1);
      break;
    }
  }

  default_animation(helix, animation, animation_index) {
    var animator = this;
    var helix3D = helix.helix3D;

    return draw_point(animation);

    function draw_point(animation) {
      if(animation.progress.i >= helix.numberOfPoints || animation.progress.i < 0){
        animator.animations.splice(animation_index, 1);
        return;
      }

      if(!helix.animation.animate){
        animation.cb = () => {
          animation.cb = null;
          draw_point(animation);
        };
        return;
      }

      var sprite = new THREE.Sprite(new THREE.SpriteMaterial({color: Math.random() * 0x00ffff}));
      sprite.position.copy(helix.points[animation.progress.strand][animation.progress.i]);
      helix3D.add(sprite);
      animation.progress.strand = (animation.progress.strand + 1) % 2;
      if(helix.animation.startPosition === START_POSITIONS.TOP){
        animation.progress.i = animation.progress.strand ? animation.progress.i : animation.progress.i - 1;
      }else{
        animation.progress.i = animation.progress.strand ? animation.progress.i : animation.progress.i + 1;
      }
      setTimeout(() => draw_point(animation), animation.delay);
    }
  }

  particles_animation(helix, animation, animation_index) {

  }
}

export default HelixAnimator;
