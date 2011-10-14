function Object(name, localPosition, mass, gravityVector, rotationVector, isTextured, texture) {
    this.name = name; // Name of Object
    
    this.localPosition = localPosition; // Vec3 in local coords
    
    this.mass = mass; // Mass of object in kg
    
    this.gravityVector = gravityVector; // Direction of gravity in global coords
    
    this.rotationVector = rotationVector; // Vec3 in local coords
    
    this.isTextured = isTextured;
    
    this.texture = texture;
    
    this.vertexBuffer;
    this.vertices = [];
    
    this.colorsBuffer;
    this.colors = [];
    
    this.textCoordsBuffer;
    this.textCoords = []; // Texture coordinates
    
    this.indicesBuffer;
    this.indices = [];   
    
    this.init = init;
    this.draw = draw;
}

function init() {
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

function draw() {
    gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
    gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, this.vertexBuffer.itemSize, gl.FLOAT, false, 0, 0);
    
    if (this.isTextured) {
        
    } else {
        gl.bindBuffer(gl.ARRAY_BUFFER, this.colorsBuffer);
        gl.vertexAttribPointer(shaderProgram.vertexColorAttribute, this.colorsBuffer.itemSize, gl.FLOAT, false, 0, 0);
    }
    
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indicesBuffer);
    setMatrixUniforms(shaderProgram);
    
    gl.drawElements(gl.TRIANGLES, this.indicesBuffer.numItems, gl.UNSIGNED_SHORT, 0);
}
