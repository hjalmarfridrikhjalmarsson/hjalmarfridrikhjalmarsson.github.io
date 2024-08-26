//Uniform breytur eru global breytur skilgreindar í liturum og gildi gefid i js
//Ekki hægt að breyta gildum í draw kalli, attribute stundum betra val (100 hluti med olikum lit)
//Buta og Hnuta geta deilt uniform breytu
//Notum uniforms og attributes til ad tengja js(cpu) vid webgl forrit (gpu)
//getUniformLocation: notum einu sinni til að
//getAttribLocation

const vertexShaderSource = `#version 300 es

uniform float uPointSize;
uniform vec2 uPosition;

void main()
{
    gl_PointSize = uPointSize;
    gl_Position = vec4(uPosition, 0.0, 1.0);
}`;

// þurfum að setja precision í bútalitara fyrir breytur af float tögum
// nota mediump(medium precision) til að byrja með, hægt að breyta seinna
const fragmentShaderSource = `#version 300 es

precision mediump float;

out vec4 fragColor;

void main()
{
    fragColor = vec4(1.0, 0.0, 0.0, 1.0);
}`;

/** @type {HTMLCanvasElement} */
const canvas = document.querySelector('canvas');
/** @type {WebGLRenderingContext} */
const gl = canvas.getContext('webgl');
const program = gl.createProgram();

const buffer = gl.createBuffer();

const vertexShader = gl.createShader(gl.VERTEX_SHADER);
gl.shaderSource(vertexShader, vertexShaderSource);
gl.compileShader(vertexShader);
gl.attachShader(program, vertexShader);

const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
gl.shaderSource(fragmentShader, fragmentShaderSource);
gl.compileShader(fragmentShader);
gl.attachShader(program, fragmentShader);

gl.linkProgram(program);

if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    console.log(gl.getShaderInfoLog(vertexShader));
    console.log(gl.getShaderInfoLog(fragmentShader));
}

gl.useProgram(program);


const uPositionLoc = gl.getUniformLocation(program, 'uPosition');
const uPointSizeLoc = gl.getUniformLocation(program, 'uPointSize');

gl.uniform1f(uPointSizeLoc, 100);
gl.uniform2f(uPositionLoc, -1, -1);

gl.drawArrays(gl.POINTS, 0, 1);

gl.uniform1f(uPointSizeLoc, 100);
gl.uniform2f(uPositionLoc, 1, 1);

gl.drawArrays(gl.POINTS, 0, 1);