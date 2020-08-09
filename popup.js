
var redirected_address ="http://game.granbluefantasy.jp/";
var port = chrome.extension.connect ({
	name: "code connect"
});
	port.onMessage.addListener(function(msg){
		if(msg.redirect != null){			
			redirected_address += msg.redirect;
		}
		else if(msg.img_enemy != null){
			var el = document.getElementById("raid_on");
			el.style.display='block';
			//msg.img_enemy, msg.hp_enemy 
			document.getElementById("img_enemy").src=msg.img_enemy;
			document.getElementById("gauge").innerHTML = msg.hp_enemy + "%";
			document.getElementById("inner").style.width = msg.hp_enemy +'%';
		}
		else
		{
			console.log("msg-error!");
			console.log(msg);
		}
	});
window.onload=function(){
	var multiCode = document.getElementById("multiCode");
	multiCode.value = "";
	multiCode.focus();
	document.execCommand('paste');
	var code = multiCode.value;
}

document.getElementById('img_enemy').addEventListener('click',function(event){				
	chrome.tabs.update({url: redirected_address});
});


