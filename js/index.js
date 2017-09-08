$(document).ready(()=>{
	App.init();
	View.init();
})

var Data = {
	history: {}
}

var App = {
	init: () => {
		App.setEvents();
	},

	setEvents: () => {
		//main app listeners
		$(".button").click(App.selectNumber);
		$("#equals").click(App.calcResult);

		//view listeners
		$("#clear").click(View.clearResult);
		$(".fa-cog").click(View.toggleHistory);

		//history listeners
		$("#historyList").click(App.useHistory);
		$("#clear-history").on('click', View.clearHistory);
	},

	selectNumber: (e) => {
		var button = $(e.target).text();

		//check if user already calculated result
		App.nextOperation(button);

		var validate = App.validateInput(button);
		if(validate){View.appendToResult(button);}
	},

	validateInput: (button) => {
		var operators = ["/", "*", "+", "-", ".", "(", ")"];
		var resultText = $("#result").text().split("");
		var prevNum = resultText[resultText.length-1];

		//user tries to enter two operators in a row
		if(operators.includes(prevNum) && operators.includes(button)){
			//if it's a parens, it's okay
			if(button == "(" || button == ")"){
				//unless you try to enter two in a row
				if(prevNum == "("){
					return false;
				}
				return true;
			}
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
		var converted = App.convertSigns(text);

		try{
			//try to evaluate result
			var result = eval(converted);
			App.successfulCalc(result, text);
		}
		catch(err){
			//if eval doesn't work, let the user know
			View.toggleError(true);
		}
	},

	successfulCalc: (result, text) => {
		if(text.replace(" ","").trim() == ""){ 
			View.appendToResult(`0`); 
		}
		else{
			View.toggleError(false);
			View.appendToResult(`=${result}`);

			//get new text after appended result
			var newText = $("#result").text().replace(" ","");
			App.addHistory(newText);
			View.renderHistory(newText);
		}
	},

	convertSigns: (text) =>{
		//converts calculator operators 
		//into .eval friendly commands

		//for multiplication 5(8), 100(10), etc
		var multiplyRegex = /\d+\((\d+\+?\-?\*?\/?\(?\)?){1,}\)/ig;
		text.replace(multiplyRegex, (data)=>{
			console.log(data);
			text = data.replace("(", "*(");
		});

		return text;
	},

	//history functions
	addHistory: (resultText) => {
		var length = Object.keys(Data.history).length+1;
		var count = `op${length}`;
		Data.history[count] = resultText;
		console.log(Data.history);
	},

	useHistory: (e) => {
		var text = $(e.target).text().trim();
		var operation = text.substring(0, text.indexOf('='));
		View.clearResult();
		View.appendToResult(operation);
	},
}

var View = {
	init: () => {
		$("#history").hide();
		$("#error").hide();
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
	},

	//History view functions
	clearHistory: () => {
		Data.history = {};
		$("#historyList").empty();
	},

	toggleError: (visible) => {
		visible ? $("#error").show() : $("#error").hide();
	}
}
