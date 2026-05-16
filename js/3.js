// HTMLからキャンバス要素を取得します
const canvas = document.getElementById("canvas");
// キャンバスの2Dレンダリングコンテキストを取得します
const ctx = canvas.getContext("2d");
// 開始ボタンのHTML要素を取得します
const start = document.getElementById("start");

// キャンバスのサイズをウィンドウサイズに合わせて調整する関数です
function resizeCanvas() {
    // デバイスのピクセル比を取得し、解像度を調整します
    const dpr = window.devicePixelRatio || 1;
    // キャンバスの内部解像度をピクセル比に合わせて設定します
    canvas.width = window.innerWidth * dpr;
    // キャンバスの内部高さをピクセル比に合わせて設定します
    canvas.height = window.innerHeight * dpr;
    // キャンバスの表示上の幅をCSSで設定します
    canvas.style.width = `${window.innerWidth}px`;
    // キャンバスの表示上の高さをCSSで設定します
    canvas.style.height = `${window.innerHeight}px`;
    // 描画のスケーリングをデバイスピクセル比に合わせて補正します
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
}

// ウィンドウのリサイズイベントにリサイズ関数を登録します
window.addEventListener("resize", resizeCanvas);
// 初回のキャンバスサイズ設定を実行します
resizeCanvas();

// フラッシュ演出用のカウント変数です
let flash = 0;
// 演出の進行段階を管理する変数です
let count = 0;
// フラッシュの間隔を制御する変数です
let flashwait = 10;
//最後のボタンの表示時間をカウントする変数です
let lasttime = 0;
// 選択したキャラクターを保持する変数です
let mycharacter = null;
// キャラクター選択モードかどうかを管理するフラグです
let charaselect = false;

// RPGパートで使用する会話シナリオのデータ配列です
let scenario = [
    { name: "", text: "暗闇の中から声が聞こえる……。" },
    { name: "謎の声", text: "「目を覚ませ……」" },
    { name: "謎の声", text: "「選ばれし勇者よ、今こそ立ち上がる時だ。」" },
    { name: "勇者", text: "（……頭が痛い。ここはどこだ？）" }
];
// 現在表示しているシナリオの行番号です
let currentLine = 0;   
// 現在タイピング表示中の文字のインデックスです
let charIndex = 0;     
// 文字をタイピング中かどうかを判定するフラグです
let isTyping = false;  
// メッセージウィンドウのDOM要素を保持します
let messageBox = null; 
// キャラクター名を表示するDOM要素を保持します
let nameBox = null;
// セリフ本文を表示するDOM要素を保持します
let textBox = null;
// 選択肢の親要素となるDOMを保持します
let selectBox = null;
// 選択肢ボタン1のDOM要素を保持します
let selectbuttom1 = null;
// 選択肢ボタン2のDOM要素を保持します
let selectbuttom2 = null;
// タイピング演出用のタイマーIDです
let typeTimer = null;
// 自動進行用のタイマーIDです
let autoStartTimer = null;

// ゲームが開始されたかどうかの状態フラグです
let started = false;

// 開始ボタンがクリックされた時の処理です
start.addEventListener("click", function() {
    // 既に開始している場合は何もしません
    if(started) return;
    // 開始フラグを真にします
    started = true;

    // ボタンに震えるアニメーションを適用します
    start.style.animation = "shake 0.2s infinite";
    // 画面の点滅演出を開始します
    startanimation();
});

// キャンバスがクリックされた時の座標判定処理です
canvas.addEventListener("click", (e) => {

    // キャラクター選択中の場合のみ処理します
    if(charaselect){

        // キャンバスの画面上の位置を取得します
        const rect = canvas.getBoundingClientRect();

        // クリックされたX座標を計算します
        const x = e.clientX - rect.left;
        // クリックされたY座標を計算します
        const y = e.clientY - rect.top;

        // 左側のキャラクター枠がクリックされたか判定します
        if (
            x >= 300 && x <= 600 &&
            y >= 100 && y <= 700
        ) {

            // はい/いいえの選択肢ウィンドウを表示します
            selecting(
                "はい",
                "いいえ",
                "これでいいですか",
                1
            );

            // 一時的に選択モードをオフにします
            charaselect = false;
        }

        // 右側のキャラクター枠がクリックされたか判定します
        if (
            x >= 900 && x <= 1200 &&
            y >= 100 && y <= 700
        ) {

            // はい/いいえの選択肢ウィンドウを表示します
            selecting(
                "はい",
                "いいえ",
                "これでいいですか",
                2
            );

            // 一時的に選択モードをオフにします
            charaselect = false;
        }
    }
});

// 開始時のホラー演出・点滅を制御する関数です
function startanimation(){
    // フレームごとにフラッシュ変数を加算します
    flash += 1;
    // 演出が終了（countが6）するまで繰り返します
    if (count !== 6){
        // 指定した間隔（flashwait）に達した時の処理です
        if (flash == flashwait){
            // 演出の後半では画面を黒く塗りつぶします
            if (count >= 4){
                ctx.fillStyle = "black";
                ctx.fillRect(0, 0, canvas.width, canvas.height);
            }
        // 更に倍の間隔が経過した時の処理です
        } else if (flash == flashwait * 2){
            // 進行度を上げます
            count += 1
            // フラッシュ変数をリセットします
            flash = 0
            // まだ終了していない場合は画面をクリアして点滅させます
            if (count !== 6){
                ctx.clearRect(0, 0, canvas.width, canvas.height);
            }
        }
    }

    if (count == 6){
        lasttime ++;
    }

    // カウントに応じて点滅の速さやボタンのテキストを不気味に変更します
    if (count == 1){
        flashwait = 5
        start.style.display = "none";
    }else if (count == 2){
        flashwait = 5
        start.textContent = "蟶ｰ繧";
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
        start.textContent = "start";
    }

    // カウントが6未満ならアニメーションを継続します
    if (lasttime < 100){
        requestAnimationFrame(startanimation);
    // 演出終了後にキャラクター選択画面へ移行します
    }else{
        start.style.display = "none";
        characterselection();
    }
}

