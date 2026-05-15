//要素取得
// --- HTML要素 ---
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const start = document.getElementById("start");

function resizeCanvas() {
    const dpr = window.devicePixelRatio || 1;
    canvas.width = window.innerWidth * dpr;
    canvas.height = window.innerHeight * dpr;
    canvas.style.width = `${window.innerWidth}px`;
    canvas.style.height = `${window.innerHeight}px`;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
}

window.addEventListener("resize", resizeCanvas);
resizeCanvas();

// --- その他の要素 ---

//変数・定数
let flash = 0;
let count = 0;
let flashwait = 10;
let mycharacter = null;
let charaselect = false;

// --- RPG会話用の設定 ---
let scenario = [
    { name: "", text: "暗闇の中から声が聞こえる……。" },
    { name: "謎の声", text: "「目を覚ませ……」" },
    { name: "謎の声", text: "「選ばれし勇者よ、今こそ立ち上がる時だ。」" },
    { name: "勇者", text: "（……頭が痛い。ここはどこだ？）" }
];
let currentLine = 0;   
let charIndex = 0;     
let isTyping = false;  
let messageBox = null; 
let nameBox = null;
let textBox = null;
let selectBox = null;
let selectbuttom1 = null;
let selectbuttom2 = null;
let typeTimer = null;
let autoStartTimer = null;

//イベント
let started = false;

start.addEventListener("click", function() {
    if(started) return;
    started = true;

    start.style.animation = "shake 0.2s infinite";
    startanimation();
});

canvas.addEventListener("click", (e) => {

    if(charaselect){

        const rect = canvas.getBoundingClientRect();

        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        if (
            x >= 300 && x <= 600 &&
            y >= 100 && y <= 700
        ) {

            selecting(
                "はい",
                "いいえ",
                "これでいいですか",
                1
            );

            charaselect = false;
        }

        if (
            x >= 900 && x <= 1200 &&
            y >= 100 && y <= 700
        ) {

            selecting(
                "はい",
                "いいえ",
                "これでいいですか",
                2
            );

            charaselect = false;
        }
    }
});

//関数
function startanimation(){
    flash += 1;
    if (count !== 6){
        if (flash == flashwait){
            if (count >= 4){
                ctx.fillStyle = "black";
                ctx.fillRect(0, 0, canvas.width, canvas.height);
            }
        } else if (flash == flashwait * 2){
            count += 1
            flash = 0
            if (count !== 6){
                ctx.clearRect(0, 0, canvas.width, canvas.height);
            }
        }
    }

    if (count == 1){
        flashwait = 5
        start.style.display = "none";
    }else if (count == 2){
        flashwait = 5
        start.textContent = "蟶ｰ繧�";
        start.style.display = "block";
    }else if (count == 3){
        flashwait = 6
        start.style.display = "none";
    }else if (count == 4){
        flashwait = 3
        start.textContent = "邨らち";
        start.style.display = "block";
    }else if (count == 5){
        flashwait = 2
        start.textContent = "豁ｻ";
    }else if (count == 6){
        start.style.display = "none";
        start.textContent = "start";
    }

    if (count < 6){

    requestAnimationFrame(startanimation);

    }else{
        start.style.display = "none";
        characterselection();
    }
    
    if (flash > 50){
       start.style.display = "none";
    }
}

function characterselection() {
    charaselect = true;
    ctx.save();
    ctx.fillStyle = "rgb(122, 122, 122)";
    ctx.shadowColor = "#ff0000";
    ctx.shadowBlur = 15;
    ctx.fillRect(300, 100, 300, 600);
    ctx.fillRect(900, 100, 300, 600);

document.fonts.ready.then(() => {
    ctx.save();

    ctx.font = "40px 'Yuji Mai', cursive";
    ctx.fillStyle = "#ff6666";
    ctx.shadowColor = "#ff0000";
    ctx.shadowBlur = 15;
    ctx.textAlign = "center";

    ctx.fillText("自分を選ぶ", 750, 100);

    ctx.restore();
});
}

