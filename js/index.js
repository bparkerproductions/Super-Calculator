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
			App.equalLast();
		}
		return true;
	},

	equalLast: () =>{
		var objLength = Object.keys(Data.history).length;
		if(objLength > 0){
			App.prependLastResult(objLength);
			return true;
		}
		return false;
	},

	invertSign: () => {
		//BUG: inverted sign changes wrong signs in some situations
		var resultText = $("#result").text();
		numReg = /-?\+?\d+$/;

		//callback to be passed into try/catch
		var callback = ()=>{return resultText.match(numReg)[0];};
		var num = App.attemptOperation(callback);

		resultText = resultText.replace(num, (result) => {
			console.log(result);
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
		App.addHistory(newText);
		View.renderHistory(newText);
	},

	convertSigns: (text) =>{
		//converts calculator operators 
		//into .eval friendly commands

		//for multiplication 5(8), 100(10), etc
		var multiplyRegex = /\d+\((\d+\+?\-?\*?\/?\(?\)?){1,}\)/ig;
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

	//history functions
	addHistory: (resultText) => {
		var length = Object.keys(Data.history).length+1;
		var count = `op${length}`;
		Data.history[count] = resultText;
	},

	useHistory: (e) => {
		var text = $(e.target).text().trim();
		var operation = text.substring(0, text.indexOf('='));
		View.clearResult();
		View.appendToResult(operation);
	},

	prependLastResult: (objLength) =>{
		var recentEntry = Data.history[`op${objLength}`];
		var result = recentEntry.substr(recentEntry.indexOf("=")+1);
		View.prependPrevAnswer(result);
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
			$("#historyList").append(`<li><p>${Data.history[key]}</p></li>`);
		})
	},

	//History view functions
	clearHistory: () => {
		Data.history = {};
		$("#historyList").empty();
	},

	toggleError: (visible) => {
		visible ? $("#error").show() : $("#error").hide();
	},

	prependPrevAnswer: (result) => {
		View.appendToResult(result);
	}
}