// キャラクター選択画面を描画する関数です
function characterselection() {
    // 選択フラグを有効にします
    charaselect = true;
    // 現在の描画状態を保存します
    ctx.save();
    // 矩形の色をグレーに設定します
    ctx.fillStyle = "rgb(122, 122, 122)";
    // 赤い光の影（グロー効果）を設定します
    ctx.shadowColor = "#ff0000";
    // 影のぼかし具合を設定します
    ctx.shadowBlur = 15;
    // 左側の選択肢矩形を描画します
    ctx.fillRect(300, 100, 300, 600);
    // 右側の選択肢矩形を描画します
    ctx.fillRect(900, 100, 300, 600);

// フォントの読み込みを待ってからテキストを描画します
document.fonts.ready.then(() => {
    ctx.save();

    // 日本語フォントとサイズを設定します
    ctx.font = "40px 'Yuji Mai', cursive";
    // テキストの色を薄い赤に設定します
    ctx.fillStyle = "#ff6666";
    // テキストに赤い影をつけます
    ctx.shadowColor = "#ff0000";
    ctx.shadowBlur = 15;
    // 中央揃えに設定します
    ctx.textAlign = "center";

    // 中央上部にメッセージを表示します
    ctx.fillText("自分を選ぶ", 750, 100);

    // 描画状態を復元します
    ctx.restore();
});
}

// 選択確認のポップアップを生成する関数です
function selecting(text1,text2,explanation,caseType) {
    // メッセージボックスとなるdiv要素を作成します
    messageBox = document.createElement("div");
    
    // スタイルを設定：画面中央付近に配置します
    messageBox.style.position = "absolute";
    messageBox.style.bottom = "350px";
    messageBox.style.left = "50%";
    messageBox.style.transform = "translateX(-50%)";
    messageBox.style.width = "20%";
    messageBox.style.height = "160px";
    // 背景を暗い赤色にします
    messageBox.style.backgroundColor = "rgba(20, 0, 0, 0.95)";
    // 枠線を二重線の暗い赤にします
    messageBox.style.border = "5px double #8b0000";
    // フォントを明朝体風に設定します
    messageBox.style.fontFamily = "'Times New Roman', 'YuMincho', serif";
    // 最前面に表示します
    messageBox.zIndex = "100";

    // 説明文を表示するdivを作成します
    selectBox = document.createElement("div");
    selectBox.style.position = "absolute";
    selectBox.style.top = "10px";
    selectBox.style.left = "20px";
    selectBox.style.color = "#ff0000";
    selectBox.style.fontSize = "24px";
    selectBox.style.fontWeight = "bold";
    selectBox.style.textShadow = "1px 1px 2px black";
    // 引数で受け取った説明文を代入します
    selectBox.innerText = explanation;

    // 1つ目のボタン（はい）を作成します
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

    // ボタン1のホバー演出を設定します
    selectbuttom1.addEventListener("mouseover", () => {
        selectbuttom1.style.backgroundColor = "#660000";
        selectbuttom1.style.color = "#ffffff";
        selectbuttom1.style.textShadow = "0 0 10px #ff0000";
    });

    // ボタン1のホバー解除演出を設定します
    selectbuttom1.addEventListener("mouseout", () => {
        selectbuttom1.style.backgroundColor = "#330000";
        selectbuttom1.style.color = "#ff6666";
        selectbuttom1.style.textShadow = "0 0 5px #ff0000";
    });

    // 2つ目のボタン（いいえ）を作成します
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

    // ボタン2のホバー演出を設定します
    selectbuttom2.addEventListener("mouseover", () => {
        selectbuttom2.style.backgroundColor = "#660000";
        selectbuttom2.style.color = "#ffffff";
        selectbuttom2.style.textShadow = "0 0 10px #ff0000";
    });

    // ボタン2のホバー解除演出を設定します
    selectbuttom2.addEventListener("mouseout", () => {
        selectbuttom2.style.backgroundColor = "#330000";
        selectbuttom2.style.color = "#ff6666";
        selectbuttom2.style.textShadow = "0 0 5px #ff0000";
    });

    // はいボタンが押された時の処理です
    selectbuttom1.addEventListener("click", function() {
        if (caseType == 1 || caseType == 2){
            // ポップアップを削除します
            messageBox.remove();
            // 画面を一度クリアします
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            // 黒色で塗りつぶします
            ctx.fillStyle = "black";
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            // 2秒後にRPG会話パートを開始します
            setTimeout(function() {
                startRPG();
            }, 2000);
        }
    });
    // いいえボタンが押された時の処理です
    selectbuttom2.addEventListener("click", function() {
        if (caseType == 1 || caseType == 2){
            // ポップアップを消して選択画面に戻ります
            messageBox.remove();
            charaselect = true;
        }
    });

    // 作成した要素をメッセージボックスに追加します
    messageBox.appendChild(selectBox);
    messageBox.appendChild(selectbuttom1);
    messageBox.appendChild(selectbuttom2);
    // メッセージボックスをHTMLドキュメントに追加します
    document.body.appendChild(messageBox);
}

