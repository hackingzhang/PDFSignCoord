PDFJS.workerSrc = 'js/pdf.worker.min.js';
PDFJS.cMapUrl = 'cmaps/';
PDFJS.cMapPacked = true;

var scale = 1,
	canvas = document.getElementById('pdf_canvas'),
	context = canvas.getContext('2d'),
	pdfProxy = null,
	pages = 0,
	currentPage = 0;

var updateDisplay = function () {
	document.getElementById('zoom').innerHTML = Math.floor(scale * 100) + "%";
	document.getElementById('currentPage').innerHTML = currentPage;
	document.getElementById('pages').innerHTML = pages;
};

var load = function load(pdfData){
	PDFJS.getDocument({data: pdfData}).then(function(pdf){
		pdfProxy = pdf;
		pages = pdf.numPages;
		currentPage = 1;

		render(1);	// 渲染第一页
	}, function(reason){

	});
};

// 渲染页面
var render = function render(pageNum){
	if(!pageNum) {		// 如果pageNum不存在（未指定页码），默认渲染第一页
		pageNum = 1;
	}

	if(typeof pageNum === 'string'){		// 如果页码为字符串格式，转换为数字
		try{
			pageNum = parseInt(pageNum);
		} catch(err) {
			pageNum = 1;		// 如果转换失败，默认渲染第一页
		}
	}

	pdfProxy.getPage(pageNum).then(function(page){
		var viewport = page.getViewport(scale);

		canvas.height = viewport.height;
		canvas.width = viewport.width;

		page.render({
			canvasContext: context,
			viewport: viewport
		});
	}, function(reason){
		console.log(reason);
	});

	updateDisplay();
};

var previousPage = function previousPage(){
	if(--currentPage < 1){
		currentPage = 1;
	}
	
	render(currentPage);
	container.scrollTop = 0;	// 翻页完成后，滚动到容器（当前pdf页面）顶部
};

var nextPage = function nextPage(){
	if(++currentPage > pages){
		currentPage = pages;
	}

	render(currentPage);
	container.scrollTop = 0;
};

// 转到指定页码
var gotoPage = function gotoPage(){
	if(currentPage < 1){
		currentPage = 1;
	} else if(currentPage > pages){
		currentPage = pages;
	}

	render(currentPage);
	container.scrollTop = 0;
};

var zoomIn = function zoomIn(){
	scale = (scale + 0.1); // > 2.0 ? 2.0 : scale + 0.1;
	render(currentPage);
};

var zoomOut = function zoomOut(){
	scale = (scale - 0.1) < 0.1 ? 0.1 : scale - 0.1;
	render(currentPage);
};