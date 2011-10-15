function Object(name, localPosition, mass, gravityVector, rotationVector, isTextured, isHudObject, textureImg) {
    this.name = name; // Name of Object
    
    this.localPosition = localPosition; // Vec3 in local coords
    
    this.mass = mass; // Mass of object in kg
    
    this.gravityVector = gravityVector; // Direction of gravity in global coords
    
    this.rotationVector = rotationVector; // Vec3 in local coords
    
    this.isTextured = isTextured;
    
    this.isHudObject = isHudObject;
    
    this.texture;
    this.textureImg = textureImg;
    
    this.vertexBuffer;
    this.vertices = [];
    
    this.colorsBuffer;
    this.colors = [];
    
    this.textCoordsBuffer;
    this.textCoords = []; // Texture coordinates
    
    this.indicesBuffer;
    this.indices = [];   
    
    this.initObject = initObject;
    this.draw = draw;
}

function initObject() {
    this.vertexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.vertices), gl.STATIC_DRAW);
    this.vertexBuffer.itemSize = 3;
    this.vertexBuffer.numItems = this.vertices.length / 3;
    
    if (this.isTextured) {
        this.textCoordsBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.textCoordsBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.textCoords), gl.STATIC_DRAW);
        this.textCoordsBuffer.itemSize = 2;
        this.textCoordsBuffer.numItems = this.textCoords.length / 2;
        
        this.texture = gl.createTexture();
        this.texture.image = new Image();
        this.texture.image.onload = function() {
            gl.bindTexture(gl.TEXTURE_2D, this.texture);
            gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
            gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, this.texture.image);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
            gl.bindTexture(gl.TEXTURE_2D, null);
        }
        this.texture.image.src = this.textureImg;
        
    } else {
        this.colorsBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.colorsBuffer);
        var unpackedColors = [];
        for (var i in this.colors) {
            var color = this.colors[i];
            for (var j=0; j < 4; j++) {
                unpackedColors = unpackedColors.concat(color);
            }
        }
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(unpackedColors), gl.STATIC_DRAW);
        this.colorsBuffer.itemSize = 4;
        this.colorsBuffer.numItems = unpackedColors.length;
    }
    
    this.indicesBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indicesBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(this.indices), gl.STATIC_DRAW);
    this.indicesBuffer.itemSize = 1;
    this.indicesBuffer.numItems = this.indices.length;
}

function draw(shaderProgram) {
    gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
    gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, this.vertexBuffer.itemSize, gl.FLOAT, false, 0, 0);
    
    if (this.isTextured) {
        gl.enable(gl.BLEND);
        if (this.isHudObject) {
            gl.disable(gl.DEPTH_TEST);
        }
        
        gl.bindBuffer(gl.ARRAY_BUFFER, this.textCoordsBuffer);
        gl.vertexAttribPointer(shaderProgram.textureCoordAttribute, this.textCoordsBuffer.itemSize, gl.FLOAT, false, 0, 0);
        
        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, this.texture);
        gl.uniform1i(shaderProgram.samplerUniform, 0);
        
        if (this.isHudObject) {
            gl.enable(gl.DEPTH_TEST);
        }
        gl.disable(gl.BLEND);
    } else {
        gl.bindBuffer(gl.ARRAY_BUFFER, this.colorsBuffer);
        gl.vertexAttribPointer(shaderProgram.vertexColorAttribute, this.colorsBuffer.itemSize, gl.FLOAT, false, 0, 0);
    }
    
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indicesBuffer);
    setMatrixUniforms(shaderProgram);
    
    gl.drawElements(gl.TRIANGLES, this.indicesBuffer.numItems, gl.UNSIGNED_SHORT, 0);
}