// RPG会話パートの初期化関数です
function startRPG(){

    // キャンバスを黒く塗りつぶします
    ctx.fillStyle = "black";

    ctx.fillRect(
        0,
        0,
        canvas.width,
        canvas.height
    );

    // 会話用のメッセージウィンドウを作成します
    createMessageBox();

    // 最初の行を表示します
    showNextLine();
}

// RPG用の会話ウィンドウを構築する関数です
function createMessageBox() {
    messageBox = document.createElement("div");
    
    // スタイルを設定：画面下部に大きく配置します
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
    // クリック可能であることを示します
    messageBox.style.cursor = "pointer";

    // 名前を表示するエリアを作成します
    nameBox = document.createElement("div");
    nameBox.style.position = "absolute";
    nameBox.style.top = "10px";
    nameBox.style.left = "20px";
    nameBox.style.color = "#ff0000";
    nameBox.style.fontSize = "24px";
    nameBox.style.fontWeight = "bold";
    nameBox.style.textShadow = "1px 1px 2px black";
    messageBox.appendChild(nameBox);

    // セリフ本文を表示するエリアを作成します
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

    // 画面に追加します
    document.body.appendChild(messageBox);

    // ウィンドウ全体をクリックした時の処理を登録します
    messageBox.addEventListener("click", handleClick);
}

// シナリオの次の行を処理する関数です
function showNextLine() {
    // 全てのセリフが終わった場合の処理です
    if (currentLine >= scenario.length) {
        // メッセージボックスを削除します
        if(messageBox && messageBox.parentNode){
            messageBox.remove();
        }

        // 2Dキャンバスを非表示にします
        canvas.style.display = "none";
        // 3Dレンダラーの重なり順を前面にします
        renderer.domElement.style.zIndex = "1";

        // 時間を記録し、3Dゲームのメインループを開始します
        lastTime = performance.now();
        requestAnimationFrame(loop);

        return;
    }

    // 現在の行のデータを取得します
    const currentData = scenario[currentLine];
    
    // キャラクター名を表示します
    nameBox.innerText = currentData.name;
    
    // テキストを空にして、一文字ずつ表示する準備をします
    textBox.innerText = ""; 
    charIndex = 0;
    isTyping = true;
    typeWriter();
}

// 文字を一文字ずつ表示する再帰関数です
function typeWriter() {
    // 現在表示すべきテキストの全文を取得します
    const text = scenario[currentLine].text;
    
    // まだ文字が残っている場合、一文字追加して0.05秒後に自分を呼び出します
    if (charIndex < text.length) {
        textBox.innerText += text.charAt(charIndex);
        charIndex++;
        typeTimer = setTimeout(typeWriter, 50); 
    // 全文字表示し終わった時の処理です
    } else {
        isTyping = false;
        // 自動進行用のタイマーをリセットします
        if (autoStartTimer) {
            clearTimeout(autoStartTimer);
            autoStartTimer = null;
        }
        // 最後の行なら1.5秒後に自動で次へ進めます
        if (currentLine === scenario.length - 1) {
            autoStartTimer = setTimeout(() => {
                currentLine++;
                showNextLine();
            }, 1500);
        }
    }
}

// メッセージウィンドウクリック時の挙動です
function handleClick() {
    // 自動進行タイマーを解除します
    if (autoStartTimer) {
        clearTimeout(autoStartTimer);
        autoStartTimer = null;
    }

    // 文字送り中の場合、タイマーを止めて全文を一瞬で表示します
    if (isTyping) {
        clearTimeout(typeTimer);
        textBox.innerText = scenario[currentLine].text;
        isTyping = false;
    // 表示完了済みの場合、次の行へ進みます
    } else {
        currentLine++;
        showNextLine();
    }
}

// --- 3Dゲームの設定定数 ---
// 1グリッドあたりの大きさを定義します
const TILE_SIZE = 4;
// マップの横方向のグリッド数です
const GRID_WIDTH = 40;
// マップの縦方向のグリッド数です
const GRID_HEIGHT = 40;
// プレイヤーの当たり判定の大きさを設定します
const PLAYER_RADIUS = 0.6;
// カメラがプレイヤーを追従する際のオフセット距離です
const CAM_OFFSET = new THREE.Vector3(0, 35, 15);
// 敵がプレイヤーを見失ってから追跡を諦めるまでの時間です
const LOS_TIMEOUT_MS = 5000;
// 敵に捕まったと判定する距離です
const CAPTURE_DIST = 1.2; 

// マップデータを保持する2次元配列を初期化します（0は道）
const WORLD_MAP = Array.from({ length: GRID_HEIGHT }, () => Array(GRID_WIDTH).fill(0));
// マップ上の特定の範囲を壁（1）にする関数です
function addWallRect(x, y, w, h) {
    for(let i=y; i<y+h; i++) {
        for(let j=x; j<x+w; j++) {
            if(WORLD_MAP[i] && WORLD_MAP[i][j] !== undefined) WORLD_MAP[i][j] = 1;
        }
    }
}
// マップの上下の端を壁で囲みます
for(let i=0; i<GRID_WIDTH; i++) { WORLD_MAP[0][i] = 1; WORLD_MAP[GRID_HEIGHT-1][i] = 1; }
// マップの左右の端を壁で囲みます
for(let i=0; i<GRID_HEIGHT; i++) { WORLD_MAP[i][0] = 1; WORLD_MAP[i][GRID_WIDTH-1] = 1; }
// 迷路のような壁を配置します
addWallRect(10, 5, 2, 10);
addWallRect(5, 15, 15, 2);
addWallRect(20, 10, 5, 5);
addWallRect(20, 25, 10, 2);
addWallRect(5, 25, 2, 10);

