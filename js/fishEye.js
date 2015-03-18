// JavaScript Document
var fishEye={};
;(function(){
	var camera=[], scene=[], renderer=[],pic=[],containerDom=[];
	
	var texture_placeholder,
			isUserInteracting = false,
			onMouseDownMouseX = 0, onMouseDownMouseY = 0,
			lon = 90, onMouseDownLon = 0,
			lat = 0, onMouseDownLat = 0,
			phi = 0, theta = 0,
			target = new THREE.Vector3();
	
	function init() {

				
				$.each(containerDom,function(u,v){
				$("#"+v).empty();
				var container, mesh;	
					
					container = document.getElementById( v );
					
					camera[u] = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 1, 1100 );
					
					scene[u] = new THREE.Scene();
					
					texture_placeholder = document.createElement( 'canvas' );
				texture_placeholder.width = 16;
				texture_placeholder.height = 16;
				
				var context = texture_placeholder.getContext( '2d' );
				context.fillStyle = 'rgb( 200, 200, 200 )';
				context.fillRect( 0, 0, texture_placeholder.width, texture_placeholder.height );
				
				var materials = pic[u];
				
				mesh = new THREE.Mesh( new THREE.BoxGeometry( 300, 300, 300, 7, 7, 7 ), new THREE.MeshFaceMaterial( materials ) );
				mesh.scale.x = - 1;
				scene[u].add( mesh );
				for ( var i = 0, l = mesh.geometry.vertices.length; i < l; i ++ ) {

					var vertex = mesh.geometry.vertices[ i ];

					vertex.normalize();
					vertex.multiplyScalar( 550 );

				}
				
				renderer[u] = new THREE.CanvasRenderer();
				renderer[u].setPixelRatio( window.devicePixelRatio );
				renderer[u].setSize( window.innerWidth, window.innerHeight );
				container.appendChild( renderer[u].domElement );
				
				
					})			

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
				$.each(containerDom,function(u,v){
					camera[u].aspect = window.innerWidth / window.innerHeight;
				camera[u].updateProjectionMatrix();
				renderer[u].setSize( window.innerWidth, window.innerHeight );
					})
				

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

			}

			function onDocumentMouseMove( event ) {

					event.stopPropagation();
					event.preventDefault();
					
				if ( isUserInteracting === true ) {

					lon = ( onPointerDownPointerX - event.clientX ) * 0.1 + onPointerDownLon;
					lat = ( event.clientY - onPointerDownPointerY ) * 0.1 + onPointerDownLat;

				}
			}

			function onDocumentMouseUp( event ) {

					event.stopPropagation();
					event.preventDefault();
				isUserInteracting = false;

			}

			function onDocumentMouseWheel( event ) {
				$.each(containerDom,function(u,v){
					// WebKit

				if ( event.wheelDeltaY ) {

					camera[u].fov -= event.wheelDeltaY * 0.05;

				// Opera / Explorer 9

				} else if ( event.wheelDelta ) {

					camera[u].fov -= event.wheelDelta * 0.05;

				// Firefox

				} else if ( event.detail ) {

					camera[u].fov -= event.detail * 0.05;

				}

				camera[u].updateProjectionMatrix();
					})
				

			}

			function onDocumentTouchStart( event ) {

				if ( event.touches.length == 1 ) {

					event.stopPropagation();
					event.preventDefault();

					onPointerDownPointerX = event.touches[ 0 ].pageX;
					onPointerDownPointerY = event.touches[ 0 ].pageY;

					onPointerDownLon = lon;
					onPointerDownLat = lat;

				}

			}

			function onDocumentTouchMove( event ) {

				if ( event.touches.length == 1 ) {

					event.stopPropagation();
					event.preventDefault();

					lon = ( onPointerDownPointerX - event.touches[0].pageX ) * 0.1 + onPointerDownLon;
					lat = ( event.touches[0].pageY - onPointerDownPointerY ) * 0.1 + onPointerDownLat;

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
				$.each(containerDom,function(u,v){
					camera[u].position.copy( target ).negate();
				camera[u].lookAt( target );

				renderer[u].render( scene[u], camera[u] );
					})
				

			}
					
			
	function reload3D(textureArry){
				pic = [];
				$.each(textureArry.texture,function(u,v){
					pic[u] = [];
				$.each(v,function(i,n){
					pic[u][i] = loadTexture( n );
					});
				});
				init();
				animate();
				};
	function setContainer(containerGroup){
		containerDom = containerGroup;
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