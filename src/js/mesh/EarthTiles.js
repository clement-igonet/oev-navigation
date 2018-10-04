
THREE.EarthTiles = function (render) {
    this.earth = new THREE.Object3D();
    this.render = render;

	//
	// public methods
    //
    this.remove = function() {
        // Remove all old tiles
        var kids = scope.earth.children;
        for (i = 0; i < kids.length; i++) {
            scope.earth.remove(kids[i]);
        }
    }
    this.getObject = function() {
        return scope.earth;
    }
    this.update = function ( tiles ) {
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
                    // console.log('tileUrl');
                    loader.load( tileUrl, function ( texture ) {
                        // texture.repeat.set( 2, 2 );
                        // console.log('tile:', tile);
                        var step = (Math.PI) / Math.pow(2, tile.z);
                        var geometry = new THREE.SphereGeometry(
                            R, 32 / (tile.z + 1), 32 / (tile.z + 1),
                            tile.x * 2 * step, 2 * step,
                            tile.y * step, step );
                        // var geometry = new THREE.SphereGeometry( R, 32, 32, 0, Math.PI * 2, 0, Math.PI );
                        var material = new THREE.MeshBasicMaterial( { map: texture, overdraw: 0.5 } );
                        var mesh = new THREE.Mesh(geometry, material);
                        mesh.updateMatrix();
                        scope.earth.add( mesh );
                        // reneder();
                        scope.render();
                    } );
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

THREE.EarthTiles.prototype = Object.create( THREE.EventDispatcher.prototype );
THREE.EarthTiles.prototype.constructor = THREE.EarthTiles;