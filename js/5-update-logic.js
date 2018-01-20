

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

  things.forEach(function(thing){
    map.set(thing.x+0.5, thing.y+0.5, 'stone', false)
  })

  things.forEach(function(thing){
    tiles.forEach(function(tile){
      if (tile.collision && tile.collision.indexOf(thing.id)>-1 ) {
        thing.vx*=0//thing.digProcess
        thing.vy*=0//thing.digProcess
        //thing.digProcess+=entities[thing.id].digSpeed
      }
      if (thing.digProcess>1) {
        //map.set(thing.x+0.5, thing.y+0.5, 'stone', false)
        //map.set(thing.x+0.5, thing.y+0.5, 'stone_floor', true)
        thing.digProcess=0
      }

    })

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


function updateHouses(){
  var houseCount=0
  for (var x=0; x<mapSize; x++) {
    for (var y=0; y<mapSize; y++) {
      if (map.get(x,y,'house')) {
        houseCount++
      }
    }
  }
  for (var x=0; x<mapSize; x++) {
    for (var y=0; y<mapSize; y++) {
      if (map.get(x,y,'house')&& things.filter(function(thing){return thing.id==1}).length<houseCount) {
        things.push({id:1, x:x, y:y, vx:0, vy:0, selected: true,  digProcess:0, animation:0, frame:0})
      }
    }
  }
}



function mineCommand(thing,evt){

}


function moveCommand(thing,evt){
  thing.moveTargets=[]
  var targetWoldX=(evt.clientX-origin.x)/tileSize
  var targetWoldY=(evt.clientY-origin.y)/tileSize
  var obstacleMap=map.map(function(line){
    return line.map(function(tile){
      if (thing.burrowed) {
        return 1<<getTileId('hole')&tile?'_':'u'
      } else {
        return 1<<getTileId('stone')&tile?'u':'_'
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