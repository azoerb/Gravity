<!DOCTYPE HTML>
<html>
<head>
    <title>Test</title>
</head>
<body style="text-align: center">
    <canvas id="Canvas" width="800" height="600" style="border:1px solid #eeeeee">
        Your browser does not support the canvas element.
    </canvas>
    <div id="debug"></div>
    
<script type="text/javascript">
    
    var canvas = document.getElementById("Canvas");
	//var context = canvas.getContext("2d");
    
    var INTERVAL = 30;
    var timeDelta;
    var currentTime;
    var oldTime;
    var fps;
        
    var keyDown = new Array();


//OBJECTS


//INITIALIZATION
	init();
    
    function init() {
        document.onkeyup = handleKeyUp;
        document.onkeydown = handleKeyDown;
        document.onclick = handleMouseClick;
        
        setInterval("update()", 1000 / INTERVAL);
    }
    
    function checkKeys() {
        if (keyDown[39]) { // Right
        }
        
        if (keyDown[37]) { // Left
        }
        
        if (keyDown[38]) { // Up
        }
        
        if (keyDown[40]) { // Down
        }
    }
    
    function draw() {
    }
    
//MAIN LOOP
    function update() {
    	oldTime = currentTime;
        currentTime = new Date();
        timeDelta = currentTime - oldTime;
        fps = 1000 / timeDelta;
    }
    
//EVENTS
    function handleKeyDown(evt) {
        keyDown[evt.keyCode] = true;
    }
 
    function handleKeyUp(evt) {
        keyDown[evt.keyCode] = false;
    }
        
    function handleMouseMove(evt) {
	}
    
    function handleMouseClick(evt) {
	}
    
</script>

</body>
</html>