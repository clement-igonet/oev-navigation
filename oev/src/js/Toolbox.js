var assert = chai.assert;


THREE.Toolbox = {

    getTileSphereMesh: function (tile, z) {
        let bb = THREE.Toolbox.boundingBox(tile);
        let color = new THREE.Color(0xffffff);
        let mesh = new THREE.Mesh(
            new THREE.SphereGeometry(
                radius, Math.max(1, 64 >> tile.z), Math.max(1, 64 >> tile.z),
                Math.PI + bb.west, bb.east - bb.west,
                Math.PI / 2 - bb.north, bb.north - bb.south),

            // new THREE.MeshBasicMaterial({
            //     color: 0x000000,
            //     wireframe: true
            // }),
            new THREE.MeshBasicMaterial({
                // color: color.setHex(Math.random() * 0xffffff),
                overdraw: 0.5
            })

        );
        mesh.name = THREE.Toolbox.getTileId(tile);
        console.log(mesh.name);
        return mesh;
    },
    long2tile: function (lon, zoom) {
        return Math.floor((lon + Math.PI) / (2 * Math.PI) * Math.pow(2, zoom));
    },

    lat2tile: function (lat, zoom) {
        return Math.floor((1.0 - Math.log(Math.tan(lat) + 1.0 / Math.cos(lat)) / Math.PI) / 2.0 * Math.pow(2, zoom));
    },

    alt2zoom: function (altitude) {
        // console.log('alt:', Math.log(altitude));
        // return Math.round(Math.min(Math.max(0, 17 - Math.log(altitude)), 22));
        return Math.floor(Math.max(Math.min(Math.floor(27 - Math.log2(altitude)), 19), 1));
    },
    tile2long: function (x, z) {
        return (x / Math.pow(2, z) * 2 * Math.PI - Math.PI);
    },

    tile2lat: function (y, z) {
        var n = Math.PI - 2 * Math.PI * y / Math.pow(2, z);
        return Math.atan(0.5 * (Math.exp(n) - Math.exp(-n)));
    },

    boundingBox: function (tile) {
        return {
            north: THREE.Toolbox.tile2lat(tile.y, tile.z),
            south: THREE.Toolbox.tile2lat(tile.y + 1, tile.z),
            west: THREE.Toolbox.tile2long(tile.x, tile.z),
            east: THREE.Toolbox.tile2long(tile.x + 1, tile.z)
        };
    },
    getTileId: function (tile) {
        let id = 'z_' + (tile.z) + '_' + tile.x + '_' + tile.y;
        return id;
    },
    test: function () {
        var position = {
            lon: 0.01600890043963752,
            lat: 0.6790204737589939,
        };
        var tile = {
            x: THREE.Toolbox.long2tile(position.lon, 3),
            y: THREE.Toolbox.lat2tile(position.lat, 3),
            z: 3
        }
        assert.equal(tile.x, 4, 'long2tile');
        assert.equal(tile.y, 3, 'lat2tile');
        var bb = THREE.Toolbox.boundingBox(tile);
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

}
