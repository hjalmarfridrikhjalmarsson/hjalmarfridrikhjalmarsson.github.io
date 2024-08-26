// Skilgreinum vec4 fylki af stærð 3 með indexi sem við stillum í js

const vertexShaderSource = `#version 300 es

uniform vec2 uPosition;
uniform float uPointSize;
void main()
{
    gl_PointSize = uPointSize;
    gl_Position = vec4(uPosition, 0.0, 1.0);
}`;

const fragmentShaderSource = `#version 300 es

precision mediump float;
out vec4 fragColor;
uniform float colorIndex;
uniform vec4 colorList[3]; 


void main()
{
    int index = int(colorIndex);
    fragColor = colorList[index];
}`;

const canvas = document.querySelector('canvas');
const gl = canvas.getContext('webgl2');
const program = gl.createProgram();

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

const uPointSizeLoc = gl.getUniformLocation(program, 'uPointSize');
gl.uniform1f(uPointSizeLoc, 100);

const uPositionLoc = gl.getUniformLocation(program, 'uPosition');
gl.uniform2f(uPositionLoc, 0.0, 0.0);

const colorListLoc = gl.getUniformLocation(program, 'colorList');
const indexColorLoc = gl.getUniformLocation(program, 'colorIndex');

gl.uniform1f(indexColorLoc, 2);
gl.uniform4fv(colorListLoc, [1,0,0,1,
                             0,1,0,1,
                             0,0,1,1]);

gl.drawArrays(gl.POINTS, 0, 1);

