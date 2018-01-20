
var tileSize=64;
var mapSize=30;


var entities=indexArray([
  { img:'house.png', size: 128, builds:0 },
  { img:'mole.png', size: 32, speed: 0.01, canBurrow: true, digSpeed: 0.1, animations:[1,5,5,5] },
])

var tiles=indexArray([
  { img:'empty.png'},
  { img:'stone.png', collision:[1], mining:[1], miningTo:'stone_floor'},
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
