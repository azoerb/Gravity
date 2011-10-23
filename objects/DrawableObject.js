function DrawableObject(textureImg) {
    var that = this;
    
    var isTextured = true;
    
    if (textureImg != null) {
        this.texture;
        this.textureImg = textureImg;
    } else {
        isTextured = false;
    }
    
    this.vertexBuffer;
    this.vertices = [];
    
    this.colorsBuffer;
    this.colors = [];
    
    this.textCoordsBuffer;
    this.textCoords = []; // Texture coordinates
    
    this.indicesBuffer;
    this.indices = [];   
    
    this.initObject = function() {
        that.vertexBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, that.vertexBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(that.vertices), gl.STATIC_DRAW);
        that.vertexBuffer.itemSize = 3;
        that.vertexBuffer.numItems = that.vertices.length / 3;
        
        if (isTextured) {
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
        
        if (isTextured) {
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
        
        gl.drawElements(gl.TRIANGLES, that.indicesBuffer.numItems, gl.UNSIGNED_SHORT, 0);
    }
}
