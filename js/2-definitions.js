
var tileSize=64;
var mapSize=30;


var entities=indexArray([
  { img:'house.png', size: 128, builds:0 },
  {
    img:'mole.png',
    size: 32,
    speed: 0.01,
    canBurrow: true,
    digSpeed: 0.1,
    animations:[1,5,5,5],
    tileAvoid: ['stone'],
    tileCollision: ['stone'],

  },
  {
    img:'slime.png',
    size: 64,
    speed: 0.01,
    animations:[13,6,6,16],
    tileAvoid: ['stone'],
    tileCollision: ['stone'],
  },
])
entities.forEach(function(entity){
  if (!entity.onAnimationEnd) entity.onAnimationEnd=[]
  if (!entity.tileAvoid) entity.tileAvoid=[]
})

var tiles=indexArray([
  { img:'empty.png'},
  { img:'stone.png', miningTo:'stone_floor'},
  { img:'stone_floor.png'},
  { img:'iron.png'},
  { img:'farm.png'},
  { img:'farm2.png'},
  { img:'house.png'},
  { img:'storage.png'},
  { img:'storage_stone.png'},
  { img:'storage_iron.png'},
  { img:'house.png'},
  { img:'river.png'},
  { img:'hole.png'},
  { img:'stairs.png'},
  { img:'mountain.png'}
]);

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

var things=[]

var Thing=function(params){
  console.log(this,params)
  this.id=params.id||0
  this.x=params.x||1
  this.vx=params.vx||0
  this.y=params.y||1
  this.vy=params.vy||0
  this.animation=params.animation||0
  this.frame=0
  things.push(this)
}

new Thing({id:2, animation:0})

//some specific shit for slime
entities[2].animations[15]=16
entities[2].onAnimationEnd[1]=function(){
  this.animation=2
}
entities[2].onAnimationEnd[15]=function(){
  this.animation=0
  var newSlime=new Thing(this)
  newSlime.x+=Math.random()
  newSlime.y+=Math.random()
}
entities[2].onMoveCommand=function(){
  this.animation=1
  this.frame=0
}
entities[2].onMoveTargetReached=function(){
  this.animation=0
  this.frame=0
}


//git outta mah room im playin moincroft
function generateTerrain(map){
  for (var y=0; y<mapSize; y++) {
    for (var x=0; x<mapSize; x++) {

      var dx=x-mapSize*0.5
      var dy=y-mapSize*0.5
      var r=Math.sqrt(dx*dx+dy*dy)
      if ( random() > 0.2*Math.abs(r-10) ) {
        if ( random() > 0.8 ) {
          map.set(x,y,'iron')
          map.set(x,y,'stone')
        } else {
          map.set(x,y,'stone')
        }
      }
    }
  }
}
