var renderer = new THREE.WebGLRenderer({
    antialias: true
});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor('lightblue', 1);
document.body.appendChild(renderer.domElement);
loaded_count = 0;
allSounds = [];

playAllSounds = function() {
    for (var i = 0; i < allSounds.length; i++){
        console.log(allSounds)
        allSounds[i].play()
    }
}

//AUDIOOBJECT
DMN_Audio = function(listener) {
    THREE.Audio.call(this,listener);
};
DMN_Audio.prototype = Object.create(THREE.Audio.prototype)

DMN_Audio.prototype.load = function ( file ) {
    var scope = this;
    var request = new XMLHttpRequest();
    request.open( 'GET', file, true );
    request.responseType = 'arraybuffer';
    request.onload = function ( e ) {

        scope.context.decodeAudioData( this.response, function ( buffer ) {
            scope.source.buffer = buffer;
            scope.source.connect( scope.panner );
            loaded_count++;
            allSounds.push(scope)
            if (loaded_count>=3) {
                playAllSounds();
            }
        } );

    };
    request.send();
    return this;
};

DMN_Audio.prototype.play = function ( file ) {
    var scope = this;
    scope.source.start( 0 );
};

//var onRenderFcts= [];
var clock = new THREE.Clock();
var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera(45, window.innerWidth/window.innerHeight, 0.01, 1000);
var controls = new THREE.FirstPersonControls(camera);
camera.position.y = .2;
controls.handleResize();
controls.noFly = true;
controls.lookVertical=false;
controls.lookSpeed = 0.07;
controls.movementSpeed = 2.5;

;(function(){
    // add a ambient light
    var light   = new THREE.AmbientLight( 0x020202 )
    scene.add( light )
})()

var light1 = new THREE.DirectionalLight( 0xffffff );
light1.position.set( 1, 1, -2 ).normalize();
scene.add( light1 );

var light2 = new THREE.DirectionalLight( 0xffffff );
light2.position.set( 1, 1, 2 ).normalize();
scene.add( light2 );

// ENVIRONMENT AND EFFECTS

//scene.fog = new THREE.FogExp2(0xFFFFFF, 1);
//skybox
var imgPrefix = "img/jajlands2/jajlands2_";
var imgExtension = ".jpg";
var directions = ["right", "left", "top", "", "front", "back"];
var skyGeom = new THREE.CubeGeometry(1000,1000,1000);
var materialAry = [];
for (var i = 0; i < 6; i++) {
    materialAry.push(new THREE.MeshBasicMaterial({
        map:THREE.ImageUtils.loadTexture(imgPrefix + directions[i] + imgExtension),
        side: THREE.BackSide //Deprecated code?
    }));
}
var skyMaterial = new THREE.MeshFaceMaterial(materialAry);
var skyBox = new THREE.Mesh(skyGeom, skyMaterial);

scene.add(skyBox);


// GRASS FLOOR
var textureUrl  = 'img/grasslight-small.jpg'
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
var object3d    = new THREE.Mesh(geometry, material)
object3d.rotateX(-Math.PI/2)
scene.add(object3d)

//TUFTS OF GRASS
var nTufts  = 5000
var positions   = new Array(nTufts)
for(var i = 0; i < nTufts; i++){
    var position    = new THREE.Vector3()
    position.x  = (Math.random()-0.5)*20
    position.z  = (Math.random()-0.5)*20
    positions[i]    = position
}
var mesh    = THREEx.createGrassTufts(positions)
scene.add(mesh);

//SOUND
var listener = new THREE.AudioListener();
var sphere = new THREE.SphereGeometry( .2,20,20);

var material_sphere1 = new THREE.MeshLambertMaterial( { color: 0xffaa00, shading: THREE.FlatShading } );
var mesh1 = new THREE.Mesh( sphere, material_sphere1 );
mesh1.position.set( 0, .2,.577 );
scene.add( mesh1 );
var sound1 = new DMN_Audio( listener );

material_sphere2 = new THREE.MeshLambertMaterial( { color: 0xff2200, shading: THREE.FlatShading } );
var mesh2 = new THREE.Mesh( sphere, material_sphere2 );
mesh2.position.set( 1, .2, 0 );
scene.add( mesh2 );
var sound2 = new DMN_Audio( listener );

material_sphere3 = new THREE.MeshLambertMaterial( { color: 0xff7700, shading: THREE.FlatShading } );
var mesh3 = new THREE.Mesh( sphere, material_sphere2 );
mesh3.position.set( 0, .2, -.577 );
scene.add( mesh3 );
var sound3 = new DMN_Audio( listener );

mesh1.add( sound1 );
mesh2.add( sound2 );
mesh3.add( sound3 );
sound1.load('../sounds/voice.mp3');
sound2.load( '../sounds/drums.mp3' );
sound3.load( '../sounds/keyboard.mp3' );
sound1.setRefDistance( .2 );
sound2.setRefDistance( .2 );
sound3.setRefDistance( .2 );

camera.add(listener)

// load the texture
var textureUrl      = THREEx.createGrassTufts.baseUrl+'/img/images/grass01.png';
var material        = mesh.material;
material.map        = THREE.ImageUtils.loadTexture(textureUrl);
material.alphaTest  = 0.7;

//ANIMATION
function animate() {
    requestAnimationFrame(animate);
    render();
}

function render() {
    controls.update(clock.getDelta());
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
