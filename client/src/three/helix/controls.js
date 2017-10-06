class Controls {
  constructor(helix){
    this.helix = helix;
    this.model = {
      numberOfPoints: helix.numberOfPoints,
      radius: helix.radius,
      density: helix.density,
      spread: helix.spread,
      phase: helix.phase,
      animation: {
        animate: false,
        delay: helix.animation.delay,
        startPosition: helix.animation.startPosition
      },
      position: {
        x: helix.position.x,
        y: helix.position.y,
        z: helix.position.z,
        offset: helix.position.offset
      },
      revolution: {
        x: helix.revolution.x,
        y: helix.revolution.y,
        z: helix.revolution.z,
        stop: false,
        reset: () => this.updateRevolution(true),
        resetAll: () => this.updateRevolution(true, true)
      }
    };
  }

  redraw() {
    for(let k in this.model){
      this.helix[k] = this.model[k];
    }
    this.helix.redraw(this.model.animation.animate);
  }

  updateRevolution(reset, all) {
    if(reset) {
      this.helix.helix3D.rotation.x = 0;
      this.helix.helix3D.rotation.y = 0;
      this.helix.helix3D.rotation.z = 0;
      if(all) {
        this.helix.revolution = {
          x: 0,
          y: 0,
          z: 0
        };
      }
    }else if(this.model.revolution.stop) {
      this.helix.revolution = {
        x: 0,
        y: 0,
        z: 0
      };
    }else{
      this.helix.revolution = {
        x: this.model.revolution.x,
        y: this.model.revolution.y,
        z: this.model.revolution.z
      };
    }
  }
}

export default Controls;
