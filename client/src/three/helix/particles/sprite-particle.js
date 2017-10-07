import HelixParticle from './particle';

const THREE = require('three');

class SpriteHelixParticle extends HelixParticle {
  constructor(options){
    super(options);
    this.draw(options.position || new THREE.Vector3(0, 0, 0));
  }

  draw(position){
    var sprite = new THREE.Sprite(new THREE.SpriteMaterial({color: this.color}));
    sprite.position.copy(position);
    this.sprite = sprite;
    this.parent.add(sprite);
  }
}

export default SpriteHelixParticle;
