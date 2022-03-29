/**
 * UdeM IFT 3355, A21
 * TP 1 Template
 */

// UNIFORMS
var remotePosition0 = {type: 'v3', value: new THREE.Vector3(0,0,5)};
var remotePosition1 = {type: 'v3', value: new THREE.Vector3(0,0,5)};
var remotePosition2 = {type: 'v3', value: new THREE.Vector3(0,0,5)};
var time = {type: 'i', value: 0};

// FFT Texture
const numPoints = 1024;
const audioDataArray = new Uint8Array(numPoints);
const fft = new THREE.DataTexture(audioDataArray, numPoints, 1, THREE.LuminanceFormat, THREE.UnsignedByteType);

// MATERIALS (You might need to add/modify the uniforms that are passed to the shaders.)
// This should be the only code block that you need to modify in TP1.js, the bulk of the code should be in the glsl shaders.
// Uniforms are passed to the shaders here using a dictionary.
var armadilloMaterial = new THREE.ShaderMaterial({
	uniforms: {
		time: time,
		fft: {type: 't', value: fft},
		remotePosition0: remotePosition0,
		remotePosition1: remotePosition1,
		remotePosition2: remotePosition2,
	}
});
var remoteMaterial0 = new THREE.ShaderMaterial({
	uniforms: {
		xoff: {value: -4.0},
		remotePosition: remotePosition0,
	}
});
var remoteMaterial1 = new THREE.ShaderMaterial({
	uniforms: {
		xoff: {value: 0.0},
		remotePosition: remotePosition1,
	}
});
var remoteMaterial2 = new THREE.ShaderMaterial({
	uniforms: {
		xoff: {value: 4.0},
		remotePosition: remotePosition2,
	}
});

// LOAD SHADERS
var shaderFiles = [
  'glsl/armadillo.vs.glsl',
  'glsl/armadillo.fs.glsl',
  'glsl/remote.vs.glsl',
  'glsl/remote.fs.glsl'
];

new THREE.SourceLoader().load(shaderFiles, function(shaders) {
	armadilloMaterial.vertexShader = shaders['glsl/armadillo.vs.glsl'];
	armadilloMaterial.fragmentShader = shaders['glsl/armadillo.fs.glsl'];

	remoteMaterial0.vertexShader = shaders['glsl/remote.vs.glsl'];
	remoteMaterial0.fragmentShader = shaders['glsl/remote.fs.glsl'];
	remoteMaterial1.vertexShader = shaders['glsl/remote.vs.glsl'];
	remoteMaterial1.fragmentShader = shaders['glsl/remote.fs.glsl'];
	remoteMaterial2.vertexShader = shaders['glsl/remote.vs.glsl'];
	remoteMaterial2.fragmentShader = shaders['glsl/remote.fs.glsl'];
  
	//Update state
	remoteMaterial0.needsUpdate = true;
	remoteMaterial1.needsUpdate = true;
	remoteMaterial2.needsUpdate = true;
	armadilloMaterial.needsUpdate = true;
})

// LOAD ARMADILLO
function loadOBJ(file, material, scale, xOff, yOff, zOff, xRot, yRot, zRot) {
  var onProgress = function(query) {
    if ( query.lengthComputable ) {
      var percentComplete = query.loaded / query.total * 100;
      console.log( Math.round(percentComplete, 2) + '% downloaded' );
    }
  };

  var onError = function() {
    console.log('Failed to load ' + file);
  };

  var loader = new THREE.OBJLoader();
  loader.load(file, function(object) {
    object.traverse(function(child) {
      if (child instanceof THREE.Mesh) {
        child.material = material;
      }
    });

    object.position.set(xOff,yOff,zOff);
    object.rotation.x= xRot;
    object.rotation.y = yRot;
    object.rotation.z = zRot;
    object.scale.set(scale,scale,scale);
	addToScene(object);

  }, onProgress, onError);
}

loadOBJ('obj/armadillo.obj', armadilloMaterial, 3, 0, 3, 0, 0, Math.PI, 0);

// CREATE REMOTE CONTROL
var remoteGeometry = new THREE.SphereGeometry(1, 32, 32);
var remote0 = new THREE.Mesh(remoteGeometry, remoteMaterial0);
addToScene(remote0);
var remote1 = new THREE.Mesh(remoteGeometry, remoteMaterial1);
addToScene(remote1);
var remote2 = new THREE.Mesh(remoteGeometry, remoteMaterial2);
addToScene(remote2);

// Clamp values
function clamp(value, min, max) {
	if (value < min) {
		value = min;
	} else if (value > max) {
		value = max;
	}
	return value;
}

// LISTEN TO KEYBOARD
var keyboard = new THREEx.KeyboardState();
var analyser = null;
var audio = null;
var lastpause = 0;
function checkKeyboard() {
	if (keyboard.pressed("Q")) {
		remotePosition0.value.y += 0.1;
	} else if (keyboard.pressed("A")) {
		remotePosition0.value.y -= 0.1;
	} else if (keyboard.pressed("W")) {
		remotePosition1.value.y += 0.1;
	} else if (keyboard.pressed("S")) {
		remotePosition1.value.y -= 0.1;
	} else if (keyboard.pressed("E")) {
		remotePosition2.value.y += 0.1;
	} else if (keyboard.pressed("D")) {
		remotePosition2.value.y -= 0.1;
	}
	
	remotePosition0.value.y = clamp(remotePosition0.value.y, 0, 4);
	remotePosition1.value.y = clamp(remotePosition1.value.y, 0, 4);
	remotePosition2.value.y = clamp(remotePosition2.value.y, 0, 4);
  
	if (keyboard.pressed("P")) {
		if (analyser == null) {
			// make a Web Audio Context
			const context = new AudioContext();
			analyser = context.createAnalyser();
			analyser.fftSize = numPoints * 2;
			
			audio = new Audio();
			audio.loop = true;
			audio.autoplay = true;
			audio.addEventListener('canplay', handleCanplay);
			audio.src = "test.mp3";
			audio.load();

			function handleCanplay() {
				// connect the audio element to the analyser node and the analyser node
				// to the main Web Audio context
				const source = context.createMediaElementSource(audio);
				source.connect(analyser);
				analyser.connect(context.destination);
			}
			
		// Use time preventing holding down the button to pause/unpause too fast.
		} else if ((Date.now() - lastpause) > 200) {
			if (audio.duration > 0 && !audio.paused) {
				audio.pause();
				lastpause = Date.now();
			} else {
				audio.play();
				lastpause = Date.now();
			}
		}
	} else if (keyboard.pressed("M") && analyser == null) {
		
		// make a Web Audio Context
		const context = new AudioContext();
		analyser = context.createAnalyser();
		analyser.fftSize = numPoints * 2;
		
		const handleSuccess = function(stream) {
			// connect the audio element to the analyser node and the analyser node
			// to the main Web Audio context
			const source = context.createMediaStreamSource(stream);
			source.connect(analyser);
			
			//Uncomment this to hear audio from microphone (disabled by default to prevent feedback loop)
			//analyser.connect(context.destination);
		};

		navigator.mediaDevices.getUserMedia({ audio: true, video: false }).then(handleSuccess);
		
		
	}
	
}


// UPDATE SCENE
function updateScene() {
	if (analyser != null) {
		analyser.getByteFrequencyData(audioDataArray);
		fft.needsUpdate = true;
	}
	armadilloMaterial.uniforms[ 'time' ].value = Date.now();
}

// SETUP UPDATE CALL-BACK
function update() {
  checkKeyboard();
  updateScene();
  requestAnimationFrame(update);
  renderer.render(scene, camera);
}

//Update state
update();
