uniform vec3 remotePosition;

void main() {
	// defined colors
	float red = 1.0 + sin(remotePosition.y * 0.4);
	float green = 0.0 + sin(remotePosition.y * 0.2);
	float blue = 0.0 + sin(remotePosition.y * 0.8);

	gl_FragColor = vec4(red, green, blue, 1.0);
}