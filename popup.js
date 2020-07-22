
var redirected_address ="http://game.granbluefantasy.jp/";
var port = chrome.extension.connect ({
	name: "code connect"
});
	port.onMessage.addListener(function(msg){
		if(msg.redirect != null){			
			redirected_address += msg.redirect;
		}
		else if(msg.img_enemy != null){
			document.getElementById("raid_on").style.display='block';
			//msg.img_enemy, msg.hp_enemy
			document.getElementById("img_enemy").src=msg.img_enemy;
			var gauge = document.getElementById("gauge");
			gauge.style.width = msg.hp_enemy+'%';
			gauge.innerHTML = msg.hp_enemy + "%";
		}
		else if(msg.popup != null)
		{
			//full people or ended battle
			//document.getElementById("raid_off").style.display='block';
			alert(msg.popup.body);
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
	//chrome.tabs.update({url: "https://" + temp + ".com"});
})