function selecting(text1,text2,explanation,caseType) {
    messageBox = document.createElement("div");
    
    // --- メッセージボックス ---
    messageBox.style.position = "absolute";
    messageBox.style.bottom = "350px";
    messageBox.style.left = "50%";
    messageBox.style.transform = "translateX(-50%)";
    messageBox.style.width = "20%";
    messageBox.style.height = "160px";
    messageBox.style.backgroundColor = "rgba(20, 0, 0, 0.95)";
    messageBox.style.border = "5px double #8b0000";
    messageBox.style.fontFamily = "'Times New Roman', 'YuMincho', serif";
    messageBox.style.zIndex = "100";

    selectBox = document.createElement("div");
    selectBox.style.position = "absolute";
    selectBox.style.top = "10px";
    selectBox.style.left = "20px";
    selectBox.style.color = "#ff0000";
    selectBox.style.fontSize = "24px";
    selectBox.style.fontWeight = "bold";
    selectBox.style.textShadow = "1px 1px 2px black";
    selectBox.innerText = explanation;

    selectbuttom1 = document.createElement("button");
    selectbuttom1.textContent = text1;
    selectbuttom1.style.position = "absolute";
    selectbuttom1.style.bottom = "45px";
    selectbuttom1.style.left = "30%";
    selectbuttom1.style.transform = "translateX(-50%)";
    selectbuttom1.style.border = "4px double red";
    selectbuttom1.style.backgroundColor = "#330000";
    selectbuttom1.style.color = "#ff6666";
    selectbuttom1.style.fontFamily = "serif";
    selectbuttom1.style.fontSize = "20px";
    selectbuttom1.style.padding = "10px 20px";
    selectbuttom1.style.cursor = "pointer";
    selectbuttom1.style.textShadow = "0 0 5px #ff0000";

    // ホバー時
    selectbuttom1.addEventListener("mouseover", () => {
        selectbuttom1.style.backgroundColor = "#660000";
        selectbuttom1.style.color = "#ffffff";
        selectbuttom1.style.textShadow = "0 0 10px #ff0000";
    });

    // ホバー解除時
    selectbuttom1.addEventListener("mouseout", () => {
        selectbuttom1.style.backgroundColor = "#330000";
        selectbuttom1.style.color = "#ff6666";
        selectbuttom1.style.textShadow = "0 0 5px #ff0000";
    });

    selectbuttom2 = document.createElement("button");
    selectbuttom2.textContent = text2;
    selectbuttom2.style.position = "absolute";
    selectbuttom2.style.bottom = "45px";
    selectbuttom2.style.left = "60%";
    selectbuttom2.style.transform = "translateX(-50%)";
    selectbuttom2.style.border = "4px double red";
    selectbuttom2.style.backgroundColor = "#330000";
    selectbuttom2.style.color = "#ff6666";
    selectbuttom2.style.fontFamily = "serif";
    selectbuttom2.style.fontSize = "20px";
    selectbuttom2.style.padding = "10px 20px";
    selectbuttom2.style.cursor = "pointer";
    selectbuttom2.style.textShadow = "0 0 5px #ff0000";

    // ホバー時
    selectbuttom2.addEventListener("mouseover", () => {
        selectbuttom2.style.backgroundColor = "#660000";
        selectbuttom2.style.color = "#ffffff";
        selectbuttom2.style.textShadow = "0 0 10px #ff0000";
    });

    // ホバー解除時
    selectbuttom2.addEventListener("mouseout", () => {
        selectbuttom2.style.backgroundColor = "#330000";
        selectbuttom2.style.color = "#ff6666";
        selectbuttom2.style.textShadow = "0 0 5px #ff0000";
    });

    selectbuttom1.addEventListener("click", function() {
        if (caseType == 1 || caseType == 2){
            messageBox.remove();
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.fillStyle = "black";
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            setTimeout(function() {
                startRPG();
            }, 2000);
        }
    });
    selectbuttom2.addEventListener("click", function() {
        if (caseType == 1 || caseType == 2){
            messageBox.remove();
            charaselect = true;
        }
    });

    messageBox.appendChild(selectBox);
    messageBox.appendChild(selectbuttom1);
    messageBox.appendChild(selectbuttom2);
    document.body.appendChild(messageBox);
}

function startRPG(){

    ctx.fillStyle = "black";

    ctx.fillRect(
        0,
        0,
        canvas.width,
        canvas.height
    );

    createMessageBox();

    showNextLine();
}

