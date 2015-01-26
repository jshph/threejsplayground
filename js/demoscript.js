var renderer = new THREE.WebGLRenderer({
    antialias: true
});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor('lightblue', 1);
document.body.appendChild(renderer.domElement);

var onRenderFcts= [];
var clock = new THREE.Clock();

var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera(45, window.innerWidth/window.innerHeight, 0.01, 1000);
var controls = new THREE.FirstPersonControls(camera);
camera.position.y = 1;
controls.handleResize();
controls.lookSpeed = 0.25;
controls.movementSpeed = 1.3;
/*
onRenderFcts.push(function() {
    console.log(camera.position.x);
})*/

;(function(){
    // add a ambient light
    var light   = new THREE.AmbientLight( 0x020202 )
    scene.add( light )
})()

// ENVIRONMENT AND EFFECTS
//scene.fog = new THREE.FogExp2(0xFFFFFF, 0.3);
//skybox
var imgPrefix = "img/jajlands2/jajlands2_";
var imgExtension = ".jpg";
var directions = ["right", "left", "top", "", "front", "back"];
var skyGeom = new THREE.BoxGeometry(1000,1000,1000);
//skyGeom.applyMatrix(new THREE.Matrix4().makeTranslation(0,-skyGeom.height/2,0));
var materialAry = [];
for (var i = 0; i < 6; i++) {
    if (directions[i] != "")
        materialAry.push(new THREE.MeshBasicMaterial({
            map:THREE.ImageUtils.loadTexture(imgPrefix + directions[i] + imgExtension),
            side: THREE.BackSide //Deprecated code?
        }));
    else
        materialAry.push(new THREE.MeshBasicMaterial());
}
var skyMaterial = new THREE.MeshFaceMaterial(materialAry);
var skyBox = new THREE.Mesh(skyGeom, skyMaterial);
scene.add(skyBox);


// GRASS FLOOR
/*var textureUrl  = 'img/grasslight-small.jpg'
var texture = THREE.ImageUtils.loadTexture(textureUrl);
texture.wrapS   = THREE.RepeatWrapping;
texture.wrapT   = THREE.RepeatWrapping;
texture.repeat.x= 10
texture.repeat.y= 10
texture.anisotropy = renderer.getMaxAnisotropy()
// build object3d
var geometry    = new THREE.PlaneGeometry(20, 20)
var material    = new THREE.MeshPhongMaterial({
    map : texture,
    emissive: 'green',
})
var grassfloor    = new THREE.Mesh(geometry, material)
grassfloor.rotateX(-Math.PI/2)
scene.add(grassfloor)
// lock floor
onRenderFcts.push(function() {
    grassfloor.position.copy({
        x: camera.position.x,
        y: camera.position.y-1,
        z: camera.position.z
    });
});*/

// X axes references (TEMP)
var posxbox = new THREE.Mesh(new THREE.BoxGeometry(0.1,0.1,0.1), new THREE.MeshBasicMaterial({color: 0xff0000}));
posxbox.position.x = 2;
scene.add(posxbox);
var negxbox = new THREE.Mesh(new THREE.BoxGeometry(0.1,0.1,0.1), new THREE.MeshBasicMaterial({color: 0x00ff00}));
negxbox.position.x = -2;
scene.add(negxbox);
onRenderFcts.push(function() {
    posxbox.position.z = camera.position.z;
    posxbox.position.y = camera.position.y;
    posxbox.position.x = camera.position.x + 2;
    negxbox.position.z = camera.position.z;
    negxbox.position.y = camera.position.y;
    negxbox.position.x = camera.position.x - 2;
})

///////////////////
//TUFTS OF GRASS //
///////////////////

var RANGEOFVIEW = 4;
var marginTH = 0.1
var renderedFields_queue = [];
var grassModels = [];
var oldCamX = 0; // to generate delta to determine direction of grass generation.

