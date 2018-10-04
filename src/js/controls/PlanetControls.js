/**
 * @author cigone / https://www.openearthview.comm
 */

// This set of controls performs orbiting, dollying (zooming), and panning.
// Unlike TrackballControls, it maintains the "up" direction object.up (+Y by default).
//
//    Orbit - left mouse / touch: one-finger move
//    Zoom - middle mouse, or mousewheel / touch: two-finger spread or squish
//    Pan - right mouse, or arrow keys / touch: two-finger move
EARTH_RADIUS = 6371;

THREE.PlanetControls = function ( object, domElement, cameraSurvey ) {
	textureLoader = new THREE.TextureLoader();

	this.object = object;
	this.cameraSurvey = cameraSurvey;
	this.johnTheta = new THREE.Object3D();
	this.johnPhi = new THREE.Object3D();
	this.johnRadius = new THREE.Mesh();
	this.cameraTheta = new THREE.Object3D();
	this.cameraPhi = new THREE.Object3D();
	this.cameraRadius = new THREE.Object3D();

	this.cameraRadius.add(this.object);
	this.cameraPhi.add(this.cameraRadius);
	this.cameraTheta.add(this.cameraPhi);
	this.johnRadius.add(this.cameraTheta);
	this.johnPhi.add(this.johnRadius);
	this.johnTheta.add(this.johnPhi);
	this.cameraSurvey.add(this.johnTheta);

	this.johnRadius.position.x = EARTH_RADIUS;
	this.cameraRadius.position.x = EARTH_RADIUS * 1.8;
	this.object.quaternion.y = Math.PI / 4;
	// console.log('this.object.quaternion:', this.object.quaternion);
	// camera.position.setFromSpherical(THREE.Spherical(radius * 1.8, Math.PI / 2, 0));
	var cameraSurveyAxes = new THREE.AxesHelper(10000);
	cameraSurveyAxes.material.linewidth = 10;
	// cameraSurveyAxes.updateMatrix();

	
	this.cameraSurvey.add( cameraSurveyAxes );
	this.johnRadius.add( new THREE.AxesHelper(2000) );
	this.cameraTheta.add( new THREE.AxesHelper(2000) );
	this.cameraPhi.add( new THREE.AxesHelper(2000) );
	// this.cameraRadius.add(originAxes( 50, 2000, 0x7 ));

	// this.cameraPlate.position.setY( EARTH_RADIUS / 2 );

	this.domElement = ( domElement !== undefined ) ? domElement : document;

	// Set to false to disable this control
	this.enabled = true;

	// How far you can dolly in and out ( PerspectiveCamera only )
	this.minDistance = 0;
	this.maxDistance = Infinity;

	// How far you can zoom in and out ( OrthographicCamera only )
	this.minZoom = 0;
	this.maxZoom = Infinity;

	// How far you can orbit vertically, upper and lower limits.
	// Range is 0 to Math.PI radians.
	this.minPolarAngle = 0; // radians
    this.maxPolarAngle = Math.PI; // radians

	// How far you can orbit horizontally, upper and lower limits.
	// If set, must be a sub-interval of the interval [ - Math.PI, Math.PI ].
	this.minAzimuthAngle = - Infinity; // radians
    this.maxAzimuthAngle = Infinity; // radians

    // Longitude
	this.minLongitudePlanet = 0; // radians
	this.maxLongitudePlanet = Math.PI/8; // radians
    // Latitude
	this.minLatitudePlanet = - Math.PI/2; // radians
	this.maxLatitudePlanet = + Math.PI/2; // radians

	// This option actually enables dollying in and out; left as "zoom" for backwards compatibility.
	// Set to false to disable zooming
	this.enableZoom = true;
	this.zoomSpeed = 1.0;

	// Set to false to disable rotating
	this.enableRotate = true;
	this.rotateSpeed = 1.0;

	// Set to false to disable panning
	this.enablePan = true;
	this.panSpeed = 1.0;
	// this.movingTypes = { PAN_SCREEN: 1, PAN_PLAN: 2, ORBITAL: 3 };
	// this.screenSpacePanning = this.movingTypes.ORBITAL;
	this.keyPanSpeed = 7.0;	// pixels moved per arrow key push

	// Set to true to automatically rotate around the target
	// If auto-rotate is enabled, you must call controls.update() in your animation loop
	this.autoRotate = false;
	this.autoRotateSpeed = 2.0; // 30 seconds per round when fps is 60

	// Set to false to disable use of the keys
	this.enableKeys = true;

	// The four arrow keys
	this.keys = { LEFT: 37, UP: 38, RIGHT: 39, BOTTOM: 40 };

	// Mouse buttons
	this.mouseButtons = { ORBIT: THREE.MOUSE.RIGHT, ZOOM: THREE.MOUSE.MIDDLE, PAN: THREE.MOUSE.LEFT };

	// for reset
	// this.target0 = this.target.clone();
	// this.position0 = this.object.position.clone();
	// this.zoom0 = this.object.zoom; 

	//
	// public methods
	//

	this.getPolarAngle = function () {

		return cameraPhi.quaternion.z;

	};

	this.getAzimuthalAngle = function () {

		return cameraTheta.quaternion.y;

	};

	// this.saveState = function () {

	// 	scope.target0.copy( scope.target );
	// 	scope.position0.copy( scope.object.position );
	// 	scope.zoom0 = scope.object.zoom;

	// };

	this.reset = function () {

		// scope.target.copy( scope.target0 );
		// scope.object.position.copy( scope.position0 );
		// scope.object.zoom = scope.zoom0;

		// scope.object.updateProjectionMatrix();
		// scope.dispatchEvent( changeEvent );

		// scope.update();

		// state = STATE.NONE;

	};

	// this method is exposed, but perhaps it would be better if we can make it private...
	this.update = function () {

		// so camera.up is the orbit axis
		// var quat = new THREE.Quaternion().setFromUnitVectors( object.up, new THREE.Vector3( 0, 1, 0 ) );
		// var quatInverse = quat.clone().inverse();

		// var lastPosition = new THREE.Vector3();
		// var lastQuaternion = new THREE.Quaternion();
		// var updateResult = false;

		return function update() {
			updateResult = false;
			// console.log( 'Call to update' );
            // console.log('camera position:', scope.object.getWorldPosition());
            scope.johnTheta.rotation.y = Math.min (Math.max( (scope.johnTheta.rotation.y - johnDelta.theta),
                scope.minLongitudePlanet ), scope.maxLongitudePlanet );
            // console.log('scope.johnTheta.rotation.y:', scope.johnTheta.rotation.y);

            // scope.johnPhi.rotation.z = Math.max(Math.min(scope.johnPhi.rotation.z - johnDelta.phi),
            //     scope.maxLatitudePlanet, scope.minLatitudePlanet ) ;
            scope.johnPhi.rotation.z = Math.min (Math.max( (scope.johnPhi.rotation.z - johnDelta.phi),
                scope.minLatitudePlanet ), scope.maxLatitudePlanet );
            // Math.max(Math.min(earth.rotation.y + phi, yLimit.max - Math.PI / 2), yLimit.min - Math.PI / 2);
            // console.log('scope.johnPhi.rotation.z:', scope.johnPhi.rotation.z);

			scope.cameraTheta.rotation.x -= cameraDelta.theta;

			// console.log('scope.cameraSurvey.position:', scope.cameraSurvey.position);
			// console.log('scope.johnTheta.quaternion:', scope.johnTheta.quaternion);
			// console.log('scope.johnPhi.quaternion:', scope.johnPhi.quaternion);
			// console.log('scope.johnRadius.position:', scope.johnRadius.position);
			// console.log('scope.cameraTheta.quaternion:', scope.cameraTheta.quaternion);
			// console.log('scope.cameraPhi.quaternion:', scope.cameraPhi.quaternion);
			// console.log('scope.cameraRadius.position:', scope.cameraRadius.position);
			// console.log('scope.johnRadius.position:', scope.johnRadius.position);
			// console.log('scope.object.position:', scope.object.position);
			// console.log('scope.object.quaternion:', scope.object.quaternion);
			// console.log('scope.object.matrixWorld:', scope.object.matrixWorld.elements);

			// console.log('this.cameraTheta.quaternion:', this.cameraTheta.quaternion);
            scope.cameraPhi.rotation.z += cameraDelta.phi;
            // console.log('');

			scope.cameraRadius.position.setX( scope.cameraRadius.position.x * scale );
			// console.log('cameraRadius worldposition:', scope.cameraRadius.getWorldPosition());
			// console.log('cameraRadius position.x:', scope.cameraRadius.position.x);

			// restrict radius to be between desired limits
			scope.cameraRadius.position.setX (
				Math.max( scope.minDistance, Math.min( scope.maxDistance, scope.cameraRadius.position.x ) )
			);
			// scope.cameraTheta.quaternion.x =
			// 	Math.max( -Math.PI/4, Math.min( Math.PI/4, scope.cameraTheta.quaternion.x ) );
			scope.cameraTheta.rotation.x %= (2 * Math.PI);

			scope.cameraPhi.rotation.z =
				Math.max( -Math.PI/2, Math.min( 0, scope.cameraPhi.rotation.z ) );
			// scope.object.lookAt( scope.cameraTheta.getWorldPosition() );
			// console.log( 'scope.object.worldPosition:', scope.object.getWorldPosition() );
			// console.log( 'scope.object.worldQuaternion:', scope.object.getWorldQuaternion() );
			// console.log( 'scope.object.position:', scope.object.position );
			if (johnDelta.theta != 0 ||
				johnDelta.phi != 0 ||
				cameraDelta.theta != 0 ||
				cameraDelta.phi != 0 ||
				scale != 1) {
				scope.dispatchEvent( changeEvent );
			}

			cameraDelta.set( 0, 0, 0 );
			johnDelta.set( 0, 0, 0 );
			scale = 1;

			// update condition is:
			// min(camera displacement, camera rotation in radians)^2 > EPS
			// using small-angle approximation cos(x/2) = 1 - x^2 / 8

			// if ( zoomChanged ) {
			// 	scope.dispatchEvent( changeEvent );
			// 	zoomChanged = false;
			// 	return true;
			// }
			// return updateResult;
			return false;

		};

	}();

	this.dispose = function () {

		scope.domElement.removeEventListener( 'contextmenu', onContextMenu, false );
		scope.domElement.removeEventListener( 'mousedown', onMouseDown, false );
		scope.domElement.removeEventListener( 'wheel', onMouseWheel, false );

		scope.domElement.removeEventListener( 'touchstart', onTouchStart, false );
		scope.domElement.removeEventListener( 'touchend', onTouchEnd, false );
		scope.domElement.removeEventListener( 'touchmove', onTouchMove, false );

		document.removeEventListener( 'mousemove', onMouseMove, false );
		document.removeEventListener( 'mouseup', onMouseUp, false );

		window.removeEventListener( 'keydown', onKeyDown, false );

		//scope.dispatchEvent( { type: 'dispose' } ); // should this be added here?

	};

	//
	// internals
	//

	var scope = this;
	var radius = 6371;

	var changeEvent = { type: 'change' };
	var startEvent = { type: 'start' };
	var endEvent = { type: 'end' };

	var STATE = { NONE: - 1, ROTATE: 0, DOLLY: 1, PAN: 2, TOUCH_ROTATE: 3, TOUCH_DOLLY_PAN: 4 };

	var state = STATE.NONE;

	var EPS = 0.000001;

	// current position in spherical coordinates
	var johnDelta = new THREE.Spherical(0, 0, 0);

	var scale = 1;
	var panOffset = new THREE.Vector3();
	var cameraDelta = new THREE.Spherical(0, 0, 0);
	var zoomChanged = false;

	var rotateStart = new THREE.Vector2();
	var rotateEnd = new THREE.Vector2();
	var rotateDelta = new THREE.Vector2();

	var panStart = new THREE.Vector2();
	var panEnd = new THREE.Vector2();
	var panDelta = new THREE.Vector2();

	var dollyStart = new THREE.Vector2();
	var dollyEnd = new THREE.Vector2();
	var dollyDelta = new THREE.Vector2();

	function getAutoRotationAngle() {

		return 2 * Math.PI / 60 / 60 * scope.autoRotateSpeed;

	}

	function getZoomScale() {

		return Math.pow( 0.95, scope.zoomSpeed );

	}

	function rotateLeft( angle ) {

		// console.log( 'Left angle:', angle );
		cameraDelta.theta += angle;

	}

	function rotateUp( angle ) {

		// console.log( 'Up angle:', angle );
		cameraDelta.phi += angle;

	}

	var panLeft = function ( distance ) {
            johnDelta.theta += ( distance / ( scope.johnRadius.position.x ))
                * Math.cos( scope.cameraTheta.rotation.x ) / Math.max(0.1, Math.cos(scope.johnPhi.rotation.z));
            johnDelta.phi +=  ( distance / ( scope.johnRadius.position.x ))
                * Math.sin( scope.cameraTheta.rotation.x );
	};

	var panUp = function ( distance ) {
            johnDelta.phi += ( distance / scope.johnRadius.position.x )
                * -Math.cos( scope.cameraTheta.rotation.x );
            johnDelta.theta +=  ( distance / ( scope.johnRadius.position.x ))
                * Math.sin( scope.cameraTheta.rotation.x ) / Math.max(0.1, Math.cos(scope.johnPhi.rotation.z));
	}

	// deltaX and deltaY are in pixels; right and down are positive
	var pan = function ( deltaX, deltaY ) {

			var element = scope.domElement === document ? scope.domElement.body : scope.domElement;

			if ( scope.object.isPerspectiveCamera ) {
				// perspective
				// var position = scope.object.position;
				// offset.copy( position ).sub( scope.target );
				// var targetDistance = offset.length();
				var targetDistance = scope.cameraRadius.position.x;

				// half of the fov is center to top of screen
				targetDistance *= Math.tan( ( scope.object.fov / 2 ) * Math.PI / 180.0 );

				// we use only clientHeight here so aspect ratio does not distort speed
				panLeft( 2 * deltaX * targetDistance / element.clientHeight );
				panUp( 2 * deltaY * targetDistance / element.clientHeight );

			} else {

				// camera neither orthographic nor perspective
				console.warn( 'WARNING: PlanetControls.js encountered an unknown camera type - pan disabled.' );
				scope.enablePan = false;

			}
	}

	function dollyIn( dollyScale ) {

		if ( scope.object.isPerspectiveCamera ) {

			scale /= dollyScale;
			zoomChanged = true;

		} else if ( scope.object.isOrthographicCamera ) {

			scope.object.zoom = Math.max( scope.minZoom, Math.min( scope.maxZoom, scope.object.zoom * dollyScale ) );
			scope.object.updateProjectionMatrix();
			zoomChanged = true;

		} else {

			console.warn( 'WARNING: PlanetControls.js encountered an unknown camera type - dolly/zoom disabled.' );
			scope.enableZoom = false;

		}

	}

	function dollyOut( dollyScale ) {

		if ( scope.object.isPerspectiveCamera ) {

			scale *= dollyScale;
			zoomChanged = true;

		} else if ( scope.object.isOrthographicCamera ) {

			scope.object.zoom = Math.max( scope.minZoom, Math.min( scope.maxZoom, scope.object.zoom / dollyScale ) );
			scope.object.updateProjectionMatrix();
			zoomChanged = true;

		} else {

			console.warn( 'WARNING: PlanetControls.js encountered an unknown camera type - dolly/zoom disabled.' );
			scope.enableZoom = false;

		}

	}

	//
	// event callbacks - update the object state
	//

	function handleMouseDownRotate( event ) {

		//console.log( 'handleMouseDownRotate' );

		rotateStart.set( event.clientX, event.clientY );

	}

	function handleMouseDownDolly( event ) {

		//console.log( 'handleMouseDownDolly' );

		dollyStart.set( event.clientX, event.clientY );

	}

	function handleMouseDownPan( event ) {

		//console.log( 'handleMouseDownPan' );

		panStart.set( event.clientX, event.clientY );

	}

	function handleMouseMoveRotate( event ) {

		//console.log( 'handleMouseMoveRotate' );

		rotateEnd.set( event.clientX, event.clientY );

		rotateDelta.subVectors( rotateEnd, rotateStart ).multiplyScalar( scope.rotateSpeed );

		var element = scope.domElement === document ? scope.domElement.body : scope.domElement;

		// rotating across whole screen goes 360 degrees around
		rotateLeft( 2 * Math.PI * rotateDelta.x / element.clientWidth );

		// rotating up and down along whole screen attempts to go 360, but limited to 180
		rotateUp( 2 * Math.PI * rotateDelta.y / element.clientHeight );

		rotateStart.copy( rotateEnd );

		scope.update();

	}

	function handleMouseMoveDolly( event ) {

		//console.log( 'handleMouseMoveDolly' );

		dollyEnd.set( event.clientX, event.clientY );

		dollyDelta.subVectors( dollyEnd, dollyStart );

		if ( dollyDelta.y > 0 ) {

			dollyIn( getZoomScale() );

		} else if ( dollyDelta.y < 0 ) {

			dollyOut( getZoomScale() );

		}

		dollyStart.copy( dollyEnd );

		scope.update();

	}

	function handleMouseMovePan( event ) {

		//console.log( 'handleMouseMovePan' );

		panEnd.set( event.clientX, event.clientY );

		panDelta.subVectors( panEnd, panStart ).multiplyScalar( scope.panSpeed );

		pan( panDelta.x, panDelta.y );

		panStart.copy( panEnd );

		scope.update();

	}

	function handleMouseUp( event ) {

		// console.log( 'handleMouseUp' );

	}

	function handleMouseWheel( event ) {

		// console.log( 'handleMouseWheel' );

		if ( event.deltaY < 0 ) {

			dollyOut( getZoomScale() );

		} else if ( event.deltaY > 0 ) {

			dollyIn( getZoomScale() );

		}

		scope.update();

	}

	function handleKeyDown( event ) {

		//console.log( 'handleKeyDown' );

		switch ( event.keyCode ) {

			case scope.keys.UP:
				pan( 0, scope.keyPanSpeed );
				scope.update();
				break;

			case scope.keys.BOTTOM:
				pan( 0, - scope.keyPanSpeed );
				scope.update();
				break;

			case scope.keys.LEFT:
				pan( scope.keyPanSpeed, 0 );
				scope.update();
				break;

			case scope.keys.RIGHT:
				pan( - scope.keyPanSpeed, 0 );
				scope.update();
				break;

		}

	}

	function handleTouchStartRotate( event ) {

		//console.log( 'handleTouchStartRotate' );

		rotateStart.set( event.touches[ 0 ].pageX, event.touches[ 0 ].pageY );

	}

	function handleTouchStartDollyPan( event ) {

		//console.log( 'handleTouchStartDollyPan' );

		if ( scope.enableZoom ) {

			var dx = event.touches[ 0 ].pageX - event.touches[ 1 ].pageX;
			var dy = event.touches[ 0 ].pageY - event.touches[ 1 ].pageY;

			var distance = Math.sqrt( dx * dx + dy * dy );

			dollyStart.set( 0, distance );

		}

		if ( scope.enablePan ) {

			var x = 0.5 * ( event.touches[ 0 ].pageX + event.touches[ 1 ].pageX );
			var y = 0.5 * ( event.touches[ 0 ].pageY + event.touches[ 1 ].pageY );

			panStart.set( x, y );

		}

	}

	function handleTouchMoveRotate( event ) {

		//console.log( 'handleTouchMoveRotate' );

		rotateEnd.set( event.touches[ 0 ].pageX, event.touches[ 0 ].pageY );

		rotateDelta.subVectors( rotateEnd, rotateStart ).multiplyScalar( scope.rotateSpeed );

		var element = scope.domElement === document ? scope.domElement.body : scope.domElement;

		// rotating across whole screen goes 360 degrees around
		rotateLeft( 2 * Math.PI * rotateDelta.x / element.clientWidth );

		// rotating up and down along whole screen attempts to go 360, but limited to 180
		rotateUp( 2 * Math.PI * rotateDelta.y / element.clientHeight );

		rotateStart.copy( rotateEnd );

		scope.update();

	}

	function handleTouchMoveDollyPan( event ) {

		//console.log( 'handleTouchMoveDollyPan' );

		if ( scope.enableZoom ) {

			var dx = event.touches[ 0 ].pageX - event.touches[ 1 ].pageX;
			var dy = event.touches[ 0 ].pageY - event.touches[ 1 ].pageY;

			var distance = Math.sqrt( dx * dx + dy * dy );

			dollyEnd.set( 0, distance );

			dollyDelta.set( 0, Math.pow( dollyEnd.y / dollyStart.y, scope.zoomSpeed ) );

			dollyIn( dollyDelta.y );

			dollyStart.copy( dollyEnd );

		}

		if ( scope.enablePan ) {

			var x = 0.5 * ( event.touches[ 0 ].pageX + event.touches[ 1 ].pageX );
			var y = 0.5 * ( event.touches[ 0 ].pageY + event.touches[ 1 ].pageY );

			panEnd.set( x, y );

			panDelta.subVectors( panEnd, panStart ).multiplyScalar( scope.panSpeed );

			pan( panDelta.x, panDelta.y );

			panStart.copy( panEnd );

		}

		scope.update();

	}

	function handleTouchEnd( event ) {

		//console.log( 'handleTouchEnd' );

	}

	//
	// event handlers - FSM: listen for events and reset state
	//

	function onMouseDown( event ) {

		if ( scope.enabled === false ) return;

		event.preventDefault();

		switch ( event.button ) {

			case scope.mouseButtons.ORBIT:

				if ( scope.enableRotate === false ) return;

				handleMouseDownRotate( event );

				state = STATE.ROTATE;

				break;

			case scope.mouseButtons.ZOOM:

				if ( scope.enableZoom === false ) return;

				handleMouseDownDolly( event );

				state = STATE.DOLLY;

				break;

			case scope.mouseButtons.PAN:

				if ( scope.enablePan === false ) return;

				handleMouseDownPan( event );

				state = STATE.PAN;

				break;

		}

		if ( state !== STATE.NONE ) {

			document.addEventListener( 'mousemove', onMouseMove, false );
			document.addEventListener( 'mouseup', onMouseUp, false );

			scope.dispatchEvent( startEvent );

		}

	}

	function onMouseMove( event ) {

		if ( scope.enabled === false ) return;

		event.preventDefault();

		switch ( state ) {

			case STATE.ROTATE:

				if ( scope.enableRotate === false ) return;

				handleMouseMoveRotate( event );

				break;

			case STATE.DOLLY:

				if ( scope.enableZoom === false ) return;

				handleMouseMoveDolly( event );

				break;

			case STATE.PAN:

				if ( scope.enablePan === false ) return;

				handleMouseMovePan( event );

				break;

		}

	}

	function onMouseUp( event ) {

		if ( scope.enabled === false ) return;

		handleMouseUp( event );

		document.removeEventListener( 'mousemove', onMouseMove, false );
		document.removeEventListener( 'mouseup', onMouseUp, false );

		scope.dispatchEvent( endEvent );

		state = STATE.NONE;

	}

	function onMouseWheel( event ) {

		if ( scope.enabled === false || scope.enableZoom === false || ( state !== STATE.NONE && state !== STATE.ROTATE ) ) return;

		event.preventDefault();
		event.stopPropagation();

		scope.dispatchEvent( startEvent );

		handleMouseWheel( event );

		scope.dispatchEvent( endEvent );

	}

	function onKeyDown( event ) {

		if ( scope.enabled === false || scope.enableKeys === false || scope.enablePan === false ) return;

		handleKeyDown( event );

	}

	function onTouchStart( event ) {

		if ( scope.enabled === false ) return;

		event.preventDefault();

		switch ( event.touches.length ) {

			case 1:	// one-fingered touch: rotate

				if ( scope.enableRotate === false ) return;

				handleTouchStartRotate( event );

				state = STATE.TOUCH_ROTATE;

				break;

			case 2:	// two-fingered touch: dolly-pan

				if ( scope.enableZoom === false && scope.enablePan === false ) return;

				handleTouchStartDollyPan( event );

				state = STATE.TOUCH_DOLLY_PAN;

				break;

			default:

				state = STATE.NONE;

		}

		if ( state !== STATE.NONE ) {

			scope.dispatchEvent( startEvent );

		}

	}

	function onTouchMove( event ) {

		if ( scope.enabled === false ) return;

		event.preventDefault();
		event.stopPropagation();

		switch ( event.touches.length ) {

			case 1: // one-fingered touch: rotate

				if ( scope.enableRotate === false ) return;
				if ( state !== STATE.TOUCH_ROTATE ) return; // is this needed?

				handleTouchMoveRotate( event );

				break;

			case 2: // two-fingered touch: dolly-pan

				if ( scope.enableZoom === false && scope.enablePan === false ) return;
				if ( state !== STATE.TOUCH_DOLLY_PAN ) return; // is this needed?

				handleTouchMoveDollyPan( event );

				break;

			default:

				state = STATE.NONE;

		}

	}

	function onTouchEnd( event ) {

		if ( scope.enabled === false ) return;

		handleTouchEnd( event );

		scope.dispatchEvent( endEvent );

		state = STATE.NONE;

	}

	function onContextMenu( event ) {

		if ( scope.enabled === false ) return;

		event.preventDefault();

	}

	// function originAxes( radius, height, mask ) {
	// 	// static originAxes() {
	// 	let origin = new THREE.Object3D();

	// 	//radiusTop, radiusBottom, height, segmentsRadius, segmentsHeight, openEnded
	// 	let ge3 = new THREE.CylinderGeometry( radius, radius, height, 4, 1 );
	// 	if ((mask & 1) != 0) {
	// 		let axeXMesh = new THREE.Mesh( ge3,
	// 			new THREE.MeshBasicMaterial( {
	// 			color: 0x00ff00 // Green
	// 			} )
	// 		);
	// 		axeXMesh.rotation.set( 0, 0, Math.PI / 2 );
	// 		axeXMesh.position.setX( height / 2 );
	// 		origin.add( axeXMesh );
	// 	}
	// 	if ((mask & 2) != 0) {
	// 		let axeYMesh = new THREE.Mesh( ge3,
	// 			new THREE.MeshBasicMaterial( {
	// 				color: 0xff0000, // Red
	// 				opacity: 0.7
	// 			} )
	// 		);
	// 		axeYMesh.position.setY( height / 2 );
	// 		origin.add( axeYMesh );
	// 	}
	// 	if ((mask & 4) != 0) {
	// 		let axeZMesh = new THREE.Mesh( ge3,
	// 			new THREE.MeshBasicMaterial( {
	// 				color: 0x0000ff, // Blue
	// 				opacity: 0.7
	// 			} )
	// 		);
	// 		axeZMesh.rotation.set( Math.PI / 2, 0, 0 );
	// 		axeZMesh.position.setZ( height / 2 );
	// 		origin.add( axeZMesh );
	// 	}
	// 	return origin;
	// }
	//

	scope.domElement.addEventListener( 'contextmenu', onContextMenu, false );

	scope.domElement.addEventListener( 'mousedown', onMouseDown, false );
	scope.domElement.addEventListener( 'wheel', onMouseWheel, false );

	scope.domElement.addEventListener( 'touchstart', onTouchStart, false );
	scope.domElement.addEventListener( 'touchend', onTouchEnd, false );
	scope.domElement.addEventListener( 'touchmove', onTouchMove, false );

	window.addEventListener( 'keydown', onKeyDown, false );

	// force an update at start

	this.update();

};