function createMessageBox() {
    messageBox = document.createElement("div");
    
    // --- メッセージボックス ---
    messageBox.style.position = "absolute";
    messageBox.style.bottom = "100px";
    messageBox.style.left = "50%";
    messageBox.style.transform = "translateX(-50%)";
    messageBox.style.width = "70%";
    messageBox.style.height = "160px";
    messageBox.style.backgroundColor = "rgba(20, 0, 0, 0.95)";
    messageBox.style.border = "5px double #8b0000";
    messageBox.style.fontFamily = "'Times New Roman', 'YuMincho', serif";
    messageBox.style.zIndex = "100";
    messageBox.style.cursor = "pointer";

    // --- 名前表示エリア ---
    nameBox = document.createElement("div");
    nameBox.style.position = "absolute";
    nameBox.style.top = "10px";
    nameBox.style.left = "20px";
    nameBox.style.color = "#ff0000";
    nameBox.style.fontSize = "24px";
    nameBox.style.fontWeight = "bold";
    nameBox.style.textShadow = "1px 1px 2px black";
    messageBox.appendChild(nameBox);

    // --- 本文表示エリア ---
    textBox = document.createElement("div");
    textBox.style.position = "absolute";
    textBox.style.top = "50px";
    textBox.style.left = "20px";
    textBox.style.right = "20px";
    textBox.style.color = "#ffcccc";
    textBox.style.fontSize = "30px";
    textBox.style.lineHeight = "1.2";
    textBox.style.textShadow = "2px 2px 4px #330000";
    messageBox.appendChild(textBox);

    document.body.appendChild(messageBox);

    // クリックイベント
    messageBox.addEventListener("click", handleClick);
}

// 次の行を表示
function showNextLine() {
    if (currentLine >= scenario.length) {
        if(messageBox && messageBox.parentNode){
            messageBox.remove();
        }

        canvas.style.display = "none";
        renderer.domElement.style.zIndex = "1";

        lastTime = performance.now();
        requestAnimationFrame(loop);

        return;
    }

    const currentData = scenario[currentLine];
    
    nameBox.innerText = currentData.name;
    
    textBox.innerText = ""; 
    charIndex = 0;
    isTyping = true;
    typeWriter();
}

// 一文字ずつ表示する関数
function typeWriter() {
    const text = scenario[currentLine].text;
    
    if (charIndex < text.length) {
        textBox.innerText += text.charAt(charIndex);
        charIndex++;
        typeTimer = setTimeout(typeWriter, 50); 
    } else {
        isTyping = false;
        if (autoStartTimer) {
            clearTimeout(autoStartTimer);
            autoStartTimer = null;
        }
        if (currentLine === scenario.length - 1) {
            autoStartTimer = setTimeout(() => {
                currentLine++;
                showNextLine();
            }, 1500);
        }
    }
}

// クリック時の挙動
function handleClick() {
    if (autoStartTimer) {
        clearTimeout(autoStartTimer);
        autoStartTimer = null;
    }

    if (isTyping) {
        clearTimeout(typeTimer);
        textBox.innerText = scenario[currentLine].text;
        isTyping = false;
    } else {
        currentLine++;
        showNextLine();
    }
}

// ゲームプレイ処理開始（このセクションはマップ、AI、プレイヤー、メインループを含みます）
// --- 基本設定 ---
// 1: 1グリッドの大きさ（ワールド単位）
const TILE_SIZE = 4;
// 2: マップの幅（グリッド数）
const GRID_WIDTH = 40;
// 3: マップの高さ（グリッド数）
const GRID_HEIGHT = 40;
// 4: プレイヤー当たり判定半径
const PLAYER_RADIUS = 0.6;
// 5: カメラのプレイヤー相対オフセット
const CAM_OFFSET = new THREE.Vector3(0, 35, 15);
// 6: 視界ロスト後に敵が追跡を止めるまでの時間（ミリ秒）
const LOS_TIMEOUT_MS = 5000;
// 7: 敵に捕まったと判定する距離（中心間）
const CAPTURE_DIST = 1.2; // 捕まる距離（プレイヤーと敵の中心距離）

