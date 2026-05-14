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
        gameLoop(0);
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

// --- Configuration ---
const TILE_SIZE = 64;
const GRID_WIDTH = 40;
const GRID_HEIGHT = 40;
const ASTAR_ITERATION_LIMIT = 500; 

const WORLD_MAP = Array.from({ length: GRID_HEIGHT }, () => Array(GRID_WIDTH).fill(0));

// Setup Map
for(let i=0; i<GRID_WIDTH; i++) { WORLD_MAP[0][i] = 1; WORLD_MAP[GRID_HEIGHT-1][i] = 1; }
for(let i=0; i<GRID_HEIGHT; i++) { WORLD_MAP[i][0] = 1; WORLD_MAP[i][GRID_WIDTH-1] = 1; }
        
function addWallRect(x, y, w, h) {
    for(let i=y; i<y+h; i++) {
        for(let j=x; j<x+w; j++) {
            if(WORLD_MAP[i] && WORLD_MAP[i][j] !== undefined) WORLD_MAP[i][j] = 1;
        }
    }
}
addWallRect(10, 5, 2, 10);
addWallRect(5, 15, 15, 2);
addWallRect(20, 10, 5, 5);

const keys = {};
window.addEventListener('keydown', e => keys[e.code] = true);
window.addEventListener('keyup', e => keys[e.code] = false);

// --- Logic Utilities ---
function getDistance(a, b) {
    return Math.sqrt((a.x - b.x)**2 + (a.y - b.y)**2);
}

function hasLineOfSight(from, to) {
    const dx = to.x - from.x;
    const dy = to.y - from.y;
    const dist = Math.sqrt(dx*dx + dy*dy);
    const stepSize = 10;
    const steps = dist / stepSize;
    for (let i = 1; i < steps; i++) {
        const px = from.x + (dx * (i / steps));
        const py = from.y + (dy * (i / steps));
        const gx = Math.floor(px / TILE_SIZE);
        const gy = Math.floor(py / TILE_SIZE);
        if (WORLD_MAP[gy] && WORLD_MAP[gy][gx] === 1) return false;
    }
    return true;
}

function findPath(start, target) {
    const sx = Math.floor(start.x / TILE_SIZE);
    const sy = Math.floor(start.y / TILE_SIZE);
    const tx = Math.floor(target.x / TILE_SIZE);
    const ty = Math.floor(target.y / TILE_SIZE);

    if (tx < 0 || tx >= GRID_WIDTH || ty < 0 || ty >= GRID_HEIGHT || WORLD_MAP[ty][tx] === 1) return [];
    if (sx === tx && sy === ty) return [];

    const openSet = [{ x: sx, y: sy, g: 0, f: 0, parent: null }];
    const closedSet = new Map();
    let iterations = 0;

    while (openSet.length > 0) {
        if (iterations++ > ASTAR_ITERATION_LIMIT) break;
        openSet.sort((a, b) => a.f - b.f);
        const current = openSet.shift();
        const key = `${current.x},${current.y}`;

        if (current.x === tx && current.y === ty) {
            const path = [];
            let temp = current;
            while (temp.parent) {
                path.push({ x: temp.x * TILE_SIZE + TILE_SIZE/2, y: temp.y * TILE_SIZE + TILE_SIZE/2 });
                temp = temp.parent;
            }
            return path.reverse();
        }

        closedSet.set(key, current.g);
        const neighbors = [
            {x:0, y:1, c:1}, {x:0, y:-1, c:1}, {x:1, y:0, c:1}, {x:-1, y:0, c:1},
            {x:1, y:1, c:1.41}, {x:1, y:-1, c:1.41}, {x:-1, y:1, c:1.41}, {x:-1, y:-1, c:1.41}
        ];

        for (const d of neighbors) {
            const nx = current.x + d.x, ny = current.y + d.y;
            if (nx < 0 || nx >= GRID_WIDTH || ny < 0 || ny >= GRID_HEIGHT || WORLD_MAP[ny][nx] === 1) continue;
            if (d.c > 1 && (WORLD_MAP[current.y][nx] === 1 || WORLD_MAP[ny][current.x] === 1)) continue;
            const g = current.g + d.c;
            const nKey = `${nx},${ny}`;
            if (closedSet.has(nKey) && closedSet.get(nKey) <= g) continue;
            const h = Math.abs(nx - tx) + Math.abs(ny - ty);
            const existing = openSet.find(o => o.x === nx && o.y === ny);
            if (!existing) {
                openSet.push({ x: nx, y: ny, g, f: g + h, parent: current });
            } else if (g < existing.g) {
                existing.g = g;
                existing.f = g + h;
                existing.parent = current;
            }
        }
    }
    return [];
}

