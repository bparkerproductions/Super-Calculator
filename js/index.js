$(document).ready(()=>{
	App.init();
	View.init();
})

var Data = {
	resultText: ""
}

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

		var validate = App.validateInput(button);
		if(validate){View.appendToResult(button);}
		Data.resultText = $("#result").text().split("");
	},

	validateInput: (button) => {
		var operators = ["/", "*", "+", "-"];
		var resultText = Data.resultText;
		var prevNum = resultText[resultText.length-1];
		if(operators.includes(prevNum) && operators.includes(button)){
			return false;
		}
		return true;
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