// 8: グリッド表現のマップ（0=通路,1=壁）を初期化
const WORLD_MAP = Array.from({ length: GRID_HEIGHT }, () => Array(GRID_WIDTH).fill(0));
// 9: 矩形領域を壁化するヘルパー関数
function addWallRect(x, y, w, h) {
    // 縦ループ
    for(let i=y; i<y+h; i++) {
        // 横ループ
        for(let j=x; j<x+w; j++) {
            // 範囲チェックして壁に設定
            if(WORLD_MAP[i] && WORLD_MAP[i][j] !== undefined) WORLD_MAP[i][j] = 1;
        }
    }
}
// 10: 外周を壁にする（上・下）
for(let i=0; i<GRID_WIDTH; i++) { WORLD_MAP[0][i] = 1; WORLD_MAP[GRID_HEIGHT-1][i] = 1; }
// 11: 外周を壁にする（左・右）
for(let i=0; i<GRID_HEIGHT; i++) { WORLD_MAP[i][0] = 1; WORLD_MAP[i][GRID_WIDTH-1] = 1; }
// 12〜16: サンプルの矩形壁を追加（ステージ形状）
addWallRect(10, 5, 2, 10);
addWallRect(5, 15, 15, 2);
addWallRect(20, 10, 5, 5);
addWallRect(20, 25, 10, 2);
addWallRect(5, 25, 2, 10);

// 17: THREE.js シーン/CAM/レンダラーの初期化
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x050508);
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.domElement.style.position = "fixed";
renderer.domElement.style.top = "0";
renderer.domElement.style.left = "0";
// レンダラーは最初 UI を妨げないよう背面に置く
renderer.domElement.style.zIndex = "-1";
document.body.appendChild(renderer.domElement);

// 18: 照明を追加
scene.add(new THREE.AmbientLight(0x404040, 1.2));
const dirLight = new THREE.DirectionalLight(0xffffff, 0.6);
dirLight.position.set(10, 20, 10);
scene.add(dirLight);

// A* 経路探索
// findPath(startGrid,endGrid): グリッド座標の最短経路を返す（上下左右4方向）
function findPath(startGrid, endGrid) {
    // 開始==終了なら空経路
    if (startGrid.x === endGrid.x && startGrid.z === endGrid.z) return [];
    const openList = [];
    const closedSet = new Set();
    // 開始ノード（g=0, h=マンハッタン距離）
    const startNode = { x: startGrid.x, z: startGrid.z, g: 0, h: Math.abs(startGrid.x - endGrid.x) + Math.abs(startGrid.z - endGrid.z), parent: null };
    startNode.f = startNode.g + startNode.h;
    openList.push(startNode);
    let iterations = 0;
    // 探索ループ（安全のため反復上限あり）
    while (openList.length > 0 && iterations++ < 500) {
        // f が最小のノードを選ぶ
        let currentIdx = 0;
        for (let i = 1; i < openList.length; i++) if (openList[i].f < openList[currentIdx].f) currentIdx = i;
        const current = openList[currentIdx];
        // 目的地に到達したら親ポインタを辿って経路復元
        if (current.x === endGrid.x && current.z === endGrid.z) {
            const path = []; let temp = current;
            while (temp) { path.push({ x: temp.x, z: temp.z }); temp = temp.parent; }
            return path.reverse();
        }
        // 現ノードをオープンから除外しクローズに追加
        openList.splice(currentIdx, 1);
        closedSet.add(`${current.x},${current.z}`);
        const neighbors = [{x: 0, z: 1}, {x: 0, z: -1}, {x: 1, z: 0}, {x: -1, z: 0}];
        for (const neighbor of neighbors) {
            const nx = current.x + neighbor.x, nz = current.z + neighbor.z;
            // 範囲外・壁・既評価ノードはスキップ
            if (nx < 0 || nx >= GRID_WIDTH || nz < 0 || nz >= GRID_HEIGHT || WORLD_MAP[nz][nx] === 1 || closedSet.has(`${nx},${nz}`)) continue;
            const gScore = current.g + 1;
            let neighborNode = openList.find(n => n.x === nx && n.z === nz);
            if (!neighborNode) {
                neighborNode = { x: nx, z: nz, g: gScore, h: Math.abs(nx - endGrid.x) + Math.abs(nz - endGrid.z), parent: current };
                neighborNode.f = neighborNode.g + neighborNode.h;
                openList.push(neighborNode);
            } else if (gScore < neighborNode.g) {
                neighborNode.g = gScore; neighborNode.f = neighborNode.g + neighborNode.h; neighborNode.parent = current;
            }
        }
    }
    // 経路が見つからなければ空配列
    return [];
}

