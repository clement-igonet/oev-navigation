var assert = chai.assert;
THREE.BasicTiler = function () {

    // this.render = render;

    //
    // public methods
    //


    //
    // internals
    //

    let scope = this;
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

THREE.BasicTiler.getTile = function (position) {
    let zoom = THREE.Toolbox.alt2zoom(position.alt);
    return{
        z: zoom,
        x: THREE.Toolbox.long2tile(position.lon, zoom),
        y: THREE.Toolbox.lat2tile(position.lat, zoom)
    }
}

// THREE.BasicTiler.getTileSquare = function (position) {
//     let tile = THREE.BasicTiler.getTile(position);

//     // for(let z = Math.max(0, tile.z - 3); z >= tile.z; z )
// }
THREE.BasicTiler.getTiles = function (position) {
    let tile = THREE.BasicTiler.getTile(position);
    let tiles = [tile];
    // console.log('tile:', tile);
    let size = 2;
    let tileIds = {};
    let x_, y_;

    // let modulus = (zoom_ > 0) ? Math.pow(2, zoom_) : 0;




    // for (let atile = minXtile; atile <= maxXtile; atile++) {
    //     for (let btile = minYtile; btile <= maxYtile; btile++) {
    //         let id;

    //         id = 'z_' + zoom_ + '_' + (atile % modulus) +
    //             '_' + (btile % modulus);
    //         for (let zzz = 1; zzz <= 2; zzz++) {
    //             let idNext;

    //             idNext = 'z_' + (zoom_ - zzz) +
    //                 '_' + Math.floor((atile % modulus) / Math.pow(2, zzz)) +
    //                 '_' + Math.floor((btile % modulus) / Math.pow(2, zzz));
    //             tiles[idNext] = {};
    // }


    for (dz = 0; dz < 3 && zoom - dz >= 0; dz++) {
        // console.log('dz:', dz);
        x_ = Math.floor(tile.x / Math.pow(2, dz));
        y_ = Math.floor(tile.y / Math.pow(2, dz));
        // console.log('zoom:', zoom, 'x_:', x_, 'y:', y_);
        let minXtile = Math.max(0, Math.floor((x_ - (Math.pow(2, (size - 1)) - 1)) / 2) * 2);
        let maxXtile = Math.floor((x_ + (Math.pow(2, (size - 1)) - 1)) / 2) * 2 + 1;
        let minYtile = Math.max(0, Math.floor((y_ - (Math.pow(2, (size - 1)) - 1)) / 2) * 2);
        let maxYtile = Math.floor((y_ + (Math.pow(2, (size - 1)) - 1)) / 2) * 2 + 1;
        let id;
        for (u = minXtile; u <= maxXtile; u++) {
            for (v = minYtile; v <= maxYtile; v++) {
                // if (u == x_ && v == y_) {
                //     break;
                // }
                // console.log('u:', u, 'v:', v);
                let tile = {
                    z: zoom - dz,
                    x: u,
                    y: v
                };
                id = THREE.Toolbox.getId(tile);
                // console.log('idNext:', idNext)
                for (f = 1; zoom - dz - f >= 0 && f <= 3; f++) {
                    tileIds[THREE.Toolbox.getTileId({
                        z: tile.z - f,
                        x: Math.floor(tile.x / Math.pow(2, f)),
                        y: Math.floor(tile.y / Math.pow(2, f))
                    })] = {};
                }

                if (!tileIds.hasOwnProperty(id)) {
                    tiles.push(tile);
                }
            }
        }
    }
    console.log('tiles:', tiles);
    return tiles;
    // return [{
    //     z: alt2zoom(position.altitude),
    //     x: long2tile(position.lon),
    //     y: lat2tile(position.lat)
    // }];
};
THREE.BasicTiler.test = function () {
    let position = {
        alt: 12742,
        lon: 0.01600890043963752,
        lat: 0.6790204737589939,
    };
    // assert.equal(
    //     THREE.BasicTiler.getTiles(position),
    //     [
    //         {z: 3, x: 4, y: 3}, 
    //         {z: 3, x: 2, y: 2},
    //          {z: 3, x: 2, y: 3},
    //          {z: 3, x: 2, y: 4},
    //          {z: 3, x: 2, y: 5},
    //          {z: 3, x: 3, y: 2},
    //          {z: 3, x: 3, y: 3},
    //          {z: 3, x: 3, y: 4},
    //          {z: 3, x: 3, y: 5},
    //          {z: 3, x: 4, y: 2},
    //          {z: 3, x: 4, y: 3},
    //          {z: 3, x: 4, y: 4},
    //          {z: 3, x: 4, y: 5},
    //          {z: 3, x: 5, y: 2},
    //          {z: 3, x: 5, y: 3},
    //          {z: 3, x: 5, y: 4},
    //          {z: 3, x: 5, y: 5},
    //          {z: 2, x: 0, y: 0},
    //          {z: 2, x: 0, y: 1},
    //          {z: 2, x: 0, y: 2},
    //          {z: 2, x: 0, y: 3},
    //          {z: 2, x: 1, y: 0},
    //          {z: 2, x: 1, y: 3},
    //          {z: 2, x: 2, y: 0},
    //          {z: 2, x: 2, y: 3},
    //          {z: 2, x: 3, y: 0},
    //          {z: 2, x: 3, y: 1},
    //          {z: 2, x: 3, y: 2},
    //          {z: 2, x: 3, y: 3},
    //          {z: 1, x: 2, y: 0},
    //          {z: 1, x: 2, y: 1},
    //          {z: 1, x: 3, y: 0},
    //          {z: 1, x: 3, y: 1},
    //          {z: 0, x: 0, y: 1},
    //          {z: 0, x: 1, y: 1}
    //     ], 'THREE.BasicTiler.getTiles');
}
THREE.BasicTiler.prototype = Object.create(THREE.BasicTiler.prototype);
THREE.BasicTiler.prototype.constructor = THREE.BasicTiler;