
function createMap(){
  var map=[];
  map.planned=[]

  for (var y=0; y<mapSize; y++) {
    map[y]=[]
    map.planned[y]=[]
    for (var x=0; x<mapSize; x++) {
      map[y][x]=1
      map.planned[y][x]=0
    }
  }

  map.set=function (x,y,tileName,to){
    if (to===undefined) {
      to=true
    }
    if (!x || !y || !tileName) {
      console.error(arguments)
    }
    if (to){
      this[Math.floor(y)][Math.floor(x)] |= (1<<getTileId(tileName))
    } else {
      this[Math.floor(y)][Math.floor(x)] &= ~(1<<getTileId(tileName))
    }
  }

  map.get=function(x,y,tileName){
    return ( this[Math.floor(y)][Math.floor(x)] & (1<<getTileId(tileName)) ) > 0
  }

  map.plan=function(x,y,tileName,to){
    if (to===undefined) {
      to=true
    }
    var tileId=getTileId(tileName)
    if (!x || !y || !tileId) {
      throw arguments.join(',')
    }
    if (to){
      this.planned[Math.floor(y)][Math.floor(x)] |= (1<<tileId)
    } else {
      this.planned[Math.floor(y)][Math.floor(x)] &= ~(1<<tileId)
    }
  }

  map.mapTiles=function(cb){
    var result=[]
    for (var y=0; y<mapSize; y++) {
      result[y]=[]
      for (var x=0; x<mapSize; x++) {
        result[y][x]=cb(x,y)
      }
    }
    return result
  }


  map.set(mapSize*0.5,mapSize*0.5,'house')
  map.plan(mapSize*0.5-5,mapSize*0.5-5,'house')

  return map
}

var map=createMap()
generateTerrain(map)
console.log(map)
