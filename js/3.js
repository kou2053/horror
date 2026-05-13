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
const statusEl = document.getElementById("status") || (() => {
    const el = document.createElement('div');
    document.body.appendChild(el);
    return el;
})();

// --- ゲーム手動調整用設定 ---
const GAME_SETTINGS = {
    playerType: "warrior",
    patrolTargetPadding: 1.5
};

const PLAYER_TYPES = {
    warrior: { radius: 16, speed: 5, color: '#00f2ff', shape: 'circle', label: '勇者' },
    ghost: { radius: 18, speed: 4, color: '#8899ff', shape: 'circle', label: '幽霊' }
};

const ENEMY_TYPE_CONFIGS = {
    scout: { speed: 3.0, viewDist: 250, viewAngle: Math.PI / 1.5, color: '#00ffaa', hitbox: 'circle', radius: 15, sprite: 'circle', movementMode: 'aStar' },
    tank: { speed: 1.5, viewDist: 400, viewAngle: Math.PI * 2, color: '#ffcc00', hitbox: 'rect', width: 50, height: 50, sprite: 'rect', movementMode: 'direct' },
    predator: { speed: 4.0, viewDist: 350, viewAngle: Math.PI / 4, color: '#ff3366', hitbox: 'rect', width: 25, height: 80, sprite: 'rect', movementMode: 'aStar' }
};

// --- RPG会話用の設定 ---
let flash = 0;
let count = 0;
let flashwait = 10;
let mycharacter = null;
let charaselect = false;

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

//イベント
start.addEventListener("click", function() {
    start.style.animation = "shake 0.2s infinite";
    startanimation();
});

