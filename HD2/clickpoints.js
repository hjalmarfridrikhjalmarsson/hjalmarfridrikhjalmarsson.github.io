var canvas;
var gl;

var maxNumPoints = 500000;  
var index = 0;
var circles = [];

window.onload = function init() {

    canvas = document.getElementById( "gl-canvas" );
    
    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }
    
    gl.viewport( 0, 0, canvas.width, canvas.height );
    gl.clearColor( 0.95, 1.0, 1.0, 1.0 );

    var program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );
    
    
    var vBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, 8*maxNumPoints, gl.DYNAMIC_DRAW);
    
    var vPosition = gl.getAttribLocation(program, "vPosition");
    gl.vertexAttribPointer(vPosition, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vPosition);
    

    canvas.addEventListener("mousedown", function(e){
        gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);
        
        var t = vec2(2 * e.offsetX / canvas.width - 1, 2 * (canvas.height - e.offsetY) / canvas.height - 1);
        let points = createCirclePoints(t, Math.random() * 0.1, 100);
        
        circles.push(points);
        index += points.length;
        gl.bufferSubData(gl.ARRAY_BUFFER, 8 * (index - points.length), flatten(points));
    });
    render();
}


function render() {
    
    gl.clear( gl.COLOR_BUFFER_BIT );
    var offset = 0;
    for (var i = 0; i < circles.length; i++) {
        gl.drawArrays(gl.TRIANGLE_FAN, offset, circles[i].length);
        offset += circles[i].length;
    }
    window.requestAnimFrame(render);
}

function createCirclePoints( cent, rad, k )
{
    var points = [];
    points.push( cent );
    
    var dAngle = 2*Math.PI/k;
    for( let i=0; i<=k; i++ ) {
    	let a = i*dAngle;
    	var p = vec2( rad*Math.sin(a) + cent[0], rad*Math.cos(a) + cent[1] );
    	points.push(p);
    }
    return points;
}