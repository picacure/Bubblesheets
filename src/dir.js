/**
 * Created by admin on 14-10-21.
 */
(function(){
	if(!window._dir){
		window._dir = {};
	}

	// Get a directory reader
	_dir.listAllFiles = function(callback){
		function success(entries) {
			callback(entries);
		}

		function fail(error) {
			alert("Failed to list directory contents: " + error.code);
		}

		window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function(fs){

			//创建子目录.
			fs.root.getDirectory("schedule", {create: true, exclusive: false}, function(dirEntry){
				var directoryReader = dirEntry.createReader();
				directoryReader.readEntries(success,fail);
			}, fail);
		}, fail);
	}

	_dir.removeAllFile = function(callback){

		function removefile(filename){

			window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function(fs){
				fs.root.getDirectory("schedule", {create: false, exclusive: false}, function(dirEntry){

					//获取指定目录
					dirEntry.getFile(filename, {create: false, exclusive: false}, function(fileEntry){
						fileEntry.remove(success, fail);
					}, fail);
				}, fail);

			}, fail);
		}

		function success(entry) {
			console.log("Removal succeeded");
		}

		function fail(error) {
			console.log("Error removing file: " + error.code);
		}

		_dir.listAllFiles(function(files){

			for(var i = 0,len = files.length; i < len; i++){

				(function(idx,len){
					removefile(files[idx].name);
					if(idx == len - 1) callback();
				})(i,len);
			}

			if(len == 0) callback();
		});
	}
})()