canvas.addEventListener("click", (e) => {
    if (charaselect){
        const rect = canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        if (x >= 300 && x <= 600 && y >= 100 && y <= 700) {
            selecting("はい","いいえ","これでいいですか",1);
            charaselect = false;
        }

        if (x >= 900 && x <= 1200 && y >= 100 && y <= 700) {
            selecting("はい","いいえ","これでいいですか",2);
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
        start.textContent = "邨らч";
        start.style.display = "block";
    }else if (count == 5){
        flashwait = 2
        start.textContent = "豁ｻ";
    }else if (count == 6){
        start.textContent = "start";
    }

    if (flash <= 100){
        requestAnimationFrame(startanimation);
    }
    
    if (flash > 100){
        characterselection();
    }else if (flash > 50){
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

function startRPG() {
    // 画面が黒のまま終わっている場合があるので、必要なら背景を塗りつぶす
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

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
        messageBox.remove();
        requestAnimationFrame(gameLoop);
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
    }
}

// クリック時の挙動
function handleClick() {
    if (isTyping) {
        clearTimeout(typeTimer);
        textBox.innerText = scenario[currentLine].text;
        isTyping = false;
    } else {
        currentLine++;
        showNextLine();
    }
}

//ゲームプレイ時の処理
let lastTime = 0;
let accumulator = 0;
const timeStep = 1000 / 60;
let anyChasing = false;

function gameLoop(timestamp) {
    if (!lastTime) lastTime = timestamp;
    const deltaTime = timestamp - lastTime;
    lastTime = timestamp;
    accumulator += deltaTime;

    while (accumulator >= timeStep) {
        updateGameLogic();
        accumulator -= timeStep;
    }

    drawGame();

    requestAnimationFrame(gameLoop);
}

function updateGameLogic() {
    anyChasing = false;
    player.update();
    enemies.forEach(e => {
        e.update(player);
        if (e.state === 'chasing') anyChasing = true;
    });
}

function drawGame() {
    const cx = player.x - canvas.width / 2;
    const cy = player.y - canvas.height / 2;

    ctx.fillStyle = '#050508';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw Map
    ctx.fillStyle = '#1a1a25';
    for (let y = 0; y < GRID_HEIGHT; y++) {
        for (let x = 0; x < GRID_WIDTH; x++) {
            if (WORLD_MAP[y][x] === 1) ctx.fillRect(x * TILE_SIZE - cx, y * TILE_SIZE - cy, TILE_SIZE, TILE_SIZE);
        }
    }

    enemies.forEach(e => e.draw(cx, cy));
    player.draw(cx, cy);

    statusEl.textContent = anyChasing ? 'DETECTED' : 'HIDDEN';
    statusEl.className = anyChasing ? 'detected' : 'hidden';
}

//敵の動き
// --- Settings ---
const TILE_SIZE = 64;
const GRID_WIDTH = 30;
const GRID_HEIGHT = 30;
const WORLD_MAP = Array.from({ length: GRID_HEIGHT }, () => Array(GRID_WIDTH).fill(0));

const ENEMY_SPAWNS = [
    { x: TILE_SIZE * 15, y: TILE_SIZE * 10, type: 'scout' },
    { x: TILE_SIZE * 25, y: TILE_SIZE * 25, type: 'tank' },
    { x: TILE_SIZE * 5, y: TILE_SIZE * 25, type: 'predator' }
];

// Create Walls
for(let i=0; i<GRID_WIDTH; i++) { WORLD_MAP[0][i] = 1; WORLD_MAP[GRID_HEIGHT-1][i] = 1; }
for(let i=0; i<GRID_HEIGHT; i++) { WORLD_MAP[i][0] = 1; WORLD_MAP[i][GRID_WIDTH-1] = 1; }
        
// Add some hiding spots (walls)
function addWallRect(x, y, w, h) {
    for(let i=y; i<y+h; i++) for(let j=x; j<x+w; j++) WORLD_MAP[i][j] = 1;
}
addWallRect(5, 5, 2, 6);
addWallRect(12, 4, 6, 2);
addWallRect(8, 15, 8, 1);
addWallRect(20, 10, 2, 10);

const keys = {};
window.addEventListener('keydown', e => keys[e.code] = true);
window.addEventListener('keyup', e => keys[e.code] = false);

// --- Core Math ---
function getDistance(a, b) {
    return Math.sqrt((a.x - b.x)**2 + (a.y - b.y)**2);
}

// --- Critical: Line of Sight Check ---
function hasLineOfSight(from, to) {
    const dx = to.x - from.x;
    const dy = to.y - from.y;
    const dist = Math.sqrt(dx*dx + dy*dy);
            
    // 8ピクセルごとにレイを飛ばして壁に当たるか確認
    const stepSize = 8;
    const steps = dist / stepSize;
            
    for (let i = 1; i < steps; i++) {
        const checkX = from.x + (dx * (i / steps));
        const checkY = from.y + (dy * (i / steps));
                
        const gridX = Math.floor(checkX / TILE_SIZE);
        const gridY = Math.floor(checkY / TILE_SIZE);
                
        if (WORLD_MAP[gridY] && WORLD_MAP[gridY][gridX] === 1) {
            return false; // 壁に遮られた
        }
    }
    return true; // プレイヤーが見える
}

// --- A* Pathfinding ---
function findPath(start, target) {
    const sX = Math.floor(start.x / TILE_SIZE);
    const sY = Math.floor(start.y / TILE_SIZE);
    const tX = Math.floor(target.x / TILE_SIZE);
    const tY = Math.floor(target.y / TILE_SIZE);
            
    if (sX === tX && sY === tY) return [];

    const openSet = [{ x: sX, y: sY, g: 0, f: 0, parent: null }];
    const closedSet = new Set();
            
    while (openSet.length > 0) {
        openSet.sort((a, b) => a.f - b.f);
        const current = openSet.shift();
        const key = `${current.x},${current.y}`;
                
        if (current.x === tX && current.y === tY) {
            const path = [];
            let temp = current;
            while (temp.parent) {
                path.push({ x: temp.x * TILE_SIZE + TILE_SIZE/2, y: temp.y * TILE_SIZE + TILE_SIZE/2 });
                temp = temp.parent;
            }
            return path.reverse();
        }
                
        closedSet.add(key);

        const dirs = [
            {x:0, y:1, c:1}, {x:0, y:-1, c:1}, {x:1, y:0, c:1}, {x:-1, y:0, c:1},
            {x:1, y:1, c:1.41}, {x:1, y:-1, c:1.41}, {x:-1, y:1, c:1.41}, {x:-1, y:-1, c:1.41}
        ];

        for (let d of dirs) {
            const nx = current.x + d.x, ny = current.y + d.y;
            if (nx < 0 || nx >= GRID_WIDTH || ny < 0 || ny >= GRID_HEIGHT || WORLD_MAP[ny][nx] === 1 || closedSet.has(`${nx},${ny}`)) continue;
            // 斜め移動時の角抜け防止
            if (d.c > 1 && (WORLD_MAP[current.y][nx] === 1 || WORLD_MAP[ny][current.x] === 1)) continue;

            const g = current.g + d.c;
            const h = Math.abs(nx - tX) + Math.abs(ny - tY);
            openSet.push({ x: nx, y: ny, g, f: g+h, parent: current });
        }
    }
    return [];
}

// --- Collision Math (OBB) ---
function checkCircleRectCollision(circle, rect) {
    let cx = circle.x - rect.x;
    let cy = circle.y - rect.y;
    const cos = Math.cos(-rect.angle), sin = Math.sin(-rect.angle);
    const rx = cx * cos - cy * sin, ry = cx * sin + cy * cos;
    let closestX = Math.max(-rect.width/2, Math.min(rx, rect.width/2));
    let closestY = Math.max(-rect.height/2, Math.min(ry, rect.height/2));
    const dist = Math.sqrt((rx - closestX)**2 + (ry - closestY)**2);
    return dist < circle.radius;
}

// --- Entities ---
class Player {
    constructor(typeKey = GAME_SETTINGS.playerType) {
        const config = PLAYER_TYPES[typeKey] || PLAYER_TYPES.warrior;
        this.x = TILE_SIZE * 2.5;
        this.y = TILE_SIZE * 2.5;
        this.radius = config.radius;
        this.speed = config.speed;
        this.color = config.color;
        this.shape = config.shape;
        this.label = config.label;
    }
    update() {
        let dx = 0, dy = 0;
        if (keys['KeyW'] || keys['ArrowUp']) dy -= 1;
        if (keys['KeyS'] || keys['ArrowDown']) dy += 1;
        if (keys['KeyA'] || keys['ArrowLeft']) dx -= 1;
        if (keys['KeyD'] || keys['ArrowRight']) dx += 1;
        if (dx !== 0 && dy !== 0) { dx *= 0.707; dy *= 0.707; }

        const nx = this.x + dx * this.speed, ny = this.y + dy * this.speed;
        if (WORLD_MAP[Math.floor(this.y / TILE_SIZE)][Math.floor(nx / TILE_SIZE)] === 0) this.x = nx;
        if (WORLD_MAP[Math.floor(ny / TILE_SIZE)][Math.floor(this.x / TILE_SIZE)] === 0) this.y = ny;
    }
    draw(cx, cy) {
        ctx.fillStyle = this.color;
        const px = this.x - cx;
        const py = this.y - cy;
        if (this.shape === 'circle') {
            ctx.beginPath();
            ctx.arc(px, py, this.radius, 0, Math.PI * 2);
            ctx.fill();
        } else {
            ctx.fillRect(px - this.radius, py - this.radius, this.radius * 2, this.radius * 2);
        }
    }
}

class Enemy {
    constructor(x, y, type) {
        this.x = x;
        this.y = y;
        this.type = type;
        this.angle = 0;
        this.state = 'patrol';
        this.path = [];
        this.directTarget = null;
        this.lastUpdate = 0;

        this.config = ENEMY_TYPE_CONFIGS[type] || ENEMY_TYPE_CONFIGS.scout;
    }

    getPatrolDestination() {
        const rx = (GAME_SETTINGS.patrolTargetPadding + Math.floor(Math.random() * (GRID_WIDTH - 3))) * TILE_SIZE;
        const ry = (GAME_SETTINGS.patrolTargetPadding + Math.floor(Math.random() * (GRID_HEIGHT - 3))) * TILE_SIZE;
        return { x: rx, y: ry };
    }

    setMovementTarget(target) {
        if (this.config.movementMode === 'direct') {
            this.directTarget = target;
            this.path = [];
        } else {
            this.path = findPath(this, target);
            this.directTarget = null;
        }
    }

    moveStraightTo(target) {
        const moveAngle = Math.atan2(target.y - this.y, target.x - this.x);
        this.x += Math.cos(moveAngle) * this.config.speed;
        this.y += Math.sin(moveAngle) * this.config.speed;

        let aDiff = moveAngle - this.angle;
        while (aDiff < -Math.PI) aDiff += Math.PI * 2;
        while (aDiff > Math.PI) aDiff -= Math.PI * 2;
        this.angle += aDiff * 0.1;
    }

    update(player) {
        const dist = getDistance(this, player);
        const angleTo = Math.atan2(player.y - this.y, player.x - this.x);
        let diff = Math.abs(this.angle - angleTo);
        while (diff > Math.PI) diff = Math.PI * 2 - diff;

        const hasLoS = hasLineOfSight(this, player);
        const seesPlayer = dist < this.config.viewDist && diff < this.config.viewAngle / 2 && hasLoS;

        if (this.state === 'patrol') {
            if (seesPlayer) {
                this.state = 'chasing';
                this.setMovementTarget(player);
            } else if (!this.directTarget && this.path.length === 0) {
                const destination = this.getPatrolDestination();
                this.setMovementTarget(destination);
            }
        } else if (this.state === 'chasing') {
            if (dist > this.config.viewDist * 1.8) {
                this.state = 'patrol';
                this.path = [];
                this.directTarget = null;
            } else if (Date.now() - this.lastUpdate > 400) {
                this.setMovementTarget(player);
                this.lastUpdate = Date.now();
            }
        }

        if (this.config.movementMode === 'direct' && this.directTarget) {
            this.moveStraightTo(this.directTarget);
            if (getDistance(this, this.directTarget) < 20) this.directTarget = null;
        } else if (this.path.length > 0) {
            const target = this.path[0];
            this.moveStraightTo(target);
            if (getDistance(this, target) < 10) this.path.shift();
        }

        let collided = false;
        if (this.config.hitbox === 'circle') {
            collided = dist < (this.config.radius + player.radius);
        } else {
            collided = checkCircleRectCollision(player, { x: this.x, y: this.y, width: this.config.width, height: this.config.height, angle: this.angle });
        }

        if (collided) {
            // ゲームオーバー処理等をここに
        }
    }

    draw(cx, cy) {
        const sx = this.x - cx;
        const sy = this.y - cy;
        const isChasing = this.state === 'chasing';

        ctx.save();
        ctx.globalAlpha = isChasing ? 0.3 : 0.1;
        ctx.fillStyle = isChasing ? '#ff4444' : '#ffffff';
        ctx.beginPath();
        ctx.moveTo(sx, sy);
        ctx.arc(sx, sy, this.config.viewDist, this.angle - this.config.viewAngle / 2, this.angle + this.config.viewAngle / 2);
        ctx.fill();
        ctx.restore();

        ctx.save();
        ctx.translate(sx, sy);
        ctx.rotate(this.angle);
        ctx.fillStyle = this.config.color;
        if (this.config.sprite === 'circle') {
            ctx.beginPath();
            ctx.arc(0, 0, this.config.radius, 0, Math.PI * 2);
            ctx.fill();
        } else {
            ctx.fillRect(-this.config.width / 2, -this.config.height / 2, this.config.width, this.config.height);
        }
        ctx.restore();
    }
}

const player = new Player(GAME_SETTINGS.playerType);
const enemies = ENEMY_SPAWNS.map(({ x, y, type }) => new Enemy(x, y, type));