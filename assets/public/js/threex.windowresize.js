/** @namespace */
var THREEx	= THREEx || {}

/**
 * Update renderer and camera when the window is resized
 * 
 * @param {Object} renderer the renderer to update
 * @param {Object} Camera the camera to update
 * @param {Function} dimension callback for renderer size
 * @param {Object} object 3D object to look and zoom at window resize
 * @param {Object} controls OrbitControls for mouse input
 * 
*/
THREEx.WindowResize	= function(renderer, camera, dimension, object, tanFOV,controls){
	dimension 	= dimension || function(){ return { width: window.innerWidth, height: window.innerHeight } }
	var callback	= function(){
		// fetch target renderer size
		var rendererSize = dimension();
		// notify the renderer of the size change
		renderer.setSize( rendererSize.width, rendererSize.height )
		// update the camera
		camera.aspect	= rendererSize.width / rendererSize.height
		//camera.fov = ( 360 / Math.PI ) * Math.atan( tanFOV * ( rendererSize.width, rendererSize.height ) );
		camera.updateProjectionMatrix()
	}
	// bind the resize event
	window.addEventListener('resize', callback, false)
	// return .stop() the function to stop watching window resize
	return {
		trigger	: function(){
			callback()
		},
		/**
		 * Stop watching window resize
		*/
		destroy	: function(){
			window.removeEventListener('resize', callback)
		}
	}
}
