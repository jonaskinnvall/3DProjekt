var init = function(){

      var world, mass, body, shape, timeStep=1/60,
         camera, scene, renderer, geometry, material, mesh;
      initThree();
      initCannon();
      animate();
      function initCannon() {
          world = new CANNON.World();
          world.gravity.set(0,0,0);
          world.broadphase = new CANNON.NaiveBroadphase();
          world.solver.iterations = 10;
          shape = new CANNON.Box(new CANNON.Vec3(1,1,1));
          mass = 1;
          body = new CANNON.Body({
            mass: 1
          });
        //  // Generate some height data (y-values).
        // 	var data = [];
        // 	for(var i = 0; i < 100; i++){
        //     	var y = 0.5 * Math.cos(0.2 * i);
        //     	data.push(y);
        // 	}
        
        // // Create the heightfield shape
        // var heightfieldShape = new CANNON.Heightfield(data, {
        //     elementSize: 1 // Distance between the data points in X and Y directions
        // });
        // var heightfieldBody = new CANNON.Body();
        // heightfieldBody.addShape(heightfieldShape);
        // world.addBody(heightfieldBody);

          body.addShape(shape);
          body.angularVelocity.set(0,5,0);
          body.angularDamping = 0.0;
          world.add(body);



      }
      function initThree() {
          scene = new THREE.Scene();
          camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 1, 100 );
          camera.position.z = 5;
          scene.add( camera );
          geometry = new THREE.BoxGeometry( 2, 2, 2 );
          material = new THREE.MeshPhongMaterial( { color: 0xdddddd, specular: 0x009900, shininess: 30, shading: THREE.FlatShading } );
          mesh = new THREE.Mesh( geometry, material );
          scene.add( mesh );
          	// RENDERER
			if ( Detector.webgl )
				renderer = new THREE.WebGLRenderer( {antialias:true} );
			else
				renderer = new THREE.CanvasRenderer(); 
          renderer.setSize( window.innerWidth, window.innerHeight );
          document.body.appendChild( renderer.domElement );
          //LIGHT
          var light = new THREE.AmbientLight( 0x404040 ); // soft white light
			scene.add( light );
      }
      function animate() {
          requestAnimationFrame( animate );
          updatePhysics();
          render();
      }
      function updatePhysics() {
          // Step the physics world
          world.step(timeStep);
          // Copy coordinates from Cannon.js to Three.js
          mesh.position.copy(body.position);
          mesh.quaternion.copy(body.quaternion);
      }
      function render() {
          renderer.render( scene, camera );
      }
}

