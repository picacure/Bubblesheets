/**
 * Created by admin on 14-10-21.
 */
// Wait for device API libraries to load
	//

(function(){
	if(!window._File){
		window._File = {};
	}

	_File.read = function(filename,callback){

		function readAsText(file) {
			var reader = new FileReader();
			reader.onloadend = function(evt) {

				callback(evt.target.result);
			};
			reader.readAsText(file);

		}

		function fail(error) {
			console.log(error.code);
		}

		if(window.isDeviceReady){
			window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function(fs){


				//创建子目录.
				fs.root.getDirectory("schedule", {create: true, exclusive: false}, function(dirEntry){

					dirEntry.getFile(filename, null, function(fileEntry){

						fileEntry.file(function(file){
							readAsText(file);
						}, fail);
					}, fail);

				}, fail);

			}, fail);
		}
	}
})();



(function(){
	if(!window._File){
		window._File = {};
	}

	window._File.write = function(filename,data){

		function gotFileEntry(fileEntry) {
			fileEntry.createWriter(gotFileWriter, fail);
		}

		function gotFileWriter(writer) {
			writer.seek(0);

			writer.onwriteend = function(evt) {
				console.log("写完");
			};
			writer.write(data);
		}

		function fail(error) {
			console.log(error.code);
		}

		if(window.isDeviceReady){
			window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function(fs){

				//创建子目录.
				fs.root.getDirectory("schedule", {create: true, exclusive: false}, function(dirEntry){

					dirEntry.getFile(filename, {create: true, exclusive: false}, gotFileEntry, fail);

				}, fail);


			}, fail);
		}
		else{
			console.log("_file.write device not ready");
		}
	}

})();