// 衝突判定: ワールド座標 (x,z) が壁セルかどうかを判定
function checkWallCollision(x, z, radius) {
    const gx = Math.floor(x / TILE_SIZE), gz = Math.floor(z / TILE_SIZE);
    if (gx < 0 || gx >= GRID_WIDTH || gz < 0 || gz >= GRID_HEIGHT || WORLD_MAP[gz][gx] === 1) return true;
    return false;
}

// 入力管理: キーボード状態オブジェクト
const keys = {};
window.addEventListener('keydown', e => keys[e.code] = true);
window.addEventListener('keyup', e => keys[e.code] = false);

// タッチ用スティック（UI 要素がページにあれば連動）
const joystickContainer = document.getElementById('joystick-container');
const joystickKnob = document.getElementById('joystick-knob');
let stickInput = { x: 0, y: 0, active: false };
if ('ontouchstart' in window) {
    // タッチ環境ならスティックを表示・イベント登録
    joystickContainer.style.display = 'block';
    joystickContainer.addEventListener('touchstart', () => stickInput.active = true);
    window.addEventListener('touchmove', (e) => {
        if (!stickInput.active) return;
        const rect = joystickContainer.getBoundingClientRect();
        const dx = e.touches[0].clientX - (rect.left + 50), dy = e.touches[0].clientY - (rect.top + 50);
        const dist = Math.min(50, Math.sqrt(dx*dx + dy*dy));
        const angle = Math.atan2(dy, dx);
        stickInput.x = (Math.cos(angle) * dist) / 50; stickInput.y = (Math.sin(angle) * dist) / 50;
        joystickKnob.style.transform = `translate(calc(-50% + ${Math.cos(angle) * dist}px), calc(-50% + ${Math.sin(angle) * dist}px))`;
    });
    window.addEventListener('touchend', () => { stickInput.active = false; stickInput.x = 0; stickInput.y = 0; joystickKnob.style.transform = 'translate(-50%, -50%)'; });
}

// 壁メッシュ作成と保持配列
const wallMat = new THREE.MeshPhongMaterial({ color: 0x1a1a25 });
const wallObjects = [];
for(let z=0; z<GRID_HEIGHT; z++) {
    for(let x=0; x<GRID_WIDTH; x++) {
        if (WORLD_MAP[z][x] === 1) {
            const wall = new THREE.Mesh(new THREE.BoxGeometry(TILE_SIZE, TILE_SIZE * 1.5, TILE_SIZE), wallMat);
            wall.position.set(x * TILE_SIZE + TILE_SIZE/2, TILE_SIZE * 0.75, z * TILE_SIZE + TILE_SIZE/2);
            scene.add(wall);
            wallObjects.push(wall);
        }
    }
}
// 床メッシュ（ステージ）を追加
const floor = new THREE.Mesh(new THREE.PlaneGeometry(GRID_WIDTH*TILE_SIZE, GRID_HEIGHT*TILE_SIZE), new THREE.MeshPhongMaterial({ color: 0x0a0a0f }));
floor.rotation.x = -Math.PI/2; floor.position.set(GRID_WIDTH*TILE_SIZE/2, 0, GRID_HEIGHT*TILE_SIZE/2);
scene.add(floor);

// Player クラス: プレイヤーの見た目・移動ロジック
class Player {
    constructor() {
        this.mesh = new THREE.Mesh(new THREE.SphereGeometry(0.8, 16, 16), new THREE.MeshPhongMaterial({ color: 0x00f2ff, emissive: 0x00f2ff, emissiveIntensity: 0.4 }));
        this.reset();
        scene.add(this.mesh);
        this.speed = 0.35;
    }
    // 初期位置に戻す
    reset() {
        this.mesh.position.set(TILE_SIZE * 2.5, 0.8, TILE_SIZE * 2.5);
    }
    // フレーム毎の入力処理と移動
    update() {
        let dx = 0, dz = 0;
        if (keys['KeyW'] || keys['ArrowUp']) dz -= 1; if (keys['KeyS'] || keys['ArrowDown']) dz += 1;
        if (keys['KeyA'] || keys['ArrowLeft']) dx -= 1; if (keys['KeyD'] || keys['ArrowRight']) dx += 1;
        if (keys["ShiftLeft"]) {
            this.speed = 0.5;
        } else {
            this.speed = 0.35;
        }
        if (stickInput.active) { dx = stickInput.x; dz = stickInput.y; }
        const mag = Math.sqrt(dx*dx + dz*dz);
        if (mag > 0.1) {
            const moveX = (dx/mag) * this.speed, moveZ = (dz/mag) * this.speed;
            if (!checkWallCollision(this.mesh.position.x + moveX, this.mesh.position.z, PLAYER_RADIUS)) this.mesh.position.x += moveX;
            if (!checkWallCollision(this.mesh.position.x, this.mesh.position.z + moveZ, PLAYER_RADIUS)) this.mesh.position.z += moveZ;
        }
        // 足音
        this.noiseRadius = 0;

        if (mag > 0.1) {

            if (keys["ShiftLeft"]) {
                // 走る
                this.noiseRadius = 18;
            } else {
                // 歩く
                this.noiseRadius = 10;
            }
        }
    }
}

