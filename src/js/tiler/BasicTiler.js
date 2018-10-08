var assert = chai.assert

THREE.BasicTiler = function () {

    // this.render = render;

    //
    // public methods
    //
    this.getTiles = function (position) {
        // console.log('position:', position);
        // THREE.BasicTiler.alt2zoom is not a function
        var zoom = THREE.BasicTiler.alt2zoom(position.alt);
        var tile = {
            z: zoom,
            x: THREE.BasicTiler.long2tile(position.lon, zoom),
            y: THREE.BasicTiler.lat2tile(position.lat, zoom)
        };
        // console.log('tile:', tile);
        return [tile];
        // return [{
        //     z: alt2zoom(position.altitude),
        //     x: long2tile(position.lon),
        //     y: lat2tile(position.lat)
        // }];
    };


    //
    // internals
    //

    var scope = this;
    // function getUrl(urls, zoom, xtile, ytile) {
    //     return url;
    // }
    // long2tile = function (lon, zoom) {
    //     return Math.floor((lon + Math.PI) / (2 * Math.PI) * Math.pow(2, zoom));
    // }

    // lat2tile = function (lat, zoom) {
    //     return Math.floor((1 - Math.log(Math.tan(lat) + 1 / Math.cos(lat)) / Math.PI) / 2 * Math.pow(2, zoom));
    // }
    // // function lat2tile(lat,zoom)  { return (Math.floor((1-Math.log(Math.tan(lat*Math.PI/180) + 1/Math.cos(lat*Math.PI/180))/Math.PI)/2 *Math.pow(2,zoom))); }

    // alt2zoom = function (altitude) {
    //     return Math.round(Math.min(Math.max(0, 22 - 2 * Math.log(altitude)), 22));
    // }
}

THREE.BasicTiler.long2tile = function (lon, zoom) {
    return Math.floor((lon + Math.PI) / (2 * Math.PI) * Math.pow(2, zoom));
}

THREE.BasicTiler.lat2tile = function (lat, zoom) {
    return Math.floor((1.0 - Math.log(Math.tan(lat) + 1.0 / Math.cos(lat)) / Math.PI) / 2.0 * Math.pow(2, zoom));
}

THREE.BasicTiler.alt2zoom = function (altitude) {
    return Math.round(Math.min(Math.max(0, 22 - 2 * Math.log(altitude)), 22));
}
THREE.BasicTiler.tile2long = function (x, z) {
    return (x / Math.pow(2, z) * 2 * Math.PI - Math.PI);
}

THREE.BasicTiler.tile2lat = function (y, z) {
    var n = Math.PI - 2 * Math.PI * y / Math.pow(2, z);
    return Math.atan(0.5 * (Math.exp(n) - Math.exp(-n)));
}

THREE.BasicTiler.boundingBox = function (tile) {
    return {
        north: THREE.BasicTiler.tile2lat(tile.y, tile.z),
        south: THREE.BasicTiler.tile2lat(tile.y + 1, tile.z),
        west: THREE.BasicTiler.tile2long(tile.x, tile.z),
        east: THREE.BasicTiler.tile2long(tile.x + 1, tile.z)
    };
}
THREE.BasicTiler.test = function () {
    var position = {
        lon: 0.01600890043963752,
        lat: 0.6790204737589939,
    };
    var tile = {
        x: THREE.BasicTiler.long2tile(position.lon, 3),
        y: THREE.BasicTiler.lat2tile(position.lat, 3),
        z: 3
    }
    assert.equal(tile.x, 4, 'long2tile');
    assert.equal(tile.y, 3, 'lat2tile');
    var bb = THREE.BasicTiler.boundingBox(tile);
    assert.isTrue(bb.west - 0 < 0.0000001, 'west');
    assert.isTrue(bb.east - 0.7853981633974483 < 0.0000001, 'east');
    assert.isTrue(bb.south - 0 < 0.0000001, 'south')
    assert.isTrue(bb.south - 0 < 0.7152341484465397, 'north')
     //     east: 221.85840734641022,
    //     north: -1.5707963267948966,
    //     south: -1.5707963267948966,
    //     west: 176.85840734641022
    // });
    // console.log()
    // console.log('tile2lat:', THREE.BasicTiler.tile2lat(0, 3));

    // assert.equal(THREE.BasicTiler.lat2tile(Math.PI/4 + 0.001, 3), 1, 'lat2tile');
    // assert.equal(THREE.BasicTiler.lat2tile(0.00001, 2), 1, 'lat2tile');
    // assert.equal(THREE.BasicTiler.lat2tile(0.00001, 3), 3, 'lat2tile');
    // assert.equal(THREE.BasicTiler.lat2tile(Math.PI / 8 - 0.1, 3), 3, 'lat2tile');
    // assert.equal(THREE.BasicTiler.lat2tile(Math.PI/8 + 0.1, 3), 2, 'lat2tile');
    // assert.equal(THREE.BasicTiler.lat2tile(Math.PI/4 - 0.1, 3), 2, 'lat2tile');
    // assert.equal(THREE.BasicTiler.lat2tile(Math.PI/4 + 0.1, 3), 1, 'lat2tile');
    // assert.equal(THREE.BasicTiler.lat2tile(3 * Math.PI/8 - 0.1, 3), 1, 'lat2tile');
    // assert.equal(THREE.BasicTiler.lat2tile(3 * Math.PI / 8 + 0.1, 3), 0, 'lat2tile');
    // assert.equal(THREE.BasicTiler.lat2tile(3 * Math.PI/8, 3), 1, 'lat2tile');
    // assert.equal(THREE.BasicTiler.lat2tile(Math.PI/4 + 0.1, 3), 1, 'lat2tile');
    // console.log('lat2tile:', THREE.BasicTiler.lat2tile(Math.PI/2 - 0.1, 3));
}



THREE.BasicTiler.prototype = Object.create(THREE.BasicTiler.prototype);
THREE.BasicTiler.prototype.constructor = THREE.BasicTiler;