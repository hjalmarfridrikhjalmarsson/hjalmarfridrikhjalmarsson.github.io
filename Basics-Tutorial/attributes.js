/*
Attribute senda hnutadata frá js til gpu. Hér sendum við lit frá hnuta yfir í buta
Notum buffer til að geyma hnutaupplýsingar(staðsetning,pointsize,color her)
búum til buffer,bindum og loadum inn í með bufferdata
Lýsum svo gögnum fyrir GPU með vertexAttribPointer (fyrst gera enableVertexArray) 
fyrir attributes og teiknum svo

vertex attrib (location, count, datatype, normalized, stride, offset)
count og datatype: fjoldi gagna og gagnategund
normalized: true/false. Finnur ut hvar tala er normalized. t.d rgb(185,177,239) er vec3(0.723,0.691,0.934) ef normalized = true
stride: fjoldi byte i hverjum chun
offset: hversu morg byte þarf að skippa til að komast í okkar gogn

Uniforms: Notum fyrir hluti sem breytast sjaldan
Attributes: Ætlað fyrir hluti sem breytast oft
Ekki heilagt hvað skal velja en best er að gera það sem er hraðast
*/

const vertexShaderSource = `#version 300 es

in vec2 aPos;
in vec3 aColor;
out vec3 vColor;

void main()
{
    vColor = aColor;
    gl_Position = vec4(aPos, 0.0, 1.0);
}`;

// þurfum að setja precision í bútalitara fyrir breytur af float tögum
// nota mediump(medium precision) til að byrja með, hægt að breyta seinna
const fragmentShaderSource = `#version 300 es

precision mediump float;
in vec3 vColor;
out vec4 fragColor;

void main()
{
    fragColor = vec4(vColor, 1.0);
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

const bufferData = new Float32Array([
    0,0.5,          1,0,0,
    0.5,-0.5,     0,1,0,
    -0.5,-0.5,      0,0,1,
])


//Setjum attribute location
const aPosLoc = 0;
const aColorLoc = 1;

//Tengja attributes vid js
gl.enableVertexAttribArray(aPosLoc);
gl.enableVertexAttribArray(aColorLoc);


const buffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
gl.bufferData(gl.ARRAY_BUFFER, bufferData, gl.STATIC_DRAW);

//vertexAttribPointer lýsir gögnum
//Her er haegt ad setja 0 i stad aPosLoc t.d
gl.vertexAttribPointer(aPosLoc, 2, gl.FLOAT, false, 5*4, 0);
gl.vertexAttribPointer(aColorLoc, 3, gl.FLOAT, false, 5*4, 2*4);


gl.clearColor(0, 0, 0, 1); // RGBA values (1.0 means full white, 0.0 means full black)
        
// Clear the canvas with the clear color
gl.clear(gl.COLOR_BUFFER_BIT);

gl.drawArrays(gl.TRIANGLES, 0, 3);


// So far. 