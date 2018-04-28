const materializeCss = require('./css/materialize.min.css');
const commonStyle = require('./sass/app.sass');
const ejs = require('./js/ejs.js');

var gradesListObj;

//jquery variables
$gradeListAccordian = $('#grades-list-accordian');
$gradesListTemplate = $('#grades-list-template');
//templates here
//templateFor Accordian
var accordianTemplate = $gradesListTemplate.html();

//curChapters
var curChap,curSub,curGrade;


//document.ready
$(function(){
	//inits here
  var elem = document.querySelector('.sidenav');
  var instance = M.Sidenav.init(elem);
  
  $('.tooltipped').tooltip();

  
  //main functions start here
  $.getJSON('/data.json', function(dat, textStatus) {
  		
  		gradesListObj = dat;
  		saveData(dat)
  		refreshDoc();
  		$('.collapsible').collapsible();	
		  

		  //click event of chapter
		  $('.chapters>li').click(function(event) {
		  	$this = $(this);
		  	remPrevActiveChap();
		  	$this.addClass('active')
		  	curChap = $this.data('chapter-id');
		  	curSub = $this.parent().parent().parent().data('subject-id');
		  	curGrade = $this.parent().parent().parent().parent().parent().parent().data('grade-id');
		  });
  });

});

function refreshDoc() {
	fetchData();
	appendElements(gradesListObj);
}

function fetchData() {
	gradesListObj = JSON.parse(localStorage.getItem('gradesList'));
}

function saveData(jsonData) {
	localStorage.setItem('gradesList',JSON.stringify(jsonData));
}

function appendElements(array) {
	var html = ejs.render(accordianTemplate,array);
	$gradeListAccordian.append(html);
}

function remPrevActiveChap(){
	var str = `.grade[data-grade-id="${curGrade}"] .subject[data-subject-id="${curSub}"] .chapter[data-chapter-id="${curChap}"]`;
	$prevChap = $(str);
	if($prevChap.length != 0)
		$prevChap.removeClass('active')
	console.log(curGrade);
}