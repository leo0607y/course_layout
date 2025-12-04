const canvas = document.getElementById('courseField');
const ctx = canvas.getContext('2d');

// 1枚の板のサイズ: 900mm × 1350mm
const BOARD_WIDTH = 900;
const BOARD_HEIGHT = 1350;

let horizontalCount = 1;
let verticalCount = 1;
let startPoint = null; // STARTポイント {x, y}
let goalPoint = null; // GOALポイント {x, y}

// 盤面を描画
function drawField() {
    // キャンバスサイズを更新
    const totalWidth = BOARD_WIDTH * horizontalCount;
    const totalHeight = BOARD_HEIGHT * verticalCount;
    canvas.width = totalWidth;
    canvas.height = totalHeight;

    // 背景を白で塗りつぶし
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, totalWidth, totalHeight);

    // 座標グリッド線を描画（薄い色）
    drawCoordinateGrid(totalWidth, totalHeight);

    // 各板を描画
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 2;

    for (let row = 0; row < verticalCount; row++) {
        for (let col = 0; col < horizontalCount; col++) {
            const x = col * BOARD_WIDTH;
            const y = row * BOARD_HEIGHT;
            ctx.strokeRect(x, y, BOARD_WIDTH, BOARD_HEIGHT);
        }
    }

    // STARTポイントを描画
    if (startPoint) {
        drawStartPoint(startPoint.x, startPoint.y, totalHeight);
    }

    // GOALポイントを描画
    if (goalPoint) {
        drawGoalPoint(goalPoint.x, goalPoint.y, totalHeight);
    }

    // キャンバスのスタイルを更新してスクロールなしで表示
    updateCanvasScale();
}

// STARTポイントを描画
function drawStartPoint(x, y, totalHeight) {
    // 左下を(0,0)とするため、Y座標を反転
    const canvasY = totalHeight - y;

    // 赤い丸を描画
    ctx.fillStyle = '#ff0000';
    ctx.beginPath();
    ctx.arc(x, canvasY, 15, 0, Math.PI * 2);
    ctx.fill();

    // "START"テキストを描画
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 10px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('START', x, canvasY);
}

// GOALポイントを描画
function drawGoalPoint(x, y, totalHeight) {
    // 左下を(0,0)とするため、Y座標を反転
    const canvasY = totalHeight - y;

    // 青い丸を描画
    ctx.fillStyle = '#0000ff';
    ctx.beginPath();
    ctx.arc(x, canvasY, 15, 0, Math.PI * 2);
    ctx.fill();

    // "GOAL"テキストを描画
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 10px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('GOAL', x, canvasY);
}

// 座標グリッドを描画（左下を(0,0)とする）
function drawCoordinateGrid(totalWidth, totalHeight) {
    ctx.strokeStyle = '#e0e0e0';
    ctx.lineWidth = 1;
    ctx.fillStyle = '#999999';
    ctx.font = '12px Arial';

    const gridSpacing = 100; // 100mm間隔

    // 縦線とX座標ラベル
    for (let x = 0; x <= totalWidth; x += gridSpacing) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, totalHeight);
        ctx.stroke();

        // X座標ラベル（下部に表示）
        ctx.fillText(x.toString(), x + 2, totalHeight - 5);
    }

    // 横線とY座標ラベル
    for (let y = 0; y <= totalHeight; y += gridSpacing) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(totalWidth, y);
        ctx.stroke();

        // Y座標ラベル（左下を0とするため、反転）
        const yCoord = totalHeight - y;
        ctx.fillText(yCoord.toString(), 2, y - 2);
    }
}

// キャンバスのスケールを自動調整
function updateCanvasScale() {
    const wrapper = document.querySelector('.field-wrapper');
    const wrapperWidth = wrapper.clientWidth - 40; // パディング分を引く
    const canvasWidth = canvas.width;
    const canvasHeight = canvas.height;

    // ラッパーの幅に合わせてスケール計算
    const scale = wrapperWidth / canvasWidth;

    // スケールを適用（CSSで自動的に調整されるため、明示的な設定は不要）
}

// 盤面サイズ変更のイベント
document.getElementById('horizontalCount').addEventListener('input', () => {
    horizontalCount = parseInt(document.getElementById('horizontalCount').value) || 1;
    updateGoalDirections();
    drawField();
});

document.getElementById('verticalCount').addEventListener('input', () => {
    verticalCount = parseInt(document.getElementById('verticalCount').value) || 1;
    updateGoalDirections();
    drawField();
});

// START座標変更のイベント
document.getElementById('startX').addEventListener('input', () => {
    const x = parseInt(document.getElementById('startX').value) || 0;
    const y = parseInt(document.getElementById('startY').value) || 0;
    startPoint = { x, y };
    updateGoalDirections();
    drawField();
});

document.getElementById('startY').addEventListener('input', () => {
    const x = parseInt(document.getElementById('startX').value) || 0;
    const y = parseInt(document.getElementById('startY').value) || 0;
    startPoint = { x, y };
    updateGoalDirections();
    drawField();
});

// GOAL方向のプルダウンを更新
function updateGoalDirections() {
    const select = document.getElementById('goalDirection');
    select.innerHTML = '<option value="">選択してください</option>';

    if (!startPoint) return;

    const totalWidth = BOARD_WIDTH * horizontalCount;
    const totalHeight = BOARD_HEIGHT * verticalCount;
    const DISTANCE = 1000; // 1000mm

    // 右側 (X軸正の方向)
    if (startPoint.x + DISTANCE <= totalWidth) {
        const option = document.createElement('option');
        option.value = 'right';
        option.textContent = `右側 (X: ${startPoint.x + DISTANCE}, Y: ${startPoint.y})`;
        select.appendChild(option);
    }

    // 左側 (X軸負の方向)
    if (startPoint.x - DISTANCE >= 0) {
        const option = document.createElement('option');
        option.value = 'left';
        option.textContent = `左側 (X: ${startPoint.x - DISTANCE}, Y: ${startPoint.y})`;
        select.appendChild(option);
    }

    // 上側 (Y軸正の方向)
    if (startPoint.y + DISTANCE <= totalHeight) {
        const option = document.createElement('option');
        option.value = 'up';
        option.textContent = `上側 (X: ${startPoint.x}, Y: ${startPoint.y + DISTANCE})`;
        select.appendChild(option);
    }

    // 下側 (Y軸負の方向)
    if (startPoint.y - DISTANCE >= 0) {
        const option = document.createElement('option');
        option.value = 'down';
        option.textContent = `下側 (X: ${startPoint.x}, Y: ${startPoint.y - DISTANCE})`;
        select.appendChild(option);
    }
}

// GOAL方向選択のイベント
document.getElementById('goalDirection').addEventListener('change', () => {
    const direction = document.getElementById('goalDirection').value;
    if (!direction || !startPoint) {
        goalPoint = null;
        drawField();
        return;
    }

    const DISTANCE = 1000;

    switch (direction) {
        case 'right':
            goalPoint = { x: startPoint.x + DISTANCE, y: startPoint.y };
            break;
        case 'left':
            goalPoint = { x: startPoint.x - DISTANCE, y: startPoint.y };
            break;
        case 'up':
            goalPoint = { x: startPoint.x, y: startPoint.y + DISTANCE };
            break;
        case 'down':
            goalPoint = { x: startPoint.x, y: startPoint.y - DISTANCE };
            break;
    }

    drawField();
});// 初期化
drawField();