THREE.PlanetControls.prototype = Object.create( THREE.EventDispatcher.prototype );
THREE.PlanetControls.prototype.constructor = THREE.PlanetControls;

Object.defineProperties( THREE.PlanetControls.prototype, {

	center: {

		get: function () {

			console.warn( 'THREE.PlanetControls: .center has been renamed to .target' );
			return this.target;

		}

	},

	// backward compatibility

	noZoom: {

		get: function () {

			console.warn( 'THREE.PlanetControls: .noZoom has been deprecated. Use .enableZoom instead.' );
			return ! this.enableZoom;

		},

		set: function ( value ) {

			console.warn( 'THREE.PlanetControls: .noZoom has been deprecated. Use .enableZoom instead.' );
			this.enableZoom = ! value;

		}

	},

	noRotate: {

		get: function () {

			console.warn( 'THREE.PlanetControls: .noRotate has been deprecated. Use .enableRotate instead.' );
			return ! this.enableRotate;

		},

		set: function ( value ) {

			console.warn( 'THREE.PlanetControls: .noRotate has been deprecated. Use .enableRotate instead.' );
			this.enableRotate = ! value;

		}

	},

	noPan: {

		get: function () {

			console.warn( 'THREE.PlanetControls: .noPan has been deprecated. Use .enablePan instead.' );
			return ! this.enablePan;

		},

		set: function ( value ) {

			console.warn( 'THREE.PlanetControls: .noPan has been deprecated. Use .enablePan instead.' );
			this.enablePan = ! value;

		}

	},

	noKeys: {

		get: function () {

			console.warn( 'THREE.PlanetControls: .noKeys has been deprecated. Use .enableKeys instead.' );
			return ! this.enableKeys;

		},

		set: function ( value ) {

			console.warn( 'THREE.PlanetControls: .noKeys has been deprecated. Use .enableKeys instead.' );
			this.enableKeys = ! value;

		}

	},

	dynamicDampingFactor: {

		get: function () {

			console.warn( 'THREE.PlanetControls: .dynamicDampingFactor has been renamed. Use .dampingFactor instead.' );
			return this.dampingFactor;

		},

		set: function ( value ) {

			console.warn( 'THREE.PlanetControls: .dynamicDampingFactor has been renamed. Use .dampingFactor instead.' );
			this.dampingFactor = value;

		}

	}

} );
