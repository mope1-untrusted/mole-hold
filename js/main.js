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

for (var x=5;x<10;x++){
  map[x][10]+=128
}

function indexArray(a){
  return a.map(function(el,i){
    el.i=i
    return el
  })
}

var entities=indexArray([
  { img:'house.png', size: 128, builds:0 },
  { img:'mole.png', size: 64, speed: 0.01, canBurrow: true, digSpeed: 0.1 },
])

var tiles=indexArray([
  { img:'empty.png'},
  { img:'farm.png'},
  { img:'farm2.png'},
  { img:'building.png'},
  { img:'river.png'},
  { img:'hole.png'},
  { img:'stairs.png'},
  { img:'mountain.png'}
]);

function getTileId(tileName){
  return tiles.filter(function(tile){
    return tile.img.indexOf(tileName)>-1
  })[0].i
}
function setMap(x,y,tileName){
  map[Math.floor(y)][Math.floor(x)] |= (1<<getTileId(tileName))
}
function getMap(x,y,tileName){
  return ( map[Math.floor(y)][Math.floor(x)] & (1<<getTileId(tileName)) ) > 0
}
var things=[
  {id:0, x:mapSize*0.5, y:mapSize*0.5, vx:0, vy:0, selected: true},
  {id:1, x:mapSize*0.5, y:mapSize*0.5, vx:0, vy:0, selected: true, digProcess:0},
  {id:1, x:mapSize*0.5+1.0, y:mapSize*0.5, vx:0, vy:0, selected: true, digProcess:0},
  {id:1, x:mapSize*0.5+2.0, y:mapSize*0.5, vx:0, vy:0, selected: true,  digProcess:0}
]

loadTiles()
loadEntities()

