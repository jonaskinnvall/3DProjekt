var init = function(){

      var world, mass, boxBody, boxShape, planeShape, planeBody, timeStep=1/60,
         camera, light, scene, renderer, skyboxGeo, skyboxMat, skyboxMesh, plane, 
         planeGeo, planeMat, physicsMaterial, axes, texture,
         mouseX = 0, mouseY = 0,
         windowHalfX = window.innerWidth / 2, windowHalfY = window.innerHeight / 2;

            texture = THREE.ImageUtils.loadTexture("http://s3.postimg.org/gz4fv8q9v/mountains.jpg "); //http://s3.postimg.org/gz4fv8q9v/mountains.jpg
            texture.minFilter = THREE.NearestFilter;   

      initCannon();
      initThree();
      animate();

      function initCannon() {
          world = new CANNON.World();
          world.gravity.set(0,0,0);
          world.broadphase = new CANNON.NaiveBroadphase();
          world.solver.iterations = 10;
          
          world.defaultContactMaterial.contactEquationStiffness = 1e9;
          world.defaultContactMaterial.contactEquationRelaxation = 4;
          // //PHYSICS MATERIAL
          // physicsMaterial = CANNON.Material("slipperyMaterial");
          // var physicsContactMAterial = new CANNON.ContactMaterial(physicsMaterial, physicsMaterial, 2.0,  //friction
          //                                                                                           0.5   //restitution
          //                                                                                         );
          // world.addContactMaterial(physicsContactMaterial);
          //BOX
          boxShape = new CANNON.Box(new CANNON.Vec3(0,0,0));
          mass = 1;
          boxBody = new CANNON.Body({
            mass: 1
          });
          boxBody.addShape(boxShape);
          boxBody.angularVelocity.set(0,5,0);
          world.add(boxBody);
          //PLANE
          planeShape = new CANNON.Plane(new CANNON.Vec3(0, 0, 0));
          planeBody = new CANNON.Body({
            mass: 0
          });
          planeBody.addShape(planeShape);
          planeBody.quaternion.setFromAxisAngle(new CANNON.Vec3(1,0,0),-Math.PI/2);
          world.add(planeBody);

      }

      function initThree() {
          //SCENE
          scene = new THREE.Scene();
          // scene.fog = new THREE.Fog( 0x404040, -100, 200 );
          
          //CAMERA
          camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 2000 );
          camera.position.y = 15;
          camera.position.z = 50;
          camera.lookAt(scene.position);
          scene.add( camera );

          //AXES
          axes = new THREE.AxisHelper(40);
          scene.add( axes );

          //BOX
          geometry = new THREE.BoxGeometry( 2, 2, 2 );
          material = new THREE.MeshBasicMaterial( { 
            color: 0x00dddd, specular: 0x009900, shininess: 30, shading: THREE.FlatShading 
            // map: THREE.ImageUtils.loadTexture( '../images/mountain.jpg' )
          } );
          mesh = new THREE.Mesh( geometry, material );
          scene.add( mesh );

          //PLANE
          planeGeo = new THREE.PlaneBufferGeometry( 50, 50, 50 );
          planeGeo.applyMatrix( new THREE.Matrix4().makeRotationX( - Math.PI / 2 ) );
          planeMat = new THREE.MeshBasicMaterial( {color: 0x00ff00, side: THREE.DoubleSide} );
          plane = new THREE.Mesh( planeGeo, planeMat );
          plane.position.y = -1.01;
          scene.add( plane );

          //SKYBOX
            skyGeometry = new THREE.BoxGeometry( 500, 500, 500);
            skyMaterial = new THREE.MeshBasicMaterial( {
              // color: 0x1005ff,
              map: texture,
              side: THREE.BackSide
              } );
            skyboxMesh = new THREE.Mesh( skyGeometry, skyMaterial );
            scene.add( skyboxMesh );
          
          //LIGHT
          light = new THREE.AmbientLight( 0x404040 ); // soft white light
			    scene.add( light );

          spotLight = new THREE.SpotLight( 0xffffff );
                spotLight.position.set( 10, 30, 20 );
                spotLight.target.position.set( 0, 0, 0 );
                if(true){
                    spotLight.castShadow = true;

                    spotLight.shadowCameraNear = 20;
                    spotLight.shadowCameraFar = 50;//camera.far;
                    spotLight.shadowCameraFov = 40;

                    spotLight.shadowMapBias = 0.1;
                    spotLight.shadowMapDarkness = 0.7;
                    spotLight.shadowMapWidth = 2*512;
                    spotLight.shadowMapHeight = 2*512;

                    //spotLight.shadowCameraVisible = true;
                }
                scene.add( spotLight );

            // RENDERER
            if ( Detector.webgl )
            renderer = new THREE.WebGLRenderer( {antialias:true} );
            else
            renderer = new THREE.CanvasRenderer(); 
            renderer.setSize( window.innerWidth, window.innerHeight );
            document.body.appendChild( renderer.domElement );
            document.addEventListener( 'mousemove', onDocumentMouseMove, false );
            }


      function onDocumentMouseMove( event ) {
          mouseX = ( event.clientX - windowHalfX ) / 2;
          mouseY = ( event.clientY - windowHalfY ) / 2;
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
          mesh.position.copy(boxBody.position);
          mesh.quaternion.copy(boxBody.quaternion);
      }
      
      function render() {
          camera.position.x += ( mouseY - camera.position.x ) * .05;
          camera.position.y += ( mouseX - camera.position.y ) * .05;
          camera.lookAt( scene.position );
          renderer.render( scene, camera );
      }
}

