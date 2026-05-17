// HTMLからキャンバス要素を取得します
const canvas = document.getElementById("canvas");
// キャンバスの2Dレンダリングコンテキストを取得します
const ctx = canvas.getContext("2d");
// 開始ボタンのHTML要素を取得します
const start = document.getElementById("start");

// キャンバスのサイズをウィンドウサイズに合わせて調整する関数です
function resizeCanvas() {
    // デバイスのピクセル比を取得し、解せる解像度を調整します
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

canvas.style.position = "fixed";
canvas.style.top = "0";
canvas.style.left = "0";
canvas.style.zIndex = "10"; // 3Dより大きい数字にする

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
//スタートボタンのカウントする変数です
let startCount = 0;
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
    canvas.style.pointerEvents = "none";
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
        startCount ++;
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
    if (startCount < 200){

        requestAnimationFrame(startanimation);
        if (startCount > 100){
            start.style.display = "none";
        }

    // 演出終了後にキャラクター選択画面へ移行します
    }else{
        start.style.display = "none";
        characterselection();
    }
}

function characterselection() {
    canvas.style.pointerEvents = "auto";
    charaselect = true;
    ctx.clearRect(0, 0, canvas.width, canvas.height); // 一度クリア
    
    ctx.save();
    ctx.fillStyle = "rgb(122, 122, 122)";
    ctx.shadowColor = "#ff0000";
    ctx.shadowBlur = 15;
    ctx.fillRect(300, 100, 300, 600); // 左
    ctx.fillRect(900, 100, 300, 600); // 右
    ctx.restore(); // 一旦リセット

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

    // ボタン1 of ホバー演出を設定します
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
            canvas.style.pointerEvents = "auto";
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

// --- 基本設定 ---
const TILE_SIZE = 4;
const GRID_WIDTH = 40;
const GRID_HEIGHT = 40;
const PLAYER_RADIUS = 0.6;
const CAM_OFFSET = new THREE.Vector3(0, 18, 10);
const LOS_TIMEOUT_MS = 5000;
const CAPTURE_DIST = 1.2; // 捕まる距離（プレイヤーと敵の中心距離）

// --- 多層構造に対応したマップデータ定義 ---
// 0 = 地上(高さ0), 1 = 壁/柱
// 2 = 2階フロア (高さを大きく: 高さ 4.0), 3 = 3階フロア (高さを大きく: 高さ 8.0)
// 12 = 1階から2階への階段, 23 = 2階から3階への階段
const WORLD_MAP = Array.from({ length: GRID_HEIGHT }, () => Array(GRID_WIDTH).fill(0));

function addWallRect(x, y, w, h, type = 1) {
    for(let i=y; i<y+h; i++) {
        for(let j=x; j<x+w; j++) {
            if(WORLD_MAP[i] && WORLD_MAP[i][j] !== undefined) WORLD_MAP[i][j] = type;
        }
    }
}

// 外周の壁
for(let i=0; i<GRID_WIDTH; i++) { WORLD_MAP[0][i] = 1; WORLD_MAP[GRID_HEIGHT-1][i] = 1; }
for(let i=0; i<GRID_HEIGHT; i++) { WORLD_MAP[i][0] = 1; WORLD_MAP[i][GRID_WIDTH-1] = 1; }

// 障害物の配置
addWallRect(10, 5, 2, 10, 1);
addWallRect(5, 15, 15, 2, 1);
addWallRect(20, 10, 5, 5, 1);

// 各階層の基準高さを定義する定数
const H_1F = 0.0;
const H_2F = 10.0; // 2階の高さ
const H_3F = 20.0; // 3階の高さ

// 階段ごとのサイズ・位置・段数の設定
const STAIR_12_CONFIG = {
    startX: 16,    // 階段の開始Xグリッド
    lengthX: 6,    // 階段の長さ（X方向のマス数）
    startZ: 24,    // 階段の開始Zグリッド
    lengthZ: 2,    // 階段の幅（Z方向のマス数）
    steps: 12,     // 階段の段数
};

const STAIR_23_CONFIG = {
    startX: 26,    // 階段の開始Xグリッド
    lengthX: 2,    // 階段の幅（X方向のマス数）
    startZ: 17,    // 階段の開始Zグリッド
    lengthZ: 7,    // 階段の長さ（Z方向のマス数）
    steps: 10,     // 階段の段数
};

// 階段のステップ高低差から、1マスあたりの許容傾斜（段差上限）を動的に計算する自動補正
const LIMIT_STEP_12 = Math.max(1.5, (Math.abs(H_2F - H_1F) / STAIR_12_CONFIG.steps) + 0.1);
const LIMIT_STEP_23 = Math.max(1.5, (Math.abs(H_3F - H_2F) / STAIR_23_CONFIG.steps) + 0.1);

// ★ 高低差・多層エリアの定義 ★
// 2階エリア (右下あたりに高台を作成)
addWallRect(22, 20, 12, 12, 2); 
// 2階への階段をカスタム設定に従い配置
addWallRect(STAIR_12_CONFIG.startX, STAIR_12_CONFIG.startZ, STAIR_12_CONFIG.lengthX, STAIR_12_CONFIG.lengthZ, 12); 

// 3階エリア (2階の上にさらに高台を設置)
addWallRect(26, 24, 6, 6, 3);
// 3階への階段をカスタム設定に従い配置
addWallRect(STAIR_23_CONFIG.startX, STAIR_23_CONFIG.startZ, STAIR_23_CONFIG.lengthX, STAIR_23_CONFIG.lengthZ, 23); 

// その他の1階壁
addWallRect(5, 25, 2, 10, 1);

// 指定マスにおける階段ステップの正確な高さを計算するヘルパー関数
function getStepHeight(gx, gz, type) {
    if (type === 12) {
        // 開始地点から終了地点の長さにおける進捗度（0.0 〜 1.0）
        const progress = Math.max(0, Math.min(1, (gx - STAIR_12_CONFIG.startX) / STAIR_12_CONFIG.lengthX));
        const stepIndex = Math.floor(progress * STAIR_12_CONFIG.steps);
        return H_1F + (stepIndex / STAIR_12_CONFIG.steps) * (H_2F - H_1F); // 各段差のステップ高
    }
    if (type === 23) {
        const progress = Math.max(0, Math.min(1, (gz - STAIR_23_CONFIG.startZ) / STAIR_23_CONFIG.lengthZ));
        const stepIndex = Math.floor(progress * STAIR_23_CONFIG.steps);
        return H_2F + (stepIndex / STAIR_23_CONFIG.steps) * (H_3F - H_2F); // 各段差のステップ高
    }
    return 0;
}

// マスごとの基準高さを算出するヘルパー関数 (指定階層 floor を考慮した足元の高さを返す)
function getGridHeightValueForFloor(gx, gz, floor) {
    if (gx < 0 || gx >= GRID_WIDTH || gz < 0 || gz >= GRID_HEIGHT) return 0;
    const val = WORLD_MAP[gz][gx];
    if (val === 1) return H_1F; // 壁は侵入不可（基準は地上と同じ）
    
    if (floor === 1) {
        // 1階にいる場合、2階床(2)や3階床(3)、階段23(23)の下は1階の床(0.0)として自由に通れる
        if (val === 2 || val === 3 || val === 23) return H_1F;
        if (val === 12) return getStepHeight(gx, gz, 12);
        return H_1F;
    }
    
    if (floor === 2) {
        // 2階にいる場合、2階床(2)は高さH_2F。他の床(1階床や3階床)は落下・侵入不可
        if (val === 2) return H_2F;
        if (val === 12) return getStepHeight(gx, gz, 12);
        if (val === 23) return getStepHeight(gx, gz, 23);
        return H_1F; // 崖
    }
    
    if (floor === 3) {
        // 3階にいる場合、3階床(3)は高さH_3F
        if (val === 3) return H_3F;
        if (val === 23) return getStepHeight(gx, gz, 23);
        return H_1F; // 崖
    }
    
    return H_1F;
}

// 座標(実数値)から高さを精密に取得する関数 (特定階層を基準にする)
function getTargetYForFloor(x, z, floor) {
    const gx = Math.floor(x / TILE_SIZE);
    const gz = Math.floor(z / TILE_SIZE);
    const val = WORLD_MAP[gz][gx];
    
    // 階段エリアにいるときは実座標の進捗から現在のステップ段差高さを精密に計算
    // ただし、現在いる階層（floor）で利用可能な階段のみ高さを適用する
    if (val === 12) {
        if (floor === 1 || floor === 2) {
            const startXReal = STAIR_12_CONFIG.startX * TILE_SIZE;
            const totalLength = STAIR_12_CONFIG.lengthX * TILE_SIZE;
            const progress = Math.max(0, Math.min(1, (x - startXReal) / totalLength));
            const stepIndex = Math.floor(progress * STAIR_12_CONFIG.steps);
            return H_1F + (stepIndex / STAIR_12_CONFIG.steps) * (H_2F - H_1F);
        }
    }
    if (val === 23) {
        if (floor === 2 || floor === 3) {
            const startZReal = STAIR_23_CONFIG.startZ * TILE_SIZE;
            const totalLength = STAIR_23_CONFIG.lengthZ * TILE_SIZE;
            const progress = Math.max(0, Math.min(1, (z - startZReal) / totalLength));
            const stepIndex = Math.floor(progress * STAIR_23_CONFIG.steps);
            return H_2F + (stepIndex / STAIR_23_CONFIG.steps) * (H_3F - H_2F);
        }
    }
    
    return getGridHeightValueForFloor(gx, gz, floor);
}

// 現在のプレイヤーがいる物理的な高さを参照し、実質的な階層(1, 2, 3)を取得する関数
function getPlayerFloor() {
    const x = player.mesh.position.x;
    const z = player.mesh.position.z;
    const y = player.mesh.position.y;
    const gx = Math.floor(x / TILE_SIZE);
    const gz = Math.floor(z / TILE_SIZE);
    const val = WORLD_MAP[gz]?.[gx] || 0;

    // 1階➔2階への階段を登っている最中の判定
    if (val === 12) {
        const startXReal = STAIR_12_CONFIG.startX * TILE_SIZE;
        const totalLength = STAIR_12_CONFIG.lengthX * TILE_SIZE;
        const progress = (x - startXReal) / totalLength;
        
        // 階段を85%以上登るか、高さが2階の高さにかなり近くなったら「2階」判定に切り替え
        if (progress > 0.85 || y >= H_2F * 0.8) {
            return 2;
        }
        return 1;
    }

    // 2階➔3階への階段を登っている最中の判定
    if (val === 23) {
        // プレイヤーの物理的な高さが、すでに2階フロアに近い（y >= H_2F - 1.0）場合のみ、階段23の昇降処理を行う
        if (y >= H_2F - 1.0) {
            const startZReal = STAIR_23_CONFIG.startZ * TILE_SIZE;
            const totalLength = STAIR_23_CONFIG.lengthZ * TILE_SIZE;
            const progress = (z - startZReal) / totalLength;
            
            // 階段を85%以上登るか、高さが3階の高さにかなり近くなったら「3階」判定に切り替え
            if (progress > 0.85 || y >= H_2F + (H_3F - H_2F) * 0.8) {
                return 3;
            }
            return 2;
        } else {
            // プレイヤーの高さが明らかに1階を歩いているレベルなら、階段23のマスにいても「1階の床下」にいるものとみなす
            return 1;
        }
    }

    // 通常の床の上での判定
    // 現在のマスが「2」であっても、プレイヤーの物理的な高さ(y)が2階の高さにかなり近くない(y < H_2F - 1.0)場合は、「1階の床下(1F)」にいると判定
    if (val === 2) {
        if (y >= H_2F - 1.0) return 2;
        return 1;
    }
    // 現在のマスが「3」であっても、プレイヤーの物理的な高さ(y)が3階の高さにかなり近くない場合は、登り切っていないため下の階と判定
    if (val === 3) {
        if (y >= H_3F - 1.0) return 3;
        if (y >= H_2F - 1.0) return 2;
        return 1;
    }

    // 落下時やそれ以外の特殊エリアでの安全用物理高さ判定
    if (y < H_2F - 0.5 + 0.8) return 1;
    if (y < H_3F - 0.5 + 0.8) return 2;
    return 3;
}

// 敵の高さから現在の巡回階層を取得する関数 (1, 2, 3)
function getEnemyFloor(enemyY) {
    const baseHeight = enemyY - 1.0; // 敵モデルの足元の高さ
    if (baseHeight < H_2F - 0.5) return 1;
    if (baseHeight >= H_2F - 0.5 && baseHeight < H_3F - 0.5) return 2;
    return 3;
}

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x050508);
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