// Three.jsのシーン（世界）を作成します
const scene = new THREE.Scene();
// 背景色を非常に暗い紺色に設定します
scene.background = new THREE.Color(0x050508);
// 遠近感のあるカメラを作成します
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
// 3D描画用のレンダラーを作成します
const renderer = new THREE.WebGLRenderer({ antialias: true });
// ウィンドウサイズに合わせて描画サイズを設定します
renderer.setSize(window.innerWidth, window.innerHeight);
// レンダラーの位置を固定します
renderer.domElement.style.position = "fixed";
renderer.domElement.style.top = "0";
renderer.domElement.style.left = "0";
// 最初は背面（UIの下）に隠しておきます
renderer.domElement.style.zIndex = "-1";
// レンダラーのキャンバスをHTMLに追加します
document.body.appendChild(renderer.domElement);

// 全体を照らす環境光を追加します
scene.add(new THREE.AmbientLight(0x404040, 1.2));
// 特定の方向から照らす平行光源を追加します
const dirLight = new THREE.DirectionalLight(0xffffff, 0.6);
// 光の飛んでくる向きを設定します
dirLight.position.set(10, 20, 10);
scene.add(dirLight);

// A*アルゴリズムを用いて目的地までの最短経路を算出する関数です
function findPath(startGrid, endGrid) {
    // 目的地が現在地と同じなら即終了します
    if (startGrid.x === endGrid.x && startGrid.z === endGrid.z) return [];
    // 探索待ちのノードリストです
    const openList = [];
    // 探索済みのノードを記録するセットです
    const closedSet = new Set();
    // 開始地点のデータを生成します
    const startNode = { x: startGrid.x, z: startGrid.z, g: 0, h: Math.abs(startGrid.x - endGrid.x) + Math.abs(startGrid.z - endGrid.z), parent: null };
    // コスト合計値を計算します
    startNode.f = startNode.g + startNode.h;
    openList.push(startNode);
    let iterations = 0;
    // リストが空になるまで探索を続けます（上限500回）
    while (openList.length > 0 && iterations++ < 500) {
        let currentIdx = 0;
        // 最も期待値の高い（コストが低い）ノードを探します
        for (let i = 1; i < openList.length; i++) if (openList[i].f < openList[currentIdx].f) currentIdx = i;
        const current = openList[currentIdx];
        // 目的地に到達した場合、親ノードを遡って経路を作成します
        if (current.x === endGrid.x && current.z === endGrid.z) {
            const path = []; let temp = current;
            while (temp) { path.push({ x: temp.x, z: temp.z }); temp = temp.parent; }
            return path.reverse();
        }
        // 現在のノードを処理済みリストに移動します
        openList.splice(currentIdx, 1);
        closedSet.add(`${current.x},${current.z}`);
        // 隣接する4方向のノードを調べます
        const neighbors = [{x: 0, z: 1}, {x: 0, z: -1}, {x: 1, z: 0}, {x: -1, z: 0}];
        for (const neighbor of neighbors) {
            const nx = current.x + neighbor.x, nz = current.z + neighbor.z;
            // マップ外や壁、探索済みの場所は無視します
            if (nx < 0 || nx >= GRID_WIDTH || nz < 0 || nz >= GRID_HEIGHT || WORLD_MAP[nz][nx] === 1 || closedSet.has(`${nx},${nz}`)) continue;
            const gScore = current.g + 1;
            let neighborNode = openList.find(n => n.x === nx && n.z === nz);
            // 新しい場所ならリストに追加します
            if (!neighborNode) {
                neighborNode = { x: nx, z: nz, g: gScore, h: Math.abs(nx - endGrid.x) + Math.abs(nz - endGrid.z), parent: current };
                neighborNode.f = neighborNode.g + neighborNode.h;
                openList.push(neighborNode);
            // 既に知っている場所でも、より短い経路が見つかれば更新します
            } else if (gScore < neighborNode.g) {
                neighborNode.g = gScore; neighborNode.f = neighborNode.g + neighborNode.h; neighborNode.parent = current;
            }
        }
    }
    return [];
}

// 座標が壁に衝突しているかチェックする関数です
function checkWallCollision(x, z, radius) {
    const gx = Math.floor(x / TILE_SIZE), gz = Math.floor(z / TILE_SIZE);
    // 範囲外またはマップデータの1（壁）なら衝突とみなします
    if (gx < 0 || gx >= GRID_WIDTH || gz < 0 || gz >= GRID_HEIGHT || WORLD_MAP[gz][gx] === 1) return true;
    return false;
}

// キー入力を管理するためのオブジェクトです
const keys = {};
// キーが押されたらtrueをセットします
window.addEventListener('keydown', e => keys[e.code] = true);
// キーが離されたらfalseをセットします
window.addEventListener('keyup', e => keys[e.code] = false);

