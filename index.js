let canvas
let angle = 0
function main() {
  canvas = document.querySelector('#myCanvas')
  canvas.width = window.innerWidth
  canvas.height = window.innerHeight
  const middleCoordsOfCanvas = {x: canvas.width * 0.5, y: canvas.height * 0.5}



  window.addEventListener('deviceorientation', function(e) {

    angle = e.alpha
    const offset =-Math.PI * 0.5  // we only want 0-90 degrees as the phone  is only rotating 90 degs
    const nearFullHeightRadius = Math.min(canvas.width, canvas.height)*0.45

    const fixedAngle = angle * Math.PI * 0.5 + offset
     const ctx = canvas.getContext('2d')
    ctx.clearRect(0,0, canvas.width, canvas.height)

    ctx.beginPath()
    ctx.fillStyle='#47f'
    ctx.arc(middleCoordsOfCanvas.x, middleCoordsOfCanvas.y, nearFullHeightRadius, offset, fixedAngle )
    ctx.lineTo(middleCoordsOfCanvas.x , middleCoordsOfCanvas.y)

    ctx.fill()


    ctx.beginPath()
    ctx.strokeStyle = 'white'
    ctx.moveTo(middleCoordsOfCanvas.x  , middleCoordsOfCanvas.y)
    ctx.lineTo(middleCoordsOfCanvas.x , middleCoordsOfCanvas.y - nearFullHeightRadius)
    ctx.stroke()

    ctx.beginPath()
    ctx.strokeSyle='#47f'
    ctx.moveTo(middleCoordsOfCanvas.x  , middleCoordsOfCanvas.y)

    const movingArcCalculations =  {
      x: middleCoordsOfCanvas.x + Math.cos(angle * Math.PI / 180 + offset) * nearFullHeightRadius,
      y: middleCoordsOfCanvas.y + Math.sin(angle * Math.PI / 180 + offset) * nearFullHeightRadius
    }

    ctx.lineTo(movingArcCalculations.x, movingArcCalculations.y)
    ctx.stroke()
  })
}
