//set variable
var source_domain = "http://game.granbluefantasy.jp";
var uid = "";	//user-id
var x_ver = "";	//x-version
var redirected_address ="http://game.granbluefantasy.jp/";
setversion();
function ascii_to_char(str)
{
	var return_val="";
	for(var i = 0; i<str.length;i++)
	{
		if(str.charAt(i)=="%")
		{
			var t = str.substr(i+1,2);
			return_val += String.fromCharCode(parseInt(t,16));
			i+=2;
		}
		else
			return_val += str.charAt(i);
	}
	return return_val;
}
function setversion()
{
	$.ajax({
		url:source_domain,
		type: "GET",
		success:function(result) {
			//serarch game.version
			var string_result = result;
			var n = string_result.search("Game.version");
			x_ver = string_result.substr(n+16,10);
			n = string_result.search("Game.userId");
			var uid_ary = string_result.substr(n+14,9).split(";");
			uid = uid_ary[0];
			//console.log(x_ver);
			//console.log(uid);
		},
		error:function(request,status,error){
			console.log("get X-version error!");
		}
	});
}
function getBattleKey(battle_key_check_domain,bat_key,port,mode)
{
	$.ajax({
		url: battle_key_check_domain,
		type: "POST",
		dataType: "json",
		contentType:"application/json",
		headers: {
			'X-Requested-With': 'XMLHttpRequest',
			'X-VERSION' : x_ver
		},
		data:
		JSON.stringify({
			"special_token": null,
			"battle_key":bat_key
		}),
		success:function(result) {
			port.postMessage(result);
			if(result.redirect == null)
			{
				//seed 부족, 인원 꽉참, 시간지남, battle 사라짐 등등 기타상화들				
				console.log(result);
				alert(result.popup.body);
				return;
			}
			var string_redirect = result.redirect;
			var url_array = string_redirect.split('/');
			var battle_data_url = source_domain + "/quest/content/supporter_raid/" + url_array[2] + "/" + url_array[5] + "/0?_=" + Date.now() + "&t=" + Date.now() + "&uid=" + uid;			
			if(mode == 'popup')
			{
				setEnemyData(battle_data_url,port);	
			}				
			else
			{
				chrome.tabs.update({url: redirected_address + result.redirect});
			}
		},
		error:function(request,status,error){
			console.log("get battle_key error!");
			setversion();
		}
	});
}
function setEnemyData(battle_data_url,port)
{
	$.ajax({
			url: battle_data_url,
			dataType:"json",
			contentType:"application/json",				
			headers: {
				'X-Requested-With' : 'XMLHttpRequest',
				'X-VERSION' : x_ver
			},
			success:function(result) {
				//set json 
				var post_msg = JSON.parse('{"img_enemy":"", "hp_enemy":""}');
				//search raid data					
				//raid_img search
				var string_result = result.data;
				var string_temp = string_result.substr(string_result.search("img-enemy"),200);
				var img_enemy = string_temp.substr(0,string_temp.search(".png")+4);
				img_enemy = img_enemy.substr(img_enemy.search("http"));
				//HP search
				string_temp = string_result.substr(string_result.search("prt-raid-gauge-inner"),200);
				var hp_enemy = string_temp.substr(string_temp.search("width") + 11,2);
					//set ascii to string
				img_enemy = ascii_to_char(img_enemy);
				post_msg.img_enemy = img_enemy;
				post_msg.hp_enemy = hp_enemy;
				port.postMessage(post_msg);
			},
			error:function(request,status,errror){
				console.log("get supporter raid error!");
				setversion();
			}
	});
}
function codeCheck(code)
{
	if(code.length == 8)
	{
		var re = /[A-Z0-9a-z]/;
		for(var i = 0;i<code.length;i++)
		{
			if(re.test(code[i]))
				continue;
			else
				return false;
		}
	}
	else
		return false;
	return true;
}

function connect(port,mode)
{
	//popup on load
	if(uid=="0")
	{
		setversion();
		if(uid == "0")
		{
			alert("need log-in granblue fantasy");
			return ;
		}
	}
	var multiCode = document.getElementById("multiCode");
	multiCode.value="";
	multiCode.focus();
	document.execCommand('paste');
	var code = multiCode.value;
	code = code.replace(/(\s*)/g,"");	//replace empty space
	if(!codeCheck(code))
	{
		//console.log("code incorrect");
		return ;
	}
	var battle_key_check_domain = source_domain + "/quest/battle_key_check?_=" + Date.now() +"&t=" + Date.now() + "&uid=" + uid;	//사용자 정보
	var bat_key = code;	//battle_key
	getBattleKey(battle_key_check_domain,bat_key,port,mode);	
}

chrome.extension.onConnect.addListener(function(port) {	
	if(port.name == 'content_script')
	{
		port.onMessage.addListener(function(msg){
			//F7 button click
			console.log("msg received :",msg);
			connect(port,'shortcut');
		});
		return;
	}
	connect(port,'popup');
	/*console.log("Connected...");*/
	/*port.onMessage.addListener(function(msg){
		console.log("message received" + msg);
		port.postMessage("Hi popup.js");
	});*/
})






