import dat from 'dat.gui';
import HelixProxy from './three/helix/proxy';
import helix_gui from './three/helix/gui';

const MVCs = {
  'Helix': {
    proxy: HelixProxy,
    gui: helix_gui
  }
};

class GUI {
  constructor(){
    this.gui = new dat.GUI();
  }

  addSubmodule(name, model){
    if(MVCs[name] !== undefined){
      this.gui[name] = this.gui.addFolder(name);
      MVCs[name].gui(this.gui[name], new MVCs[name].proxy(model));
      return this;
    }else{
      throw new Error('Unsupported submodule');
    }
  }
}

export default GUI;
