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
		$("#plus-minus").click(Display.invertSign);

		Display.setEvents();
		History.setEvents();
	},

	selectNumber: (e) => {
		var button = $(e.target).text();

		//check if user already calculated result
		App.nextOperation(button);

		var validate = Validate.validateInput(button);
		if(validate){Display.Views.appendToResult(button);}
	},

	nextOperation: (number) => {
		var resultText = $("#result").text().split("");
 
		if(resultText.includes("=")){
			Display.Views.clearResult();
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
			//console.log(err);
			App.evalError(text);
		}
	},

	successfulEval: (result, text) => {
		if(text.replace(" ","").trim() == ""){ 
			Display.Views.appendToResult(`0`); 
		}
		else{
			App.successfulCalc(result);
		}
	},

	evalError: (text) => {
		if(text.includes("=")){
			Display.Views.clearResult();
		}
		else{
			Display.Views.toggleError(true);
		}
	},

	successfulCalc: (result) => {
		Display.shortenDisplay(result);

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
			Display.Views.toggleError(false);
			var result = operation();
			return result;
		}
		catch(err){
			Display.Views.toggleError(true);
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
	}
}
