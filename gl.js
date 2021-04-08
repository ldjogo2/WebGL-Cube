import vertexShaderSrc from './vertex.glsl.js';
import fragmentShaderSrc from './fragment.glsl.js';




// ------------------------------------------ helper functions ----------------------------------------------
function multiplyMatrices(a, b) {

    var result = [];

    var a00 = a[0], a01 = a[1], a02 = a[2], a03 = a[3],
        a10 = a[4], a11 = a[5], a12 = a[6], a13 = a[7],
        a20 = a[8], a21 = a[9], a22 = a[10], a23 = a[11],
        a30 = a[12], a31 = a[13], a32 = a[14], a33 = a[15];

    // Cache only the current line of the second matrix
    var b0 = b[0], b1 = b[1], b2 = b[2], b3 = b[3];
    result[0] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30;
    result[1] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31;
    result[2] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32;
    result[3] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33;

    b0 = b[4]; b1 = b[5]; b2 = b[6]; b3 = b[7];
    result[4] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30;
    result[5] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31;
    result[6] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32;
    result[7] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33;

    b0 = b[8]; b1 = b[9]; b2 = b[10]; b3 = b[11];
    result[8] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30;
    result[9] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31;
    result[10] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32;
    result[11] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33;

    b0 = b[12]; b1 = b[13]; b2 = b[14]; b3 = b[15];
    result[12] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30;
    result[13] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31;
    result[14] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32;
    result[15] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33;

    return result;
}

function invertMatrix(matrix) {
    // Performance note: Try not to allocate memory during a loop. This is done here
    // for the ease of understanding the code samples.
    var result = [];

    var n11 = matrix[0], n12 = matrix[4], n13 = matrix[8], n14 = matrix[12];
    var n21 = matrix[1], n22 = matrix[5], n23 = matrix[9], n24 = matrix[13];
    var n31 = matrix[2], n32 = matrix[6], n33 = matrix[10], n34 = matrix[14];
    var n41 = matrix[3], n42 = matrix[7], n43 = matrix[11], n44 = matrix[15];

    result[0] = n23 * n34 * n42 - n24 * n33 * n42 + n24 * n32 * n43 - n22 * n34 * n43 - n23 * n32 * n44 + n22 * n33 * n44;
    result[4] = n14 * n33 * n42 - n13 * n34 * n42 - n14 * n32 * n43 + n12 * n34 * n43 + n13 * n32 * n44 - n12 * n33 * n44;
    result[8] = n13 * n24 * n42 - n14 * n23 * n42 + n14 * n22 * n43 - n12 * n24 * n43 - n13 * n22 * n44 + n12 * n23 * n44;
    result[12] = n14 * n23 * n32 - n13 * n24 * n32 - n14 * n22 * n33 + n12 * n24 * n33 + n13 * n22 * n34 - n12 * n23 * n34;
    result[1] = n24 * n33 * n41 - n23 * n34 * n41 - n24 * n31 * n43 + n21 * n34 * n43 + n23 * n31 * n44 - n21 * n33 * n44;
    result[5] = n13 * n34 * n41 - n14 * n33 * n41 + n14 * n31 * n43 - n11 * n34 * n43 - n13 * n31 * n44 + n11 * n33 * n44;
    result[9] = n14 * n23 * n41 - n13 * n24 * n41 - n14 * n21 * n43 + n11 * n24 * n43 + n13 * n21 * n44 - n11 * n23 * n44;
    result[13] = n13 * n24 * n31 - n14 * n23 * n31 + n14 * n21 * n33 - n11 * n24 * n33 - n13 * n21 * n34 + n11 * n23 * n34;
    result[2] = n22 * n34 * n41 - n24 * n32 * n41 + n24 * n31 * n42 - n21 * n34 * n42 - n22 * n31 * n44 + n21 * n32 * n44;
    result[6] = n14 * n32 * n41 - n12 * n34 * n41 - n14 * n31 * n42 + n11 * n34 * n42 + n12 * n31 * n44 - n11 * n32 * n44;
    result[10] = n12 * n24 * n41 - n14 * n22 * n41 + n14 * n21 * n42 - n11 * n24 * n42 - n12 * n21 * n44 + n11 * n22 * n44;
    result[14] = n14 * n22 * n31 - n12 * n24 * n31 - n14 * n21 * n32 + n11 * n24 * n32 + n12 * n21 * n34 - n11 * n22 * n34;
    result[3] = n23 * n32 * n41 - n22 * n33 * n41 - n23 * n31 * n42 + n21 * n33 * n42 + n22 * n31 * n43 - n21 * n32 * n43;
    result[7] = n12 * n33 * n41 - n13 * n32 * n41 + n13 * n31 * n42 - n11 * n33 * n42 - n12 * n31 * n43 + n11 * n32 * n43;
    result[11] = n13 * n22 * n41 - n12 * n23 * n41 - n13 * n21 * n42 + n11 * n23 * n42 + n12 * n21 * n43 - n11 * n22 * n43;
    result[15] = n12 * n23 * n31 - n13 * n22 * n31 + n13 * n21 * n32 - n11 * n23 * n32 - n12 * n21 * n33 + n11 * n22 * n33;

    var determinant = n11 * result[0] + n21 * result[4] + n31 * result[8] + n41 * result[12];

    if (determinant === 0) {
        throw new Error("Can't invert matrix, determinant is 0");
    }

    for (var i = 0; i < result.length; i++) {
        result[i] /= determinant;
    }

    return result;
}

