
THREE.EarthTiles = function (render) {
    this.earth = new THREE.Object3D();
    this.render = render;

    //
    // public methods
    //
    this.remove = function () {
        // Remove all old tiles
        while (scope.earth.children.length > 0) {
            scope.earth.remove(scope.earth.children[0]);
        }
    }
    this.getObject = function () {
        return scope.earth;
    }
    this.update = function (tiles) {
        scope.remove();
        console.log(tiles.length);

        // tilesOld = tiles;
        for (i = 0; i < tiles.length; i++) {
            var tile = tiles[i];
            // var tileUrl = 'textures/planets/earth_atmos_4096.jpg';
            // var tileUrl = 'http://a.tile.openstreetmap.org/0/0/0.png';
            // var tileUrl = 'https://tileserver.maptiler.com/nasa/0/0/0.jpg'
            // var tileUrl = getUrl(
            //     ['https://tileserver.maptiler.com/nasa/{z}/{x}/{y}.jpg'],
            //     tile.z, tile.x, tile.y);

            ((tile) => {
                var tileUrl = getUrl(
                    ['https://tileserver.maptiler.com/nasa/{z}/{x}/{y}.jpg'],
                    tile.z, tile.x, tile.y);
                console.log('tileUrl:', tileUrl);
                loader.load(tileUrl, function (texture) {
                    // texture.repeat.set( 2, 2 );
                    // console.log('tile:', tile);
                    bb = THREE.BasicTiler.boundingBox(tile);
                    console.log('bb:', bb);
                    // console.log('lon1:', THREE.BasicTiler.tile2long(tile.x, tile.z);
                    // console.log('lon2:', (tile.x * 2 * step + 2 * step) * 180 / Math.PI - 180);
                    // console.log('lat1:', (tile.y * step) * 180 / Math.PI);
                    // console.log('lat2:', (tile.y * step + step) * 180 / Math.PI);
                    // var geometry = new THREE.SphereGeometry(
                    //     R, 32 / Math.pow(2, tile.z), 32 / Math.pow(2, tile.z),
                    //     (180 + 0) * Math.PI/180,
                    //     45 * Math.PI/180,
                    //     22.5 * Math.PI/180,
                    //     45 * Math.PI/180);
                    var geometry = new THREE.SphereGeometry(
                        R, Math.max(1, 32 / Math.pow(2, tile.z)), Math.max(1, 32 / Math.pow(2, tile.z)),
                        Math.PI + bb.west, bb.east - bb.west,
                        Math.PI/2 - bb.north, bb.north - bb.south);
                    console.log('geometry:', geometry.parameters);
                    // var geometry = new THREE.SphereGeometry( R, 32, 32, 0, Math.PI * 2, 0, Math.PI );
                    var material = new THREE.MeshBasicMaterial({ map: texture, overdraw: 0.5 });
                    var mesh = new THREE.Mesh(geometry, material);
                    mesh.updateMatrix();
                    scope.earth.add(mesh);
                    // reneder();
                    scope.render();
                });
            })(tile);

        }
    }

    //
    // internals
    //

    var scope = this;
    var tilesOld;
    var loader = new THREE.TextureLoader();
    function getUrl(urls, zoom, xtile, ytile) {
        let urlRandom = urls[
            Math.floor(Math.random() * urls.length)];
        let url = urlRandom.replace('{z}', zoom);
        url = url.replace('{x}', xtile);
        url = url.replace('{y}', ytile);
        // console.log('url:', url);
        return url;
    }

}

THREE.EarthTiles.prototype = Object.create(THREE.EventDispatcher.prototype);
THREE.EarthTiles.prototype.constructor = THREE.EarthTiles;