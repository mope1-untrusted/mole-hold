
var canvas=document.querySelector('canvas')
var ctx=canvas.getContext("2d")


resize(canvas)


var oldOrigin
var origin={
  x:-mapSize*0.5*tileSize+0.5*canvas.width,
  y:-mapSize*0.5*tileSize+0.5*canvas.height,
  scale:1
}
function moveOrigin(evt){
  if (!oldOrigin) {
      oldOrigin=Object.assign({},origin)
  }
  origin.x=oldOrigin.x+evt.clientX-MMBdragging.clientX
  origin.y=oldOrigin.y+evt.clientY-MMBdragging.clientY
}

window.addEventListener('resize', (ev) => {
  resize()
});
