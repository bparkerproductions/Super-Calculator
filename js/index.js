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
		View.appendToResult(button);
	},

	calcResult: () => {
		//var result;
		var text = $("#result").text().replace(" ","");
		var result = eval(text);
		console.log(result);
		/*
		for(var num in text){
			if(parseInt(text[num])){
				console.log('num')
			}
			else{
				console.log('operator')
			}
		}
		*/
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
