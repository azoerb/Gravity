function GameObject(name, globalPosition, mass, gravityVector, rotationVector, isTextured, isHudObject, textureImg) {
    var that = this;
    
    this.name = name; // Name of Object

    this.localOffset = [0.0, 0.0, 0.0];
    this.globalPosition = globalPosition; // Vec3 in global coords
    
    this.width = 0;
	this.height = 0;
	this.depth = 0;
    
    this.mass = mass; // Mass of object in kg
    
    this.gravityVector = gravityVector; // Direction of gravity in global coords
    this.rotationVector = rotationVector; // Vec3 in local coords
    
    this.isTextured = isTextured;
    this.isHudObject = isHudObject;
	this.isModel = false;
	this.isLit = false;
    this.shininess = 40;

    this.texture;
    this.textureImg = textureImg;

    this.vertexBuffer;
    this.vertices = [];

    this.colorsBuffer;
    this.colors = [];

    this.textCoordsBuffer;
    this.textCoords = []; // Texture coordinates

	this.normBuffer;
	this.normals = [];

    this.indicesBuffer;
    this.indices = [];   

	this.loadModel = function(path) {
		that.isModel = true;
		that.isLit = true;
		var result = $.ajax({ url: path, async: false }).responseText;
		var lines = result.split('\n');
		var v = [];
		var n = [];
		var t = [];
		for (var i = 0; i < lines.length; i++) {
			if (lines[i][0] == 'v') {
				if (lines[i][1] == ' ') {
					var array = lines[i].split(" ");
					for (var j = 1; j <= 3; j++) {
						v[v.length] = parseFloat(array[j]);
						//console.log(array[j]);
					}
				}
				else if (lines[i][1] == 't') {
                    var array = lines[i].split(" ");
                    for (var j = 1; j <= 2; j++) {
                        t[t.length] = parseFloat(array[j]);
                    }
				}
				else if (lines[i][1] == 'n') {
					var array = lines[i].split(" ");
					for (var j = 1; j <= 3; j++) {
						n[n.length] = parseFloat(array[j]);
					}
				}
				else {
					console.log("Unknown line in model: " + name + " Line: " + i );
				}
			}
			else if (lines[i][0] == 'f') {
				var array = lines[i].split(" ");
				for (var j = 1; j <= 3; j++) {
					var values = array[j].split("/");
					that.vertices[that.vertices.length] = v[3 * (parseFloat(values[0]) - 1)];	
					that.vertices[that.vertices.length] = v[(3 * (parseFloat(values[0]) - 1)) + 1];			
					that.vertices[that.vertices.length] = v[(3 * (parseFloat(values[0]) - 1)) + 2];				
					that.textCoords[that.textCoords.length] = t[2 * (parseFloat(values[1]) - 1)];
					that.textCoords[that.textCoords.length] = t[2 * (parseFloat(values[1]) - 1) + 1];
					that.normals[that.normals.length] = n[3* (parseFloat(values[2]) - 1)];
					that.normals[that.normals.length] = n[3* (parseFloat(values[2]) - 1) + 1];
					that.normals[that.normals.length] = n[3* (parseFloat(values[2]) - 1) + 2];
					that.indices[that.indices.length] = parseFloat(parseFloat(values[0] - 1));
                }
			}
		}
        var minX;
		var maxX;
		var minY;
		var maxY;
		var minZ;
		var maxZ;
        for (var i = 0; i < that.vertices.length; i += 3) {
            if (i == 0) {
                minX = that.vertices[i];     maxX = that.vertices[i];
                minY = that.vertices[i + 1]; maxY = that.vertices[i + 1];
                minZ = that.vertices[i + 2]; maxZ = that.vertices[i + 2];
            } else {
                if (minX > that.vertices[i])     { minX = that.vertices[i]; }
                if (maxX < that.vertices[i])     { maxX = that.vertices[i]; }
                if (minY > that.vertices[i + 1]) { minY = that.vertices[i + 1]; }
                if (maxY < that.vertices[i + 1]) { maxY = that.vertices[i + 1]; }
                if (minZ > that.vertices[i + 2]) { minZ = that.vertices[i + 2]; }
                if (maxZ < that.vertices[i + 2]) { maxZ = that.vertices[i + 2]; }
            }
        }
        that.width = maxX - minX;
        that.height = maxY - minY;
		that.depth = maxZ - minZ;
	}
    
    this.initObject = function() {
        that.vertexBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, that.vertexBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(that.vertices), gl.STATIC_DRAW);
        that.vertexBuffer.itemSize = 3;
        that.vertexBuffer.numItems = that.vertices.length / 3;
		
		that.normalBuffer = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, that.normalBuffer);
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(that.normals), gl.STATIC_DRAW);
		that.normalBuffer.itemSize = 3;
        that.normalBuffer.numItems = that.normals.length / 3;
		
        if (that.isTextured) {
            that.textCoordsBuffer = gl.createBuffer();
            gl.bindBuffer(gl.ARRAY_BUFFER, that.textCoordsBuffer);
            gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(that.textCoords), gl.STATIC_DRAW);
            that.textCoordsBuffer.itemSize = 2;
            that.textCoordsBuffer.numItems = that.textCoords.length / 2;
            
            that.texture = gl.createTexture();
            that.texture.image = new Image();
            that.texture.image.onload = function() {
                gl.bindTexture(gl.TEXTURE_2D, that.texture);
                gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
                gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, that.texture.image);
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
                gl.bindTexture(gl.TEXTURE_2D, null);
            }
            that.texture.image.src = that.textureImg;
            
        } else {
            that.colorsBuffer = gl.createBuffer();
            gl.bindBuffer(gl.ARRAY_BUFFER, that.colorsBuffer);
            var unpackedColors = [];
            for (var i in that.colors) {
                var color = that.colors[i];
                for (var j=0; j < 4; j++) {
                    unpackedColors = unpackedColors.concat(color);
                }
            }
            gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(unpackedColors), gl.STATIC_DRAW);
            that.colorsBuffer.itemSize = 4;
            that.colorsBuffer.numItems = unpackedColors.length;
        }
        
        that.indicesBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, that.indicesBuffer);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(that.indices), gl.STATIC_DRAW);
        that.indicesBuffer.itemSize = 1;
        that.indicesBuffer.numItems = that.indices.length;
    }
    
    this.draw = function(shaderProgram) {
        gl.bindBuffer(gl.ARRAY_BUFFER, that.vertexBuffer);
        gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, that.vertexBuffer.itemSize, gl.FLOAT, false, 0, 0);
		
		if (that.isLit) {
			gl.bindBuffer(gl.ARRAY_BUFFER, that.normalBuffer);
			gl.vertexAttribPointer(shaderProgram.vertexNormalAttribute, that.normalBuffer.itemSize, gl.FLOAT, false, 0, 0);
			
			gl.uniform3f(shaderProgram.ambientColorUniform,ambientLight[0],ambientLight[1],ambientLight[2]);
			
			gl.uniform3f(shaderProgram.lightingLocationUniform, lightPos[0], lightPos[1], lightPos[2]);
            
			gl.uniform3f(shaderProgram.lightingDiffuseColorUniform,lightDiffColor[0],lightDiffColor[1],lightDiffColor[2]);
			gl.uniform3f(shaderProgram.lightingSpecularColorUniform,lightSpecColor[0],lightSpecColor[1],lightSpecColor[2]);
			gl.uniform1f(shaderProgram.materialShininessUniform, that.shininess);
			
        }
		
        if (that.isTextured) {
            gl.enable(gl.BLEND);
            if (that.isHudObject) {
                gl.disable(gl.DEPTH_TEST);
            }
            
            gl.bindBuffer(gl.ARRAY_BUFFER, that.textCoordsBuffer);
            gl.vertexAttribPointer(shaderProgram.textureCoordAttribute, that.textCoordsBuffer.itemSize, gl.FLOAT, false, 0, 0);
            
            gl.activeTexture(gl.TEXTURE0);
            gl.bindTexture(gl.TEXTURE_2D, that.texture);
            gl.uniform1i(shaderProgram.samplerUniform, 0);
            
        } else {
            gl.bindBuffer(gl.ARRAY_BUFFER, that.colorsBuffer);
            gl.vertexAttribPointer(shaderProgram.vertexColorAttribute, that.colorsBuffer.itemSize, gl.FLOAT, false, 0, 0);
        }
		
        
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, that.indicesBuffer);
        setMatrixUniforms(shaderProgram);
        
		if (that.isModel) {
			gl.drawArrays(gl.TRIANGLES, 0, that.vertexBuffer.numItems);
		} else {
			gl.drawElements(gl.TRIANGLES, that.indicesBuffer.numItems, gl.UNSIGNED_SHORT, 0);
		}
        
        if (that.isHudObject) {
            gl.enable(gl.DEPTH_TEST);
        } 
        if (that.isTextured) {
            gl.disable(gl.BLEND);
        }
    }
}
