var port = chrome.extension.connect({
	name: 'content_script'
});

window.addEventListener('keyup', doKeyPress, false);

trigger_key = 118; 	//F7
function doKeyPress(e){
	if(e.keyCode == trigger_key)		
		port.postMessage("key_unlock!");	
};

port.onMessage.addListener(function(msg) {
	//nothing;
})

