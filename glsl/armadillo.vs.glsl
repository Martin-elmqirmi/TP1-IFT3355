// Create shared variable for the vertex and fragment shaders
out vec3 interpolatedNormal;
uniform int time;
uniform sampler2D fft;
uniform vec3 remotePosition0;
uniform vec3 remotePosition1;
uniform vec3 remotePosition2;

void main() {
    // Set shared variable to vertex normal
    interpolatedNormal = normal;
	
	// Get components of sounds from the FFT texture
	float fft_bass = texture(fft, vec2(0.1, 0.0)).x;
	float fft_middle = texture(fft, vec2(0.25, 0.0)).x;
	float fft_treble = texture(fft, vec2(0.5, 0.0)).x;

	mat4 firstPerturbation = mat4(vec4(1.0 + fft_bass * (1.0 + remotePosition0.y), 0.0, 0.0, 0.0),
							 	  vec4(0.0, 1.0 + fft_bass * (1.0 + remotePosition0.y), 0.0, 0.0),
							 	  vec4(0.0, 0.0, 1.0 + fft_bass * (1.0 + remotePosition0.y), 0.0),
							 	  vec4(0.0, 0.0, 0.0, 1.0));

	float secondPerturbationX = 0.5 + fft_middle * 20.0 * (1.0 + remotePosition1.y);
	float thirdPerturbationY = 0.9 + fft_treble * 30.0;
	float thirdPerturbationZ = 0.9 + fft_treble * 30.0 * (1.0 + remotePosition2.y);

	interpolatedNormal *= vec3(secondPerturbationX, thirdPerturbationY, thirdPerturbationZ);

	// HINT: Work with fft and normal here to perturb the armadillo's geometry.
	// You can use time as a seed for pseudo-random number generators.
	// By default, we simply multiply each vertex by the model-view matrix and the projection matrix to get final vertex position
	gl_Position = projectionMatrix * modelViewMatrix * firstPerturbation * vec4(position, 1.0);
}
