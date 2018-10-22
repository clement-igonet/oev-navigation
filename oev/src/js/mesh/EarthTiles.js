
THREE.EarthTiles = function (render) {
    this.earth = new THREE.Object3D();
    this.render = render;
    this.tiles = ['https://tileserver.maptiler.com/nasa/{z}/{x}/{y}.jpg'];
    //
    // public methods
    //
    this.remove = function (object3D) {
        let self = this;
        for (var i = object3D.children.length - 1; i >= 0; i--) {
            if (object3D.children[i].type === 'Object3D') {
                // console.log('object3D.children[', i, ']:', object3D.children[i]);
                // console.log('type:', object3D.children[i].type);
                self.remove(object3D.children[i]);

            } else {
                let mesh = object3D.children[i];
                mesh.geometry.dispose();
                mesh.geometry = null;
                if (mesh.material !== null) {
                    if (mesh.material.map !== null) {
                        mesh.material.map.dispose();
                        mesh.material.map = null;
                    }
                    mesh.material.dispose();
                    mesh.material.needsUpdate = true;
                    // mesh.material = null;
                }
                object3D.remove(mesh);
            }
        }
    }
    this.getObject = function () {
        return scope.earth;
    }
    this.populateTiles = function (bb, tile, parent3D) {
        if (bb.z < 0) {
            console.error('Cannot manage negative zoom !')
            let ref3D = new THREE.Object3D();
            parent3D.add(ref3D);
            tileBbNext = {
                z: 0,
                x: {
                    min: 0,
                    max: 0
                },
                y: {
                    min: 0,
                    max: 0
                }
            };
            scope.populateTiles(tileBbNext, tile, ref3D);
            scope.populateTiles(
                tileBbNext,
                tile,
                ref3D
            );

            return;
        }
        if (bb.z > tile.z) {
            return;
        }
        let depth = tile.z - bb.z - 1;
        let bbNext = {
            z: bb.z + 1,
            x: {
                min: (((tile.x << 1) >> depth) - 1) >> 1,
                max: (((tile.x << 1) >> depth) + 1) >> 1
            },
            y: {
                min: (((tile.y << 1) >> depth) - 1) >> 1,
                max: (((tile.y << 1) >> depth) + 1) >> 1
            }
        }
        let bbHole = {
            z: bbNext.z - 1,
            x: {
                min: bbNext.x.min >> 1,
                max: bbNext.x.max >> 1,
            },
            y: {
                min: bbNext.y.min >> 1,
                max: bbNext.y.max >> 1
            }
        }
        for (let u = Math.max(0, bb.x.min); u <= Math.min(Math.pow(2, bb.z), bb.x.max); u++) {
            for (let v = Math.max(0, bb.y.min); v <= Math.min(Math.pow(2, bb.z), bb.y.max); v++) {
                let tile_ = {
                    z: bb.z,
                    x: u,
                    y: v
                };
                if (u >= bbHole.x.min && u <= bbHole.x.max && v >= bbHole.y.min && v <= bbHole.y.max && bb.z < tile.z && tile) {
                    let tileBbNext = {
                        z: bbNext.z,
                        x: {
                            min: u << 1,
                            max: (u << 1) + 1
                        },
                        y: {
                            min: v << 1,
                            max: (v << 1) + 1
                        }
                    }
                    let tileRef = tile_;
                    let ref3D = new THREE.Object3D();
                    parent3D.add(ref3D);
                    scope.populateTiles(tileBbNext, tile, ref3D);
                }
                else {
                    let tileMesh = THREE.Toolbox.getTileSphereMesh(tile_, bb.z)
                    tileMesh.material.needsUpdate = true;
                    parent3D.add(tileMesh);
                    scope.render();
                    ((tile, tileMesh) => {
                        let tileUrl = getUrl(
                            scope.tiles,
                            tile.z, tile.x, tile.y);
                        // console.log('url request: ', tileUrl);

                        loader.load(tileUrl, function (texture) {
                            // console.log('url gotten for: ', tileUrl);
                            tileMesh.material.map = texture;
                            tileMesh.material.needsUpdate = true;
                            // console.log('tileMesh:', tileMesh);
                            scope.render();
                        });
                    })(tile_, tileMesh);
                }
            }
        }
    }
    // this.populateTiles = function (tileBB, tile, parent3D) {
    //     console.log('tileBB:', tileBB);
    //     // console.log('tile:', tile);


    //     let zoom = Math.max(0, tileBB.z + 1);
    //     if (tileBB.z >= tile.z) {
    //         // console.log('exit');
    //         return;
    //     }
    //     let dz = tile.z - zoom;
    //     // console.log('zoom:', zoom);
    //     // console.log('dz:', dz);
    //     xMin = tileBB.x << 1;
    //     xMax = xMin + 1;
    //     yMin = tileBB.y << 1;
    //     yMax = yMin + 1;
    //     console.log('xMin:', xMin, ', xMax:', xMax, ', yMin:', yMin, ', yMax:', yMax);
    //     // tileBB = {
    //     //     z: zoom,
    //     //     x: Math.floor(tile.x / Math.pow(2, dz)),
    //     //     y: Math.floor(tile.y / Math.pow(2, dz))
    //     // };
    //     // console.log('tileBB:', tileBB);
    //     // let tiles = [];
    //     for (u = xMin; u <= xMax; u++) {
    //         for (v = yMin; v <= yMax; v++) {
    //             console.log('v:', v);
    //             let tile_ = {
    //                 z: tileBB.z + 1,
    //                 x: u,
    //                 y: v
    //             };
    //             // console.log('tile_:', tile_);
    //             // console.log('tile aaa:', tile);
    //             let x = tile.x;
    //             let y = tile.y;
    //             if ((x >> dz) === tile_.x && (y >> dz) === tile_.y) {
    //                 // console.log('(tile.x >> dz):', (tile.x >> dz));
    //                 // console.log('tile bbb:', tile);

    //                 // console.log('tile_ aze:', tile_);
    //                 let ref3D = new THREE.Object3D();
    //                 parent3D.add(ref3D);
    //                 // tileNext = {
    //                 //     z: z + 1,
    //                 //     x: tile_.x * 2,
    //                 //     y: tile_.y * 2
    //                 // };
    //                 scope.populateTiles(tile_, tile, ref3D);
    //                 // console.log('ref3D:', ref3D);
    //                 // continue;
    //             } else {
    //                 let tileMesh = THREE.Toolbox.getTileSphereMesh(tile_)
    //                 tileMesh.material.needsUpdate = true;
    //                 parent3D.add(tileMesh);
    //                 console.log('add:', tile_);
    //             }
    //             scope.render();
    //             // ((tile, tileMesh) => {
    //             //     let tileUrl = getUrl(
    //             //         scope.tiles,
    //             //         tile.z, tile.x, tile.y);
    //             //     // console.log('url:', tileUrl);
    //             //     loader.load(tileUrl, function (texture) {
    //             //         console.log('url gotten for: ', tileUrl);
    //             //         // console.log('tileMesh: ', tileMesh);
    //             //         tileMesh.material.map = texture;
    //             //         tileMesh.material.needsUpdate = true;

    //             //         scope.render();
    //             //     });
    //             // })(tile_, tileMesh);
    //         }
    //     }
    //     return;
    // }
    this.update = function (tile) {
        scope.remove(scope.earth);
        // scope.removeKids(scope.earth, 5);
        // scope.earth.dispose();
        // scope.earth.dispose();

        let depth = 5;
        // THREE.EarthTiles.populateTiles_01(
        //     {
        //         z: tile.z - depth,
        //         x: tile.x >> depth,
        //         y: tile.y >> depth
        //     },
        //     tile,
        //     scope.earth
        // );
        // THREE.EarthTiles.populateTiles_02(
        //     tile.z - depth,
        //     // Math.max(0, tile.z - 1),
        //     tile,
        //     scope.earth
        // );
        scope.populateTiles(
            {
                z: tile.z - depth,
                x: {
                    min: (((tile.x << 2) >> depth) - 1) >> 2,
                    max: (((tile.x << 2) >> depth) + 1) >> 2
                },
                y: {
                    min: (((tile.y << 2) >> depth) - 1) >> 2,
                    max: (((tile.y << 2) >> depth) + 1) >> 2
                }
            },
            // Math.max(0, tile.z - 1),
            tile,
            scope.earth
        );
        scope.render();
        console.log(renderer.info.memory);

        return;
    }
    //
    // internals
    //

    let scope = this;
    let currentTiles;
    let loader = new THREE.TextureLoader();
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

// THREE.EarthTiles.populateTiles_01 = function (tileBB, tile, parent3D) {
//     // console.log('tileBB:', tileBB);

//     let zoom = Math.max(0, tileBB.z + 1);
//     if (tileBB.z >= tile.z) {
//         console.log('exit');
//         return;
//     }
//     let dz = tile.z - zoom;
//     xMin = tileBB.x << 1;
//     xMax = xMin + 1;
//     yMin = tileBB.y << 1;
//     yMax = yMin + 1;
//     // console.log('xMin:', xMin, ', xMax:', xMax, ', yMin:', yMin, ', yMax:', yMax);
//     let tileRef;
//     for (u = xMin; u <= xMax; u++) {
//         for (v = yMin; v <= yMax; v++) {
//             let tile_ = {
//                 z: tileBB.z + 1,
//                 x: u,
//                 y: v
//             };
//             let x = tile.x;
//             let y = tile.y;
//             if ((x >> dz) === tile_.x && (y >> dz) === tile_.y) {
//                 tileRef = tile_;
//             } else {
//                 let tileMesh = THREE.Toolbox.getTileSphereMesh(tile_)
//                 tileMesh.material.needsUpdate = true;
//                 parent3D.add(tileMesh);
//                 // console.log('add:', tile_);
//             }
//         }
//     }
//     let ref3D = new THREE.Object3D();
//     parent3D.add(ref3D);
//     THREE.EarthTiles.populateTiles_01(tileRef, tile, ref3D);
// }


// THREE.EarthTiles.populateTiles_02 = function (z, tile, parent3D) {
//     // console.log('tileBB:', tileBB);
//     let depth = tile.z - z;
//     let tileBB = {
//         z: z,
//         x: tile.x >> depth,
//         y: tile.y >> depth
//     };
//     let zoom = Math.max(0, tileBB.z + 1);
//     if (tileBB.z >= tile.z) {
//         console.log('exit');
//         return;
//     }
//     let dz = tile.z - zoom;
//     let xMin = tileBB.x << 1;
//     let xMax = xMin + 1;
//     let yMin = tileBB.y << 1;
//     let yMax = yMin + 1;
//     // console.log('xMin:', xMin, ', xMax:', xMax, ', yMin:', yMin, ', yMax:', yMax);
//     let tileRef;
//     for (let u = xMin; u <= xMax; u++) {
//         for (let v = yMin; v <= yMax; v++) {
//             let tile_ = {
//                 z: tileBB.z + 1,
//                 x: u,
//                 y: v
//             };
//             let x = tile.x;
//             let y = tile.y;
//             if ((x >> dz) === tile_.x && (y >> dz) === tile_.y) {
//                 let tileRef = tile_;
//                 let ref3D = new THREE.Object3D();
//                 parent3D.add(ref3D);
//                 THREE.EarthTiles.populateTiles_02(tileRef.z, tile, ref3D);
//             } else {
//                 let tileMesh = THREE.Toolbox.getTileSphereMesh(tile_)
//                 tileMesh.material.needsUpdate = true;
//                 parent3D.add(tileMesh);
//                 // console.log('add:', tile_);
//             }
//         }
//     }

// }


// THREE.EarthTiles.populateTiles_03 = function (bb, tile, parent3D) {
//     if (bb.z > tile.z) {
//         console.log('exit');
//         return;
//     }
//     let depth = tile.z - bb.z - 1;
//     let bbNext = {
//         z: bb.z + 1,
//         x: {
//             min: (((tile.x << 1) >> depth) - 1) >> 1,
//             max: (((tile.x << 1) >> depth) + 1) >> 1
//         },
//         y: {
//             min: (((tile.y << 1) >> depth) - 1) >> 1,
//             max: (((tile.y << 1) >> depth) + 1) >> 1
//         }
//     }
//     let bbHole = {
//         z: bb.z,
//         x: {
//             min: bbNext.x.min >> 1,
//             max: bbNext.x.max >> 1,
//         },
//         y: {
//             min: bbNext.y.min >> 1,
//             max: bbNext.y.max >> 1
//         }
//     }
//     for (let u = bb.x.min; u <= bb.x.max; u++) {
//         for (let v = bb.y.min; v <= bb.y.max; v++) {
//             let tile_ = {
//                 z: bb.z,
//                 x: u,
//                 y: v
//             };

//             if (u >= bbHole.x.min && u <= bbHole.x.max && v >= bbHole.y.min && v <= bbHole.y.max && bb.z < tile.z) {
//                 let tileBbNext = {
//                     z: bbNext.z,
//                     x: {
//                         min: Math.min(u << 1),
//                         max: Math.max((u << 1) + 1)
//                     },
//                     y: {
//                         min: Math.min(v << 1),
//                         max: Math.max((v << 1) + 1)
//                     }
//                 }
//                 let tileRef = tile_;
//                 let ref3D = new THREE.Object3D();
//                 parent3D.add(ref3D);
//                 THREE.EarthTiles.populateTiles_03(tileBbNext, tile, ref3D);
//             }
//             else {
//                 let tileMesh = THREE.Toolbox.getTileSphereMesh(tile_, bb.z)
//                 tileMesh.material.needsUpdate = true;
//                 parent3D.add(tileMesh);
//                 // }
//             }
//         }
//     }
// }