

setInterval(function(){
  updateAnmiations()
}, 1000.0/10)

setInterval(function(){
  //updateEvilSpawn()
  updateSlimes()
  updateHouses()
}, 1000.0)

setInterval(function(){
  update()
}, 1000.0/50)

setInterval(function(){
  draw()
}, 1000.0/30)
