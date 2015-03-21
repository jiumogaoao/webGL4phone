// JavaScript Document
var fishEye={};
;(function(){
	var camera, scene, renderer,pic,containerDom,raycaster,mouse, mesh;
	var texture_placeholder,
			isUserInteracting = false,
			onMouseDownMouseX = 0, onMouseDownMouseY = 0,
			lon = 90, onMouseDownLon = 0,
			lat = 0, onMouseDownLat = 0,
			phi = 0, theta = 0,
			target = new THREE.Vector3();
	
	function init() {

				
				
				$("#"+containerDom).empty();
				var container;	
					
					container = document.getElementById( containerDom );
					
					camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 1, 1100 );
					
					scene = new THREE.Scene();
					
					texture_placeholder = document.createElement( 'canvas' );
				texture_placeholder.width = 128;
				texture_placeholder.height = 128;
				
				var context = texture_placeholder.getContext( '2d' );
				context.fillStyle = 'rgb( 200, 200, 200 )';
				context.fillRect( 0, 0, texture_placeholder.width, texture_placeholder.height );
				
				var materials = pic;
				
				mesh = new THREE.Mesh( new THREE.BoxGeometry( 300, 300, 300, 7, 7, 7 ), new THREE.MeshFaceMaterial( materials ) );
				mesh.scale.x = - 1;
				
				scene.add( mesh );
				for ( var i = 0, l = mesh.geometry.vertices.length; i < l; i ++ ) {

					var vertex = mesh.geometry.vertices[ i ];

					vertex.normalize();
					vertex.multiplyScalar( 550 );

				}
				raycaster = new THREE.Raycaster();
				raycaster.far=100000;
				mouse = new THREE.Vector2();
				renderer = new THREE.CanvasRenderer();
				renderer.setPixelRatio( window.devicePixelRatio );
				renderer.setSize( window.innerWidth, window.innerHeight );
				container.appendChild( renderer.domElement );
				
				document.addEventListener( 'mousedown', onDocumentMouseDown, false );
				document.addEventListener( 'mousemove', onDocumentMouseMove, false );
				document.addEventListener( 'mouseup', onDocumentMouseUp, false );
				document.addEventListener( 'mousewheel', onDocumentMouseWheel, false );
				document.addEventListener( 'DOMMouseScroll', onDocumentMouseWheel, false);

				document.addEventListener( 'touchstart', onDocumentTouchStart, false );
				document.addEventListener( 'touchmove', onDocumentTouchMove, false );

				//

				window.addEventListener( 'resize', onWindowResize, false );

			}
			
	function onWindowResize() {
				
					camera.aspect = window.innerWidth / window.innerHeight;
				camera.updateProjectionMatrix();
				renderer.setSize( window.innerWidth, window.innerHeight );
					
				

			}
			
	function loadTexture( path ) {

				var texture = new THREE.Texture( texture_placeholder );
				var material = new THREE.MeshBasicMaterial( { map: texture, overdraw: 0.5 } );

				var image = new Image();
				image.onload = function () {

					texture.image = this;
					texture.needsUpdate = true;

				};
				image.src = path;

				return material;

			}
	
	function onDocumentMouseDown( event ) {

					event.stopPropagation();
					event.preventDefault();

				isUserInteracting = true;

				onPointerDownPointerX = event.clientX;
				onPointerDownPointerY = event.clientY;

				onPointerDownLon = lon;
				onPointerDownLat = lat;

				mouse.x = ( event.clientX / renderer.domElement.width ) * 2 - 1;
				mouse.y = - ( event.clientY / renderer.domElement.height ) * 2 + 1;

				raycaster.setFromCamera( mouse, camera );

				var intersects = raycaster.intersectObjects( scene.children );
				debugger;
				if ( intersects.length > 0 ) {
					console.log(intersects[ 0 ].point);
				}
			}

			function onDocumentMouseMove( event ) {

					event.stopPropagation();
					event.preventDefault();
					
				if ( isUserInteracting === true ) {

					lon = ( onPointerDownPointerX - event.clientX ) * 0.1*window.devicePixelRatio + onPointerDownLon;
					lat = ( event.clientY - onPointerDownPointerY ) * 0.1*window.devicePixelRatio + onPointerDownLat;

				}
			}

			function onDocumentMouseUp( event ) {

					event.stopPropagation();
					event.preventDefault();
				isUserInteracting = false;

			}

			function onDocumentMouseWheel( event ) {
				
					// WebKit

				if ( event.wheelDeltaY ) {

					camera.fov -= event.wheelDeltaY * 0.05;

				// Opera / Explorer 9

				} else if ( event.wheelDelta ) {

					camera.fov -= event.wheelDelta * 0.05;

				// Firefox

				} else if ( event.detail ) {

					camera.fov -= event.detail * 0.05;

				}

				camera.updateProjectionMatrix();
				
				

			}

			function onDocumentTouchStart( event ) {

				if ( event.touches.length == 1 ) {

					event.stopPropagation();
					event.preventDefault();
					event.preventDefault();
				
				event.clientX = event.touches[0].clientX;
				event.clientY = event.touches[0].clientY;
				onDocumentMouseDown( event );
				}

			}

			function onDocumentTouchMove( event ) {

				if ( event.touches.length == 1 ) {

					event.stopPropagation();
					event.preventDefault();

					event.clientX = event.touches[0].clientX;
				event.clientY = event.touches[0].clientY;
				onDocumentMouseMove( event );

				}

			}

			function animate() {

				requestAnimationFrame( animate );
				update();

			}

			function update() {
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
				camera.lookAt( target );

				renderer.render( scene, camera );
					
				

			}
					
			
	function reload3D(textureArry){
				pic = [];
				$.each(textureArry.texture[0],function(u,v){
					pic[u] = loadTexture( v );
				});
				init();
				animate();
				};
	function setContainer(container){
		containerDom = container;
		};

	function getColor(touchPoint,num){
		var canvasOffset = $("#"+containerDom[num]).offset();
					var canvasX = Math.floor(touchPoint.pageX - canvasOffset.left) * window.devicePixelRatio;
					var canvasY = Math.floor(touchPoint.pageY - canvasOffset.top) * window.devicePixelRatio;
					// 获取该点像素的数据
					var context = renderer[num].domElement.getContext("2d");
					var imageData = context.getImageData(canvasX, canvasY, 1, 1);
				   // 获取该点像素数据
					var pixel = imageData.data;
					return "#" + pixel[0] + "#" + pixel[1] + "#" + pixel[2]
	}						
	fishEye.reload3D = reload3D;
	fishEye.setContainer = setContainer;
	fishEye.getColor = getColor;
	})();