
var redirected_address ="http://game.granbluefantasy.jp/";

var port = chrome.extension.connect ({
	name: "code connect"
});

window.onload=function(){
	var multiCode = document.getElementById("multiCode");
	multiCode.value="";
	multiCode.focus();
	document.execCommand('paste');
	var code = multiCode.value;
	port.postMessage(code);
	port.onMessage.addListener(function(msg){
		if(msg.redirect != null){			
			redirected_address += msg.redirect;
		}
		else if(msg.img_enemy != null){
			console.log(msg.img_enemy);
		}
		else
		{			
			console.log("msg-error!");
			console.log(msg);
		}
	});
}

document.getElementById('battle').addEventListener('click',function(event){
	chrome.tabs.update({url: redirected_address});
	//chrome.tabs.update({url: "https://" + temp + ".com"});
})
