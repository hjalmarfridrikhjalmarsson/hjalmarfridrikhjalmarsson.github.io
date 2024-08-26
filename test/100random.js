var gl;
var points;

window.onload = function init()
{
    var canvas = document.getElementById( "gl-canvas" );
    
    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }
    

    //  Configure WebGL

    gl.viewport( 0, 0, canvas.width, canvas.height );
    gl.clearColor( 0.95, 1.0, 1.0, 1.0 );
    
    //  Load shaders and initialize attribute buffers
    
    var program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );
    
    
    var vertices = randtri(5);

    // Load the data into the GPU
    
    var bufferId = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, bufferId );
    gl.bufferData( gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW );

    // Associate shader variables with our data buffer
    var vPosition = gl.getAttribLocation( program, "vPosition" );
    gl.vertexAttribPointer( vPosition, 2, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPosition );

    render(vertices.length);
};

function randtri(x) {
    vertices = [];

    for(i = 0; i < x; i++) {
        let x1 = Math.random() * 2 -1;
        let x2 = Math.random() * 2 -1;
        let y1 = Math.random() * 2 -1;
        let y2 = Math.random() * 2 -1;
        let x3 = Math.random() * 2 -1;
        let y3 = Math.random() * 2 -1;
        vertices.push(x1,y2,x2,y2,x3,y3);
    }
    return vertices

}


function render(x) {
    gl.clear( gl.COLOR_BUFFER_BIT );
    gl.drawArrays( gl.TRIANGLES, 0, x );
}
