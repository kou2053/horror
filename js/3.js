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

function gameLoop(timestamp) {
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
    // ここに「1/60秒分」の移動処理を書く
}

function drawGame() {
    // 画面をクリアして再描画
}

requestAnimationFrame(gameLoop);