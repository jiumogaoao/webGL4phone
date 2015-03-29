/**
 * @author mrdoob / http://mrdoob.com/
 */
if(!requestAnimationFrame){
	window.requestAnimationFrame = (function(){ 
		return window.requestAnimationFrame || 
			window.webkitRequestAnimationFrame || 
			window.mozRequestAnimationFrame || 
			window.oRequestAnimationFrame || 
			window.msRequestAnimationFrame || 
			function(/* function */ callback, /* DOMElement */ element){ 
				window.setTimeout(callback, 1000 / 60); 
			}; 
	})(); 
}
var APP = {

	Player: function () {

		var scope = this;

		var loader = new THREE.ObjectLoader();
		var camera, scene, renderer,texture_placeholder,pic,container,
			touch={},
			canvasArry={
				"nz": $('<canvas width="512" height="512"></canvas>'),
				"nx": $('<canvas width="512" height="512"></canvas>'),
				"ny": $('<canvas width="512" height="512"></canvas>'),
				"px": $('<canvas width="512" height="512"></canvas>'),
				"py": $('<canvas width="512" height="512"></canvas>'),
				"pz": $('<canvas width="512" height="512"></canvas>')
			},
			contexts={
				"nz": canvasArry.nz[0].getContext("2d"),
				"nx": canvasArry.nx[0].getContext("2d"),
				"ny": canvasArry.ny[0].getContext("2d"),
				"px": canvasArry.px[0].getContext("2d"),
				"py": canvasArry.py[0].getContext("2d"),
				"pz": canvasArry.pz[0].getContext("2d")
			},
			textureArry={
				"nz": $('<canvas width="512" height="512"></canvas>'),
				"nx": $('<canvas width="512" height="512"></canvas>'),
				"ny": $('<canvas width="512" height="512"></canvas>'),
				"px": $('<canvas width="512" height="512"></canvas>'),
				"py": $('<canvas width="512" height="512"></canvas>'),
				"pz": $('<canvas width="512" height="512"></canvas>')
			},
			textureContexts={
				"nz": textureArry.nz[0].getContext("2d"),
				"nx": textureArry.nx[0].getContext("2d"),
				"ny": textureArry.ny[0].getContext("2d"),
				"px": textureArry.px[0].getContext("2d"),
				"py": textureArry.py[0].getContext("2d"),
				"pz": textureArry.pz[0].getContext("2d")
			},
			cacheTexture=$('<canvas width="512" height="512"></canvas>'),
			cacheContext=cacheTexture[0].getContext("2d"),
			lastPic=false,
			isUserInteracting = false,
			onMouseDownMouseX = 0, onMouseDownMouseY = 0,
			lon = 90, onMouseDownLon = 0,
			lat = 0, onMouseDownLat = 0,
			phi = 0, theta = 0,
			target = new THREE.Vector3(),
			container = document.getElementById( "container" );
			pic={};
			
		var vr, controls;
		var raycaster = new THREE.Raycaster();
		var mouse = new THREE.Vector2();
		var events = {};

		this.dom = undefined;

		this.width = 500;
		this.height = 500;

		texture_placeholder = document.createElement( 'canvas' );
				texture_placeholder.width = 512;
				texture_placeholder.height = 512;
				
				var context = texture_placeholder.getContext( '2d' );
				context.fillStyle = 'rgb( 200, 200, 200 )';
				context.fillRect( 0, 0, texture_placeholder.width, texture_placeholder.height );
		function flood_fill_4(x,y,name,color)
			{
			var current;
			current = contexts[name].getImageData(x,y,1,1).data.toString();
			if ( current==color.toString())
			{
			var textureData=textureContexts[name].getImageData(x,y,1,1);
			for (var i=0;i<3;i++){
				if(textureData[i]<=245){
					textureData[i]+=10
				}else{
					textureData[i]=255
				}
			}
			textureContexts[name].putImageData(textureData,x,y)

			flood_fill_4(x, y+1,name,color); /* 上 */
			flood_fill_4(x, y-1,name,color); /* 下 */
			flood_fill_4(x-1, y,name,color); /* 左 */
			flood_fill_4(x+1, y,name,color); /* 右 */
			}
			}
		function heightLight(name,color){
			
			if(lastPic){
				var lastobj=scene.getChildByName(lastPic)
			lastobj.material.map.image.src=textureArry[lastPic][0].toDataURL();
			lastobj.material.map.needsUpdate = true;
				}
				lastPic=name;
				var channelData=contexts[name].getImageData(0,0,512,512)
				var textureData=textureContexts[name].getImageData(0,0,512,512)
				for(var i=0;i<channelData.data.length-1;i+=4){
					if(channelData.data[i]==color[0]&&channelData.data[i+1]==color[1]&&channelData.data[i+2]==color[2]){
						textureData.data[i]+=10;
						textureData.data[i+1]+=10;
						textureData.data[i+2]+=10;
						if(textureData.data[i]>255){
							textureData.data[i]=255
						}
						if(textureData.data[i+1]>255){
							textureData.data[i+1]=255
						}
						if(textureData.data[i+2]>255){
							textureData.data[i+2]=255
						}
					}
				}
				debugger;
			}
		function loadTexture(name, path ) {
				var texture = new THREE.Texture( texture_placeholder );
				var material = new THREE.MeshBasicMaterial( { map: texture, overdraw: 1.5 } );

				var image = new Image();
				image.name=name;
				image.onload = function () {
					textureContexts[this.name].drawImage(this,0,0,512,512)
					
					var showUrl=textureArry[this.name][0].toDataURL();
					var showImg=new Image();
					showImg.src=showUrl;
					texture.image = showImg;
					texture.needsUpdate = true;

				};
				image.src = path;

				return material;

			}
			
		this.reload = function(json){
			for(var texture in json){
				pic[texture]= loadTexture(texture,json[texture])
			}
		}
		
		this.setCannel=function(json){
			for(var channel in json){
				var img=new Image();
				img.name=channel
			function loadFunction(){
				contexts[this.name].drawImage(this,0,0,512,512)
			}
			img.addEventListener("load",loadFunction,false);
			
			img.src=json[channel]
				}
	}	
		this.chooseColor=function(color){debugger;}
		function findColor(name,point){
			var colorContext=contexts[name];
			var colorX=0;
			var colorY=0;
			function three2two(num){
				return parseInt(((num-483.15972900390625)/(483.15972900390625*2))*512)*(-1)
				}
			if(name=="py"){
				colorX=three2two(point.z);
				colorY=three2two(point.x);
				}
			if(name=="nx"){
				colorX=three2two(point.x);
				colorY=three2two(point.y);
				}
			if(name=="nz"){
				colorX=three2two(-point.z);
				colorY=three2two(point.y);
				}
			if(name=="px"){
				colorX=three2two(-point.x);
				colorY=three2two(point.y);
				}
			if(name=="pz"){
				colorX=three2two(point.z);
				colorY=three2two(point.y);
				}
			if(name=="ny"){
				colorX=three2two(-point.z);
				colorY=three2two(-point.x);
				}
			var colorReturn=colorContext.getImageData(colorX, colorY, 1, 1);
			heightLight(name,colorReturn.data)
			scope.chooseColor("#"+colorReturn.data[0]+"#"+colorReturn.data[1]+"#"+colorReturn.data[2])
			}
		this.load = function ( json ) {

			vr = json.project.vr;
			function webglAvailable() {
		try {
			var canvas = document.createElement( 'canvas' );
			return !!( window.WebGLRenderingContext && (
				canvas.getContext( 'webgl' ) ||
				canvas.getContext( 'experimental-webgl' ) )
			);
		} catch ( e ) {
			return false;
		}
	}

	if ( webglAvailable() ) {
		renderer = new THREE.WebGLRenderer();
	} else {
		renderer = new THREE.CanvasRenderer();
	}
			//renderer = new THREE.CanvasRenderer( { antialias: true } );
			renderer.setClearColor( 0x000000 );
			//renderer.setPixelRatio( window.devicePixelRatio );
			container.appendChild( renderer.domElement );

			this.setScene( loader.parse( json.scene ) );
			//this.setCamera( loader.parse( json.camera ) );
			camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 1, 1100 );
			events = {
				keydown: [],
				keyup: [],
				mousedown: [
				function(event){	
					event.stopPropagation();
					event.preventDefault();
					touch.time=new Date().getTime();
					touch.name="";
					touch.point={};
					mouse.x = ( event.clientX / renderer.domElement.width ) * 2 - 1;
					mouse.y = - ( event.clientY / renderer.domElement.height ) * 2 + 1;
	
					raycaster.setFromCamera( mouse, camera );
	
					var intersects = raycaster.intersectObjects( scene.children );
					if ( intersects.length > 0 ) {
						touch.name=intersects[ 0 ].object.name;
						touch.point=intersects[ 0 ].point
					}
			
				},function(event){
					

					event.stopPropagation();
					event.preventDefault();

				isUserInteracting = true;

				onPointerDownPointerX = event.clientX;
				onPointerDownPointerY = event.clientY;

				onPointerDownLon = lon;
				onPointerDownLat = lat;

			
					}
				],
				mouseup: [
					function(event){
						event.stopPropagation();
					event.preventDefault();
				isUserInteracting = false;
				var endTime = new Date().getTime();
						if((endTime-touch.time)<300){
							findColor(touch.name,touch.point)
							}
						}
				],
				mousemove: [
					function(event){
						

					event.stopPropagation();
					event.preventDefault();
					
				if ( isUserInteracting === true ) {

					lon = ( onPointerDownPointerX - event.clientX ) * 0.1 + onPointerDownLon;
					lat = ( event.clientY - onPointerDownPointerY ) * 0.1 + onPointerDownLat;

				}
			
						}
				],
				touchstart: [
					function(event){	
					event.stopPropagation();
					event.preventDefault();
					event.clientX=event.touches[0].clientX
					event.clientY=event.touches[0].clientY
					touch.time=new Date().getTime();
					touch.name="";
					touch.point={};
					mouse.x = ( event.clientX / renderer.domElement.width ) * 2 - 1;
					mouse.y = - ( event.clientY / renderer.domElement.height ) * 2 + 1;
	
					raycaster.setFromCamera( mouse, camera );
	
					var intersects = raycaster.intersectObjects( scene.children );
					if ( intersects.length > 0 ) {
						touch.name=intersects[ 0 ].object.name;
						console.log(intersects[ 0 ].object)
						touch.point=intersects[ 0 ].point
					}
			
				},function(event){
					if ( event.touches.length == 1 ) {

					event.stopPropagation();
					event.preventDefault();

					onPointerDownPointerX = event.touches[ 0 ].pageX;
					onPointerDownPointerY = event.touches[ 0 ].pageY;

					onPointerDownLon = lon;
					onPointerDownLat = lat;

				}
					}
				],
				touchend: [
					function(event){
						var endTime = new Date().getTime();
						if((endTime-touch.time)<300){
							findColor(touch.name,touch.point)
							}
						}
				],
				touchmove: [
					function(event){
						

				if ( event.touches.length == 1 ) {

					event.stopPropagation();
					event.preventDefault();
					var move = .1;
					if($.os.phone){
						move = .5;
						}
					lon = ( onPointerDownPointerX - event.touches[0].pageX ) * move + onPointerDownLon;
					lat = ( event.touches[0].pageY - onPointerDownPointerY ) * move + onPointerDownLat;

				}

			
						}
				],
				update: [
					function(){
								if ( isUserInteracting === false ) {
							var addLon=0.1;
							if($.os.phone){
								addLon=1
								}
							lon += addLon;
						}
		
						lat = Math.max( - 85, Math.min( 85, lat ) );
						phi = THREE.Math.degToRad( 90 - lat );
						theta = THREE.Math.degToRad( lon );
		
						target.x = 500 * Math.sin( phi ) * Math.cos( theta );
						target.y = 500 * Math.cos( phi );
						target.z = 500 * Math.sin( phi ) * Math.sin( theta );
						
						camera.position.copy( target ).negate();
				
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
			prevTime = new Date().getTime();

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
