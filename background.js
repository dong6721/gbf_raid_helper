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

chrome.extension.onConnect.addListener(function(port) {
	var code;
	var source_domain = "http://game.granbluefantasy.jp";
	port.onMessage.addListener(function(msg) {
		code = msg;
	});
	
	$(function() {
		var uid;
		var x_ver;	//x-version
	var battle_key_check_domain = source_domain + "/quest/battle_key_check?_=" + Date.now() +"&t=" + Date.now() + "&uid=" + uid;	//사용자 정보
	var bat_key = code;	//battle_key
	//get X_ver
	$.ajax({
		url:source_domain,
		type: "GET",
		async:false,
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
			alert("get X-version error!");
		}
	});
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
			var string_redirect = result.redirect;
			var url_array = string_redirect.split('/');
			var battle_data_url = source_domain + "/quest/content/supporter_raid/" + url_array[2] + "/" + url_array[5] + "/0?_=" + Date.now() + "&t=" + Date.now() + "&uid=" + uid;
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
					var post_msg = JSON.parse('{"img_enemy":"", "HP":""}');
					//search raid data					
					//raid_img search
					var string_result = result.data;
					var string_temp = string_result.substr(string_result.search("img-enemy"),200);
					var img_enemy = string_temp.substr(0,string_temp.search(".png")+4);
					img_enemy = img_enemy.substr(img_enemy.search("http"));
					//HP search
					string_temp = stringresult.substr(string_result.search("prt-raid-gauge-inner"),200);
					var hp_enemy = string_temp.substr()

					//set ascii to string
					img_enemy = ascii_to_char(img_enemy);
					post_msg.img_enemy = img_enemy;

				},
				error:function(request,status,errror){
					alert("get supporter raid error!");
				}
			});
		},
		error:function(request,status,error){
			alert("get battle_key error!");
		}
	});
});

	/*console.log("Connected...");*/
	/*port.onMessage.addListener(function(msg){
		console.log("message received" + msg);
		port.postMessage("Hi popup.js");
	});*/
})


