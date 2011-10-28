	var ballList = new Array();
	var ballAngleList = new Array();
	var radiusFactor = 0.002;
	
	function setBallList(num) {
		var repeats = 5;
		
		var repeatDist = 1.0 / repeats; 
		var pi = Math.PI;
		var x = 0;
		for (var i = 0; i < 1; i += (1.0/num)) {
			x += repeats / num;
			if (x > 1) {
				x = x - 1;
			}
			var angle = (x* 2 * pi) / repeatDist;
			var ball1Pos = [Math.sin(angle) * radiusFactor, Math.cos(angle) * radiusFactor, -i];
			var ball2Pos = [Math.sin(angle - pi) * radiusFactor, Math.cos(angle - pi) * radiusFactor, -i];
			var ball1 = new GameObject("ball", ball1Pos , 60.0, [0.0, -1.0, 0.0], [0.0, 0.0, 0.0], true, false, "textures/ball.png");
			ball1.loadModel("models/ball.obj");
			var ball2 = new GameObject("ball", ball2Pos , 60.0, [0.0, -1.0, 0.0], [0.0, 0.0, 0.0], true, false, "textures/ball.png");
			ball2.loadModel("models/ball.obj");
			ball1.initObject();
			ball2.initObject();
			ballList[ballList.length] = ball1;
			ballList[ballList.length] = ball2;
			ballAngleList[ballAngleList.length] = angle;
			ballAngleList[ballAngleList.length] = angle - pi;
		}
	}
	
	function drawBeam() {
		var rotSpeed = 0.5;
		var beamSpeed = 0.01;
		mvPushMatrix();
        gl.useProgram(textureShaderProgram);
		mat4.translate(mvMatrix, [0.0, -0.08, 0.3]);
		mat4.rotate(mvMatrix, degToRad(4.0), [1.0, 0.0, 0.0]);
		mvPushMatrix();
		mat4.scale(mvMatrix, [0.03, 0.03, 1.0]);
		
		for (var i = 1; i < beam.textCoords.length; i += 2)
		{
			beam.textCoords[i] += 0.02;
			if (beam.textCoords[i] > 1.0) {
				beam.textCoords[i] = beam.textCoords[i] - 1.0;
			}
		}
		gl.bindBuffer(gl.ARRAY_BUFFER, beam.textCoordsBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(beam.textCoords), gl.STATIC_DRAW);
        beam.draw(textureShaderProgram);
		mvPopMatrix()
		
		for (var i = 0; i < ballList.length; i++) {
			mvPushMatrix();
			mat4.translate(mvMatrix, ballList[i].globalPosition);
			mat4.scale(mvMatrix, [0.004, 0.004, 0.004]);
			ballAngleList[i] += rotSpeed;
			if (ballAngleList[i] > (2 * Math.PI)) {
				ballAngleList[i] = ballAngleList[i] - (2 * Math.PI);
			}
			ballList[i].globalPosition[0] = Math.sin(ballAngleList[i]) * radiusFactor;
			ballList[i].globalPosition[1] = Math.cos(ballAngleList[i]) * radiusFactor;
			ballList[i].globalPosition[2] -= beamSpeed;
			if (ballList[i].globalPosition[2] <= -1) {
				ballList[i].globalPosition[2] = 0;
			}
			ballList[i].draw(textureShaderProgram);
			mvPopMatrix();
		}
		
        mvPopMatrix();
	}