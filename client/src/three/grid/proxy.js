import clone_deep from 'lodash/cloneDeep';

class GridProxy {
  constructor(grid){
    this.grid = grid;
    this.model = {
      displaySize: grid.displays.size,
      posts: grid.posts,
      width: grid.width,
      height: grid.height,
      phase: grid.phase,
      pigeonholes: {
        size: grid.pigeonholes.size,
        columns: grid.pigeonholes.columns,
        rows: grid.pigeonholes.rows
      },
      position: {
        x: grid.position.x,
        y: grid.position.y,
        z: grid.position.z,
        offset: grid.position.offset
      }
    };
  }

  redraw() {
    // TODO: Clone deep only the necessary properties
    let model = clone_deep(this.model);
    for(let k in model){
      this.grid[k] = model[k];
    }
    this.grid.redraw();
  }

  remove() {
    // TODO: add grid.remove
    this.grid.remove();
  }
}

export default GridProxy;