function loadTiles(){
  tiles.forEach(function(tile){
    tile.imageObj= new Image();
    tile.imageObj.src='tiles/'+tile.img;
  })
}
function loadEntities(){
  entities.forEach(function(entity){
    entity.imageObj= new Image();
    entity.imageObj.src='entities/'+entity.img;
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
        +(Math.random()>0.98?16:0)
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
//draw()

window.addEventListener('resize', (ev) => {
  resize()
  //draw()
});

function draw(evt){
  ctx.rect(0,0,canvas.width,canvas.height);
  ctx.fillStyle="black";
  ctx.fill()
  drawMap();
  drawThings();

  if (LMBdragging && LMBdraggingEnd) {
    drawBox({
      x1: LMBdragging.clientX-origin.x,
      y1: LMBdragging.clientY-origin.y,
      x2: LMBdraggingEnd.clientX-origin.x,
      y2: LMBdraggingEnd.clientY-origin.y
    })
  }

}

function vecDist(x1,y1,x2,y2){
  var dx = x1-x2
  var dy = y1-y2
  return Math.sqrt(dx*dx+dy*dy)
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

function drawThings(){
  things.forEach(function(thing){
    var x=origin.x+thing.x*tileSize
    var y=origin.y+thing.y*tileSize
    if (thing.burrowed) {
      ctx.globalAlpha = 0.5
    } else {
      ctx.globalAlpha = 1
    }
    ctx.drawImage(
      entities[thing.id].imageObj,
      x-0.5*entities[thing.id].size,
      y-0.5*entities[thing.id].size
    )
    ctx.globalAlpha = 1

    if (thing.selected) {
      console.log('sele')
      ctx.beginPath();
      ctx.arc( x, y, entities[thing.id].size*0.5, 0, Math.PI*2, false);
      ctx.strokeStyle='#F0F'
      ctx.lineWidth=5
      ctx.stroke();
      ctx.closePath();
    }
  })
}

function drawBox(box){
  ctx.strokeStyle='#f0f'
  //ctx.rect(box.x1+origin.x,box.y1+origin.y,box.x2-box.x1,box.y2-box.y1);
  ctx.beginPath()
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
  //draw()
}

var LMBdragging=null;
var LMBdraggingEnd=null;
var MMBdragging=null;
var keysDown={}
var controlGroups={}
var numberKeysTimeStamp=[]

window.onmousedown=function(evt){
  console.log(evt)
  if (evt.button===0) {
    LMBdragging=evt;
  } else if (evt.button===1) {
    MMBdragging=evt;
  } else if (evt.button===2) {
    things.forEach(function(thing){
      if (thing.selected){
        thing.moveTargets=[]
        var targetWoldX=(evt.clientX-origin.x)/tileSize
        var targetWoldY=(evt.clientY-origin.y)/tileSize
        var obstacleMap=map.map(function(line){
          return line.map(function(tile){
            if (thing.burrowed) {
              return 1<<getTileId('hole')&tile?'_':'u'
            } else {
              return 1<<getTileId('mountain')&tile?'u':'_'
            }
          })
        });
        obstacleMap[Math.floor(thing.y)][Math.floor(thing.x)]='s'
        obstacleMap[Math.floor(targetWoldY)][Math.floor(targetWoldX)]='g'
        console.log(obstacleMap)
        var path=astar(obstacleMap,'manhattan',true)
        if (path) {
          path=path.reverse();
          path.pop()
          console.log(path)
          path.forEach(function(step){
            //map[step.row][step.col]+=32
            thing.moveTargets.push({x: step.col, y: step.row});
          })
        }
        thing.moveTargets.unshift({x: targetWoldX, y: targetWoldY});

      }
    })
    console.log(things)
  }

}

window.onmouseup=function(evt){
  if (evt.button===0) {
    things.forEach(function(thing){
      thing.selected=false
    })

    //box select
    things.filter(function(thing){
      return true &&
          ( ( LMBdragging.clientX-origin.x < thing.x*tileSize && evt.clientX-origin.x > thing.x*tileSize ) ||
          ( LMBdragging.clientX-origin.x > thing.x*tileSize && evt.clientX-origin.x < thing.x*tileSize ) ) &&
          ( ( LMBdragging.clientY-origin.y < thing.y*tileSize && evt.clientY-origin.y > thing.y*tileSize ) ||
          ( LMBdragging.clientY-origin.y > thing.y*tileSize && evt.clientY-origin.y < thing.y*tileSize ) )
    }).forEach(function(thing){
      thing.selected=true
    });

    //click select
    var clicked=things.filter(function(thing){
      return true && (
        vecDist(thing.x, thing.y, (evt.clientX-origin.x)/tileSize, (evt.clientY-origin.y)/tileSize)<entities[thing.id].size*0.5/tileSize// ||
        //vecDist(thing.x, thing.y, LMBdragging.clientX/tileSize-origin.x, LMBdragging.clientY/tileSize-origin.x)<entities[thing.id].size*0.5/tileSize
        )
    });
    if (clicked.length>0) {
      clicked[0].selected=true
    }

    LMBdragging=null;
    LMBdraggingEnd=null;
  } else if (evt.button===1) {
    MMBdragging=null;
    oldOrigin=null
  }
}

window.onmousemove=function(evt){
  if (LMBdragging) {
    LMBdraggingEnd=evt
  }
  if (MMBdragging) {
    moveOrigin(evt)
  }
}

window.onmousewheel=function(evt){
  console.log(evt)
  origin.scale+=Math.sign(evt.deltaY)*0.1
  console.log(origin)
//  draw()
}

window.onkeydown=function(evt){
  console.log(evt)
  var numberKey=parseInt(evt.key)
  if (numberKey) {
    if (numberKeysTimeStamp[numberKey]) {
      if (evt.timeStamp-numberKeysTimeStamp[numberKey]<500 && controlGroups[numberKey]){
        origin.x=-things[controlGroups[numberKey]].x*tileSize
      }
    }
    numberKeysTimeStamp[numberKey]=evt.timeStamp
    if (evt.ctrlKey) {
      controlGroups[numberKey]=things.map(function(thing, i){
        thing.i=i
        return thing
      }).filter(function(thing){
        return thing.selected
      }).map(function(thing){
        return thing.i
      })
    } else {
      if (!controlGroups[numberKey]) return
      things.forEach(function(thing){
        thing.selected=false
      })
      controlGroups[numberKey].forEach(function(i){
        things[i].selected=true
      })
    }
  }
  if (evt.key==="d") {
    console.log('burrow')
    var burrowAbleThings=things.filter(function(thing){
      return entities[thing.id].canBurrow && thing.selected
    })
    var burrowAbleThingsBurrowed=burrowAbleThings.filter(function(thing){
      return thing.burrowed
    })
    console.log(burrowAbleThingsBurrowed,burrowAbleThings)
    if (burrowAbleThingsBurrowed.length>0.5*burrowAbleThings.length) {
      burrowAbleThings.forEach(function(thing){
        thing.burrowed=false
      })
    } else {
      burrowAbleThings.forEach(function(thing){
        thing.burrowed=true
      })
    }
    burrowAbleThings.forEach(function(thing){
      var worldSize=entities[thing.id].size/tileSize
      setMap(thing.x+worldSize*0.5, thing.y+worldSize*0.5, 'stairs')
    })
  }
}

function update(){
  things.forEach(function(thing){
    if (entities[thing.id].speed && thing.moveTargets && thing.moveTargets.length>0 ){
      var moveTarget=thing.moveTargets[thing.moveTargets.length-1]
      var dx = moveTarget.x-thing.x
      var dy = moveTarget.y-thing.y
      var l=Math.sqrt(dx*dx+dy*dy)
      if (l<0.5) {
        thing.moveTargets.pop()
        return
      }
      thing.vx+=dx*1.0/l*entities[thing.id].speed;
      thing.vy+=dy*1.0/l*entities[thing.id].speed;
    }
  })

  things.filter(function(thing){
    return thing.burrowed
  }).forEach(function(thing){
    var worldSize=entities[thing.id].size/tileSize
    if (!getMap(thing.x+worldSize*0.5, thing.y+worldSize*0.5, 'hole')) {
      thing.vx*=thing.digProcess
      thing.vy*=thing.digProcess
      thing.digProcess+=entities[thing.id].digSpeed
    }
    if (thing.digProcess>1) {
      setMap(thing.x+worldSize*0.5, thing.y+worldSize*0.5, 'hole')
      thing.digProcess=0
    }
  })

  things.forEach(function(thing){
    if (!entities[thing.id].speed) return
    things.forEach(function(thing2){
      if (thing==thing2) return
      var dx = thing.x-thing2.x
      var dy = thing.y-thing2.y
      var l=Math.sqrt(dx*dx+dy*dy)
      var r=entities[thing.id].size/tileSize;
      if (l<r) {
        thing.vx+=dx*0.1*(r-l)
        thing.vy+=dy*0.1*(r-l)
      }
    })
  })

  things.forEach(function(thing){
    thing.vx*=0.85
    thing.vy*=0.85
    thing.x+=thing.vx
    thing.y+=thing.vy
  })

}

setInterval(function(){
  update()
}, 1000.0/20)

setInterval(function(){
  draw()
}, 1000.0/20)
