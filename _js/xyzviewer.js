

function handleFile(files){
	var reader = new FileReader;
	reader.onloadend = function(e){
		processFile(e.target.result);
	};
	reader.readAsText(files[0]);
}

function processFile(file){
	console.log('Loaded file, processing...');
	console.log('File length: '+file.length);
	file = file.trim();
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
	
	console.log('Drawing... (This might take a while)');
	
	var color = 0;
	
	var imageData = context.getImageData(0, 0, canvas.width, canvas.height);
	var data = imageData.data;
	//var newImage = context.createImageData(imageData);
	
	for(var i = 2; i < entriesCount; i += 3){
		color = Math.floor(((flatMap[i] - minimumZ)/zRange)*255);
		var x = Math.floor(((flatMap[i-2] - minimumX)/scale));
		var y = Math.floor(((maximumY - flatMap[i-1])/scale));
		var pos = (imageData.width*y + x)*4;
		
		data[pos  ] = color;
		data[pos+1] = color;
		data[pos+2] = color;
		data[pos+3] = 255;
	}
	
	context.putImageData(imageData, 0, 0);
	
	return;
	
	var foo = context.getImageData(0, 0, canvas.width, canvas.height).data;
	
	for(var i = 0; i < foo.length; i += 4){
		var gradient = (foo[i] - foo[i-4 - 4*canvas.width])*10 + 128 + foo[i]*0.2;
		data[i  ] = gradient;
		data[i+1] = gradient;
		data[i+2] = gradient;
	}
	
	context.putImageData(imageData, 0, 0);
	
	console.log('Done.');
	
}