scene.add(new THREE.AmbientLight(0x404040, 1.2));
const dirLight = new THREE.DirectionalLight(0xffffff, 0.6);
dirLight.position.set(10, 20, 10);
scene.add(dirLight);

// A* 経路探索 (高低差も考慮：特定階層 floor に従う)
function findPath(startGrid, endGrid, floor) {
    if (startGrid.x === endGrid.x && startGrid.z === endGrid.z) return [];
    const openList = [];
    const closedSet = new Set();
    const startNode = { x: startGrid.x, z: startGrid.z, g: 0, h: Math.abs(startGrid.x - endGrid.x) + Math.abs(startGrid.z - endGrid.z), parent: null };
    startNode.f = startNode.g + startNode.h;
    openList.push(startNode);
    let iterations = 0;
    while (openList.length > 0 && iterations++ < 500) {
        let currentIdx = 0;
        for (let i = 1; i < openList.length; i++) if (openList[i].f < openList[currentIdx].f) currentIdx = i;
        const current = openList[currentIdx];
        if (current.x === endGrid.x && current.z === endGrid.z) {
            const path = []; let temp = current;
            while (temp) { path.push({ x: temp.x, z: temp.z }); temp = temp.parent; }
            return path.reverse();
        }
        openList.splice(currentIdx, 1);
        closedSet.add(`${current.x},${current.z}`);
        const neighbors = [{x: 0, z: 1}, {x: 0, z: -1}, {x: 1, z: 0}, {x: -1, z: 0}];
        for (const neighbor of neighbors) {
            const nx = current.x + neighbor.x, nz = current.z + neighbor.z;
            if (nx < 0 || nx >= GRID_WIDTH || nz < 0 || nz >= GRID_HEIGHT || WORLD_MAP[nz][nx] === 1 || closedSet.has(`${nx},${nz}`)) continue;
            
            // 自分の階層に応じた高低差の確認
            const currentHeight = getGridHeightValueForFloor(current.x, current.z, floor);
            const neighborHeight = getGridHeightValueForFloor(nx, nz, floor);
            
            const stepLimit = (WORLD_MAP[nz][nx] === 23 || WORLD_MAP[current.z][current.x] === 23) ? LIMIT_STEP_23 : LIMIT_STEP_12;
            let canPass = Math.abs(currentHeight - neighborHeight) <= stepLimit;
            if (!canPass) continue;

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
    return [];
}

// 壁当たり判定 (高低差も考慮：段差を乗り越えられない壁として判定する)
function checkWallCollision(x, z, radius, currentY, floor) {
    const gx = Math.floor(x / TILE_SIZE), gz = Math.floor(z / TILE_SIZE);
    if (gx < 0 || gx >= GRID_WIDTH || gz < 0 || gz >= GRID_HEIGHT) return true;
    
    const tileType = WORLD_MAP[gz][gx];
    
    // 1階にいるとき
    if (floor === 1) {
        if (tileType === 1) return true; // 通常の壁は衝突
        if (tileType === 12) { 
            const targetFloorHeight = getGridHeightValueForFloor(gx, gz, floor);
            const heightDiff = Math.abs(targetFloorHeight - currentY);
            if (heightDiff > LIMIT_STEP_12) return true;
        }
        // 2階床、3階床、階段23は頭上の天井なので1階では完全にすり抜けて通行可能
        return false;
    }
    
    // 2階にいるとき
    if (floor === 2) {
        if (tileType === 1) return true;
        if (tileType === 2) return false; // 2階の床は歩行可能
        if (tileType === 12 || tileType === 23) { // 階段
            const targetFloorHeight = getGridHeightValueForFloor(gx, gz, floor);
            const heightDiff = Math.abs(targetFloorHeight - currentY);
            const stepLimit = (tileType === 23) ? LIMIT_STEP_23 : LIMIT_STEP_12;
            if (heightDiff > stepLimit) return true;
            return false;
        }
        // 1階床(0)や3階床(3)は、2階から見ると崖または天井のため侵入不可(衝突)
        return true;
    }
    
    // 3階にいるとき
    if (floor === 3) {
        if (tileType === 1) return true;
        if (tileType === 3) return false; // 3階床
        if (tileType === 23) { // 階段
            const targetFloorHeight = getGridHeightValueForFloor(gx, gz, floor);
            const heightDiff = Math.abs(targetFloorHeight - currentY);
            if (heightDiff > LIMIT_STEP_23) return true;
            return false;
        }
        return true; // その他は崖
    }
    
    return false;
}

const keys = {};
window.addEventListener('keydown', e => keys[e.code] = true);
window.addEventListener('keyup', e => keys[e.code] = false);

const joystickContainer = document.getElementById('joystick-container');
const joystickKnob = document.getElementById('joystick-knob');
let stickInput = { x: 0, y: 0, active: false };
if ('ontouchstart' in window) {
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

// メッシュマテリアル設定
const wallMat = new THREE.MeshPhongMaterial({ color: 0x1a1a25 });
const floor2Mat = new THREE.MeshPhongMaterial({ color: 0x2c2c3e, roughness: 0.8 });
const floor3Mat = new THREE.MeshPhongMaterial({ color: 0x3d3d5c, roughness: 0.7 });
const stairMat = new THREE.MeshPhongMaterial({ color: 0x223344 });

const wallObjects = [];

// 3Dマップの構築
for(let z=0; z<GRID_HEIGHT; z++) {
    for(let x=0; x<GRID_WIDTH; x++) {
        const type = WORLD_MAP[z][x];
        
        if (type === 1) {
            // 通常の壁（1階の床からそびえ立つ壁）
            const wall = new THREE.Mesh(new THREE.BoxGeometry(TILE_SIZE, TILE_SIZE * 1.5, TILE_SIZE), wallMat);
            wall.position.set(x * TILE_SIZE + TILE_SIZE/2, TILE_SIZE * 0.75, z * TILE_SIZE + TILE_SIZE/2);
            wall.userData = { floor: 1 }; // 1Fのオブジェクト
            scene.add(wall);
            wallObjects.push(wall);
        } else if (type === 2) {
            // 2階フロアの床プレート (厚み0.2の薄いプレートを高さ H_2F の直下に配置。これで床下が通れます)
            const floorThickness = 0.2;
            const floor2 = new THREE.Mesh(new THREE.BoxGeometry(TILE_SIZE, floorThickness, TILE_SIZE), floor2Mat);
            floor2.position.set(x * TILE_SIZE + TILE_SIZE/2, H_2F - floorThickness / 2, z * TILE_SIZE + TILE_SIZE/2);
            floor2.userData = { floor: 2, isFloor: true }; // Floor 2 床フラグ
            scene.add(floor2);
            wallObjects.push(floor2); // 視界遮蔽用に登録
        } else if (type === 3) {
            // 3階フロアの床プレート (厚み0.2)
            const floorThickness = 0.2;
            const floor3 = new THREE.Mesh(new THREE.BoxGeometry(TILE_SIZE, floorThickness, TILE_SIZE), floor3Mat);
            floor3.position.set(x * TILE_SIZE + TILE_SIZE/2, H_3F - floorThickness / 2, z * TILE_SIZE + TILE_SIZE/2);
            floor3.userData = { floor: 3, isFloor: true }; // Floor 3 床フラグ
            scene.add(floor3);
            wallObjects.push(floor3); // 視界遮蔽用に登録
        }
    }
}

// ★ 1階から2階への緩やかなステップ階段 (段数 steps に基づく自動描画) ★
const stair12Width = STAIR_12_CONFIG.lengthZ * TILE_SIZE; 
const total12Length = STAIR_12_CONFIG.lengthX * TILE_SIZE; 
const step12Depth = total12Length / STAIR_12_CONFIG.steps; 
const startX12Real = STAIR_12_CONFIG.startX * TILE_SIZE;
const startZ12Real = STAIR_12_CONFIG.startZ * TILE_SIZE;

for (let i = 0; i < STAIR_12_CONFIG.steps; i++) {
    const h = H_1F + ((i + 1) / STAIR_12_CONFIG.steps) * (H_2F - H_1F);
    const step = new THREE.Mesh(new THREE.BoxGeometry(step12Depth, h, stair12Width), stairMat);
    const xPos = startX12Real + (i * step12Depth) + (step12Depth / 2);
    const zPos = startZ12Real + (stair12Width / 2);
    step.position.set(xPos, h / 2, zPos);
    step.userData = { floor: 12 };
    scene.add(step);
    wallObjects.push(step);
}

// ★ 2階から3階への緩やかなステップ階段 (段数 steps に基づく自動描画) ★
const stair23Width = STAIR_23_CONFIG.lengthX * TILE_SIZE; 
const total23Length = STAIR_23_CONFIG.lengthZ * TILE_SIZE; 
const step23Depth = total23Length / STAIR_23_CONFIG.steps; 
const startX23Real = STAIR_23_CONFIG.startX * TILE_SIZE;
const startZ23Real = STAIR_23_CONFIG.startZ * TILE_SIZE;

for (let i = 0; i < STAIR_23_CONFIG.steps; i++) {
    const h = H_2F + ((i + 1) / STAIR_23_CONFIG.steps) * (H_3F - H_2F);
    const step = new THREE.Mesh(new THREE.BoxGeometry(stair23Width, h, step23Depth), stairMat);
    const xPos = startX23Real + (stair23Width / 2);
    const zPos = startZ23Real + (i * step23Depth) + (step23Depth / 2);
    step.position.set(xPos, h / 2, zPos);
    step.userData = { floor: 23 };
    scene.add(step);
    wallObjects.push(step);
}

// メインフロア（地上）の床
const floor = new THREE.Mesh(new THREE.PlaneGeometry(GRID_WIDTH*TILE_SIZE, GRID_HEIGHT*TILE_SIZE), new THREE.MeshPhongMaterial({ color: 0x0a0a0f }));
floor.rotation.x = -Math.PI/2; floor.position.set(GRID_WIDTH*TILE_SIZE/2, 0, GRID_HEIGHT*TILE_SIZE/2);
floor.userData = { floor: 1 }; // 1Fのオブジェクト
scene.add(floor);

class Player {
    constructor() {
        this.mesh = new THREE.Mesh(new THREE.SphereGeometry(0.8, 16, 16), new THREE.MeshPhongMaterial({ color: 0x00f2ff, emissive: 0x00f2ff, emissiveIntensity: 0.4 }));
        this.reset();
        scene.add(this.mesh);
        this.speed = 0.35;
    }
    reset() {
        this.mesh.position.set(TILE_SIZE * 2.5, 0.8, TILE_SIZE * 2.5);
    }
    update() {
        const currentFloor = getPlayerFloor(); // プレイヤーの現在階層を取得

        let dx = 0, dz = 0;
        if (keys['KeyW'] || keys['ArrowUp']) dz -= 1; if (keys['KeyS'] || keys['ArrowDown']) dz += 1;
        if (keys['KeyA'] || keys['ArrowLeft']) dx -= 1; if (keys['KeyD'] || keys['ArrowRight']) dx += 1;
        if (stickInput.active) { dx = stickInput.x; dz = stickInput.y; }
        const mag = Math.sqrt(dx*dx + dz*dz);
        if (mag > 0.1) {
            const moveX = (dx/mag) * this.speed, moveZ = (dz/mag) * this.speed;
            const currentBaseY = getTargetYForFloor(this.mesh.position.x, this.mesh.position.z, currentFloor);
            
            if (!checkWallCollision(this.mesh.position.x + moveX, this.mesh.position.z, PLAYER_RADIUS, currentBaseY, currentFloor)) this.mesh.position.x += moveX;
            if (!checkWallCollision(this.mesh.position.x, this.mesh.position.z + moveZ, PLAYER_RADIUS, currentBaseY, currentFloor)) this.mesh.position.z += moveZ;
        }

        // 現在の階層に適したステップ高さを算出し、補間(lerp)で滑らかに上下動
        const targetY = getTargetYForFloor(this.mesh.position.x, this.mesh.position.z, currentFloor) + 0.8; // 半径オフセット
        this.mesh.position.y += (targetY - this.mesh.position.y) * 0.2; 
    }
}

class Enemy {
    constructor(x, z, color, dist, angleFov, speed, id, patrolFloor) {
        this.id = id;
        this.patrolFloor = patrolFloor; // この敵が巡回すべき階層 (1, 2, 3)
        this.startPos = { x, z };
        this.mesh = new THREE.Mesh(new THREE.BoxGeometry(1.2, 2, 1.8), new THREE.MeshPhongMaterial({ color: color }));
        
        // 初期の高さを指定された階層に合わせる
        let startY = 1.0;
        if (patrolFloor === 2) startY = H_2F + 1.0;
        if (patrolFloor === 3) startY = H_3F + 1.0;
        this.mesh.position.set(x, startY, z);
        
        scene.add(this.mesh);
        this.config = { viewDist: dist, viewAngle: angleFov, speed: speed };
        this.angle = 0; this.state = 'patrol'; this.path = []; this.pathTimer = 0; this.search = false;
        this.losTimer = 0;
        this.vision = new THREE.Mesh(new THREE.CircleGeometry(dist, 24, -angleFov/2, angleFov), new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.15, side: THREE.DoubleSide }));
        this.vision.rotation.x = -Math.PI / 2;
        scene.add(this.vision);
    }
    reset() {
        let startY = 1.0;
        if (this.patrolFloor === 2) startY = H_2F + 1.0;
        if (this.patrolFloor === 3) startY = H_3F + 1.0;
        this.mesh.position.set(this.startPos.x, startY, this.startPos.z);
        this.state = 'patrol';
        this.path = [];
        this.losTimer = 0;
    }
    update(player, deltaTime) {
        const enemyPos = this.mesh.position;
        const playerPos = player.mesh.position;
        const distToPlayer = enemyPos.distanceTo(playerPos);
        
        // 階層に基づいた追跡制御 (階層が完全に一致する場合のみ追跡可能とする)
        const playerFloor = getPlayerFloor();
        const enemyFloor = getEnemyFloor(enemyPos.y);
        
        const dirToPlayer = new THREE.Vector3().subVectors(playerPos, enemyPos).normalize();
        const currentDir = new THREE.Vector3(Math.cos(this.angle), 0, Math.sin(this.angle));
        const angleToPlayer = currentDir.angleTo(dirToPlayer);
        
        const ray = new THREE.Raycaster(enemyPos, dirToPlayer, 0, distToPlayer);
        const wallIntersects = ray.intersectObjects(wallObjects);
        const isBlockedByWall = wallIntersects.length > 0;
        
        // 階層が一致していて、かつ視界が通っている場合のみ発見できる
        const isVisible = (playerFloor === enemyFloor) && !isBlockedByWall && distToPlayer < this.config.viewDist && angleToPlayer < this.config.viewAngle/2;

        if (this.state === 'patrol') {
            this.vision.material.color.setHex(0xffffff);
            this.losTimer = 0;
            if (isVisible) this.state = 'chasing';
            
            if (this.path.length === 0) {
                let tx, tz;
                let found = false;
                for (let attempt = 0; attempt < 100; attempt++) {
                    tx = Math.floor(2 + Math.random() * 36);
                    tz = Math.floor(2 + Math.random() * 36);
                    const tileType = WORLD_MAP[tz][tx];
                    
                    // 1階の敵は、2階(2)や3階(3)のタイルの下でも、1階床(0)なので通行可能
                    if (this.patrolFloor === 1 && (tileType === 0 || tileType === 2 || tileType === 3)) { found = true; break; }
                    if (this.patrolFloor === 2 && tileType === 2) { found = true; break; }
                    if (this.patrolFloor === 3 && tileType === 3) { found = true; break; }
                }
                if (found) {
                    this.path = findPath({x: Math.floor(enemyPos.x/TILE_SIZE), z: Math.floor(enemyPos.z/TILE_SIZE)}, {x: tx, z: tz}, this.patrolFloor);
                }
            }
        } else if (this.state === 'chasing') {
            this.vision.material.color.setHex(0xff3333);
            this.search = false;
            const maxChaseDist = this.config.viewDist * 2;
            
            // プレイヤーが別階層に逃げた場合
            if (distToPlayer > maxChaseDist || playerFloor !== enemyFloor) {
                this.state = 'Searching'; this.path = []; this.losTimer = 0;
            } else if (isBlockedByWall) {
                this.losTimer += deltaTime;
                if (this.losTimer >= LOS_TIMEOUT_MS) {
                    this.state = 'Searching'; this.path = []; this.losTimer = 0;
                }
            } else {
                this.losTimer = 0;
            }
            if (this.pathTimer++ > 20) {
                this.path = findPath({x: Math.floor(enemyPos.x/TILE_SIZE), z: Math.floor(enemyPos.z/TILE_SIZE)}, {x: Math.floor(playerPos.x/TILE_SIZE), z: Math.floor(playerPos.z/TILE_SIZE)}, this.patrolFloor);
                this.pathTimer = 0;
            }
        } else if (this.state === 'Searching'){
            this.vision.material.color.setHex(0xFFFF00);
            if (isVisible) this.state = 'chasing';
            if (!this.search) {
                this.path = findPath({x: Math.floor(enemyPos.x/TILE_SIZE), z: Math.floor(enemyPos.z/TILE_SIZE)}, {x: Math.floor(playerPos.x/TILE_SIZE), z: Math.floor(playerPos.z/TILE_SIZE)}, this.patrolFloor);
                this.search = true;
            }
        }

        let targetPos = null;
        if (this.state === 'chasing' && distToPlayer < TILE_SIZE * 1.5) {
            targetPos = playerPos;
        } else if (this.path && this.path.length > 0) {
            const currentGridX = Math.floor(enemyPos.x / TILE_SIZE), 
                currentGridZ = Math.floor(enemyPos.z / TILE_SIZE);

            if (this.path[0].x === currentGridX && this.path[0].z === currentGridZ) {
                this.path.shift(); // 先頭を削除
                if (this.path.length === 0) {
                    this.search = false;
                    if (this.state === 'Searching') {
                        this.state = 'patrol';
                    }
                }
            }
            if (this.path.length > 0) {
                targetPos = new THREE.Vector3(
                    this.path[0].x * TILE_SIZE + TILE_SIZE / 2, 
                    1, 
                    this.path[0].z * TILE_SIZE + TILE_SIZE / 2
                );
            }
        }

        if (targetPos) {
            const moveVec = new THREE.Vector3().subVectors(targetPos, enemyPos);
            const targetAngle = Math.atan2(moveVec.z, moveVec.x);
            let diff = targetAngle - this.angle;
            while(diff < -Math.PI) diff += Math.PI*2;
            while(diff > Math.PI) diff -= Math.PI*2;
            this.angle += diff * 0.1;
            if (Math.abs(diff) < 0.5) {
                const s = this.config.speed;
                enemyPos.x += Math.cos(this.angle) * s; enemyPos.z += Math.sin(this.angle) * s;
            }
        }
        
        // 巡回階層(this.patrolFloor)に適合したY座標
        const targetY = getTargetYForFloor(enemyPos.x, enemyPos.z, this.patrolFloor) + 1.0;
        enemyPos.y += (targetY - enemyPos.y) * 0.2;

        this.mesh.rotation.y = -this.angle;
        this.vision.position.set(enemyPos.x, enemyPos.y - 0.8, enemyPos.z);
        this.vision.rotation.z = -this.angle;

        return { id: this.id, losTimer: this.losTimer, state: this.state, dist: distToPlayer };
    }
}

const player = new Player();
const enemies = [
    new Enemy(TILE_SIZE * 28.5, TILE_SIZE * 27.5, 0xff3366, 20, Math.PI/3, 0.22, "Red", 3),       // 3F巡回
    new Enemy(TILE_SIZE * 25.5, TILE_SIZE * 25.5, 0x00ffaa, 18, Math.PI/1.5, 0.15, "Green", 2),   // 2F巡回
    new Enemy(TILE_SIZE * 15.5, TILE_SIZE * 5.5, 0xffcc00, 25, Math.PI*2, 0.12, "Yellow", 1)      // 1F巡回
];

const statusEl = document.getElementById('status');
const debugEl = document.getElementById('debug-info');
const msgOverlay = document.getElementById('msg-overlay');

let lastTime = performance.now();
let isGameOver = false;

function update(deltaTime) {
    if (isGameOver) return;

    player.update();
    let isChased = false;
    let debugText = "";
    const currentFloor = getPlayerFloor(); // プレイヤーの現在階層
    
    // 3Dオブジェクトの可視・不可視をプレイヤーの階層に同期させるシステム
    scene.traverse((obj) => {
        if (obj.userData && obj.userData.floor !== undefined) {
            const objFloor = obj.userData.floor;
            
            if (objFloor === currentFloor) {
                obj.visible = true; // 同じ階層の障害物・床を表示
            } else if (objFloor === 12 && (currentFloor === 1 || currentFloor === 2)) {
                obj.visible = true; // 1Fから2Fに繋がる階段は、1F・2F両方のとき表示
            } else if (objFloor === 23 && (currentFloor === 2 || currentFloor === 3)) {
                obj.visible = true; // 2Fから3Fに繋がる階段は、2F・3F両方のとき表示
            } else {
                obj.visible = false; // それ以外の階層は完全に非表示（見えないようにする）
            }
        }
    });

    for (const e of enemies) {
        const info = e.update(player, deltaTime);
        const enemyFloor = getEnemyFloor(e.mesh.position.y);
        const isSameFloor = (enemyFloor === currentFloor);

        // 敵とその視界表示を「同じ階層にいる場合のみ」見えるように設定
        e.mesh.visible = isSameFloor;
        e.vision.visible = isSameFloor;

        if (isSameFloor && info.state === 'chasing') {
            isChased = true;
            if (info.losTimer > 0) {
                const timeLeft = Math.max(0, (LOS_TIMEOUT_MS - info.losTimer) / 1000).toFixed(1);
                debugText += `${info.id}: ロストまで ${timeLeft}s<br>`;
            }
        }
        
        // 同じ階層にいる場合のみ、当たり判定（捕まる処理）を行う
        if (isSameFloor && info.dist < CAPTURE_DIST) {
            triggerGameOver();
        }
    }

    // statusEl.textContent = isChased ? "発見されました！" : "隠密中";
    // statusEl.className = isChased ? "detected" : "hidden";
    // debugEl.innerHTML = debugText;
}

function triggerGameOver() {
    isGameOver = true;
    msgOverlay.style.display = 'flex';
    setTimeout(() => {
        isGameOver = false;
        msgOverlay.style.display = 'none';
        player.reset();
        enemies.forEach(e => e.reset());
    }, 2000); // 2秒後に復活
}

function draw() {
    camera.position.set(player.mesh.position.x + CAM_OFFSET.x, player.mesh.position.y + CAM_OFFSET.y, player.mesh.position.z + CAM_OFFSET.z);
    camera.lookAt(player.mesh.position);
    renderer.render(scene, camera);
}

function loop() {
    const currentTime = performance.now();
    const deltaTime = currentTime - lastTime;
    lastTime = currentTime;
    update(deltaTime);
    draw();
    requestAnimationFrame(loop);
}

window.addEventListener('resize', () => { 
    camera.aspect = window.innerWidth/window.innerHeight; camera.updateProjectionMatrix(); renderer.setSize(window.innerWidth, window.innerHeight); 
});