// スマートフォン等のタッチ操作用スティックの設定です
const joystickContainer = document.getElementById('joystick-container');
const joystickKnob = document.getElementById('joystick-knob');
let stickInput = { x: 0, y: 0, active: false };
// タッチデバイスの場合、ジョイスティックを有効化します
if ('ontouchstart' in window) {
    joystickContainer.style.display = 'block';
    joystickContainer.addEventListener('touchstart', () => stickInput.active = true);
    window.addEventListener('touchmove', (e) => {
        if (!stickInput.active) return;
        const rect = joystickContainer.getBoundingClientRect();
        // 中心からの指の距離を計算します
        const dx = e.touches[0].clientX - (rect.left + 50), dy = e.touches[0].clientY - (rect.top + 50);
        const dist = Math.min(50, Math.sqrt(dx*dx + dy*dy));
        const angle = Math.atan2(dy, dx);
        // 指の動きに合わせてスティックの傾きを計算します
        stickInput.x = (Math.cos(angle) * dist) / 50; stickInput.y = (Math.sin(angle) * dist) / 50;
        // スティックの見た目を移動させます
        joystickKnob.style.transform = `translate(calc(-50% + ${Math.cos(angle) * dist}px), calc(-50% + ${Math.sin(angle) * dist}px))`;
    });
    // 指を離したらスティックを中央に戻します
    window.addEventListener('touchend', () => { stickInput.active = false; stickInput.x = 0; stickInput.y = 0; joystickKnob.style.transform = 'translate(-50%, -50%)'; });
}

// 壁の質感（マテリアル）を作成します
const wallMat = new THREE.MeshPhongMaterial({ color: 0x1a1a25 });
// 壁のオブジェクトを管理する配列です
const wallObjects = [];
// マップデータをループして、壁がある場所に3Dボックスを配置します
for(let z=0; z<GRID_HEIGHT; z++) {
    for(let x=0; x<GRID_WIDTH; x++) {
        if (WORLD_MAP[z][x] === 1) {
            const wall = new THREE.Mesh(new THREE.BoxGeometry(TILE_SIZE, TILE_SIZE * 1.5, TILE_SIZE), wallMat);
            // マップの座標に合わせて位置を調整します
            wall.position.set(x * TILE_SIZE + TILE_SIZE/2, TILE_SIZE * 0.75, z * TILE_SIZE + TILE_SIZE/2);
            scene.add(wall);
            wallObjects.push(wall);
        }
    }
}
// 床となる大きな平面を作成してシーンに追加します
const floor = new THREE.Mesh(new THREE.PlaneGeometry(GRID_WIDTH*TILE_SIZE, GRID_HEIGHT*TILE_SIZE), new THREE.MeshPhongMaterial({ color: 0x0a0a0f }));
floor.rotation.x = -Math.PI/2; floor.position.set(GRID_WIDTH*TILE_SIZE/2, 0, GRID_HEIGHT*TILE_SIZE/2);
scene.add(floor);

// プレイヤーを定義するクラスです
class Player {
    constructor() {
        // 青く光る球体をプレイヤーとして作成します
        this.mesh = new THREE.Mesh(new THREE.SphereGeometry(0.8, 16, 16), new THREE.MeshPhongMaterial({ color: 0x00f2ff, emissive: 0x00f2ff, emissiveIntensity: 0.4 }));
        this.reset();
        scene.add(this.mesh);
        this.speed = 0.35;
    }
    // プレイヤーの位置を初期地点に戻します
    reset() {
        this.mesh.position.set(TILE_SIZE * 2.5, 0.8, TILE_SIZE * 2.5);
    }
    // 入力に基づきプレイヤーを移動させる更新関数です
    update() {
        let dx = 0, dz = 0;
        // キーボード入力を取得します
        if (keys['KeyW'] || keys['ArrowUp']) dz -= 1; if (keys['KeyS'] || keys['ArrowDown']) dz += 1;
        if (keys['KeyA'] || keys['ArrowLeft']) dx -= 1; if (keys['KeyD'] || keys['ArrowRight']) dx += 1;
        // シフトキーでダッシュします
        if (keys["ShiftLeft"]) {
            this.speed = 0.5;
        } else {
            this.speed = 0.35;
        }
        // ジョイスティック入力があれば上書きします
        if (stickInput.active) { dx = stickInput.x; dz = stickInput.y; }
        const mag = Math.sqrt(dx*dx + dz*dz);
        // 入力がある場合、壁との衝突を考慮しながら座標を更新します
        if (mag > 0.1) {
            const moveX = (dx/mag) * this.speed, moveZ = (dz/mag) * this.speed;
            if (!checkWallCollision(this.mesh.position.x + moveX, this.mesh.position.z, PLAYER_RADIUS)) this.mesh.position.x += moveX;
            if (!checkWallCollision(this.mesh.position.x, this.mesh.position.z + moveZ, PLAYER_RADIUS)) this.mesh.position.z += moveZ;
        }
        // 足音の半径を初期化します
        this.noiseRadius = 0;

        // 移動中は音の範囲を設定（敵に見つかりやすくなる）
        if (mag > 0.1) {

            if (keys["ShiftLeft"]) {
                // 走る時の足音は大きく設定します
                this.noiseRadius = 18;
            } else {
                // 歩く時の足音は小さめに設定します
                this.noiseRadius = 10;
            }
        }
    }
}

