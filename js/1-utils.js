
function indexArray(a){
  return a.map(function(el,i){
    el.i=i
    return el
  })
}

function getTileId(tileName){
  var tile=tiles.filter(function(tile){
    return tile.img.indexOf(tileName)>-1
  })[0]
  if (!tile) {
    throw 'getTileId('+tileName+'), not found'
  } else {
    return tile.i
  }
}


// shitty PRNG from stackoverflow that accepts a seed unlike fucking Math.random
var seed = 1;
function random() {
    var derp = Math.sin(seed++) * 10000;
    return derp - Math.floor(derp);
}



function resize(canvas){
  var w = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
  var h = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
  canvas.width=w;
  canvas.height=h;
}

function vecDist(x1,y1,x2,y2){
  var dx = x1-x2
  var dy = y1-y2
  return Math.sqrt(dx*dx+dy*dy)
}

// gets corners that belong to the corner on top left of a tile
function getCorners(map2, x,y, border){
    return [
        map2[y][x],
        x+1<mapSize ? map2[y][x+1]:border,
        x+1<mapSize && y+1<mapSize ? map2[y+1][x+1]:border,
        y+1<mapSize ? map2[y+1][x]:border
      ]
}