// ===============================
// Enemy クラス（リアルAI版）
// ===============================
class Enemy {
    constructor(x, z, color, dist, angleFov, speed, id) {

        this.id = id;

        this.startPos = { x, z };

        this.mesh = new THREE.Mesh(
            new THREE.BoxGeometry(1.2, 2, 1.8),
            new THREE.MeshPhongMaterial({ color: color })
        );

        this.mesh.position.set(x, 1, z);

        scene.add(this.mesh);

        this.config = {
            viewDist: dist,
            viewAngle: angleFov,
            speed: speed
        };

        this.angle = 0;

        // ===============================
        // AI STATE
        // patrol
        // suspicious
        // chasing
        // search
        // ===============================
        this.state = "patrol";

        this.path = [];

        this.pathTimer = 0;

        this.losTimer = 0;

        // 最後に見た位置
        this.lastKnownPos = null;

        // 調査待機
        this.searchTimer = 0;

        // 巡回ポイント
        this.patrolPoints = [
            { x: 5, z: 5 },
            { x: 30, z: 8 },
            { x: 28, z: 30 },
            { x: 8, z: 28 }
        ];

        this.currentPatrol = Math.floor(
            Math.random() * this.patrolPoints.length
        );

        // 視界
        this.vision = new THREE.Mesh(
            new THREE.CircleGeometry(
                dist,
                24,
                -angleFov / 2,
                angleFov
            ),
            new THREE.MeshBasicMaterial({
                color: 0xffffff,
                transparent: true,
                opacity: 0.15,
                side: THREE.DoubleSide
            })
        );

        this.vision.rotation.x = -Math.PI / 2;

        scene.add(this.vision);
    }

    reset() {

        this.mesh.position.set(
            this.startPos.x,
            1,
            this.startPos.z
        );

        this.state = "patrol";

        this.path = [];

        this.losTimer = 0;

        this.lastKnownPos = null;

        this.searchTimer = 0;
    }

