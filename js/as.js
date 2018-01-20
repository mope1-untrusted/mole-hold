var map=[
  ['s',0,0,0,0,0,0],
  ['u','u','u','u',1,0,0],
  [0,0,0,0,0,0,0],
  [0,'u','u','u','u','u','u'],
  [0,0,0,0,0,0,'g']
]

console.log(astar(map,'manhattan',true))
astar(map,'manhattan',true).forEach(function(step){
  map[step.row][step.col]='x'
})

console.log(map)

map.forEach(function(row){
  document.body.innerHTML+='<br>'+row.join('')
})
