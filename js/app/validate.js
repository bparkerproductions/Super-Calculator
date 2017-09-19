var Validate = {
	validateInput: (button) => {
		var operators = ["/", "*", "+", "-", ".", "(", ")"];
		var resultText = $("#result").text().split("");
		var prevNum = resultText[resultText.length-1];

		var operate = Validate.validateOperators(prevNum, button, operators);
		var floatPoints = Validate.validateFloats(resultText, button);
		var parens = Validate.validateParens(resultText, button);

		if(operate !== undefined) return operate;
		if(floatPoints !== undefined) return floatPoints;
		console.log(parens);
		if(parens !== undefined) return parens;

		//user starts with operator
		if(operators.includes(button) && resultText.length == 0){
			return Data.history ? App.equalLast() : false;
		}
		return true;
	},

	validateOperators: (prevNum, button, operators) => {
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
	},

	validateFloats: (text, button) => {
		var operatorRegex = /(\+|\-|\*|\/)/g;
		text = text.join("").split(operatorRegex);
		textGroup = text[text.length-1];

		if(textGroup.includes('.') && button == "."){
			return false
		}
	},

	validateParens: (resultText, button) =>{
		//enforces equal amounts of closed and open parens
		resultText = resultText.join("");
		var fullText = `${resultText}${button}`.split("");
		var rightCount = 0;
		var leftCount = 0;
		var validate = undefined;

		for(var e=0; e<resultText.length; e++){
			if(fullText[e] == ")") rightCount++;
			if(fullText[e] == "(") leftCount++;
			if(rightCount > leftCount) validate = false;
		}
		return validate;
	},
}