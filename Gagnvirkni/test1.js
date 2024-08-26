/** @type {WebGLRenderingContext} */
var gl;

window.onload = function init()
{
    var canvas = document.getElementById( "gl-canvas" );

    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }

    var vertices = new Float32Array([
        -1, -1,
         0,  1,
         1, -1,
    ]);

    
    // Configure WebGL
    gl.viewport( 0, 0, canvas.width, canvas.height );
    gl.clearColor( 0.95, 1.0, 1.0, 1.0 );

    // Load shaders and initialize attribute buffers
    var program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );

    // Load the data into the GPU
    var pbuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, pbuffer );
    gl.bufferData( gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW );

    // Associate shader variables with our data buffer
    var vPosition = gl.getAttribLocation( program, "vPosition" );
    gl.vertexAttribPointer( vPosition, 2, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPosition );

    // Set the uniform color
    var uColor = gl.getUniformLocation(program, "color");
    x1 = Math.random()*2-1;
    x2 = Math.random()*2-1;
    x3 = Math.random()*2-1;
    gl.uniform3f(uColor, x1, x2, x3);
  

    // Call the render function
    render();
};

function render() {
    gl.clear( gl.COLOR_BUFFER_BIT );
    gl.drawArrays( gl.TRIANGLES, 0, 3 );
}