function multiplyArrayOfMatrices(matrices) {

    var inputMatrix = matrices[0];

    for (var i = 1; i < matrices.length; i++) {
        inputMatrix = multiplyMatrices(inputMatrix, matrices[i]);
    }

    return inputMatrix;
}


function rotateXMatrix(a) {

    var cos = Math.cos;
    var sin = Math.sin;

    return [
        1, 0, 0, 0,
        0, cos(a), -sin(a), 0,
        0, sin(a), cos(a), 0,
        0, 0, 0, 1
    ];
}

function rotateYMatrix(a) {

    var cos = Math.cos;
    var sin = Math.sin;

    return [
        cos(a), 0, sin(a), 0,
        0, 1, 0, 0,
        -sin(a), 0, cos(a), 0,
        0, 0, 0, 1
    ];
}

function rotateZMatrix(a) {

    var cos = Math.cos;
    var sin = Math.sin;

    return [
        cos(a), -sin(a), 0, 0,
        sin(a), cos(a), 0, 0,
        0, 0, 1, 0,
        0, 0, 0, 1
    ];
}

function translateMatrix(x, y, z) {
    return [
        1, 0, 0, 0,
        0, 1, 0, 0,
        0, 0, 1, 0,
        x, y, z, 1
    ];
}

function scaleMatrix(w, h, d) {
    return [
        w, 0, 0, 0,
        0, h, 0, 0,
        0, 0, d, 0,
        0, 0, 0, 1
    ];
}

function perspectiveMatrix(fieldOfViewInRadians, aspectRatio, near, far) {
    var f = 1.0 / Math.tan(fieldOfViewInRadians / 2);
    var rangeInv = 1 / (near - far);

    return [
        f / aspectRatio, 0, 0, 0,
        0, f, 0, 0,
        0, 0, (near + far) * rangeInv, -1,
        0, 0, near * far * rangeInv * 2, 0
    ];
}

function orthographicMatrix(left, right, bottom, top, near, far) {

    // Each of the parameters represents the plane of the bounding box

    var lr = 1 / (left - right);
    var bt = 1 / (bottom - top);
    var nf = 1 / (near - far);

    var row4col1 = (left + right) * lr;
    var row4col2 = (top + bottom) * bt;
    var row4col3 = (far + near) * nf;

    return [
        -2 * lr, 0, 0, 0,
        0, -2 * bt, 0, 0,
        0, 0, 2 * nf, 0,
        row4col1, row4col2, row4col3, 1
    ];
}


function identityMatrix() {
    return identity = [
        1, 0, 0, 0,
        0, 1, 0, 0,
        0, 0, 1, 0,
        0, 0, 0, 1,
    ];
}
// ------------------------------------------ End of helper functions --------------------------------------------


