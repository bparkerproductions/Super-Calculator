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
		$("#plus-minus").click(App.invertSign);

		//view listeners
		$("#clear").click(View.clearResult);
		$(".fa-cog").click(History.Views.toggleHistory);

		History.setEvents();
	},

	selectNumber: (e) => {
		var button = $(e.target).text();

		//check if user already calculated result
		App.nextOperation(button);

		var validate = Validate.validateInput(button);
		if(validate){View.appendToResult(button);}
	},

	invertSign: () => {

		var resultText = $("#result").text();
		//take regex with -, +, or any# of digits(optional)
		//and the rest of the numbers 
		var numReg = /-?\+?\d+?\.?\d+$/;

		resultText = resultText.replace(numReg, (result) => {
			//replace - with + at beginning, and vice versa
			if(result.includes("-")){
				return result.replace("-", "+");
			}
			{
				result = result.replace("+","");
				return `-${result}`;
			}
		});

		View.clearResult();
		View.appendToResult(resultText);
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
			var result = eval(converted);
			App.successfulEval(result, text);
		}
		catch(err){
			console.log(err);
			App.evalError(text);
		}
	},

	successfulEval: (result, text) => {
		if(text.replace(" ","").trim() == ""){ 
			View.appendToResult(`0`); 
		}
		else{
			App.successfulCalc(result);
		}
	},

	evalError: (text) => {
		if(text.includes("=")){
			View.clearResult();
		}
		else{
			View.toggleError(true);
		}
	},

	successfulCalc: (result) => {
		View.toggleError(false);
		result = App.shortenResult(result);
		View.appendToResult(`=${result}`);

		//get new text after appended result
		var newText = $("#result").text().replace(" ","");
		History.addHistory(newText);
		History.Views.renderHistory(newText);
	},

	convertSigns: (text) =>{
		//converts calculator operators 
		//into .eval friendly commands

		//for multiplication 5(8), 100(10), etc
		var multiplyRegex = /\d+\((\d+\+?\-?\.?\*?\/?\(?\)?){1,}\)/ig;
		text.replace(multiplyRegex, (data)=>{
			text = data.replace("(", "*(");
		});

		return text;
	},

	attemptOperation: (operation) => {
		try{
			View.toggleError(false);
			var result = operation();
			return result;
		}
		catch(err){
			View.toggleError(true);
			console.log(err);
		}
	},

	shortenResult: (result) => {
		var resultStr = result.toString();

		var callback = ()=>{return resultStr.includes(".") ? result = result.toFixed(4) : result;}
		var result = App.attemptOperation(callback);

		return result;
	}
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

	toggleError: (visible) => {
		visible ? $("#error").show() : $("#error").hide();
	},

	prependPrevAnswer: (result) => {
		View.appendToResult(result);
	}
}