//var grassSpan = {'x': 0, 'z': 0, 'y': camera.position.y}; // each element: center of the last added mesh layout. i.e. after init, first should be 20.
onRenderFcts.push(function check_regenerateGrass() {
    var distanceFromMargin = Math.abs(camera.position.x % RANGEOFVIEW/2);
    //console.log(distanceFromMargin + " " + camera.position.x);
    if (distanceFromMargin < marginTH && Math.abs(camera.position.x) > 0) {
        //console.log(Math.abs(camera.position.x % RANGEOFVIEW/2))
        console.log("generating!");

        var camDeltaX = camera.position.x - oldCamX;
        
        if (camDeltaX > 0)
            generateGrass(camera.position.x + 4);
        else if (camDeltaX < 0)
            generateGrass(camera.position.x - 4);
    }
    oldCamX = camera.position.x;
});


//Procedure for regeneration:
// - select randomly from n pregenerated fields of grass to render.
// - render field when A position passes some margin M from the borders of area A.
// - remove a field when the area A around the camera no longer encompasses its center.
// 
// NECESSITIES:
// - keep track of rendered field... ideally, depending on direction of movement, script knows
//     that such field is the first to go. Otherwise, keep track of fields at boundaries.
// - 
function generateGrass(xPos) {
    // lock grass y
    grassTuftsMesh = grassModels[Math.random()*3];
    console.log(grassTuftsMesh);

/*    onRenderFcts.push(function() {
        grassTuftsMesh.position.y = camera.position.y-1;
    });*/

    //grassTuftsMesh.position.x = xPos;
    throw "error!";

    scene.add(grassTuftsMesh);
    renderedFields_queue.push(grassTuftsMesh);
    scene.remove(renderedFields_queue.shift());
}

function modelGrass() {
    var nTufts  = 1000
    var positions   = new Array(nTufts)
    for(var i = 0; i < nTufts; i++){
        var position    = new THREE.Vector3()
        position.x  = (Math.random()-0.5)*RANGEOFVIEW;
        position.z  = (Math.random()-0.5)*RANGEOFVIEW*2;
        positions[i]    = position;
    }
    var grassTuftsMesh    = THREEx.createGrassTufts(positions)
    
    // console.log(grassTuftsMesh.position);
    console.log('initialized a field');

    // load the texture
    var textureUrl      = THREEx.createGrassTufts.baseUrl+'/img/images/grass01.png';
    var material        = grassTuftsMesh.material;
    material.map        = THREE.ImageUtils.loadTexture(textureUrl);
    material.alphaTest  = 0.7;
    return grassTuftsMesh;
}

// prerender grass models
grassModels.push(modelGrass());
grassModels.push(modelGrass());
grassModels.push(modelGrass());

setTimeout(function() {
renderedFields_queue.push(generateGrass(-4));
renderedFields_queue.push(generateGrass(0));
renderedFields_queue.push(generateGrass(4));
}, 3000)

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

function animate() {
    requestAnimationFrame(animate);
    render();
}

function render() {
    controls.update(clock.getDelta());

    onRenderFcts.forEach(function(onRenderFct) { onRenderFct(); });

    renderer.render(scene, camera);
}

animate();

/*onRenderFcts.push(function(){
        renderer.render( scene, camera );       
    })
    
    //////////////////////////////////////////////////////////////////////////////////
    //      loop runner                         //
    //////////////////////////////////////////////////////////////////////////////////
    var lastTimeMsec= null
    requestAnimationFrame(function animate(nowMsec){
        // keep looping
        requestAnimationFrame( animate );
        // measure time
        lastTimeMsec    = lastTimeMsec || nowMsec-1000/60
        var deltaMsec   = Math.min(200, nowMsec - lastTimeMsec)
        lastTimeMsec    = nowMsec
        // call each update function
        onRenderFcts.forEach(function(onRenderFct){
            onRenderFct(deltaMsec/1000, nowMsec/1000)
        })
    })*/