console.log("derp")


var tileSize=64;
var mapSize=20;

// clockwise edges of tile have this material? -> x,y on tilemap
var tileMappings = {
  '1,1,1,1':[[1,1],[1,2],[2,1],[2,2]],  //middle
  '0,0,1,0':[[0,0]],        //corners
  '0,1,0,0':[[0,3]],
  '0,0,0,1':[[3,0]],
  '1,0,0,0':[[3,3]],
  '0,0,1,1':[[1,0],[2,0]],  //edges
  '1,1,0,0':[[1,3],[2,3]],
  '0,1,1,0':[[0,1],[0,2]],
  '1,0,0,1':[[3,1],[3,2]],
  '1,1,0,1':[[1,5]], //inner corners
  '1,1,1,0':[[2,5]],
  '1,0,1,1':[[1,6]],
  '0,1,1,1':[[2,6]],
  '1,0,1,0':[[5,5]],  //diagonal
  '0,1,0,1':[[6,5]],
}


var map=createMap()
console.log(map)

var tiles=[
  { img:'empty.png'},
  { img:'farm.png'},
  { img:'farm2.png'},
  { img:'building.png'}
];

loadTiles()
function loadTiles(){
  tiles.forEach(function(tile){
    tile.imageObj= new Image();
    tile.imageObj.src='tiles/'+tile.img;
  })
}

function createMap(){
  var map=[];
  for (var y=0; y<mapSize; y++) {
    map[y]=[]
    for (var x=0; x<mapSize; x++) {
      map[y][x]=1
        //+(Math.random()>0.8?2:0)
        +(Math.random()>0.95?4:0)
        +(Math.random()>0.98?8:0)
    }
  }
  return map
}


var oldOrigin
var origin={x:0,y:0,scale:1}

var canvas=document.querySelector('canvas')
var ctx=canvas.getContext("2d")

function resize(){
  var w = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
  var h = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
  canvas.width=w;
  canvas.height=h;
}

resize()
draw()

window.addEventListener('resize', (ev) => {
  resize()
  draw()
});

function draw(evt){
  console.log('draw')
  ctx.rect(0,0,canvas.width,canvas.height);
  ctx.fillStyle="black";
  ctx.fill()
  drawMap();

  if (LMBdragging && evt) {
    drawBox({
      x1: LMBdragging.clientX-origin.x,
      y1: LMBdragging.clientY-origin.y,
      x2: evt.clientX-origin.x,
      y2: evt.clientY-origin.y
    })
  }

  ctx.strokeStyle='rgba(255,255,255,1)'
  ctx.rect(100, 100, 500, 500);
  ctx.stroke();

}


// gets corners that belong to the corner on top left of a tile
function getCorners(x,y, border){
    return [
        map[y][x],
        x+1<mapSize ? map[y][x+1]:border,
        x+1<mapSize && y+1<mapSize ? map[y+1][x+1]:border,
        y+1<mapSize ? map[y+1][x]:border
      ]
}

// shitty PRNG from stackoverflow that accepts a seed unlike fucking Math.random
var seed = 1;
function random() {
    var x = Math.sin(seed++) * 10000;
    return x - Math.floor(x);
}


// render entire map including units maybe if they need to be behind stuff
function drawMap(){
  seed=0
  for (var x=0; x<mapSize; x++) {
    for (var y=0; y<mapSize; y++) {
      tiles.forEach(function(tile, i) {
        var corners=getCorners(x,y,1).map(function(corner){
          return ( corner & (1<<i) ) >> i
        })
        var possibleMappings=tileMappings[corners.join()]
        if (!possibleMappings) return
        var mapping = possibleMappings[Math.floor(random()*possibleMappings.length)].map(function(e){
          return e*tileSize
        })
        var args=[tile.imageObj]
        .concat(mapping)
        .concat([tileSize,tileSize])
        .concat([tileSize*x, tileSize*y, tileSize, tileSize])

        ctx.drawImage(tile.imageObj,
          mapping[0], mapping[1], tileSize, tileSize,
          (x)*tileSize+origin.x, y*tileSize+origin.y, tileSize, tileSize
        )
      })

    }
  }
}

function drawBox(box){
  ctx.strokeStyle='rgba(255,255,255,1)'

  ctx.rect(box.x1+origin.x,box.y1+origin.y,box.x2-box.x1,box.y2-box.y1);
  ctx.stroke();
}


function moveOrigin(evt){
  if (!oldOrigin) {
      oldOrigin=Object.assign({},origin)
  }
  origin.x=oldOrigin.x+evt.clientX-MMBdragging.clientX
  origin.y=oldOrigin.y+evt.clientY-MMBdragging.clientY
  console.log(origin)
  draw()
}

var LMBdragging=null;
var MMBdragging=null;

window.onmousedown=function(evt){
  console.log(evt)
  if (evt.button===0) {
    LMBdragging=evt;
  } else if (evt.button===1) {
    MMBdragging=evt;
  }
}

window.onmouseup=function(evt){
  if (evt.button===0) {
    LMBdragging=null;
    draw();
  } else if (evt.button===1) {
    MMBdragging=null;
    oldOrigin=null
  }
}

window.onmousemove=function(evt){
  if (LMBdragging) {
    draw(evt)
  }
  if (MMBdragging) {
    moveOrigin(evt)
  }
}

window.onmousewheel=function(evt){
  console.log(evt)
  origin.scale+=Math.sign(evt.deltaY)*0.1
  console.log(origin)
  draw()
}

setInterval(function(){
  draw(), 1000
})
