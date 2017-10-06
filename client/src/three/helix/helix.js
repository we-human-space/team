import THREE from 'three.js';
import HelixAnimator, { START_POSITIONS } from './animator.js';

/**
 * Helix
 **/
class Helix {
  constructor(options){
    this.numberOfPoints = typeof options.numberOfPoints === 'number' ? options.numberOfPoints : 150;
    this.radius = typeof options.radius === 'number' ? options.radius : 4;
    this.spread = typeof options.spread === 'number' ? options.spread : 0.3;
    this.density = typeof options.density === 'number' ? options.density : 60;
    this.phase = typeof options.phase !== 'number' ? Math.PI : options.phase;
    this.scene = options.scene;
    this.position =
      typeof options.position === 'object'
        ? {
          x: typeof options.position.x === 'number' ? options.position.x : 0,
          y: typeof options.position.y === 'number' ? options.position.y : 0,
          z: typeof options.position.z === 'number' ? options.position.z : 0,
          offset: typeof options.position.offset === 'number' ? options.position.offset : 75
        }
        : {
          x: 0,
          y: 0,
          z: 0,
          offset: -75
        };
    // Named this property revolution instead of rotation because making reference
    // to process of rotation about oneself, rather than rotation with regards to
    // axes. Hence when rotation is used, it is the value f(t=ti) of the revolution
    this.revolution =
      typeof options.revolution === 'object'
        ? {
          x: typeof options.revolution.x === 'number' ? options.revolution.x : 0,
          y: typeof options.revolution.y === 'number' ? options.revolution.y : 0,
          z: typeof options.revolution.z === 'number' ? options.revolution.z : 0
        }
        : {
          x: 0,
          y: 0,
          z: 0
        };
    let animation = options.animation;
    this.animation = {
      active: true,
      delay: typeof animation === 'object' && typeof animation.delay === 'number'
        ? animation.delay
        : 10,
      startPosition: animation === 'object' && Object.keys(START_POSITIONS).indexOf(animation.startPosition) !== -1
        ? animation.startPosition
        : START_POSITIONS.BOTTOM
    };
    this.points = [];
    this.helix3D = null;
    this.animator = new HelixAnimator();
    this._generatePoints();
    if(options.animate){
      this.drawWithAnimation();
    }else{
      this.draw();
    }
  }

  get animate() { return this.animation.active; }

  set animate(animate) {
    this.animation.active = !!animate;
    if(animate) {
      this.animator.activate(this);
    }
  }

  _generatePoints(){
    for(let i = 0; i < this.numberOfPoints; i++){
      this.points[i] = [];
      for(let t = 0; t < this.numberOfPoints; t++){
        let x = this.radius * Math.cos((2 * Math.PI / this.density) * t + i * this.phase) + this.position.x;
        let z = this.radius * Math.sin((2 * Math.PI / this.density) * t + i * this.phase) + this.position.z;
        let y = this.spread * (t + this.position.y + this.position.offset);

        // o = 2πf
        // f = o/2π
        // let o = 200π
        // then f = 100.
        // y = a(t+b) = at + ab => a is coefficient determining total length of structure
        // b = position.y - numberOfPoints/2 => center structure at y=0
        // assuming t has a range of [0,100]
        // total length of spiral is 100*a
        // thus total length of cycle = 100*a/f
        // which in this case is a
        // a is thus the spacing between the points, assuming that 1
        // is the default where total length of spiral = range of t.
        // let f be named frequency
        // let a be named spread
        // If I want t=100 squares per cycle, I should have
        // f=2π/100

        this.points[i].push(new THREE.Vector3(x, y, z));
      }
    }
  }

  draw(){
    var scene = this.scene;
    var helix3D = new THREE.Object3D();

    scene.remove(this.helix3D);
    this.helix3D = helix3D;

    this.points[0].forEach(draw_point);
    this.points[1].forEach(draw_point);
    scene.add(helix3D);

    function draw_point(point) {
      var sprite = new THREE.Sprite(new THREE.SpriteMaterial({color: Math.random() * 0x00ffff}));
      sprite.position.copy(point);
      helix3D.add(sprite);
    }
  }



  drawWithAnimation(type){
    var helix = this;
    var scene = helix.scene;
    var helix3D = new THREE.Object3D();

    scene.remove(this.helix3D);
    this.helix3D = helix3D;
    scene.add(helix3D);

    helix.animator.animate(this, type);
  }


  redraw(animate){
    this.animate = animate;
    this.points = [];
    this._generatePoints();
    if(animate){
      this.drawWithAnimation();
    }else{
      this.draw();
    }
  }

  update(){
    this.helix3D.rotation.x += this.revolution.x;
    this.helix3D.rotation.y += this.revolution.y;
    this.helix3D.rotation.z += this.revolution.z;
  }
}

export default Helix;
