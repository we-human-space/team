const THREE = require('three');

/**
 *
 *  Pigeonhole VS Display
 *  _ _ _ _ _ _
 * |  _ _ _ _  |
 * | |       | | Outer: pigeonhole
 * | |       | | Inner: display (cube)
 * | |_ _ _ _| |
 * |_ _ _ _ _ _|
 *
 * @param {Object} options
 * {
 *   displays {Array}: The particles on which the posts are to be displayed.
 *   [displaySize] {Number}: The size of the displays (assuming square). Defaults to
 *                           size of display objects.
 *   [position] {Object}: The position of the grid ( x, y, z, offset (y) )
 *                        Defaults to { x:0, y:0, z:0, offset: -25 }
 *   [width] {Number}: Width of the Grid
 *                     Defaults to columns * pigeonholes.size
 *   [height] {Number}: Height of the Grid
 *                      Defaults to rows * pigeonholes.size
 *   [pigeonholes] {Object}: {
 *     [size] {Object}: The size of the pigeonholes (assuming square)
 *                      Defaults to 1.25 * displaySize.
 *     [columns] {Integer}: The number of columns of pigeonholes. Overriden by width+size
 *                          Defaults to 9
 *     [rows] {Integer}: The number of rows of pigeonholes. Overriden by height+size
 *                       Defaults to 9
 *   }
 * }
**/

class Grid {
  constructor(options){
    this.displays = options.displays;
    this.posts = options.posts;
    this.scene = options.scene;
    this.position =
      typeof options.position === 'object'
        ? {
          x: typeof options.position.x === 'number' ? options.position.x : 0,
          y: typeof options.position.y === 'number' ? options.position.y : 0,
          z: typeof options.position.z === 'number' ? options.position.z : 0,
          offset: typeof options.position.offset === 'number' ? options.position.offset : -25
        }
        : {
          x: 0,
          y: 0,
          z: 0,
          offset: -25
        };

    const displaySize = this.displays[0].sprite.children[0].geometry.parameters.width;
    this.displays.size = typeof options.displaySize === 'number' && options.displaySize > 0
      ? options.displaySize || displaySize
      : displaySize;

    const pigeonholeSize = typeof options.pigeonholes.size === 'number' && options.pigeonholes.size > this.displays.size
      ? Math.round(options.pigeonholeSize)
      : Math.round(this.displays.size * 1.25);
    var columns = typeof options.pigeonholes.columns === 'number'
      ? Math.floor(options.pigeonholeSize.columns)
      : 9;
    var rows = typeof options.pigeonholes.rows === 'number'
      ? Math.floor(options.pigeonholeSize.rows)
      : 9;

    if(typeof options.width === 'number'){
      this.width = options.width % pigeonholeSize === 0
        ? options.width
        : options.width - (options.width % pigeonholeSize);
      // Update number of columns based on width since width has precedence
      // over number of columns
      columns = this.width / pigeonholeSize;
    }else{
      this.width = columns * pigeonholeSize;
    }

    if(typeof options.height === 'number'){
      this.height = options.height % pigeonholeSize === 0
        ? options.height
        : options.height - (options.height % pigeonholeSize);
      // Update number of rows based on width since width has precedence
      // over number of rows
      rows = this.height / pigeonholeSize;
    }else{
      this.height = rows * pigeonholeSize;
    }

    this.pigeonholes = {
      size: pigeonholeSize,
      columns: columns,
      rows: rows
    };

    this.draw();
  }

  draw(){
    const geometry = new THREE.PlaneGeometry(this.width, this.height, this.columns, this.rows);
    const material = new THREE.MeshBasicMaterial({wireframe: true});
    this.plane = new THREE.Mesh(geometry, material);
    this.plane.position.x = this.position.x;
    this.plane.position.y = this.position.y + this.position.offset;
    this.plane.position.z = this.position.z;
    this.moveDisplaysToPosition();
    this.addPosts();
    this.scene.add(this.plane);
  }

  attachPostsToDisplays() {

  }

  moveDisplaysToPosition(){
    const grid = this;
    const MARGIN = (this.pigeonholes.size - this.displays.size) / 2;
    const TOP_LEFT = {
      x: this.position.x - this.width / 2,
      y: this.position.y + this.height / 2,
      z: this.position.z
    };
    const HALFPOINT_DISPLAY = this.displays.size / 2;
    var row = 1;
    this.displays.forEach((d, i) => {
      if(row > grid.pigeonholes.rows){
        d.sprite.transparent = true;
        d.sprite.opacity = 0;
        return;
      }

      d.position.x = TOP_LEFT.x +
                            (i % grid.pigeonholes.columns) * grid.pigeonholes.size +
                            MARGIN +
                            HALFPOINT_DISPLAY;
      d.position.y = TOP_LEFT.y +
                            Math.floor((i / grid.pigeonholes.rows)) * grid.pigeonholes.size +
                            MARGIN +
                            HALFPOINT_DISPLAY;
      d.position.z = TOP_LEFT.z;

      if(!((i + 1) % grid.pigeonholes.columns)) {
        row++;
      }
    });
  }
}

export default Grid;
