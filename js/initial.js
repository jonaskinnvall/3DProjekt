var init = function(){

      var world, mass, body, shape, timeStep=1/60,
         camera, scene, renderer, geometry, material, mesh, circle, plane;
      initThree();
      initCannon();
      animate();
      function initCannon() {
          world = new CANNON.World();
          world.gravity.set(0,-1,0);
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

		
          var geometry = new THREE.PlaneGeometry( 20, 20, 32 );
			var material = new THREE.MeshBasicMaterial( {color: 0xffff00, side: THREE.DoubleSide} );
			var plane = new THREE.Mesh( geometry, material );
			scene.add( plane );
			
			plane.rotation.x += 3.14/2;
			plane.position.y -= 2;


			var geometry = new THREE.SphereGeometry( 3, 52, 52 );
			var material = new THREE.MeshBasicMaterial( {color: 0xffffff} );
			var sphere = new THREE.Mesh( geometry, material );
			scene.add( sphere );

			sphere.position.x += 5;
			sphere.position.z -= 10;
			sphere.position.y += 2;

			var keys = {};

	$(document).keydown( function(e){

		keys[e.which] = true;

		rotate();

	});

	$(document).keyup( function(e) {
	
		delete keys[e.which];

		rotate();

	});

	

	function rotate(){

		for (var i in keys) {

			if(i == 37)
				mesh.position.y -= 0.1;
			if(i == 38)
				mesh.position.x -= 0.1;
			if(i == 39)
				mesh.position.y += 0.1;
			if(i == 40)
				mesh.position.x += 0.1;
			if(i == 65)
				mesh.position.x -= 0.1;
			if(i == 87)
				mesh.position.z -= 0.1;
			if(i == 68)
				mesh.position.x += 0.1;
			if(i == 83)
				mesh.position.z += 0.1;

		}

	}


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

