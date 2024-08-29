var canvas;
var gl;
var points = [];
var maxNumPoints = 2000; // Adjust as needed
var vBuffer;
var program;

window.onload = function init() {
    canvas = document.getElementById("gl-canvas");
    gl = WebGLUtils.setupWebGL(canvas);
    if (!gl) { alert("WebGL isn't available"); }

    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.clearColor(1.0, 1.0, 1.0, 1.0); // White background

    // Load shaders and initialize attribute buffers
    program = initShaders(gl, "vertex-shader", "fragment-shader");
    gl.useProgram(program);

    vBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, 8 * maxNumPoints, gl.DYNAMIC_DRAW);

    var vPosition = gl.getAttribLocation(program, "vPosition");
    gl.vertexAttribPointer(vPosition, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vPosition);

    canvas.addEventListener("mousedown", function(e) {
        var t = vec2(2 * e.offsetX / canvas.width - 1, 2 * (canvas.height - e.offsetY) / canvas.height - 1);
        var randRad = Math.random() * 0.2; // Random radius between 0 and 0.2
        createCirclePoints(t, randRad, 30); // 30 points per circle
        updateBuffer();
    });

    render();
};

function createCirclePoints(cent, rad, k) {
    points = [];
    points.push(cent); // Center of the circle

    var dAngle = 2 * Math.PI / k;
    for (var i = 0; i <= k; i++) {
        var a = i * dAngle;
        var p = vec2(rad * Math.cos(a) + cent[0], rad * Math.sin(a) + cent[1]);
        points.push(p);
    }
}

function updateBuffer() {
    gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(points), gl.STATIC_DRAW);
}

function render() {
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.drawArrays(gl.TRIANGLE_FAN, 0, points.length);
    window.requestAnimFrame(render);
}