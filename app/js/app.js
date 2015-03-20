/**
 * @author mrdoob / http://mrdoob.com/
 */

var APP = {

	Player: function () {

		var scope = this;

		var loader = new THREE.ObjectLoader();
		var camera, scene, renderer,texture_placeholder,pic,
			isUserInteracting = false,
			onMouseDownMouseX = 0, onMouseDownMouseY = 0,
			lon = 90, onMouseDownLon = 0,
			lat = 0, onMouseDownLat = 0,
			phi = 0, theta = 0,
			target = new THREE.Vector3();
		pic={};
		var vr, controls;
		var raycaster = new THREE.Raycaster();
		var mouse = new THREE.Vector2();
		var events = {};

		this.dom = undefined;

		this.width = 500;
		this.height = 500;

		texture_placeholder = document.createElement( 'canvas' );
				texture_placeholder.width = 1024;
				texture_placeholder.height = 1024;
				
				var context = texture_placeholder.getContext( '2d' );
				context.fillStyle = 'rgb( 200, 200, 200 )';
				context.fillRect( 0, 0, texture_placeholder.width, texture_placeholder.height );

		function loadTexture( path ) {

				var texture = new THREE.Texture( texture_placeholder );
				var material = new THREE.MeshBasicMaterial( { map: texture, overdraw: 1.5 } );

				var image = new Image();
				image.onload = function () {

					texture.image = this;
					texture.needsUpdate = true;

				};
				image.src = path;

				return material;

			}
		this.reload = function(json){
			for(var texture in json){
				pic[texture]= loadTexture(json[texture])
			}
		}		
		this.load = function ( json ) {

			vr = json.project.vr;

			renderer = new THREE.CanvasRenderer( { antialias: true } );
			renderer.setClearColor( 0x000000 );
			renderer.setPixelRatio( window.devicePixelRatio );
			this.dom = renderer.domElement;

			this.setScene( loader.parse( json.scene ) );
			this.setCamera( loader.parse( json.camera ) );

			events = {
				keydown: [],
				keyup: [],
				mousedown: [
				function(event){	
					event.stopPropagation();
					event.preventDefault();
	
					mouse.x = ( event.clientX / renderer.domElement.width ) * 2 - 1;
					mouse.y = - ( event.clientY / renderer.domElement.height ) * 2 + 1;
	
					raycaster.setFromCamera( mouse, camera );
	
					var intersects = raycaster.intersectObjects( scene.children );
					debugger;
					if ( intersects.length > 0 ) {
						console.log(intersects[ 0 ].point);
					}
			
				}
				],
				mouseup: [],
				mousemove: [],
				touchstart: [],
				touchend: [],
				touchmove: [],
				update: [
					function(){
								if ( isUserInteracting === false ) {
		
							lon += 0.1*window.devicePixelRatio;
		
						}
		
						lat = Math.max( - 85, Math.min( 85, lat ) );
						phi = THREE.Math.degToRad( 90 - lat );
						theta = THREE.Math.degToRad( lon );
		
						target.x = 500 * Math.sin( phi ) * Math.cos( theta );
						target.y = 500 * Math.cos( phi );
						target.z = 500 * Math.sin( phi ) * Math.sin( theta );
						
						camera.position.copy( target ).negate();
						console.log(camera.position)
						camera.lookAt( target );
						}
				]
			};
				
				
				

			$.each(scene.children,function(i,n){
				n.material=pic[n.name];
			})

		};

		this.setCamera = function ( value ) {

			camera = value;
			camera.aspect = this.width / this.height;
			camera.updateProjectionMatrix();

		};

		this.setScene = function ( value ) {

			scene = value;

		},

		this.setSize = function ( width, height ) {

			if ( renderer._fullScreen ) return;

			this.width = width;
			this.height = height;

			camera.aspect = this.width / this.height;
			camera.updateProjectionMatrix();

			renderer.setSize( width, height );

		};

		var dispatch = function ( array, event ) {

			for ( var i = 0, l = array.length; i < l; i ++ ) {

				array[ i ]( event );

			}

		};

		var prevTime, request;

		var animate = function ( time ) {

			request = requestAnimationFrame( animate );

			dispatch( events.update, { time: time, delta: time - prevTime } );

			renderer.render( scene, camera );

			prevTime = time;

		};

		this.play = function () {

			document.addEventListener( 'keydown', onDocumentKeyDown );
			document.addEventListener( 'keyup', onDocumentKeyUp );
			document.addEventListener( 'mousedown', onDocumentMouseDown );
			document.addEventListener( 'mouseup', onDocumentMouseUp );
			document.addEventListener( 'mousemove', onDocumentMouseMove );
			document.addEventListener( 'touchstart', onDocumentTouchStart );
			document.addEventListener( 'touchend', onDocumentTouchEnd );
			document.addEventListener( 'touchmove', onDocumentTouchMove );

			request = requestAnimationFrame( animate );
			prevTime = performance.now();

		};

		this.stop = function () {

			document.removeEventListener( 'keydown', onDocumentKeyDown );
			document.removeEventListener( 'keyup', onDocumentKeyUp );
			document.removeEventListener( 'mousedown', onDocumentMouseDown );
			document.removeEventListener( 'mouseup', onDocumentMouseUp );
			document.removeEventListener( 'mousemove', onDocumentMouseMove );
			document.removeEventListener( 'touchstart', onDocumentTouchStart );
			document.removeEventListener( 'touchend', onDocumentTouchEnd );
			document.removeEventListener( 'touchmove', onDocumentTouchMove );

			cancelAnimationFrame( request );

		};

		//

		var onDocumentKeyDown = function ( event ) {

			dispatch( events.keydown, event );

		};

		var onDocumentKeyUp = function ( event ) {

			dispatch( events.keyup, event );

		};

		var onDocumentMouseDown = function ( event ) {
			
			dispatch( events.mousedown, event );

		};

		var onDocumentMouseUp = function ( event ) {

			dispatch( events.mouseup, event );

		};

		var onDocumentMouseMove = function ( event ) {

			dispatch( events.mousemove, event );

		};

		var onDocumentTouchStart = function ( event ) {

			dispatch( events.touchstart, event );

		};

		var onDocumentTouchEnd = function ( event ) {

			dispatch( events.touchend, event );

		};

		var onDocumentTouchMove = function ( event ) {

			dispatch( events.touchmove, event );

		};

	}

};