// ------------------------------------------Start of graphics pipeline ------------------------------------------
var gl;
var program;
var vao;
var modelLoc;
var projLoc;
var viewLoc;
var modelMatrix;
var projMatrix;
var viewMatrix;
var buffers;
var dragging = null;
var anglex = 0;
var angley = 0;

window.mousemove = function (event) {
    var deltax, deltay;

    // console.log(event.clientX, event.clientY, event.which);
    if (dragging) {
        deltax = event.clientX - dragging.clientX;
        deltay = -(event.clientY - dragging.clientY);
        console.log("moved: " + deltax + " " + deltay);

        anglex += deltay;
        angley -= deltax;

        dragging = event;
        event.preventDefault();
    }
};

self.mousedown = function (event) {
    console.log(event.clientX, event.clientY);
    dragging = event;
    event.preventDefault();
};

self.mouseup = function(event) {
    dragging = null;
}

function createCube() {

    var positions = [
        // Front face
        -1.0, -1.0, 1.0,
        1.0, -1.0, 1.0,
        1.0, 1.0, 1.0,
        -1.0, 1.0, 1.0,

        // Back face
        -1.0, -1.0, -1.0,
        -1.0, 1.0, -1.0,
        1.0, 1.0, -1.0,
        1.0, -1.0, -1.0,

        // Top face
        -1.0, 1.0, -1.0,
        -1.0, 1.0, 1.0,
        1.0, 1.0, 1.0,
        1.0, 1.0, -1.0,

        // Bottom face
        -1.0, -1.0, -1.0,
        1.0, -1.0, -1.0,
        1.0, -1.0, 1.0,
        -1.0, -1.0, 1.0,

        // Right face
        1.0, -1.0, -1.0,
        1.0, 1.0, -1.0,
        1.0, 1.0, 1.0,
        1.0, -1.0, 1.0,

        // Left face
        -1.0, -1.0, -1.0,
        -1.0, -1.0, 1.0,
        -1.0, 1.0, 1.0,
        -1.0, 1.0, -1.0
    ];

    // added 
    var colorsOfFaces = [
        [0.3, 1.0, 1.0, 1.0],    // Front face: cyan
        [1.0, 0.3, 0.3, 1.0],    // Back face: red
        [0.3, 1.0, 0.3, 1.0],    // Top face: green
        [0.3, 0.3, 1.0, 1.0],    // Bottom face: blue
        [1.0, 1.0, 0.3, 1.0],    // Right face: yellow
        [1.0, 0.3, 1.0, 1.0]     // Left face: purple
    ];

    var colors = [];

    for (var j = 0; j < 6; j++) {
        var polygonColor = colorsOfFaces[j];

        // for every vertex we need to get the color specifying it according to it's face
        for (var i = 0; i < 4; i++) {
            colors = colors.concat(polygonColor);
        }
    }

    

    var elements = [
        0, 1, 2, 0, 2, 3,    // front
        4, 5, 6, 4, 6, 7,    // back
        8, 9, 10, 8, 10, 11,   // top
        12, 13, 14, 12, 14, 15,   // bottom
        16, 17, 18, 16, 18, 19,   // right
        20, 21, 22, 20, 22, 23    // left
    ];

    return {
        positions: positions,
        colors: colors,
        elements: elements
    }
}

function updateModelMatrix() {
    var scale = scaleMatrix(0.5, 0.5, 0.5);

    // Rotate a slight tilt
    var rotateX = rotateXMatrix(0.01*anglex + 45.0 * Math.PI / 180.0);

    // Rotate according to time
    var rotateY = rotateYMatrix(0.01*angley + -45.0 * Math.PI / 180.0);

    // Move slightly down
    var position = translateMatrix(0, 0, -50);

    // Multiply together, make sure and read them in opposite order
    modelMatrix = multiplyArrayOfMatrices([
        position, // step 4
        rotateY,  // step 3
        rotateX,  // step 2
        scale     // step 1
    ]);
}

function updateProjectionMatrix() {
    var aspect = window.innerWidth / window.innerHeight;
    projMatrix = perspectiveMatrix(45.0 * Math.PI / 180.0, aspect, 1, 500);
    // projMatrix = orthographicMatrix(-aspect, aspect, -1, 1, 0, 500);
}

