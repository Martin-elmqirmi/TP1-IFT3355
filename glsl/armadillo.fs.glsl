// Create shared variable. The value is given as the interpolation between normals computed in the vertex shader
in vec3 interpolatedNormal;

/* HINT: YOU WILL NEED A DIFFERENT SHARED VARIABLE TO COLOR ACCORDING TO POSITION OF REMOTE */

void main() {
  // Set final rendered color according to the surface normal
  gl_FragColor = vec4(normalize(interpolatedNormal), 1.0);
}
