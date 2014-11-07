/**
 * Created by admin on 14-10-25.
 */

(function(){
	window.isDeviceReady = false;
	document.addEventListener("deviceready", function(){
		window.isDeviceReady = true;
	}, false);
})();