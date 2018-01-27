

function update(){
  things.forEach(function(thing){
    if (thing.customMovement) {
      return
    }

    if (entities[thing.id].speed && thing.moveTargets && thing.moveTargets.length>0 ){
      var moveTarget=thing.moveTargets[thing.moveTargets.length-1]
      var dx = moveTarget.x-thing.x
      var dy = moveTarget.y-thing.y
      var l=Math.sqrt(dx*dx+dy*dy)
      if (l<0.5) {
        thing.moveTargets.pop()
        if (thing.moveTargets.length==0 && entities[thing.id].onMoveTargetReached){
          entities[thing.id].onMoveTargetReached.apply(thing)
        }
      }
      thing.vx+=dx*1.0/l*entities[thing.id].speed;
      thing.vy+=dy*1.0/l*entities[thing.id].speed;
    }
  })

  things.forEach(function(thing){


  })

  things.forEach(function(thing){

    thing.tileCollision.forEach(function(tileName){
      if (map.get(thing.x+0.5, thing.y+0.5, tileName)) {
        thing.vx*=0//thing.digProcess
        thing.vy*=0//thing.digProcess
        if ( thing.tileMine.indexOf(tileName)>-1 ) {
          thing.digProcess+=entities[thing.id].digSpeed
          map.set(thing.x+0.5, thing.y+0.5, 'cracks', true)
          if (thing.digProcess>1) {
            map.set(thing.x+0.5, thing.y+0.5, 'stone', false)
            map.set(thing.x+0.5, thing.y+0.5, 'cracks', false)
            //map.set(thing.x+0.5, thing.y+0.5, 'stone', false)
            //map.set(thing.x+0.5, thing.y+0.5, 'stone_floor', true)
            thing.digProcess=0

          }

        }
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

  updateEvil()
}

function updateEvil(){
  evilAngle+=evilSpeed
  evilSpeed*=0.9
  things.filter(function(thing){
    return thing.id===3
  }).forEach(function(thing){
    var x=mapSize*0.5+0.4*mapSize*Math.sin(evilAngle)
    var y=mapSize*0.5+0.4*mapSize*Math.cos(evilAngle)

    thing.x=x
    thing.y=y

    thing.angle=evilAngle

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
      if (map.get(x,y,'house')&& things.filter(function(thing){return thing.id==2}).length<houseCount) {
        new Thing({id:2, x:x, y:y})
      }
    }
  }
}

function updateEvilSpawn(){
  if (Math.random()<0.9) return
  var evil=things.filter(function(thing){
    return thing.id===3
  })[0]
  var monster=new Thing({id:1, x:evil.x, y:evil.y})
  console.log(monster)
  moveCommand(monster, { x: mapSize*0.5, y: mapSize*0.5 } )
}

function updateSlimes(){
  things.filter(function(thing){
    return thing.id===2
  }).forEach(function(thing){
    if (Math.random()>0.9) {
      //thing.animation=15
    }
  })
}

function mineCommand(thing,target){

}



function moveCommand(thing,target){

  // lol exception for slimes during clone HACK
  if (thing.id==2 && thing.animation==15) return

  if (entities[thing.id].onMoveCommand) {
    entities[thing.id].onMoveCommand.apply(thing)
  }

  var targetWoldX
  var targetWoldY
  thing.moveTargets=[]
  if (target.clientX) {
    // mouse event target
    targetWoldX=(target.clientX-origin.x)/tileSize
    targetWoldY=(target.clientY-origin.y)/tileSize
  } else {
    // world target
    targetWoldX=target.x
    targetWoldY=target.y
  }
  var obstacleMap=map.mapTiles(function(x,y){
    var avoid=false
    entities[thing.id].tileAvoid.forEach(function(tile){
      if (map.get(x,y,tile)) {
        avoid=true
      }
    })
    return avoid?'u':'_'  //unpassable=u in this astar library
  });
  obstacleMap[Math.floor(thing.y)][Math.floor(thing.x)]='s'
  obstacleMap[Math.floor(targetWoldY)][Math.floor(targetWoldX)]='g'

  var path=astar(obstacleMap,'manhattan',true)
  if (path) {
    path=path.reverse();
    path.pop()
    path.forEach(function(step){
      thing.moveTargets.push({x: step.col, y: step.row});
      if (thing.pathTrail) {
        map.set(step.col, step.row, 'path')
      }
    })
  } else {
    console.log('no path, going yolo mode')
  }
  thing.moveTargets.unshift({x: targetWoldX, y: targetWoldY});
  console.log('movecommand path', path)
}