    update(player, deltaTime) {

        const enemyPos = this.mesh.position;

        const playerPos = player.mesh.position;

        const distToPlayer =
            enemyPos.distanceTo(playerPos);

        // ===============================
        // 視界判定
        // ===============================

        const dirToPlayer =
            new THREE.Vector3()
                .subVectors(playerPos, enemyPos)
                .normalize();

        const currentDir =
            new THREE.Vector3(
                Math.cos(this.angle),
                0,
                Math.sin(this.angle)
            );

        const angleToPlayer =
            currentDir.angleTo(dirToPlayer);

        const ray = new THREE.Raycaster(
            enemyPos,
            dirToPlayer,
            0,
            distToPlayer
        );

        const wallIntersects =
            ray.intersectObjects(wallObjects);

        const isBlockedByWall =
            wallIntersects.length > 0;

        const isVisible =
            !isBlockedByWall &&
            distToPlayer < this.config.viewDist &&
            angleToPlayer < this.config.viewAngle / 2;

        // ===============================
        // 足音判定
        // ===============================

        const heardPlayer =
            distToPlayer < player.noiseRadius;

        // ===============================
        // patrol
        // ===============================

        if (this.state === "patrol") {

            this.vision.material.color.setHex(
                0xffffff
            );

            // 音を聞いた
            if (heardPlayer) {

                this.state = "suspicious";

                this.lastKnownPos =
                    playerPos.clone();
            }

            // 発見
            if (isVisible) {

                this.state = "chasing";

                this.lastKnownPos =
                    playerPos.clone();

                // 仲間に共有
                enemies.forEach(other => {

                    if (other !== this) {

                        const d =
                            other.mesh.position.distanceTo(
                                enemyPos
                            );

                        if (d < 25) {

                            other.state =
                                "suspicious";

                            other.lastKnownPos =
                                playerPos.clone();
                        }
                    }
                });
            }

            // 巡回
            if (this.path.length === 0) {

                const target =
                    this.patrolPoints[
                        this.currentPatrol
                    ];

                this.path = findPath(
                    {
                        x: Math.floor(
                            enemyPos.x / TILE_SIZE
                        ),
                        z: Math.floor(
                            enemyPos.z / TILE_SIZE
                        )
                    },
                    target
                );
            }
        }

        // ===============================
        // suspicious
        // ===============================

        else if (this.state === "suspicious") {

            this.vision.material.color.setHex(
                0xffff00
            );

            if (isVisible) {

                this.state = "chasing";

                this.lastKnownPos =
                    playerPos.clone();
            }

            // 調査地点到達
            if (
                this.lastKnownPos &&
                enemyPos.distanceTo(
                    this.lastKnownPos
                ) < 2
            ) {

                this.state = "search";

                this.searchTimer = 2000;
            }
        }

        // ===============================
        // search
        // ===============================

        else if (this.state === "search") {

            this.vision.material.color.setHex(
                0xff8800
            );

            this.searchTimer -= deltaTime;

            // 左右見る
            this.angle +=
                Math.sin(
                    performance.now() * 0.003
                ) * 0.02;

            if (isVisible) {

                this.state = "chasing";

                this.lastKnownPos =
                    playerPos.clone();
            }

            if (this.searchTimer <= 0) {

                this.state = "patrol";

                this.path = [];
            }
        }

        // ===============================
        // chasing
        // ===============================

        else if (this.state === "chasing") {

            this.vision.material.color.setHex(
                0xff3333
            );

            this.lastKnownPos =
                playerPos.clone();

            // 見失った
            if (isBlockedByWall) {

                this.losTimer += deltaTime;

                if (
                    this.losTimer >=
                    LOS_TIMEOUT_MS
                ) {

                    this.state = "suspicious";

                    this.path = [];

                    this.losTimer = 0;
                }

            } else {

                this.losTimer = 0;
            }

            // 遠すぎ
            const maxChaseDist =
                this.config.viewDist * 1.8;

            if (
                distToPlayer > maxChaseDist
            ) {

                this.state = "suspicious";
            }

            // 経路更新
            if (this.pathTimer++ > 20) {

                this.path = findPath(
                    {
                        x: Math.floor(
                            enemyPos.x / TILE_SIZE
                        ),
                        z: Math.floor(
                            enemyPos.z / TILE_SIZE
                        )
                    },
                    {
                        x: Math.floor(
                            playerPos.x / TILE_SIZE
                        ),
                        z: Math.floor(
                            playerPos.z / TILE_SIZE
                        )
                    }
                );

                this.pathTimer = 0;
            }
        }

        // ===============================
        // 移動処理
        // ===============================

        let targetPos = null;

        // suspicious
        if (
            this.state === "suspicious" &&
            this.lastKnownPos
        ) {

            targetPos = this.lastKnownPos;
        }

        // chasing
        else if (
            this.state === "chasing" &&
            distToPlayer <
            TILE_SIZE * 1.5
        ) {

            targetPos = playerPos;
        }

        // path移動
        else if (
            this.path &&
            this.path.length > 0
        ) {

            const currentGridX =
                Math.floor(
                    enemyPos.x / TILE_SIZE
                );

            const currentGridZ =
                Math.floor(
                    enemyPos.z / TILE_SIZE
                );

            if (
                this.path[0].x === currentGridX &&
                this.path[0].z === currentGridZ
            ) {

                this.path.shift();

                // 巡回更新
                if (
                    this.state === "patrol" &&
                    this.path.length === 0
                ) {

                    this.currentPatrol =
                        (
                            this.currentPatrol + 1
                        ) %
                        this.patrolPoints.length;
                }
            }

            if (this.path.length > 0) {

                targetPos =
                    new THREE.Vector3(
                        this.path[0].x *
                        TILE_SIZE +
                        TILE_SIZE / 2,

                        1,

                        this.path[0].z *
                        TILE_SIZE +
                        TILE_SIZE / 2
                    );
            }
        }

        // ===============================
        // 実移動
        // ===============================

        if (targetPos) {

            const moveVec =
                new THREE.Vector3()
                    .subVectors(
                        targetPos,
                        enemyPos
                    );

            const targetAngle =
                Math.atan2(
                    moveVec.z,
                    moveVec.x
                );

            let diff =
                targetAngle - this.angle;

            while (diff < -Math.PI)
                diff += Math.PI * 2;

            while (diff > Math.PI)
                diff -= Math.PI * 2;

            this.angle += diff * 0.1;

            if (Math.abs(diff) < 0.5) {

                const s =
                    this.config.speed;

                enemyPos.x +=
                    Math.cos(this.angle) * s;

                enemyPos.z +=
                    Math.sin(this.angle) * s;
            }
        }

        // ===============================
        // 見た目更新
        // ===============================

        this.mesh.rotation.y =
            -this.angle;

        this.vision.position.set(
            enemyPos.x,
            0.2,
            enemyPos.z
        );

        this.vision.rotation.z =
            -this.angle;

        return {
            id: this.id,
            losTimer: this.losTimer,
            state: this.state,
            dist: distToPlayer
        };
    }
}

