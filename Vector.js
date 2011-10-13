function Vector(x, y, z) {
    this.x = x;
    this.y = y;
    this.z = z;
}

function getDistance(v1, v2) { // Technically using the vector as vertices here.
    return Math.sqrt(Math.pow(v1.x - v2.x, 2) + Math.pow(v1.y - v2.y, 2) + Math.pow(v1.z - v2.z, 2));
}

function getLength(v) {
    return getDistance(v, new Vector());
}

function normalize(v){
    var length = getLength(v);
    if(length == 0) {
        return new Vector(0,0);
    }
    
    return new Vector(v.x / length, v.y / length, v.z / length);
}

function scale(v, multiplier){
    return new Vector(v.x * multiplier, v.y * multiplier, v.z * multiplier);
}

function add(v1, v2) {
    return new Vector(v1.x + v2.x, v1.y + v2.y, v1.z + v2.z);
}

function subtract(v1, v2) {
    return add(v1, invert(v2));
}

function invert(v) {
    return new Vector(-v.x, -v.y, -v.z);
}

function dot(v1, v2) {
    return new Vector(v1.x * v2.x, v1.y * v2.y, v1.z * v2.z);
}

function cross(v1, v2) {
    return new Vector(v1.y * v2.z - v1.z * v2.y,
                      v1.z * v2.x - v1.x * v2.z,
                      v1.x * v2.y - v1.y * v2.x);
}

function randomVector(min, max) {
    return new Vector(Math.random() * (max - min) + min,
                      Math.random() * (max - min) + min,
                      Math.random() * (max - min) + min);
}