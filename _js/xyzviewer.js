

document.getElementById("files").addEventListener("submit", handleFile);

function handleFile(event){
	
	event.preventDefault();
	
	var file = document.getElementById("file").files[0];
	
	var fileName = file.name.split(".");
	var extension = fileName[fileName.length-1];
	
	var reader = new FileReader();
	
	if(extension == "xyz"){
		reader.onloadend = function(e){
			processXyzFile(e.target.result);
		};
		reader.readAsText(file);
	} else if(extension == "asc"){
		reader.onloadend = function(e){
			processAscFile(e.target.result);
		};
		reader.readAsText(file);
	} else {
		console.log("File extension is "+extension+", but only xyz and asc are known.");
	}
	
	return false;
}

function processAscFile(file){
	console.log('File length: '+file.length);
	console.log('Trimming...');
	file = file.trim();
	
	console.log(file.slice(0, 1000));
}

function processXyzFile(file){
	console.log('File length: '+file.length);
	console.log('Trimming...');
	file = file.trim();
	console.log('Splitting...');
	var flatMap = file.split(/[\s]+/);
	var entriesCount = flatMap.length;
	console.log('List has '+entriesCount+' entries.');
	
	var maximumX = flatMap[0];
	var maximumY = flatMap[1];
	var maximumZ = flatMap[2];
	
	var minimumX = flatMap[0];
	var minimumY = flatMap[1];
	var minimumZ = flatMap[2];
	console.log('Finding extreme values...');
	
	for(var i = 0; i < flatMap.length; i += 3){
			maximumX = Math.max(maximumX, flatMap[i]);
			minimumX = Math.min(minimumX, flatMap[i]);
	}
	for(var i = 1; i < flatMap.length; i += 3){
			maximumY = Math.max(maximumY, flatMap[i]);
			minimumY = Math.min(minimumY, flatMap[i]);
	}
	for(var i = 2; i < flatMap.length; i += 3){
			maximumZ = Math.max(maximumZ, flatMap[i]);
			minimumZ = Math.min(minimumZ, flatMap[i]);
	}
	
	var width = maximumX - minimumX;
	var height = maximumY - minimumY;
	var zRange = maximumZ - minimumZ;
	var scale = parseFloat(document.getElementById("scale").value);
	
	console.log('Extreme values:');
	console.log('X: '+minimumX+" - "+maximumX+', width: '+width);
	console.log('Y: '+minimumY+" - "+maximumY+', height: '+height);
	console.log('Z: '+minimumZ+" - "+maximumZ);
	
	var canvas = document.getElementById('canvas');
	var context = canvas.getContext('2d');
	
	canvas.width = Math.floor(width/scale);
	canvas.height = Math.floor(height/scale);
	
	context.fillStyle = "rgba(0, 255, 0, 0.5)";
	context.fillRect(0, 0, canvas.width, canvas.height);
	
	console.log('Filling array...');
	
	var floatArray = new Float32Array(canvas.width*canvas.height);
	
	for(var i = 2; i < entriesCount; i += 3){
		var height = (flatMap[i] - minimumZ)/zRange;
		var x = Math.floor(((flatMap[i-2] - minimumX)/scale));
		var y = Math.floor(((maximumY - flatMap[i-1])/scale));
		var pos = canvas.width*y + x;
		
		floatArray[pos] = height;
	}
	
	console.log('Drawing...');
	
	var imageData = context.getImageData(0, 0, canvas.width, canvas.height);
	var data = imageData.data;
	//var newImage = context.createImageData(imageData);
	
	if(!document.getElementById("shading").checked){
	
		for(var i in floatArray){
			var color = Math.floor(floatArray[i]*256);
			
			data[i*4  ] = color;
			data[i*4+1] = color;
			data[i*4+2] = color;
			data[i*4+3] = 255;
		}
		
		context.putImageData(imageData, 0, 0);
	
	} else {
	
		for(var i in floatArray){
			var gradient = (floatArray[i] - floatArray[i-1 - canvas.width])*10 + 0.5;
			var color = Math.floor(gradient*256);
			
			data[i*4  ] = color;
			data[i*4+1] = color;
			data[i*4+2] = color;
			data[i*4+3] = 255;
		}
		
		context.putImageData(imageData, 0, 0);
	}
	
	console.log('Done.');
	
}