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

var userName,password;

//document.ready
$(function(){
	isAuthenticated();
	//inits here
  var elem = document.querySelector('.sidenav');
  var instance = M.Sidenav.init(elem);
  
  $('.tooltipped').tooltip();
  $('.tabs').tabs();
  refreshDoc();
  //main functions start here
  $('#btn-login').click(login);
  $('#btn-sign-up').click(signUp);

  //for addding question
  $('#btn-add-question-answer').click(addQuestion)
});

function inits() {
	$('.collapsible').collapsible();	
		  

		  //click event of chapter
		  $('.chapters>li').click(toggleChapter);

		  //click event for add Grade
		  $('#btn-grade').click(addGrade);

		  //click event for adding subject
		  $('.btn-subject').click(addSubject);

		  //click event for adding chapter
		  $('.btn-chapter').click(addChapter);

	   $('.modal').modal();
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
	if(curChap != undefined)
		$('#btn-question').show();
	else
		$('#btn-question').hide();
}

function addGrade(e) {
	var $inputGrade = $('#input-grade')
	var value = $inputGrade.val();
	gradesListObj.gradesList.push({name: value,subjectList: []});
	saveData(gradesListObj);
	refreshDoc();
	M.toast({html: 'Grade Added!'})
}

function addSubject(e) {
	var id = +$(this).attr('id').split('-')[2];
	var $inputSubject = $('#input-subject-'+id);
	var value = $inputSubject.val();
	gradesListObj.gradesList[id].subjectList.push({name: value,chapterList: []});
	saveData(gradesListObj);
	refreshDoc();
	M.toast({html: 'Subject Added!'})
}

function addChapter(e) {
	var tempArr = $(this).attr('id').split('-');
	var gradeId = +tempArr[2];
	var subId = +tempArr[3];
	var $inputChapter = $('#input-chapter-'+gradeId+'-'+subId);
	var value = $inputChapter.val();
	gradesListObj.gradesList[gradeId].subjectList[subId].chapterList.push({name: value,questionList: []});
	saveData(gradesListObj);
	refreshDoc();
	M.toast({html: 'Chapter Added!'})
}

function addQuestion(e) {
	var inputQuestion = $('#input-question').val();
	var inputAnswer = $('#input-answer').val();
	gradesListObj.gradesList[curGrade].subjectList[curSub].chapterList[curChap].questionList.push({question: inputQuestion,answer: inputAnswer});
	saveData(gradesListObj);
	refreshDoc();
	M.toast({html: 'Question Added!'})
}

function login() {
	var auth = JSON.parse(localStorage.getItem('auth'));
	console.log(auth);
	if(userName ==undefined || password == undefined || auth==null){
		M.toast({html: 'Please Sign Up first'})
	}else{
		userName = auth.username;
		password = auth.password;
		var inputUserName = $('#login_user_name').val();
		var inputPassword = $('#login_password').val();
		if(inputUserName == userName){
			if(inputPassword == password){
				$('#section-1').hide('fast', function() {
					$('#section-2').show('fast',function () {
						
					})
				});
			}else{
				M.toast({html: 'Password do not match!'})
			}
		}else{
				M.toast({html: 'in correct username'})
			}
	}
}

function signUp() {
	var inputUserName = $('#sign_up_user_name').val();
	var inputPassword = $('#sign_up_password').val();
	userName = inputUserName;
	password = inputPassword;
	localStorage.setItem('auth',JSON.stringify({username: userName,password: password}));
	M.toast({html: 'Saved! You can now login :)'})
}

function isAuthenticated() {
	var auth = JSON.parse(localStorage.getItem('auth'));
	if (auth) {
		$('#section-1').hide();
		$('#section-2').show();
	}else{
		$('#section-1').show();
	}
}