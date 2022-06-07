let canvas
let angle = 0
let angleToRefPoint = 0
let currentAngleToDisplay = 0
 canvas = document.querySelector('#myCanvas')
     canvas.width = window.innerWidth
    canvas.height = window.innerHeight


const textInputUpdatesSlider = document.querySelector('#text-input')

textInputUpdatesSlider.oninput = function() {
  //'this' always refers to the element the listner is put on :D
    document.querySelector('#slider').value = this.value
}

  //recalculates middle coordinates when window resizes
window.onresize = function() {
  canvas.width = window.innerWidth
  canvas.height = window.innerHeight
  middleCoordsOfCanvas = {x: canvas.width * 0.5, y: canvas.height * 0.5}
}


function main() {

  // const middleCoordsOfCanvas = {x: canvas.width * 0.5, y: canvas.height * 0.5}

}

function reset(event) {
  //saves ref point as current angle since we are using right triangle trig to measure
console.log('angle', angle)
event.target.disabled = true
  angleToRefPoint = angle

}

function distanceChange(event) {
  // document.querySelector('#text-input').textContent = event.target.value
   document.querySelector('#text-input').value = event.target.value
   document.querySelector('h5').textContent =`Counted Walked Distance from Ref: ${event.target.value}`
}

function permissionStart(e) {
    if (typeof DeviceOrientationEvent.requestPermission === 'function') {
      DeviceOrientationEvent.requestPermission()
        .then(permissionState => {
          if (permissionState === 'granted') {
            window.addEventListener('deviceorientation', handleOrientation);
          }
        })
        .catch(console.error);
    } else {
      window.addEventListener('deviceorientation', handleOrientation);
    }
    e.target.classList.add('hidden')
}

function handleOrientation(e) {
  window.addEventListener('deviceorientation', function(e) {
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight
    let middleCoordsOfCanvas = {x: canvas.width * 0.5, y: canvas.height * 0.5}
    angle = e.alpha
    // this offset is because we want angle of ZERO to be starting from the top, not right side
    // subtracting 90 degrees in radians (pi/2) will solve that
   const offset = Math.PI * 0.5 * -1
   currentAngleToDisplay = e.alpha + offset
  //  document.querySelector('span').textContent = currentAngleToDisplay.toFixed(1)
   const fixedAngle = (angle - angleToRefPoint) * Math.PI / 180 + offset
   const distanceYOUandRefPoint =  document.querySelector('#slider').value


   // we must subtract the offset as we want the REAL internal angle measured by event.alpha
   // offset was ONLY USED for the circle graph representation & because we cant change event.alpha angle value on the phone
  let distanceRefPointToTarget = Math.abs(Math.tan(fixedAngle-offset) * distanceYOUandRefPoint)
    const distanceCurrentUserPositionToTarget = Math.sqrt(Math.pow(distanceRefPointToTarget, 2) + Math.pow(+distanceYOUandRefPoint, 2))
   document.querySelector('h3').innerHTML = `Distance Ref Point to Target: ${distanceRefPointToTarget.toFixed(1)} Feet`
    document.querySelector('#distance-text > h2').innerHTML = `From YOU to Target: ${distanceCurrentUserPositionToTarget.toFixed(1)} Feet`
    //using the regular radius (width / 2) will have the circle touching top of screen!
    // note that we are using ~half the width of canvas for the radius NOT height because phones
    // are rectangular and using height might produce an arc that is too wide on X-axis
    // note: these things are for visual purposes only. the real caculation depends on the phone's output alpha angles
    const circleRadius = canvas.width < 715 ?
                         canvas.width / 2.3 :
                         canvas.width > 715 && canvas.width < 1000 ?
                         canvas.width / 3.3 :  canvas.width / 5.3


    const movingArcCalculations =  {
          x: middleCoordsOfCanvas.x + Math.cos(fixedAngle) * circleRadius,
          y: middleCoordsOfCanvas.y + Math.sin(fixedAngle) * circleRadius
      }

    //fixed angle is there because we only  0-90 and to only keep positive angles

     const ctx = canvas.getContext('2d')
    ctx.clearRect(0,0, canvas.width, canvas.height)

    //code below lets us draw/fill circle arc at proper positions based on phone orientation
    // since we are only measuring Right Triangles, Right Triangle trig formulas will help

    ctx.beginPath()
    if (movingArcCalculations.y > middleCoordsOfCanvas.y) distanceRefPointToTarget = 0
    ctx.fillStyle = movingArcCalculations.y > middleCoordsOfCanvas.y ? rgb(155, 232, 91) : '#47f'
   //the code below draws the arc angle starting from the right (Default) if
   // user is turning right but also draws it starting left correctly if user turns left

      movingArcCalculations.x > middleCoordsOfCanvas.x
    ? ctx.arc(middleCoordsOfCanvas.x, middleCoordsOfCanvas.y, circleRadius, offset, fixedAngle, false)
    : ctx.arc(middleCoordsOfCanvas.x, middleCoordsOfCanvas.y, circleRadius, offset, fixedAngle, true)


    ctx.lineTo(middleCoordsOfCanvas.x , middleCoordsOfCanvas.y)
    ctx.fill()

    //draws line from center to top as initial angle 0
    ctx.beginPath()
    ctx.strokeStyle = 'white'
    ctx.moveTo(middleCoordsOfCanvas.x  , middleCoordsOfCanvas.y)
    ctx.lineTo(middleCoordsOfCanvas.x , middleCoordsOfCanvas.y - circleRadius)
    ctx.stroke()

    // draws line forming proper arcs & angles as phone is rotated
    ctx.beginPath()
    ctx.lineWidth = 3
    ctx.strokeStyle='white'
    ctx.moveTo(middleCoordsOfCanvas.x  , middleCoordsOfCanvas.y)

    ctx.lineTo(movingArcCalculations.x, movingArcCalculations.y)
    ctx.stroke()
  })
}
