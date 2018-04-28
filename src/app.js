const materializeCss = require('./css/materialize.min.css');
const commonStyle = require('./sass/app.sass');
const ejs = require('./js/ejs.js');

var gradesListObj;

//jquery variables
$gradeListAccordian = $('#grades-list-accordian');
$gradesListTemplate = $('#grades-list-template');
$questionCardTemplate =$('#question-card-template');
$questionsContainer = $('#questions-container');
$pageHeaderTemplate = $('#page-header-template');

//templates here
//templateFor Accordian
var accordianTemplate = $gradesListTemplate.html();
var questionTemplate = $questionCardTemplate.html();
var pageHeaderTemplate = $pageHeaderTemplate.html();
//curChapters
var curChap,curSub,curGrade;


//document.ready
$(function(){
	//inits here
  var elem = document.querySelector('.sidenav');
  var instance = M.Sidenav.init(elem);
  
  $('.tooltipped').tooltip();

  refreshDoc();
  //main functions start here
  
});

function inits() {
	$('.collapsible').collapsible();	
		  

		  //click event of chapter
		  $('.chapters>li').click(toggleChapter);

		  //click event for add Grade
		  $('#btn-grade').click(addGrade);
}

function refreshDoc() {
	fetchData();
	appendElements(gradesListObj);
}

function fetchData() {
	gradesListObj = JSON.parse(localStorage.getItem('gradesList'));
	if(gradesListObj == undefined){
		$.getJSON('/data.json', function(dat, textStatus) {
				gradesListObj = dat;
				saveData(dat)
		});
	}
}

function saveData(jsonData) {
	localStorage.setItem('gradesList',JSON.stringify(jsonData));
}

function appendElements(obj) {
	var accordianHtml = ejs.render(accordianTemplate,obj);
	$gradeListAccordian.html(accordianHtml);
	var questionsHtml = ejs.render(questionTemplate, obj);
	$questionsContainer.html(questionsHtml);
	var pageHeaderHtml = ejs.render(pageHeaderTemplate, {"curGrade": curGrade,"curSub": curSub,"curChap": curChap,"gradesList": obj.gradesList});
	$('#page-header-container').html(pageHeaderHtml);
	inits();
}

function remPrevActiveChap(){
	var query = `.grade[data-grade-id="${curGrade}"] .subject[data-subject-id="${curSub}"] .chapter[data-chapter-id="${curChap}"]`;
	$prevChap = $(query);
	if($prevChap.length != 0){
		$prevChap.removeClass('active');
		//remove previous questions
		$(`.${curGrade}-${curSub}-${curChap}`).hide();
	}
}

function toggleChapter(event) {
	$this = $(this);
	remPrevActiveChap();
	$this.addClass('active')
	curChap = $this.data('chapter-id');
	curSub = $this.parent().parent().parent().data('subject-id');
	curGrade = $this.parent().parent().parent().parent().parent().parent().data('grade-id');
	//show current questions
	$(`.${curGrade}-${curSub}-${curChap}`).show();
	$('#placeholder-text').hide();
	//display page Header
	var pageHeaderHtml = ejs.render(pageHeaderTemplate, {"curGrade": curGrade,"curSub": curSub,"curChap": curChap,"gradesList": gradesListObj.gradesList});
	$('#page-header-container').html(pageHeaderHtml);
}

function addGrade(e) {
	console.log('hello');
	var $inputGrade = $('#input-grade')
	var value = $inputGrade.val();
	gradesListObj.gradesList.push({name: value,subjectList: []});
	saveData(gradesListObj);
	refreshDoc();
}