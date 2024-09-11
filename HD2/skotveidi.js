var canvas;
var gl;

var vertex = [];
var mouseX;
var movement = false;
var program;
var shot = null;  


var birds = [];
var bird = [
    vec2(-0.05, 0.05),
    vec2(0.05, 0.05),
    vec2(-0.05, -0.05),
    vec2(0.05, 0.05),
    vec2(-0.05, -0.05),
    vec2(0.05, -0.05),
];

var birdColor = vec4(1.0, 1.0, 1.0, 1.0);

var shotColor = vec4(1, 0, 0, 1.0);
var shots = [
    vec2(-0.005, 0),    
    vec2(0.005, 0),    
    vec2(-0.005, -0.05), 
    vec2(0.005, 0),     
    vec2(0.005, -0.05),  
    vec2(-0.005, -0.05)  
];

var gun = [
    vec2(-0.2, -0.85),
    vec2(-0.4, -0.85),
    vec2(-0.3, -0.7)
];
var gunColor = vec4(0, 0, 0, 1.0);

var sky = [
    vec2(-1, 1),
    vec2(-1, -0.5),
    vec2(1, -0.5),
    vec2(-1, 1),
    vec2(1, -0.5),
    vec2(1, 1)
];
var skyColor = vec4(0, 0.8, 1, 1.0);

var grass = [
    vec2(-1, -0.5),
    vec2(-1, -1),
    vec2(1, -1),
    vec2(-1, -0.5),
    vec2(1, -1),
    vec2(1, -0.5)
];
var grassColor = vec4(0, 1, 0.5, 1.0);

window.onload = function init() {
    canvas = document.getElementById("gl-canvas");

    gl = WebGLUtils.setupWebGL(canvas);
    if (!gl) { alert("WebGL isn't available"); }

    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.clearColor(0.8, 0.8, 0.8, 1.0);

    program = initShaders(gl, "vertex-shader", "fragment-shader");
    gl.useProgram(program);

    canvas.addEventListener("mousemove", function (e) {
        if (movement) {
            var xmove = 2 * (e.offsetX - mouseX) / canvas.width;
            mouseX = e.offsetX;
            for (i = 0; i < 3; i++) {
                gun[i][0] += xmove;
            }
        }
    });

    canvas.addEventListener("mousedown", function (e) {
        movement = true;
        mouseX = e.offsetX;
    });

    canvas.addEventListener("mouseup", function (e) {
        movement = false;
    });

    window.addEventListener("keydown", function(event) {
        if (event.code === "Space" && !shot) {
            shot = vec2(gun[2][0], gun[2][1]);
        }
    });

    render();
};

function render() {
    gl.clear(gl.COLOR_BUFFER_BIT);
    updateEntities();
    drawPointsToBuffer();
    gl.drawArrays(gl.TRIANGLES, 0, vertex.length);
    window.requestAnimFrame(render);
}

function drawPointsToBuffer() {
    vertex = [];
    var colors = [];

    for (var i = 0; i < sky.length; i++) {
        vertex.push(sky[i]);
        colors.push(skyColor);
    }

    for (var i = 0; i < grass.length; i++) {
        vertex.push(grass[i]);
        colors.push(grassColor);
    }

    if (shot) {
        for (var j = 0; j < shots.length; j++) {
            vertex.push(vec2(shot[0] + shots[j][0], shot[1] + shots[j][1]));
            colors.push(shotColor);
        }
    }

    for (var i = 0; i < birds.length; i++) {
        for (var j = 0; j < bird.length; j++) {
            vertex.push(vec2(birds[i][0] + bird[j][0], birds[i][1] + bird[j][1]));
            colors.push(birdColor);
        }
    }

    for (var i = 0; i < gun.length; i++) {
        vertex.push(gun[i]);
        colors.push(gunColor);
    }

    var positionBufferId = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBufferId);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(vertex), gl.DYNAMIC_DRAW);

    var vPosition = gl.getAttribLocation(program, "vPosition");
    gl.vertexAttribPointer(vPosition, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vPosition);

    var colorBufferId = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, colorBufferId);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(colors), gl.DYNAMIC_DRAW);

    var vColor = gl.getAttribLocation(program, "vColor");
    gl.vertexAttribPointer(vColor, 4, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vColor);
}

function updateEntities() {
    if (shot) {
        shot[1] += 0.01;
        if (shot[1] >= 1.1) {
            shot = null; 
        }
    }

    if (birds.length < 3 && Math.random() < 0.5) {
        let birdX = (Math.random() > 0.5) ? -1.05 : 1.05;
        var birdY = Math.random() * 0.7;
        var birdSpeed = (Math.random() * 0.005) + 0.001;
        birds.push(vec3(birdX, birdY, birdSpeed * (birdX < 0 ? 1 : -1)));
    }

    for (var i = birds.length - 1; i >= 0; i--) {
        birds[i][0] += birds[i][2];
        if (birds[i][0] < -1.15 || birds[i][0] > 1.15) {
            birds.splice(i, 1);
        }
    }

    if (shot) {
        for (var i = birds.length - 1; i >= 0; i--) {
            var dx = Math.abs(shot[0] - birds[i][0]);
            var dy = Math.abs(shot[1] - birds[i][1]);

            if (dx <= 0.07 && dy <= 0.1) {
                birds.splice(i, 1); 
                shot = null;       
                break;
            }
        }
    }
}
