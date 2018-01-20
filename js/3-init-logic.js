
function createMap(){
  var map=[];
  map.planned=[]

  map.set=function (x,y,tileName,to){
    if (to===undefined) {
      to=true
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

  for (var y=0; y<mapSize; y++) {
    map[y]=[]
    map.planned[y]=[]
    for (var x=0; x<mapSize; x++) {
      map[y][x]=1
      map.planned[y][x]=0
      var dx=x-mapSize*0.5
      var dy=y-mapSize*0.5
      var r=Math.sqrt(dx*dx+dy*dy)
      console.log()
      if ( random() > 0.2*Math.abs(r-10) ) {
        console.log('random')
        map.set(x,y,'stone')
        //+(Math.random()>0.95?4:0)
        //+(Math.random()>0.98?16:0)
      }
    }
  }

  map.plan=function(x,y,tileName,to){
    if (to===undefined) {
      to=true
    }
    console.log(x,y, tileName, to)
    if (to){
      this.planned[Math.floor(y)][Math.floor(x)] |= (1<<getTileId(tileName))
    } else {
      this.planned[Math.floor(y)][Math.floor(x)] &= ~(1<<getTileId(tileName))
    }
  }


  map.set(mapSize*0.5,mapSize*0.5,'house')
  map.plan(mapSize*0.5-5,mapSize*0.5-5,'house')

  return map
}


var map=createMap()


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