function checkCollision(player, enemy) {
    if (enemy.config.hitbox === 'circle') {
        return getDistance(player, enemy) < (player.radius + enemy.config.radius);
    } else {
        let cx = player.x - enemy.x;
        let cy = player.y - enemy.y;
        const cos = Math.cos(-enemy.angle), sin = Math.sin(-enemy.angle);
        const rx = cx * cos - cy * sin, ry = cx * sin + cy * cos;
        const closestX = Math.max(-enemy.config.width/2, Math.min(rx, enemy.config.width/2));
        const closestY = Math.max(-enemy.config.height/2, Math.min(ry, enemy.config.height/2));
        return Math.sqrt((rx - closestX)**2 + (ry - closestY)**2) < player.radius;
    }
}

// --- Entities ---
class Player {
    constructor() {
        this.x = TILE_SIZE * 2.5; this.y = TILE_SIZE * 2.5;
        this.radius = 16; this.speed = 5;
    }
    update() {
        let dx = 0, dy = 0;
        if (keys['KeyW'] || keys['ArrowUp']) dy -= 1;
        if (keys['KeyS'] || keys['ArrowDown']) dy += 1;
        if (keys['KeyA'] || keys['ArrowLeft']) dx -= 1;
        if (keys['KeyD'] || keys['ArrowRight']) dx += 1;
        if (dx !== 0 && dy !== 0) { dx *= 0.707; dy *= 0.707; }
        const nx = this.x + dx * this.speed, ny = this.y + dy * this.speed;
        if (WORLD_MAP[Math.floor(this.y/TILE_SIZE)][Math.floor(nx/TILE_SIZE)] === 0) this.x = nx;
        if (WORLD_MAP[Math.floor(ny/TILE_SIZE)][Math.floor(this.x/TILE_SIZE)] === 0) this.y = ny;
    }
    draw(cx, cy) {
        ctx.fillStyle = '#00f2ff';
        ctx.beginPath(); ctx.arc(this.x - cx, this.y - cy, this.radius, 0, Math.PI*2); ctx.fill();
    }
}

class Enemy {
    constructor(x, y, type, offset) {
        this.x = x; this.y = y; this.type = type;
        this.angle = 0; this.state = 'patrol'; this.path = [];
        this.updateOffset = offset;
        const configs = {
            scout: { speed: 3.2, viewDist: 250, viewAngle: Math.PI/1.5, color: '#00ffaa', hitbox: 'circle', radius: 15 },
            tank: { speed: 1.5, viewDist: 400, viewAngle: Math.PI*2, color: '#ffcc00', hitbox: 'rect', width: 50, height: 50 },
            predator: { speed: 4.2, viewDist: 350, viewAngle: Math.PI/4, color: '#ff3366', hitbox: 'rect', width: 80, height: 25 }
        };
        this.config = configs[type];
    }
    update(player, frameCount) {
        const dist = getDistance(this, player);
        const angleTo = Math.atan2(player.y - this.y, player.x - this.x);
        let diff = Math.abs(this.angle - angleTo);
        while(diff > Math.PI) diff = Math.PI * 2 - diff;
        const hasLoS = hasLineOfSight(this, player);

        if (this.state === 'patrol') {
            if (dist < this.config.viewDist && diff < this.config.viewAngle/2 && hasLoS) {
                this.state = 'chasing';
            } else if (this.path.length === 0 && (frameCount + this.updateOffset) % 120 === 0) {
                const rx = (1.5 + Math.floor(Math.random()*(GRID_WIDTH-3))) * TILE_SIZE;
                const ry = (1.5 + Math.floor(Math.random()*(GRID_HEIGHT-3))) * TILE_SIZE;
                this.path = findPath(this, {x:rx, y:ry});
            }
        } else if (this.state === 'chasing') {
            if (dist > this.config.viewDist * 1.8) {
                this.state = 'patrol';
                this.path = [];
            } else if ((frameCount + this.updateOffset) % 30 === 0) {
                this.path = findPath(this, player);
            }
        }

        if (this.path.length > 0) {
            const target = this.path[0];
            const moveAngle = Math.atan2(target.y - this.y, target.x - this.x);
            this.x += Math.cos(moveAngle) * this.config.speed;
            this.y += Math.sin(moveAngle) * this.config.speed;
            let aDiff = moveAngle - this.angle;
            while (aDiff < -Math.PI) aDiff += Math.PI * 2;
            while (aDiff > Math.PI) aDiff -= Math.PI * 2;
            this.angle += aDiff * 0.1;
            if (getDistance(this, target) < 10) this.path.shift();
        }
    }
    draw(cx, cy) {
        const sx = this.x - cx, sy = this.y - cy;
        ctx.save();
        ctx.globalAlpha = this.state === 'chasing' ? 0.3 : 0.1;
        ctx.fillStyle = this.state === 'chasing' ? '#ff4444' : '#ffffff';
        ctx.beginPath(); ctx.moveTo(sx, sy);
        ctx.arc(sx, sy, this.config.viewDist, this.angle - this.config.viewAngle/2, this.angle + this.config.viewAngle/2);
        ctx.fill();
        ctx.restore();
        ctx.save();
        ctx.translate(sx, sy); ctx.rotate(this.angle);
        ctx.fillStyle = this.config.color;
        if (this.config.hitbox === 'circle') {
            ctx.beginPath(); ctx.arc(0,0,this.config.radius,0,Math.PI*2); ctx.fill();
        } else {
            ctx.fillRect(-this.config.width/2, -this.config.height/2, this.config.width, this.config.height);
        }
        ctx.restore();
    }
}

