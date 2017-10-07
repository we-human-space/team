import HelixParticle from './particle';

const THREE = require('three');

/**
 * ROTATION_DIRECTIONS = {
 *   CLOCKWISE: 0,
 *   COUNTERCLOCKWISE: 1
 * }
**/

class CubeHelixParticle extends HelixParticle {
  constructor(options = {}){
    super(options);
    this.rotation = {
      direction: typeof options.rotation === 'object'
        ? options.rotation.direction || Math.floor(Math.random() * 2)
        : Math.floor(Math.random() * 2),
      step: typeof options.rotation === 'object'
        ? options.rotation.step || 0.01
        : 0.01
    };
    this.wobbling = options.wobbling || 0.5;
    this.draw(options.position || new THREE.Vector3(0, 0, 0));
  }

  draw(position){
    var cubeGeometry = new THREE.BoxGeometry(1, 1, 1);
    var cubeMaterial = new THREE.MeshNormalMaterial();
    var cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
    cube.position.copy(position);
    cube.rotation.z = (Math.random() * 2 * Math.PI / 4) + Math.PI / 4; // π/4 - 3π/4
    this.sprite = cube;
    this.parent.add(cube);
  }

  update(){
    this.rotation.direction = this.shouldChangeDirection()
      ? !this.rotation.direction // Reversing direction
      : this.rotation.direction; // Keeping current direction

    this.sprite.rotation.z = this.rotation.direction
      ? this.sprite.rotation.z - this.rotation.step // Counterclockwise
      : this.sprite.rotation.z + this.rotation.step; // Clockwise
    this.sprite.rotation.x = this.rotation.direction
      ? this.sprite.rotation.x - this.rotation.step // Counterclockwise
      : this.sprite.rotation.x + this.rotation.step; // Clockwise

    if(this.rotation.direction){
      if(this.sprite.rotation.z <= Math.PI / 2){
        this.sprite.position.y += this.wobbling *
          (Math.sin(this.rotation.step + this.sprite.rotation.z) - Math.sin(this.sprite.rotation.z));
      }else{
        this.sprite.position.y += this.wobbling *
          (Math.sin(this.sprite.rotation.z) - Math.sin(this.rotation.step + this.sprite.rotation.z));
      }
    }else{
      if(this.sprite.rotation.z >= Math.PI / 2){
        this.sprite.position.y += this.wobbling *
          (Math.sin(this.rotation.step + this.sprite.rotation.z) - Math.sin(this.sprite.rotation.z));
      }else{
        this.sprite.position.y += this.wobbling *
          (Math.sin(this.sprite.rotation.z) - Math.sin(this.rotation.step + this.sprite.rotation.z));
      }
    }
  }

  shouldChangeDirection(){
    return this.sprite.rotation.z >= 3 * Math.PI / 4 || this.sprite.rotation.z <= Math.PI / 4;
  }
}

export default CubeHelixParticle;
