const dice = new Array(6);
dice[0] = {
    x: 0.7,
    y: 1.55 * 3.5,
    z: 1.55
}
dice[1] = {
    x: 1.55 * 2 + 5.5,
    y: 0,
    z: 1.55 * 1.5
}
dice[2] = {
    x: 1.55 * 4.5,
    y: 1.55 * 4.5,
    z: 1.55 * 4
}
dice[3] = {
    x: 1.55 * 4.5,
    y: 1.55 * 4.5,
    z: 1.55 * 2
}
dice[4] = {
    x: 1.55 * 4 + 5.5,
    y: 0,
    z: 1.55 * 1.5
}
dice[5] = {
    x: 1.55 * 2.5,
    y: 1.55 * 4.5,
    z: 1.55
}


let chart = new barChart;

chart.id = "histogram";
chart.width = 700;
chart.height = 500;
chart.vertName = "Кости";
chart.horName = "Количество";

let chartItems = new Array(6);
chartItems[0] = new chartValue;
chartItems[0].name = "Выпало 1";
chartItems[0].qty = 0;
chartItems[0].color = "#FF0000";

chartItems[1] = new chartValue;
chartItems[1].name = "Выпало 2";
chartItems[1].qty = 0;
chartItems[1].color = "#00FF00";

chartItems[2] = new chartValue;
chartItems[2].name = "Выпало 3";
chartItems[2].qty = 0;
chartItems[2].color = "#0000FF";

chartItems[3] = new chartValue;
chartItems[3].name = "Выпало 4";
chartItems[3].qty = 0;
chartItems[3].color = "#FFFF00";

chartItems[4] = new chartValue;
chartItems[4].name = "Выпало 5";
chartItems[4].qty = 0;
chartItems[4].color = "#FF00FF";

chartItems[5] = new chartValue;
chartItems[5].name = "Выпало 6";
chartItems[5].qty = 0;
chartItems[5].color = "#00FFFF";

chart.inputValue(chartItems);
chart.createChart();


var result;
let rollsN;
let stepX, stepY, stepZ;
let step;
let cubeRotateX = 5;
let cubeRotateY = 5;
let currentX = 0;
let currentY = 0;
let currentZ = 0;
let timer;
let animation = false;
// Создание куба-кости с помощью Three.js

var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

var renderer = new THREE.WebGLRenderer({ canvas: document.getElementById('canvas') });
renderer.setSize(400, 400);

var material = [
    new THREE.MeshBasicMaterial({ map: new THREE.TextureLoader().load('img/texture/dice_1.png') }),
    new THREE.MeshBasicMaterial({ map: new THREE.TextureLoader().load('img/texture/dice_6.png') }),
    new THREE.MeshBasicMaterial({ map: new THREE.TextureLoader().load('img/texture/dice_3.png') }),
    new THREE.MeshBasicMaterial({ map: new THREE.TextureLoader().load('img/texture/dice_4.png') }),
    new THREE.MeshBasicMaterial({ map: new THREE.TextureLoader().load('img/texture/dice_5.png') }),
    new THREE.MeshBasicMaterial({ map: new THREE.TextureLoader().load('img/texture/dice_2.png') })
];
var cube = new THREE.Mesh(new THREE.BoxGeometry(3.5, 3.5, 3.5), material);

scene.add(cube);

camera.position.z = 5;

// Анимация кости

var animate = function (x, y) {
    requestAnimationFrame(animate);

    cube.rotation.x += x;
    cube.rotation.y += y;

    renderer.render(scene, camera);
};


function speedUp() {
    cube.rotation.x += cubeRotateX / 100;
    cube.rotation.y += cubeRotateY / 100;
    currentX += cubeRotateX / 100;
    currentY += cubeRotateY / 100;

    if (cubeRotateX < 8) {
        cubeRotateX += Math.random() / 100;
    }
    if (cubeRotateY < 8) {
        cubeRotateY += Math.random() / 100;
    }
    if (cubeRotateX >= 8 && cubeRotateY >= 8) {
        clearInterval(timer);
        currentX = currentX % 6.2;
        currentY = currentY % 6.2;
        currentZ = currentZ % 6.2;
        console.log(result, ":");
        console.log("CurrentX:", currentX);
        console.log("CurrentY:", currentY);
        console.log("CurrentZ:", currentZ);
        console.log("EndX:", dice[result - 1].x);
        console.log("EndY:", dice[result - 1].y);
        console.log("EndZ:", dice[result - 1].z);
        const dx = Math.abs(currentX - dice[result - 1].x);
        const dy = Math.abs(currentY - dice[result - 1].y);
        const dz = Math.abs(currentZ - dice[result - 1].z);
        console.log("dX:", dx);
        console.log("dY:", dy);
        console.log("dZ:", dz);
        stepX = dx / 100;
        stepY = dy / 100;
        stepZ = dz / 100;
        console.log("stepX:", stepX);
        console.log("stepY:", stepY);
        console.log("stepZ:", stepZ);
        currentX = dice[result - 1].x;
        currentY = dice[result - 1].y;
        currentZ = dice[result - 1].z;
        step = 1;
        timer = setInterval(showResult, 10);
    }

    renderer.render(scene, camera);
}

function showResult() {

    cube.rotation.x += stepX;
    cube.rotation.y += stepY;
    cube.rotation.z += stepZ;
    if (step == 100) {
        clearInterval(timer);
        cube.rotation.x = dice[result - 1].x;
        cube.rotation.y = dice[result - 1].y;
        cube.rotation.z = dice[result - 1].z;
        renderer.render(scene, camera);
        document.getElementById("result").innerHTML = "Выпало " + result;
        addToTable(result);
        animation = false;
    }
    step += 1;
    renderer.render(scene, camera);
}

function rollDice() {
    if (!animation) {
        var sides = [1, 2, 3, 4, 5, 6];
        var sideIndex = Math.floor(Math.random() * 6);
        result = sides[sideIndex];
        rollsN = document.forms["rollsN"].elements["n"].value;
        cubeRotateX = 5;
        cubeRotateY = 5;
        animation = true;
        timer = setInterval(speedUp, 10);
    }
}
var rounded = function(number){
    return +number.toFixed(2);
}

function addToTable(res) {
    document.getElementById("rolls").innerHTML = document.getElementById("rolls").innerHTML-0+1;
    document.getElementById("n" + res).innerHTML = document.getElementById("n" + res).innerHTML-0+1;

    for (let i = 1; i <= 6; ++i) {
        document.getElementById("v" + i).innerHTML = rounded(document.getElementById("n" + i).innerHTML / document.getElementById("rolls").innerHTML * 100) + "%";
    }

    chartItems[res-1].qty += 1;

    if (rollsN > 1) {
        for (let j = 1; j <= rollsN - 1; ++j) {
            res = Math.floor(Math.random() * 6) + 1;
            document.getElementById("rolls").innerHTML = document.getElementById("rolls").innerHTML-0+1;
            document.getElementById("n" + res).innerHTML = document.getElementById("n" + res).innerHTML-0+1;
            chartItems[res-1].qty += 1;
            for (let i = 1; i <= 6; ++i) {
                document.getElementById("v" + i).innerHTML = rounded(document.getElementById("n" + i).innerHTML / document.getElementById("rolls").innerHTML * 100) + "%";
            }
        }
    }

    chart.animateDataChanging(chartItems);
}
