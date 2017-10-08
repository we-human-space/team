
function gui(parent, controls) {
  let v = parent;
  v.dimensions = v.addFolder('dimensions');
  v.dimensions.add(controls.model, 'width', 0, 1500).step(1);
  v.dimensions.add(controls.model, 'height', 0, 1500).step(1);
  v.pigeonholes = v.addFolder('pigeonholes');
  v.pigeonholes.add(controls.model.pigeonholes, 'size', 2, 250);
  v.pigeonholes.add(controls.model.pigeonholes, 'columns', 0, 10).step(1);
  v.pigeonholes.add(controls.model.pigeonholes, 'rows', 0, 10).step(1);
  v.position = v.addFolder('position');
  v.position.add(controls.model.position, 'x', 0, 10);
  v.position.add(controls.model.position, 'y', 0, 10);
  v.position.add(controls.model.position, 'z', 0, 10);
  v.position.add(controls.model.position, 'offset', -300, 300);
  v.add(controls, 'redraw');
  v.add(controls, 'remove');
  return v;
}

export default gui;
