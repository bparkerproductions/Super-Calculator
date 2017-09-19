var History = {
	setEvents: () => {
		$("#historyList").click(History.useHistory);
		$("#clear-history").on('click', History.Views.clearHistory);
	},

	addHistory: (resultText) => {
		var length = Object.keys(Data.history).length+1;
		var count = `op${length}`;
		Data.history[count] = resultText;
	},

	useHistory: (e) => {
		var text = $(e.target).text().trim();
		var operation = text.substring(0, text.indexOf('='));
		Display.Views.clearResult();
		Display.Views.appendToResult(operation);
	},

	prependLastResult: (objLength) =>{
		var recentEntry = Data.history[`op${objLength}`] || {};
		var result = recentEntry.substr(recentEntry.indexOf("=")+1);
		Display.Views.prependPrevAnswer(result);
	},

	equalLast: () =>{
		//takes recent history item and append it to calc
		var objLength = Object.keys(Data.history).length;
		History.prependLastResult(objLength);
		return true;
	},


	Views: {
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

		clearHistory: () => {
			Data.history = {};
			$("#historyList").empty();
		},
	}
}