// 敵キャラクターの挙動を制御するAIクラスです
class Enemy {
    constructor(x, z, color, dist, angleFov, speed, id, width = 1.2, depth = 1.8) {
        this.id = id;
        this.startPos = { x, z };
        // 敵ごとに幅と奥行きを保持するように変更
        this.width = width;
        this.depth = depth;
        // メッシュのサイズも引数に合わせる
        this.mesh = new THREE.Mesh(new THREE.BoxGeometry(this.width, 2, this.depth), new THREE.MeshPhongMaterial({ color: color }));
        this.mesh.position.set(x, 1, z);
        scene.add(this.mesh);
        this.config = { viewDist: dist, viewAngle: angleFov, speed: speed };
        this.angle = 0;
        this.state = "patrol";
        this.path = [];
        this.pathTimer = 0;
        this.losTimer = 0;
        this.lastKnownPos = null;
        this.searchTimer = 0;
        this.patrolPoints = [{ x: 5, z: 5 }, { x: 34, z: 5 }, { x: 34, z: 34 }, { x: 5, z: 34 }];
        this.currentPatrol = Math.floor(Math.random() * this.patrolPoints.length);
        this.vision = new THREE.Mesh(new THREE.CircleGeometry(dist, 24, -angleFov / 2, angleFov), new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.15, side: THREE.DoubleSide }));
        this.vision.rotation.x = -Math.PI / 2;
        scene.add(this.vision);
    }

    // 状態を初期位置・初期モードに戻します
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

    // 向きとサイズを考慮した当たり判定
    checkCollisionWithPlayer(player) {
        const playerPos = player.mesh.position;
        const enemyPos = this.mesh.position;

        // 1. 敵のローカル座標系にプレイヤーの位置を変換
        const dx = playerPos.x - enemyPos.x;
        const dz = playerPos.z - enemyPos.z;
        
        // 敵の現在の向き（angle）で逆回転させる
        // 敵のメッシュは rotation.y = -this.angle なので、座標変換はそのまま回転行列を適用
        const cos = Math.cos(-this.angle);
        const sin = Math.sin(-this.angle);
        
        const localX = dx * cos - dz * sin;
        const localZ = dx * sin + dz * cos;

        // 2. ローカル座標での矩形 vs 円（プレイヤー）の判定
        // 矩形の半分のサイズ
        const halfW = this.width / 2;
        const halfD = this.depth / 2;

        // 矩形内の最もプレイヤーに近い点を探す
        const closestX = Math.max(-halfW, Math.min(localX, halfW));
        const closestZ = Math.max(-halfD, Math.min(localZ, halfD));

        // その点とプレイヤーの距離を測る
        const distSq = (localX - closestX) ** 2 + (localZ - closestZ) ** 2;
        return distSq < (PLAYER_RADIUS * 0.8) ** 2; // 少し余裕を持たせる
    }

    // 敵の思考と移動を処理するメイン更新関数です
    update(player, deltaTime) {

        const enemyPos = this.mesh.position;

        const playerPos = player.mesh.position;

        // プレイヤーとの距離を計算します
        const distToPlayer =
            enemyPos.distanceTo(playerPos);

        // --- 視界判定ロジック ---

        // プレイヤーへの方向ベクトルを算出します
        const dirToPlayer =
            new THREE.Vector3()
                .subVectors(playerPos, enemyPos)
                .normalize();

        // 自分が向いている正面のベクトルを算出します
        const currentDir =
            new THREE.Vector3(
                Math.cos(this.angle),
                0,
                Math.sin(this.angle)
            );

        // 自分の正面とプレイヤーの方向がどれだけ離れているか角度を計算します
        const angleToPlayer =
            currentDir.angleTo(dirToPlayer);

        // 視界を遮る壁がないかレイを飛ばして確認します
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

        // 距離、角度、遮蔽物の条件を満たせば「発見」となります
        const isVisible =
            !isBlockedByWall &&
            distToPlayer < this.config.viewDist &&
            angleToPlayer < this.config.viewAngle / 2;

        // --- 足音判定ロジック ---

        // プレイヤーの発する音の範囲内にいれば「聞き取り」となります
        const heardPlayer =
            distToPlayer < player.noiseRadius;

        // --- 巡回状態の処理 ---

        if (this.state === "patrol") {

            // 視界の色を白（通常）にします
            this.vision.material.color.setHex(
                0xffffff
            );

            // 音を聞いたら、不審状態になってその場所を確認しに行きます
            if (heardPlayer) {

                this.state = "suspicious";

                this.lastKnownPos =
                    playerPos.clone();

                // 【追加】音のした場所までの迂回経路を計算します
                this.path = findPath(
                    {
                        x: Math.floor(enemyPos.x / TILE_SIZE),
                        z: Math.floor(enemyPos.z / TILE_SIZE)
                    },
                    {
                        x: Math.floor(this.lastKnownPos.x / TILE_SIZE),
                        z: Math.floor(this.lastKnownPos.z / TILE_SIZE)
                    }
                );
            }

            // 直接見つけたら追跡状態に移行します
            if (isVisible) {

                this.state = "chasing";

                this.lastKnownPos =
                    playerPos.clone();

                // 近くの仲間の敵にも警戒を促します
                enemies.forEach(other => {

                    if (other !== this) {

                        const d =
                            other.mesh.position.distanceTo(
                                enemyPos
                            );

                        // 25ユニット以内にいる仲間にプレイヤーの位置を共有します
                        if (d < 25) {

                            other.state =
                                "suspicious";

                            other.lastKnownPos =
                                playerPos.clone();
                        }
                    }
                });
            }

// 目的地に到達していたら、マップ上の有効な床からランダムに次の目的地を選んで経路を計算します
            if (this.path.length === 0) {

                let validFloorTiles = [];
                // 【修正】MAP を WORLD_MAP に変更
                const rows = WORLD_MAP.length;
                const cols = WORLD_MAP[0].length;

                // マップ全体をスキャンして、壁（1）以外の床（0）の座標をすべてリストアップします
                for (let r = 0; r < rows; r++) {
                    for (let c = 0; c < cols; c++) {
                        // 【修正】MAP を WORLD_MAP に変更
                        if (WORLD_MAP[r][c] === 0) {
                            validFloorTiles.push({ x: c, z: r });
                        }
                    }
                }

                let target = null;
                if (validFloorTiles.length > 0) {
                    // 床のリストからランダムに1つのマスを選びます
                    const randomIndex = Math.floor(Math.random() * validFloorTiles.length);
                    target = validFloorTiles[randomIndex];
                } else {
                    // 万が一床が見つからなかった場合の安全なフォールバック
                    target = { x: 1, z: 1 };
                }

                // 選ばれたランダムな目的地に向けてA*の経路を計算します
                this.path = findPath(
                    {
                        x: Math.floor(enemyPos.x / TILE_SIZE),
                        z: Math.floor(enemyPos.z / TILE_SIZE)
                    },
                    target
                );
            }
        }

        // --- 不審状態（黄色）の処理 ---

        else if (this.state === "suspicious") {

            // 視界の色を黄色に変更します
            this.vision.material.color.setHex(
                0xffff00
            );

            // この状態で見つけたら即座に追跡します
            if (isVisible) {

                this.state = "chasing";

                this.lastKnownPos =
                    playerPos.clone();
            }

            // 音がした（最後に確認された）場所に近づいたら捜索モードに入ります
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

        // --- 捜索状態（オレンジ）の処理 ---

        else if (this.state === "search") {

            // 視界の色をオレンジに変更します
            this.vision.material.color.setHex(
                0xff8800
            );

            this.searchTimer -= deltaTime;

            // 周囲をキョロキョロ見回す演出です
            this.angle +=
                Math.sin(
                    performance.now() * 0.003
                ) * 0.02;

            if (isVisible) {

                this.state = "chasing";

                this.lastKnownPos =
                    playerPos.clone();
            }

            // 一定時間見つからなければ巡回に戻ります
            if (this.searchTimer <= 0) {

                this.state = "patrol";

                this.path = [];
            }
        }

        // --- 追跡状態（赤色）の処理 ---

        else if (this.state === "chasing") {

            // 視界の色を赤に変更します
            this.vision.material.color.setHex(
                0xff3333
            );

            // 常にプレイヤーの最新座標を記憶します
            this.lastKnownPos =
                playerPos.clone();

            // 壁で見えなくなった場合のカウントダウン処理です
            if (isBlockedByWall) {

                this.losTimer += deltaTime;

                // 5秒間見失い続けたら諦めて不審状態に落とします
                if (
                    this.losTimer >=
                    LOS_TIMEOUT_MS
                ) {

                    this.state = "suspicious";

                    this.path = [];

                    this.losTimer = 0;
                }

            } else {

                // 見えていれば見失いタイマーをリセットします
                this.losTimer = 0;
            }

            // プレイヤーが大幅に離れすぎた場合も追跡を緩めます
            const maxChaseDist =
                this.config.viewDist * 1.8;

            if (
                distToPlayer > maxChaseDist
            ) {

                this.state = "suspicious";
            }

            // 追跡中は頻繁に（20フレームごと）に経路を再計算します
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

        // --- 移動先の目標決定 ---
        let targetPos = null;

        // 非常に近い場合は経路を無視してプレイヤーに突進します（chasing時のみ）
        if (
            this.state === "chasing" &&
            distToPlayer < TILE_SIZE * 1.5
        ) {
            targetPos = playerPos;
        }
        // patrol, chasing に加え、suspicious のときもA*の経路に従わせます
        else if (
            this.path &&
            this.path.length > 0
        ) {
            // 目標マスの中心座標
            const nextTargetX = this.path[0].x * TILE_SIZE + TILE_SIZE / 2;
            const nextTargetZ = this.path[0].z * TILE_SIZE + TILE_SIZE / 2;

            // 目標マスの中心までの距離を計算
            const distToNextNode = Math.sqrt(
                (enemyPos.x - nextTargetX) ** 2 + 
                (enemyPos.z - nextTargetZ) ** 2
            );

            // 1.5ユニット以内に近づいたら次のマスへ進む（前のマスの端で止まるバグを防止）
            if (distToNextNode < 1.5) {
                this.path.shift();

                // 巡回ポイントに全て着いたら次をセットします（patrol時のみ）
                if (
                    this.state === "patrol" &&
                    this.path.length === 0
                ) {
                    this.currentPatrol =
                        (this.currentPatrol + 1) % this.patrolPoints.length;
                }
            }

            // 経路の次のマスを目標地点に設定します
            if (this.path.length > 0) {
                targetPos = new THREE.Vector3(
                    this.path[0].x * TILE_SIZE + TILE_SIZE / 2,
                    1,
                    this.path[0].z * TILE_SIZE + TILE_SIZE / 2
                );
            }
        }

        // 【ここが追加ロジック】もしA*の経路が何らかの理由で空っぽ、かつ suspicious 状態なら直接向かう（保険）
        if (!targetPos && this.state === "suspicious" && this.lastKnownPos) {
            targetPos = this.lastKnownPos;
        }

        // --- 実際の移動計算 ---

        if (targetPos) {

            // 目標への方向を計算します
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

            // 現在の向きと目標の向きの差を求めます
            let diff =
                targetAngle - this.angle;

            // 角度の正規化を行います
            while (diff < -Math.PI)
                diff += Math.PI * 2;

            while (diff > Math.PI)
                diff -= Math.PI * 2;

            // スムーズに目標の方を向きます
            this.angle += diff * 0.1;

            // おおよそ目標を向いていれば前進します
            if (Math.abs(diff) < 0.5) {
                const s = this.config.speed;
                const moveX = Math.cos(this.angle) * s;
                const moveZ = Math.sin(this.angle) * s;
                
                // 【修正ポイント】マージンを少し控えめ（サイズの一番小さい部分を基準など）にするか、固定値（0.4〜0.5程度）にします
                // 敵のメッシュが壁に少しめり込むのを防ぎつつ、通れるように調整します
                const collisionMargin = 0.5; 

                if (!checkWallCollision(enemyPos.x + moveX, enemyPos.z, collisionMargin)) enemyPos.x += moveX;
                if (!checkWallCollision(enemyPos.x, enemyPos.z + moveZ, collisionMargin)) enemyPos.z += moveZ;
            }
        }

        // --- 見た目の角度と視界の位置を更新 ---

        this.mesh.rotation.y =
            -this.angle;

        this.vision.position.set(
            enemyPos.x,
            0.2,
            enemyPos.z
        );

        this.vision.rotation.z =
            -this.angle;

        // 新しい当たり判定の呼び出し
        const isCaptured = this.checkCollisionWithPlayer(player);
        
        // すべての必要な状態情報を1つにまとめて返します
        return { 
            id: this.id, 
            losTimer: this.losTimer, 
            state: this.state, 
            isCaptured,
            dist: distToPlayer 
        };
    }
}

const player = new Player();
// 敵の生成時に、最後に「幅」と「奥行き」を指定できるようにしました
const enemies = [
    // Green: 横長 (幅2.5, 奥行き1.0)
    new Enemy(TILE_SIZE * 35.5, TILE_SIZE * 35.5, 0x00ffaa, 18, Math.PI/1.5, 0.15, "Green", 5.0, 1.0),
    // Yellow: 巨大 (幅3.0, 奥行き3.0)
    new Enemy(TILE_SIZE * 35.5, TILE_SIZE * 5.5, 0xffcc00, 25, Math.PI*2, 0.12, "Yellow", 3.0, 3.0),
    // Red: 標準を少し細く (幅0.8, 奥行き1.5)
    new Enemy(TILE_SIZE * 5.5, TILE_SIZE * 35.5, 0xff3366, 20, Math.PI/3, 0.22, "Red", 0.8, 1.5)
];

// UI表示用の要素を取得します
const statusEl = document.getElementById('status');
const debugEl = document.getElementById('debug-info');
const msgOverlay = document.getElementById('msg-overlay');

// ゲームの状態を管理する変数です
let lastTime = performance.now();
let isGameOver = false;

// 毎フレーム呼ばれるロジック更新関数です
function update(deltaTime) {
    // ゲームオーバー中は何もしません
    if (isGameOver) return; 

    // プレイヤーの移動処理を行います
    player.update();
    let isChased = false;
    let debugText = "";
    
    // 全ての敵に対してAI更新を行います
    for (const e of enemies) {
        const info = e.update(player, deltaTime);
        // 誰か一人でも追跡中ならフラグを立てます
        if (info.state === 'chasing') {
            isChased = true;
            // 視界ロスト中の場合はデバッグ用のカウントダウンを表示します
            if (info.losTimer > 0) {
                const timeLeft = Math.max(0, (LOS_TIMEOUT_MS - info.losTimer) / 1000).toFixed(1);
                debugText += `${info.id}: ロストまで ${timeLeft}s<br>`;
            }
        }
        // 各敵の個別判定結果をチェック
        if (info.isCaptured) triggerGameOver();
    }

    // UIのテキストやクラスを更新します
    if (statusEl) {
        statusEl.textContent = isChased ? "発見されました！" : "隠密中";
        statusEl.className = isChased ? "detected" : "hidden";
    }
    if (debugEl) {
        debugEl.innerHTML = debugText;
    }
}

// 敵に捕まった時の処理です
function triggerGameOver() {
    if (isGameOver) return;
    isGameOver = true;
    // 「捕まった」旨のオーバーレイを表示します
    if (msgOverlay) {
        msgOverlay.style.display = 'flex';
    }
    // 2秒後にゲームを再開（リセット）します
    setTimeout(() => {
        isGameOver = false;
        if (msgOverlay) {
            msgOverlay.style.display = 'none';
        }
        // プレイヤーと敵を初期状態に戻します
        player.reset();
        enemies.forEach(e => e.reset());
    }, 2000); 
}

// 毎フレーム呼ばれる描画関数です
function draw() {
    // カメラを常にプレイヤーの後方に配置します
    camera.position.set(player.mesh.position.x + CAM_OFFSET.x, player.mesh.position.y + CAM_OFFSET.y, player.mesh.position.z + CAM_OFFSET.z);
    // カメラをプレイヤーに向けます
    camera.lookAt(player.mesh.position);
    // 3Dシーンをレンダリングします
    renderer.render(scene, camera);
}

// 3Dゲーム全体のメインループです
function loop() {
    const currentTime = performance.now();
    // 前フレームからの経過時間を計算してAI等に渡します
    const deltaTime = currentTime - lastTime;
    lastTime = currentTime;
    // ロジック更新と描画を順に行います
    update(deltaTime);
    draw();
    // 次のフレーム描画を予約します
    requestAnimationFrame(loop);
}

// ウィンドウがリサイズされた際に3D描画の比率を修正します
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth/window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});