// The uniform variable is set up in the javascript code and the same for all vertices
uniform vec3 remotePosition;
uniform float xoff;

void main() {
	/* HINT: WORK WITH remotePosition HERE! */

    // Multiply each vertex by the model-view matrix and the projection matrix to get final vertex position
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position + remotePosition + vec3(xoff, 0, 0), 1.0);
}
