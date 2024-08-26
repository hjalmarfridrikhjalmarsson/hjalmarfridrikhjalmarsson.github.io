var gl;
var points;
var program

window.onload = function init()
{
    var canvas = document.getElementById( "gl-canvas" );
    
    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }
    

    //  Configure WebGL

    gl.viewport( 0, 0, canvas.width, canvas.height );
    gl.clearColor( 0.8, 1.0, 1.0, 1.0 );
    
    //  Load shaders and initialize attribute buffers
    
    program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram(program);
    
    
    var vertices = [
        -0.1, -0.1,
         0.1, -0.1,
         0.0, 0.1
    ];

    // Load the data into the GPU
    
    var bufferId = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, bufferId );
    gl.bufferData( gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW );

    // Associate shader variables with our data buffer
    var vPosition = gl.getAttribLocation( program, "vPosition" );
    gl.vertexAttribPointer( vPosition, 2, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPosition );

    render(10);
};

function render(x) {
    gl.clear(gl.COLOR_BUFFER_BIT);
    var transVector = gl.getUniformLocation(program, "transVector");
    for (var i = 0; i < x; i++) {
        var tx = Math.random() * 2 - 1;
        ty = Math.random() * 2 - 1;
        gl.uniform2f(transVector, tx, ty);
        gl.drawArrays(gl.TRIANGLES, 0, 3);
    }
}