// --- Game Logic & Controller ---
const player = new Player();
const enemies = [
    new Enemy(TILE_SIZE*15, TILE_SIZE*10, 'scout', 0),
    new Enemy(TILE_SIZE*25, TILE_SIZE*25, 'tank', 10),
    new Enemy(TILE_SIZE*25, TILE_SIZE*25, 'predator', 20)
];
let frameCount = 0;

//すべてのゲーム内ロジックを更新する関数

function update() {
    frameCount++;
    player.update();
    enemies.forEach(e => e.update(player, frameCount));

    // 当たり判定のチェック（必要に応じて追加）
    enemies.forEach(e => {
        if (checkCollision(player, e)) {
            // ここに衝突時のペナルティなどを記述
        }
    });
}

//キャンバスへの描画のみを行う関数

function draw() {
    // キャンバスのリサイズ対応
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const cx = player.x - canvas.width/2;
    const cy = player.y - canvas.height/2;
            
    // 背景クリア
    ctx.fillStyle = '#050508'; 
    ctx.fillRect(0, 0, canvas.width, canvas.height);
            
    // マップ（壁）の描画範囲（カリング）
    ctx.fillStyle = '#1a1a25';
    const startGX = Math.max(0, Math.floor(cx / TILE_SIZE));
    const endGX = Math.min(GRID_WIDTH, Math.ceil((cx + canvas.width) / TILE_SIZE));
    const startGY = Math.max(0, Math.floor(cy / TILE_SIZE));
    const endGY = Math.min(GRID_HEIGHT, Math.ceil((cy + canvas.height) / TILE_SIZE));

    for(let y=startGY; y<endGY; y++) {
        for(let x=startGX; x<endGX; x++) {
            if (WORLD_MAP[y][x] === 1) {
                ctx.fillRect(x*TILE_SIZE-cx, y*TILE_SIZE-cy, TILE_SIZE, TILE_SIZE);
            }
        }
    }

    // オブジェクトの描画
    enemies.forEach(e => e.draw(cx, cy));
    player.draw(cx, cy);

    // UIの更新（ステータス表示）
    // const isAnyChasing = enemies.some(e => e.state === 'chasing');
    // statusEl.textContent = isAnyChasing ? "発見されました！" : "隠密中";
    // statusEl.className = isAnyChasing ? "detected" : "hidden";
}

function gameLoop(timestamp) {
    const deltaTime = timestamp - lastTime;
    lastTime = timestamp;
    accumulator += deltaTime;

    while (accumulator >= timeStep) {
        update();
        accumulator -= timeStep;
    }

    draw();

    requestAnimationFrame(gameLoop);
}