// プレイヤーと敵のインスタンス作成
const player = new Player();
const enemies = [
    new Enemy(TILE_SIZE * 35.5, TILE_SIZE * 35.5, 0x00ffaa, 18, Math.PI/1.5, 0.15, "Green"),
    new Enemy(TILE_SIZE * 35.5, TILE_SIZE * 5.5, 0xffcc00, 25, Math.PI*2, 0.12, "Yellow"),
    new Enemy(TILE_SIZE * 5.5, TILE_SIZE * 35.5, 0xff3366, 20, Math.PI/3, 0.22, "Red")
];

// DOM 要素（任意）を取得: ステータス・デバッグ・メッセージオーバーレイ
const statusEl = document.getElementById('status');
const debugEl = document.getElementById('debug-info');
const msgOverlay = document.getElementById('msg-overlay');

// ループ用タイマーとゲームオーバーフラグ
let lastTime = performance.now();
let isGameOver = false;

// 更新処理: プレイヤー/敵/当たり判定/デバッグ更新
function update(deltaTime) {
    if (isGameOver) return; // ゲームオーバー中は更新しない

    player.update();
    let isChased = false;
    let debugText = "";
    
    for (const e of enemies) {
        const info = e.update(player, deltaTime);
        if (info.state === 'chasing') {
            isChased = true;
            if (info.losTimer > 0) {
                const timeLeft = Math.max(0, (LOS_TIMEOUT_MS - info.losTimer) / 1000).toFixed(1);
                debugText += `${info.id}: ロストまで ${timeLeft}s<br>`;
            }
        }
        // 当たり判定: 十分近ければゲームオーバー
        if (info.dist < CAPTURE_DIST) {
            triggerGameOver();
        }
    }

    // ステータスやデバッグ表示の更新（存在チェックあり）
    if (statusEl) {
        statusEl.textContent = isChased ? "発見されました！" : "隠密中";
        statusEl.className = isChased ? "detected" : "hidden";
    }
    if (debugEl) {
        debugEl.innerHTML = debugText;
    }
}

// ゲームオーバー処理: 表示して一定時間後にリスポーン
function triggerGameOver() {
    if (isGameOver) return;
    isGameOver = true;
    if (msgOverlay) {
        msgOverlay.style.display = 'flex';
    }
    setTimeout(() => {
        isGameOver = false;
        if (msgOverlay) {
            msgOverlay.style.display = 'none';
        }
        player.reset();
        enemies.forEach(e => e.reset());
    }, 2000); // 2秒後に復活
}

// 描画: カメラ追従とレンダリング
function draw() {
    camera.position.set(player.mesh.position.x + CAM_OFFSET.x, player.mesh.position.y + CAM_OFFSET.y, player.mesh.position.z + CAM_OFFSET.z);
    camera.lookAt(player.mesh.position);
    renderer.render(scene, camera);
}

// メインループ: delta 計算 → 更新 → 描画 → 次フレーム予約
function loop() {
    const currentTime = performance.now();
    const deltaTime = currentTime - lastTime;
    lastTime = currentTime;
    update(deltaTime);
    draw();
    requestAnimationFrame(loop);
}

// ウィンドウリサイズ時はカメラとレンダラーを更新
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth/window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});