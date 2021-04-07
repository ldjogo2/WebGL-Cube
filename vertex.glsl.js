export default `#version 300 es

uniform mat4 uModel;
uniform mat4 uProj;
uniform mat4 uView;

in vec3 position;
in vec4 color;

out vec4 vColor;

void main() {
  vColor = color;
  gl_Position = uProj * uView * uModel * vec4(position, 1);
}
`;