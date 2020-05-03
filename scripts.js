window.onload = function() {
    var canvas = document.getElementById("main");
    var ctx = canvas.getContext("2d");
    canvas.onmousedown = myDown;
    canvas.onmouseup = myUp;
    canvas.onmousemove = myMove;
    var currentAction = 'move';
    var datafile = [];

    // Changes the current state of the app, depending on the action
    function changeCurrent(action){
        document.getElementById(currentAction).style.display = "none";
        currentAction = action;
        document.getElementById(action).style.display = "block";
    }

    // Draws a line
    function drawline(x1,y1,x2,y2) {
        ctx.moveTo(x1,y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();
    }

    // Draw a circle
    function drawCircle(x1,x2,r) {
        ctx.beginPath();
        ctx.arc(x1, x2, r, 0, 2 * Math.PI);
        ctx.stroke();
    }

    // Clears Canvas
    function clear() {
        ctx.beginPath();
        ctx.clearRect(0, 0, 1000, 800);
    }

    // Initate move sequence
    function move() {
        clear();
        var x = parseInt(document.getElementById("movex").value);
        var y = parseInt(document.getElementById("movey").value);
        drawMove(x,y);
        draw();
    }

    // Calculate move function
    function drawMove(x,y) {
        datafile = datafile.map((item) => {
            if (item[0] === 'L') {
                return ['L',item[1]+x,item[2]+y,item[3]+x,item[4]+y]
            } else {
                return ['C',item[1]+x,item[2]+y,item[3]]
            }
        });
    }

    // Scale Image
    function scale() {
        clear();
        var x = parseFloat(document.getElementById("scalex").value);
        console.log(x);
        datafile = datafile.map((item) => {
            if (item[0] === 'L') {
                return ['L',item[1]*x,item[2]*x,item[3]*x,item[4]*x]
            } else {
                return ['C',item[1]*x,item[2]*x,item[3]*x]
            }
        });
        draw();
    }

    function calcRotateX(x,y,deg) {
        return (x*Math.cos(deg)-(y*Math.sin(deg)))
    }

    function calcRotateY(x,y,deg) {
        return (x*Math.sin(deg)+(y*Math.cos(deg)))
    }

    // Rotate Image
    function rotate() {
        clear();
        var deg = parseFloat(document.getElementById("deg").value);
        datafile = datafile.map((item) => {
            if (item[0] === 'L') {
                return ['L',calcRotateX(item[1],item[2],deg),calcRotateY(item[1],item[2],deg),calcRotateX(item[3],item[4],deg),calcRotateY(item[3],item[4],deg)]
            } else {
                return ['C',calcRotateX(item[1],item[2],deg),calcRotateY(item[1],item[2],deg),item[3]]
            }
        });
        draw();
    }

    // Mirror Image Horizontally
    function mirrorX() {
        clear();
        datafile = datafile.map((item) => {
            if (item[0] === 'L') {
                return ['L',-item[1],item[2],-item[3],item[4]]
            } else {
                return ['C',-item[1],item[2],item[3]]
            }
        });
        drawMove(1000,0);
        draw();
    }

    // Mirror Image Vertically
    function mirrorY() {
        clear();
        datafile = datafile.map((item) => {
            if (item[0] === 'L') {
                return ['L',item[1],-item[2],item[3],-item[4]]
            } else {
                return ['C',item[1],-item[2],item[3]]
            }
        });
        drawMove(0,800);
        draw();
    }

    // Shear Top
    function shearTop(a) {
        clear();
        datafile = datafile.map((item) => {
            if (item[0] === 'L') {
                return ['L',item[1] + (item[2]*a),item[2],item[3]+(item[4]*a),item[4]]
            } else {
                return ['C',item[1] + (item[2]*a),item[2],item[3]]
            }
        });
        draw();
    }

    // Shear Bottom
    function shearBottom(a) {
        clear();
        datafile = datafile.map((item) => {
            if (item[0] === 'L') {
                return ['L',item[1] - (item[2]*a),item[2],item[3]-(item[4]*a),item[4]]
            } else {
                return ['C',item[1] - (item[2]*a),item[2],item[3]]
            }
        });
        draw();
    }

    // Draw the image after manipulation
    function draw() {
        datafile.forEach((item) => {
            if (item[0] === 'L') {
                drawline(item[1],item[2],item[3],item[4])
            } else {
                drawCircle(item[1],item[2],item[3])
            }
        })
    }

    var xMyDown;
    var clickActive = false;
    var topbool = false;

    // On mouse click event on shear
    function myDown(e) {
        if (currentAction === 'shear') {
            clickActive = true;
            if (e.offsetY < 400) {
                topbool = true;
            }
            xMyDown = e.screenX;
        }
    }

    // On mouse drag event on shear
    function myMove(e) {
        if (currentAction === 'shear') {
            if (clickActive) {
                if (topbool) {
                    shearBottom((e.screenX - xMyDown) / 10000);
                } else {
                    shearTop((e.screenX - xMyDown) / 10000);
                }
            }
        }
    }

    // on mouse release event on shear
    function myUp() {
        if (currentAction === 'shear') {
            topbool = false;
            clickActive = false;
        }
    }

    datafile = [
        ['L',400,400,800,400],
        ['L',800,400,700,500],
        ['L',700,500,500,500],
        ['L',500,500,400,400],
        ['L',600,400,600,200],
        ['L',600,200,605,200],
        ['L',605,200,605,400],
        ['L',600,200,500,350],
        ['L',500,350,600,350],
        ['C',500,450,20],
        ['L',480,450,520,450],
        ['L',500,430,500,470],
        ['C',600,450,20],
        ['L',580,450,620,450],
        ['L',600,430,600,470],
        ['C',700,450,20],
        ['L',680,450,720,450],
        ['L',700,430,700,470],
    ];

    draw();
}
