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
		}
	},

	calcResult: () => {
		var text = $("#result").text().replace(" ","");
		var result = eval(text);
		View.appendToResult(`=${result}`);
	},

	shortenNum: (num) => {
		var splitNum = num.split("");
		if(splitNum.length > 10){
			return splitNum.splice(1, 10).join("");
		}
		return num;
	}
}

var View = {
	init: () => {
		$("#history").hide();
	},

	appendToResult: (num) => {
		//var shortened = App.shortenNum(num);
		$("#result").append(num);
	},

	clearResult: () => {
		$("#result").text("");
	},

	toggleHistory: () =>{
		if($("#history").is(":visible")){
			$("#history").hide();
		}
		else{
			$("#history").show();
		}
	}
}
