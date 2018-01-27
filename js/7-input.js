

var LMBdragging=null;
var LMBdraggingEnd=null;
var MMBdragging=null;
var keysDown={}
var controlGroups={}
var numberKeysTimeStamp=[]


window.onmousedown=function(evt){
  if (evt.button===0) {
    LMBdragging=evt;
  } else if (evt.button===1) {
    MMBdragging=evt;
  } else if (evt.button===2) {
    things.forEach(function(thing){
      if (thing.selected){
        if ( tiles.filter(function(tile){
          return tile.mining!==undefined && tile.mining.indexOf(thing.id)>-1
        }).length>0) {
          mineCommand(thing,evt)
        } else {
          moveCommand(thing, evt)
        }
      }
    })
  }

}


window.onmouseup=function(evt){
  if (evt.button===0) {
    things.forEach(function(thing){
      thing.selected=false
    })

    //box select
    things.filter(function(thing){
      return thing.selectAble && 
          ( ( LMBdragging.clientX-origin.x < thing.x*tileSize && evt.clientX-origin.x > thing.x*tileSize ) ||
          ( LMBdragging.clientX-origin.x > thing.x*tileSize && evt.clientX-origin.x < thing.x*tileSize ) ) &&
          ( ( LMBdragging.clientY-origin.y < thing.y*tileSize && evt.clientY-origin.y > thing.y*tileSize ) ||
          ( LMBdragging.clientY-origin.y > thing.y*tileSize && evt.clientY-origin.y < thing.y*tileSize ) )
    }).forEach(function(thing){
      thing.selected=true
      console.log(thing)
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
      var mapSize=entities[thing.id].size/tileSize
      map.set(thing.x+mapSize*0.5, thing.y+mapSize*0.5, 'stairs')
    })
  }
}
