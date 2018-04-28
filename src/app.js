const materializeCss = require('./css/materialize.min.css');
const commonStyle = require('./sass/app.sass');
const ejs = require('./js/ejs.js');

var gradeList = [];

$(function(){
	//inits here
  var elem = document.querySelector('.sidenav');
  var instance = M.Sidenav.init(elem);
  
  $('.tooltipped').tooltip();

  //main functions start here
  var str = $('#grades-list-template').html();
  $.getJSON('/data.json', function(dat, textStatus) {
  		var html = ejs.render(str,dat);
  		$('#grades-list-accordian').append(html);
  		$('.collapsible').collapsible();	
  });
  // var html = ejs.render();

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