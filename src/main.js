/**
 * Created by admin on 14-10-25.
 */
(function(){

	document.addEventListener("deviceready", function(){

		//表格数据.
		var tbData;

		var currFileName;

		function showAllFiles(){
			//文件操作.
			_dir.listAllFiles(function(files){
				$('#files').html("");
				$('#files').append('<div class="file" data-create="new" data-name="' + (new Date()).getMilliseconds() + '.json">+</div>');

				for (var i= 0,len = files.length; i< len; i++) {
					$('#files').append('<div class="file" data-create="old" data-name="' + files[i].name + '">blank' + (i+1) + '</div>')
				}
			});
		}

		showAllFiles();



		$('#files').delegate('.file','touchstart',function(){
			var $this = $(this);

			currFileName = $this.data('name');
			var isNew = $this.data('create');

			function newfile(){
				//新创建需要重新绑定 滑动创建表格事件.
				tbData = [];
				_File.write(currFileName,'',function(){
					$('#handTip').removeClass('hide').bind('touchstart',touchStart).bind('touchmove',touchMove).bind('touchend',touchEnd);
					$('#files').addClass('hide');

					$('#tbs-shadow').removeClass('hide');
				});
			}

			if(isNew == 'new'){
				$("#handTip").removeClass('hide');
				newfile();
			}
			else{

				_File.read(currFileName,function(result){
					var data;

//					alert(result);
					try{
						data = JSON.parse(result);
					}
					catch(e) {
						//alert("文件读取错误->" + e);
						newfile();
						return;
					}

					try{
						//读取正常。
						if($.isArray(data)){
							tbData = data;
							var cols = data[0].length;
							var rows = data.length;
							var domStr = "";
							for(var i = 0; i < rows; i++){
								domStr += '<tr>';
								for(var j = 0; j < cols; j++){

									//泡泡
									if(j != 0 && i != 0){
										var icon = "×";
										if(data[i][j] == 'ripe') {
											icon = "√";
										}
										domStr += '<td data-row="' + i + '" data-col="' + j + '"><span class="' + data[i][j] + '">'+ icon +'</span></td>';
									}
									//h2标题
									else if(i == 0 && j == 0){
										$('h2').text(data[0][0] || "ATTENDANCE SHEET");

										domStr += '<td class="rowColsInfo" data-row="' + i + '" data-col="' +
											j + '"><span></span></td>';
									}
									else{
										domStr += '<td class="rowColsInfo" data-row="' + i + '" data-col="' +
											j + '"><span>' + data[i][j] + '</span></td>';
									}
								}
								domStr += '</tr>';
							}

							$('#tbs').removeClass('hide');
							$('#files').addClass('hide');
							$("#tbs table").html(domStr).addClass('bd');
						}
						else{
							tbData = [];
							$('#handTip').removeClass('hide');
							$('#files').addClass('hide');
						}
					}
					catch (e){
						tbData = [];
						$('#handTip').removeClass('hide');
						$('#files').addClass('hide');
					}
				});
			}
		});


		function touchStart(ex){
			var e = ex.originalEvent;
			e.preventDefault();

			startPoint.x = e.touches[0].clientX;
			startPoint.y = e.touches[0].clientY;

			$("#result").removeClass('hide');
		}

		var cellH = 30;
		var cellW = 40;
		var maxCols = Math.floor(document.clientWidth/cellW) - 1;
		var maxRows = Math.floor(document.clientHeight/cellH) - 1;
		function touchMove(ex){
			var e = ex.originalEvent;
			e.preventDefault();

			midPoint.x = e.changedTouches[0].clientX;
			midPoint.y = e.changedTouches[0].clientY;

			var cols = Math.floor(Math.abs(midPoint.x - startPoint.x)/cellW);
			var rows = Math.floor(Math.abs(midPoint.y - startPoint.y)/cellH);

			if(cols <= 0) cols = 0;
			if(cols > maxCols) cols = maxCols;
			if(rows <= 0) rows = 0;
			if(rows > maxRows) rows = maxRows;

			var disC = ((cols - 1) < 0 ? 0: (cols - 1));
			var disR = ((rows - 1) < 0 ? 0: (rows - 1));

			$("#result").css({
				left: (midPoint.x - 100) + "px",
				top: (midPoint.y - 70) + "px"
			}).text(disR + "*" + disC);

			//提示线.
			$("#line").css({
				width: midPoint.x,
				height:midPoint.y
			});
		}


		function touchEnd(ex){
			var e = ex.originalEvent;
			e.preventDefault();

			endPoint.x = e.changedTouches[0].clientX;
			endPoint.y = e.changedTouches[0].clientY;

			var cols = Math.floor(Math.abs(endPoint.x - startPoint.x)/cellW);
			var rows = Math.floor(Math.abs(endPoint.y - startPoint.y)/cellH);

			if(cols <= 0) cols = 3;
			if(cols > maxCols) cols = maxCols;
			if(rows <= 0) rows = 3;
			if(rows > maxRows) rows = maxRows;

			tbData = [];

			var domStr = "";
			for(var i = 0; i < rows; i++){
				domStr += '<tr>';
				var rowData = [];
				for(var j = 0; j < cols; j++){
					if(i != 0 && j != 0){
						domStr += '<td data-row="' + i + '" data-col="' + j + '"><span class="raw">×</span></td>';

						//默认加入未被点击的样式
						rowData.push('raw');
					}
					else{
						//默认头部列头，行头文字.
						if(i == 0 && j != 0){
							rowData.push('Week');

							domStr += '<td class="rowColsInfo" data-row="' + i + '" data-col="' +
								j + '"><span>Week</span></td>';
						}
						else if(i != 0 && j == 0){
							rowData.push('Name');

							domStr += '<td class="rowColsInfo" data-row="' + i + '" data-col="' +
								j + '"><span>Name</span></td>';
						}
						else{
							rowData.push('');
							domStr += '<td class="rowColsInfo" data-row="' + i + '" data-col="' +
								j + '"></td>';

							$('h2').text('ATTENDANCE SHEET');
						}
					}
				}
				domStr += '</tr>';

				tbData.push(rowData);
			}

			$("#line").css({
				width: 0,
				height:0
			});


			$('#tbs-shadow').addClass('hide');

			$('#tbs').removeClass('hide');
			$("#tbs table").html(domStr).addClass('bd');
			$("#result").addClass('hide');

			$("#handTip").unbind('touchstart').unbind('touchmove').unbind('touchend').addClass('hide');
		}

		var startPoint = {};
		$("#handTip").bind('touchstart',touchStart);

		var midPoint = {};
		$("#handTip").bind('touchmove',touchMove);

		var endPoint = {};
		$("#handTip").bind('touchend',touchEnd);

		//泡泡
		function cellTouch(ex){
			var $this = $(this);
			//改变model，view.
			var row = $this.data('row');
			var col = $this.data('col');

			var $span = $this.find('span');

			if($span.hasClass('raw')){
				tbData[row][col] = 'ripe';
				$span.removeClass('raw').addClass('ripe').text("√");
			}
			else if($span.hasClass('ripe')){
				tbData[row][col] = 'raw';
				$span.removeClass('ripe').addClass('raw').text("×");
			}
			else{

			}

			ex.preventDefault();
		}

		//泡泡
		$("#tbs").delegate('td','touchstart',cellTouch);

		//点击标题
		$(document).delegate('.rowColsInfo','touchstart',function(){

			var $this = $(this);
			var w = $this.css('width');
			var h = $this.css('height');
			var $input = $('<input style="z-index: 100; position: absolute; display:block; left: 0px; top:0px;">');

			var row = $this.data('row');
			var col = $this.data('col');

			$input.css({
				'width': parseInt(w) - 9,
				'height': parseInt(h) - 3
			})
			$input.appendTo($this);

			//渲染需要一定时间.
			setTimeout(function(){
				$input.focus();
			},100)

			$input.on('input',function(){
				tbData[row][col] = $input.val();
			})

			$input.focusout(function(){
				$this.text(tbData[row][col]);
				$input.unbind().hide().remove();
			})

		});

		$(document).delegate('h2','touchstart',function(){

			var $this = $(this);
			var w = $this.css('width');
			var h = $this.css('height');
			var $input = $('<input style="z-index: 100; position: absolute; display:block; left: 0px; top:0px;">');


			$input.css({
				'width': parseInt(w) - 9,
				'height': parseInt(h) - 3
			})
			$input.appendTo($this);

			$input.on('input',function(){
				tbData[0][0] = $input.val();
			})

			$input.focusout(function(){
				$this.text(tbData[0][0]);
				$input.unbind().hide().remove();
			})

		});

		$(".close").bind('touchstart',function(){


			_File.write(currFileName,JSON.stringify(tbData),function(){
				$("#tbs").animate({
					foo:100
				},{
					duration: 600,
					step: function(v){
						$(this).css('-webkit-transform','scale('+ (100-v)/100 +')');
					},
					complete: function(){

						//重置.
						this.foo = 1;

						$("#tbs").addClass('hide').css("-webkit-transform","scale(1)");
						showAllFiles();
						$('#files').removeClass('hide');
					}
				})
			});
		})

		$(".mail").bind('touchstart',function(){
			window.location.href = "mailto:email@echoecho.com?subject=BubbleSheet&body=" + $("#tbs-table").html();
		})

	}, false);
})();