function updateViewMatrix() {
    var now = Date.now();
    var moveInAndOut = 5 - 50.0 * (Math.sin(now * 0.002) + 1.0) / 2.0;

    var position = translateMatrix(0, 0, moveInAndOut);
    var world2view = multiplyArrayOfMatrices([
        position
    ]);

    viewMatrix = invertMatrix(world2view);

}

function createShader(type, source) {
    var shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        var info = gl.getShaderInfoLog(shader);
        console.log('Could not compile WebGL program:' + info);
    }

    return shader;
}

function createProgram(vertexShader, fragmentShader) {
    var program = gl.createProgram();

    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        var info = gl.getProgramInfoLog(program);
        console.log('Could not compile WebGL program:' + info);
    }

    return program;
}

function createBuffers(triangles) {
    var posBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, posBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(triangles['positions']), gl.STATIC_DRAW);

    var colorBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(triangles['colors']), gl.STATIC_DRAW);

    var elemBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, elemBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(triangles['elements']), gl.STATIC_DRAW);

    return { 'positions': posBuffer, 'colors': colorBuffer, 'elements': elemBuffer };
}

function createVAO(posAttribLoc, colorAttribLoc, buffers) {

    var vao = gl.createVertexArray();

    gl.bindVertexArray(vao);
    gl.enableVertexAttribArray(posAttribLoc);
    var size = 3; // number of components per attribute
    var type = gl.FLOAT;
    gl.bindBuffer(gl.ARRAY_BUFFER, buffers['positions']);
    gl.vertexAttribPointer(posAttribLoc, size, type, false, 0, 0);

    gl.enableVertexAttribArray(colorAttribLoc);
    size = 4;
    type = gl.FLOAT;
    gl.bindBuffer(gl.ARRAY_BUFFER, buffers['colors']);
    gl.vertexAttribPointer(colorAttribLoc, size, type, false, 0, 0);

    return vao;
}

function draw(timestamp) {

    gl.clearColor(1, 1, 1, 1);
    gl.clear(gl.COLOR_BUFFER_BIT);

    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

    gl.useProgram(program);

    updateModelMatrix();
    updateProjectionMatrix();
    updateViewMatrix();    
    gl.uniformMatrix4fv(modelLoc, false, new Float32Array(modelMatrix));
    gl.uniformMatrix4fv(projLoc, false, new Float32Array(projMatrix));
    gl.uniformMatrix4fv(viewLoc, false, new Float32Array(viewMatrix));

    gl.bindVertexArray(vao);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffers.elements);
    gl.drawElements(gl.TRIANGLES, 36, gl.UNSIGNED_SHORT, 0);

    // color1-=1;
    // if (color1 <= 0) {
    //     color1 = 255;
    // }
    // color2-=2;
    // if (color2 <= 0) {
    //     color2 = 255;
    // }
    // color3-=3;
    // if (color3 <= 0) {
    //     color3 = 255;
    // }

    requestAnimationFrame(draw);
}


function initialize() {
    var canvas = document.querySelector("#glcanvas");
    canvas.width = canvas.clientWidth;
    canvas.height = canvas.clientHeight;

    gl = canvas.getContext("webgl2");

    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

    gl.enable(gl.CULL_FACE);
    gl.cullFace(gl.BACK);

    var triangles = createCube();

    var vertexShader = createShader(gl.VERTEX_SHADER, vertexShaderSrc);
    var fragmentShader = createShader(gl.FRAGMENT_SHADER, fragmentShaderSrc);
    program = createProgram(vertexShader, fragmentShader);

    var posAttribLoc = gl.getAttribLocation(program, "position");
    var colorAttribLoc = gl.getAttribLocation(program, "color");
    modelLoc = gl.getUniformLocation(program, 'uModel');
    projLoc = gl.getUniformLocation(program, 'uProj');
    viewLoc = gl.getUniformLocation(program, 'uView');

    buffers = createBuffers(triangles);
    vao = createVAO(posAttribLoc, colorAttribLoc, buffers);

    window.requestAnimationFrame(draw);
}

window.onload = initialize;
