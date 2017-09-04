$(document).ready(()=>{
	App.init();
	View.init();
})

var Data = {
	resultText: "",
	history: {}
}

var App = {
	init: () => {
		App.setEvents();
	},

	setEvents: () => {
		$(".button").click(App.selectNumber);
		$("#equals").click(App.calcResult);
		$("#clear").click(View.clearResult);
		$(".fa-cog").click(View.toggleHistory);
	},

	selectNumber: (e) => {
		var button = $(e.target).text();
		//check if user already calculated result
		App.nextOperation(button);

		var validate = App.validateInput(button);
		if(validate){View.appendToResult(button);}
		Data.resultText = $("#result").text().split("");
	},

	validateInput: (button) => {
		var operators = ["/", "*", "+", "-"];
		var resultText = Data.resultText;
		var prevNum = resultText[resultText.length-1];

		//user tries to enter two operators in a row
		if(operators.includes(prevNum) && operators.includes(button)){
			return false;
		}

		//user starts with operator
		if(operators.includes(button) && resultText.length == 0){
			return false;
		}
		return true;
	},

	nextOperation: (number) => {
		var resultText = $("#result").text().split("");
 
		if(resultText.includes("=")){
			View.clearResult();
			//App.addHistory(resultText);
			//View.renderHistory();
		}
	},

	calcResult: () => {
		var text = $("#result").text().replace(" ","");
		var result = eval(text);
		View.appendToResult(`=${result}`);

		//get new text after appended result
		var newText = $("#result").text().replace(" ","");
		App.addHistory(newText);
		View.renderHistory(newText);
	},

	//history functions
	addHistory: (resultText) => {
		var length = Object.keys(Data.history).length+1;
		var count = `op${length}`;
		Data.history[count] = resultText;
		console.log(Data.history);
	}
}

var View = {
	init: () => {
		$("#history").hide();
	},

	appendToResult: (num) => {
		$("#result").append(num);
	},

	clearResult: () => {
		$("#result").text("");
	},

	toggleHistory: () => {
		if($("#history").is(":visible")){
			$("#history").hide();
		}
		else{
			$("#history").show();
		}
	},

	renderHistory: () => {
		$("#historyList").empty();
		Object.keys(Data.history).forEach((key)=>{
			$("#historyList").append(`<li>${Data.history[key]}</li>`);
		})
	}
}
