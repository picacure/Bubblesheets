/**
 * Created by admin on 14-10-21.
 */
(function(){

	/**
	 * 重写console.log方法，便于在移动端查看log日志。
	 * 可通过选择器`.debug-log`来设置日志div容器的样式。
	 */
	var console = window.console || {};
	var oldLog = console.log;
	console.log = function(){
		var args = [].slice.call(arguments);
		oldLog && oldLog.apply(console, args);

		var msg = '';
		for(var i = 0, obj, len = args.length; i < len; i++){
			obj = args[i];

			// try{
			//     obj = JSON.stringify(obj);
			// }catch(e){ };

			if(typeof obj === 'string'){
				obj = obj.replace(/</g, '&lt;').replace(/>/g, '&gt;');
			}

			if(i == 0) msg = obj;
			else msg += ', ' + obj;
		}

		var logContainer = this._logContainer || (this._logContainer = getLogContainer());
		logContainer.innerHTML += '> ' + msg + '<br/>';
		logContainer.scrollTop = logContainer.scrollHeight - logContainer.clientHeight;
	};

	function getLogContainer(){
		var elem = document.createElement('div'), style = elem.style;
		elem.className = 'debug-log';
		style.position = 'absolute';
		style.top = '0';
		style.left = '0';
		style.width = '100%';
		style.maxHeight = '200px';
		style.boxSizing = 'border-box';
		style.font = '12px Courier New';
        style.color = 'red';
		style.backgroundColor = 'rgba(0,0,0,0.2)';
		style.wordWrap = 'break-word';
		style.wordBreak = 'break-all';
		style.overflowY = 'scroll';
		style.padding = '25px 5px';
		style.zIndex = 1e6;
		document.documentElement.appendChild(elem);
		return elem;
	}

})();