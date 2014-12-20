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

var textureUrl  = './threex.grass/examples/images/grasslight-small.jpg'
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

// test geo at scene origin

var testgeo = new THREE.BoxGeometry(1,1,1);
var material = new THREE.MeshBasicMaterial({color: '0x00ff00'});
var cube = new THREE.Mesh(testgeo, material);
    cube.position.x = 2;
    cube.position.y = 0;
    cube.position.z = 0;
scene.add(cube);

/*var mouse   = {x : 0, y : 0}
    document.addEventListener('mousemove', function(event){
        mouse.x = (event.clientX / window.innerWidth ) - 0.5
        mouse.y = (event.clientY / window.innerHeight) - 0.5
    }, false)
    onRenderFcts.push(function(delta, now){
        camera.position.x += (mouse.x*2 - camera.position.x) * (delta*3)
        camera.position.y += (mouse.y*2 - camera.position.y) * (delta*3)
        camera.lookAt( scene.position )
    })
*/

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