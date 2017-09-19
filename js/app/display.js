var Display = {
	//logic and view models of the calculator's display
	setEvents: () => {
		$("#clear").click(Display.Views.clearResult);
		$(".fa-cog").click(History.Views.toggleHistory);
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
			else{
				result = result.replace("+","");
				return `-${result}`;
			}
		});
		Display.Views.clearResult();
		Display.Views.appendToResult(resultText);
	},

	shortenDisplay: (result) => {
		Display.Views.toggleError(false);
		result = App.shortenResult(result);
		Display.Views.appendToResult(`=${result}`);
	},

	Views:{
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
			Display.Views.appendToResult(result);
		}
	}
}