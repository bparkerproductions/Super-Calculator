$(document).ready(()=>{
	App.init();
	View.init();
})

var App = {
	init: () => {
		App.setEvents();
	},

	setEvents: () => {
		$(".button").click(App.selectNumber);
		$("#equals").click(App.calcResult);
		$("#clear").click(View.clearResult);
	},

	selectNumber: (e) => {
		var button = $(e.target).text();
		var resultText = $("#result").text().replace(" ","").split("");
		var lastSelected = resultText[resultText.length-1];
		if(lastSelected === undefined){ lastSelected = 's'}
		console.log(lastSelected)
		View.appendToResult(button);
	},

	calcResult: () => {
		var text = $("#result").text().replace(" ","");
		var result = eval(text);
		View.appendToResult(`=${result}`)
	},

	doOperation: () => {

	}
}

var View = {
	init: () => {
		
	},

	appendToResult: (num) => {
		$("#result").append(num);
	},

	clearResult: () => {
		$("#result").text("");
	}
}
