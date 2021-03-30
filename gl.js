var gl;

var modelMatrix;
var projectionMatrix;
var viewMatrix;


var color1 = 255;
var color2 = 255;
var color3 = 255;
var plus = false;

function draw() {

    gl.clearColor(color1/255, color2/255, color3/255, 1);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

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

/*
    Initialize everything
*/
function initialize() {

    var canvas = document.querySelector("#glcanvas");
    canvas.width = canvas.clientWidth;
    canvas.height = canvas.clientHeight;

    gl = canvas.getContext("webgl2");

    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

    gl.enable(gl.CULL_FACE);
    gl.cullFace(gl.BACK);

    gl.enable(gl.DEPTH_TEST);
    gl.depthFunc(gl.LESS);

    window.requestAnimationFrame(draw);

}


window.onload = initialize;