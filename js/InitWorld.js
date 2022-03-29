// WORLD COORDINATE FRAME: other objects are defined with respect to it
var worldFrame = new THREE.AxesHelper(5);
	
function addToScene(obj) {
	obj.parent = worldFrame;
	scene.add(obj);
	return scene;
}

function createWorld(scene) {	
	scene.add(worldFrame);
	
	const light = new THREE.DirectionalLight( 0xffffff, 1);
	light.position.set( 0, 10, 0 );
	light.castShadow = true;
	light.shadow.camera = new THREE.OrthographicCamera( -5, 5, 5, -5, 0.5, 1000 );
	light.shadow.mapSize.width = 2048*1;
	light.shadow.mapSize.height = 2048*1;
	addToScene(light);
	
	const alight = new THREE.AmbientLight( 0x404040 );
	addToScene(alight);
	
	const hlight = new THREE.HemisphereLight( 0xffffbb, 0x080820, 0.5 );
	addToScene(hlight);
	
	// FLOOR 
	var floorTexture = new THREE.TextureLoader().load('images/floor.jpg');
	floorTexture.wrapS = floorTexture.wrapT = THREE.RepeatWrapping;
	floorTexture.repeat.set(1, 1);

	var floorMaterial = new THREE.MeshBasicMaterial({ map: floorTexture, side: THREE.DoubleSide});
	var floorGeometry = new THREE.PlaneBufferGeometry(30, 30);
	var floor = new THREE.Mesh(floorGeometry, floorMaterial);
	floor.receiveShadow = true;
	floor.position.y = -0.1;
	floor.rotation.x = Math.PI / 2;
	addToScene(floor);

	var displayScreenGeometry = new THREE.CylinderGeometry(5, 5, 10, 32);
	var displayMaterial = new THREE.MeshBasicMaterial({color: 0xffff00, transparent: true, opacity: 0.2});
	var displayObject = new THREE.Mesh(displayScreenGeometry,displayMaterial);
	displayObject.position.x = 0;
	displayObject.position.y = 5;
	addToScene(displayObject);
	
	controls.target.y = 4;
	controls.update();
	
	return worldFrame;
}

renderer.setClearColor( 0x87CEEB, 1 ); 
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.shadowMap.enabled = true;

worldFrame = createWorld(scene);
