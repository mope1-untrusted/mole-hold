

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


// render entire map including units maybe if they need to be behind stuff
function drawMap(){
  seed=0
  for (var x=0; x<mapSize; x++) {
    for (var y=0; y<mapSize; y++) {
      tiles.forEach(function(tile, i) {
        var corners=getCorners(map, x,y,1).map(function(corner){
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

      tiles.forEach(function(tile, i) {
        var corners=getCorners(map.planned,x,y,0).map(function(corner){
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
          x*tileSize+origin.x, y*tileSize+origin.y, tileSize, tileSize
        )

        var oldGlobal = ctx.globalCompositeOperation;
        ctx.globalCompositeOperation = 'multiply';
        // fill offscreen buffer with the tint color
        ctx.fillStyle = '#0f0';
        ctx.fillRect(x*tileSize+origin.x, y*tileSize+origin.y, tileSize, tileSize);
        ctx.globalCompositeOperation=oldGlobal
      })
    }
  }
}

function drawThings(){
  things.forEach(function(thing){
    var x=origin.x+thing.x*tileSize
    var y=origin.y+thing.y*tileSize

    if (entities[thing.id].animations){
      ctx.drawImage(
        entities[thing.id].imageObj,
        entities[thing.id].size*thing.frame,
        entities[thing.id].size*thing.animation,
        entities[thing.id].size,
        entities[thing.id].size,
        x-0.5*entities[thing.id].size,
        y-0.5*entities[thing.id].size,
        entities[thing.id].size,
        entities[thing.id].size
      )
    } else {
      ctx.drawImage(
        entities[thing.id].imageObj,
        x-0.5*entities[thing.id].size,
        y-0.5*entities[thing.id].size
      )
    }


    if (thing.selected) {
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


function updateAnmiations(){
  things.forEach(function(thing){
    if (entities[thing.id].animations) {
      thing.frame++
      if (thing.frame>=entities[thing.id].animations[thing.animation]){
        thing.frame=0
      }
    }
  })
}
