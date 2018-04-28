const materializeCss = require('./css/materialize.min.css');
const commonStyle = require('./sass/app.sass');
const ejs = require('./js/ejs.js');

var gradeList = [];

$(function(){
	//inits here
  var elem = document.querySelector('.sidenav');
  var instance = M.Sidenav.init(elem);
  
  $('.collapsible').collapsible();	
  $('.tooltipped').tooltip();

  //main functions start here
  var str = $('#grade-list-accordian').html();
  console.log(str);

});

function refreshDoc() {
	fetchData();
	appendElements();
}

function fetchData(argument) {
	// body...
}

function saveData(argument) {
	// body...
}

function appendElements(argument) {
	// body...
}