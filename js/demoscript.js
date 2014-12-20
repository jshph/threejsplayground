var renderer = new THREE.WebGLRenderer({
    antialias: true
});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor('lightblue', 1);
document.body.appendChild(renderer.domElement);

//var onRenderFcts= [];
var clock = new THREE.Clock();

var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera(45, window.innerWidth/window.innerHeight, 0.01, 1000);
var controls = new THREE.FirstPersonControls(camera);
camera.position.z = 1;
controls.handleResize();
controls.lookSpeed = 0.25;
controls.movementSpeed = 2.5;

;(function(){
    // add a ambient light
    var light   = new THREE.AmbientLight( 0x020202 )
    scene.add( light )
})()

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
// load the texture
var textureUrl      = THREEx.createGrassTufts.baseUrl+'/img/images/grass01.png';
var material        = mesh.material;
material.map        = THREE.ImageUtils.loadTexture(textureUrl);
material.alphaTest  = 0.7;

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