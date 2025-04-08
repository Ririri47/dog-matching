// ゲームの状態を管理するオブジェクト
const gameState = {
    score: 0,
    lives: 3,
    level: 1,
    timeRemaining: 60,
    isPlaying: false,
    timer: null,
    matchedPairs: 0,
    totalPairs: 0
};

// 行動パターン
const moods = ['crying', 'searching', 'frozen'];

// 犬と飼い主のペアデータ
const characterPairs = [
    // レベル1のペア（明らかに似ているペア）
    {
        level: 1,
        owner: {
            name: '山田さん',
            description: 'マッチョなトレーナー',
            features: '筋肉質で活発、スポーツウェア着用、短髪',
            personality: '厳格だが情熱的',
            image: 'assets/images/owner-1.png', // 画像ファイルのパス
            color: '#8B4513'
        },
        dog: {
            name: 'ロッキー',
            breed: 'ドーベルマン',
            features: '筋肉質で引き締まった体、黒と茶色の被毛、スポーツ用の首輪',
            personality: '忠実で勇敢、活発',
            image: 'assets/images/dog-1.png', // 画像ファイルのパス
            color: '#000000'
        }
    },
    {
        level: 1,
        owner: {
            name: '佐藤さん',
            description: 'おしゃれな女性デザイナー',
            features: '20代後半、ピンク色の髪、おしゃれな服装、アクセサリー多め',
            personality: '明るく社交的、トレンドに敏感',
            image: 'assets/images/owner-2.png',
            color: '#FFB6C1'
        },
        dog: {
            name: 'ココ',
            breed: 'トイプードル',
            features: 'ピンク色のリボン付き首輪、ふわふわのカット、ネイルアート',
            personality: '甘えん坊でおしゃれ好き',
            image: 'assets/images/dog-2.png',
            color: '#FFC0CB'
        }
    },
    {
        level: 1,
        owner: {
            name: '鈴木さん',
            description: '元気なおじいさん',
            features: '70代、笑顔が素敵、和服が好き、杖を持っている',
            personality: '朗らかで優しい、伝統を大切にする',
            image: 'assets/images/owner-3.png',
            color: '#708090'
        },
        dog: {
            name: 'ポチ',
            breed: '柴犬',
            features: '日本伝統の和風首輪、手入れの行き届いた毛並み、少し年配',
            personality: '忠実で落ち着いた性格、主人に従順',
            image: 'assets/images/dog-3.png',
            color: '#D2691E'
        }
    },
    
    // レベル2のペア（少し微妙なペア）
    {
        level: 2,
        owner: {
            name: '田中さん',
            description: '真面目なサラリーマン',
            features: '40代、スーツ姿、眼鏡着用、整った髪型',
            personality: '責任感が強く、几帳面、計画的',
            image: 'assets/images/owner-4.png',
            color: '#000080'
        },
        dog: {
            name: 'レオ',
            breed: 'ラブラドール',
            features: 'シンプルな革の首輪、きちんとブラッシングされた毛並み、しつけが行き届いている',
            personality: '従順で賢く、冷静',
            image: 'assets/images/dog-4.png',
            color: '#DAA520'
        }
    },
    {
        level: 2,
        owner: {
            name: '伊藤さん',
            description: '活発な大学生',
            features: '20代前半、スポーツウェア、バックパック、元気な笑顔',
            personality: 'エネルギッシュで好奇心旺盛、新しいことに挑戦的',
            image: 'assets/images/owner-5.png',
            color: '#32CD32'
        },
        dog: {
            name: 'マックス',
            breed: 'ボーダーコリー',
            features: 'スポーティな首輪、常に動き回る、ボールを持っている',
            personality: '知的で活発、常に刺激を求める',
            image: 'assets/images/dog-5.png',
            color: '#000000'
        }
    },
    {
        level: 2,
        owner: {
            name: '渡辺さん',
            description: '優しいおばあさん',
            features: '80代、白髪、温かい笑顔、編み物が趣味',
            personality: '穏やかで思いやりがある、忍耐強い',
            image: 'assets/images/owner-6.png',
            color: '#B0C4DE'
        },
        dog: {
            name: 'モモ',
            breed: 'マルチーズ',
            features: '手編みのセーターを着ている、リボン付きの首輪、ふわふわの毛並み',
            personality: '穏やかでおとなしい、甘えん坊',
            image: 'assets/images/dog-6.png',
            color: '#FFFFFF'
        }
    },
    
    // レベル3のペア（意外な組み合わせ）
    {
        level: 3,
        owner: {
            name: '高橋さん',
            description: '小柄な女性アーティスト',
            features: '30代、小柄な体型、カラフルな服装、アート用品を持っている',
            personality: '創造的で繊細、内向的だが情熱的',
            image: 'assets/images/owner-7.png',
            color: '#9370DB'
        },
        dog: {
            name: 'タイタン',
            breed: 'グレートデーン',
            features: 'アート風のカラフルな首輪、体は大きいが優しい目、のんびりした動き',
            personality: '穏やかで優しい巨人、芸術的な感性を持つ',
            image: 'assets/images/dog-7.png',
            color: '#696969'
        }
    },
    {
        level: 3,
        owner: {
            name: '中村さん',
            description: '元ボクサーの男性',
            features: '50代、筋肉質、厳つい顔、タトゥーあり',
            personality: '外見は怖いが心は優しい、保護活動に熱心',
            image: 'assets/images/owner-8.png',
            color: '#8B0000'
        },
        dog: {
            name: 'プリン',
            breed: 'チワワ',
            features: 'ピンクのドレスを着ている、キラキラした首輪、小さいが自信に満ちた態度',
            personality: '小さいが勇敢、飼い主に非常に忠実',
            image: 'assets/images/dog-8.png',
            color: '#F5DEB3'
        }
    },
    {
        level: 3,
        owner: {
            name: '小林さん',
            description: 'おしゃれなカフェオーナー',
            features: '30代男性、スタイリッシュな服装、整った髭、コーヒーを持っている',
            personality: '落ち着いていて洗練されている、細部にこだわる',
            image: 'assets/images/owner-9.png',
            color: '#4682B4'
        },
        dog: {
            name: 'ブル',
            breed: 'ブルドッグ',
            features: 'おしゃれな蝶ネクタイ付き首輪、きれいにグルーミングされた毛並み、カフェで寝ている',
            personality: '落ち着いていて忍耐強い、人懐っこい',
            image: 'assets/images/dog-9.png',
            color: '#A52A2A'
        }
    }
];

// DOM要素の参照
const mapContainer = document.getElementById('map-container');
const scoreElement = document.getElementById('score');
const timeElement = document.getElementById('time');
const livesElement = document.getElementById('lives');
const levelElement = document.getElementById('level');
const gameMessageElement = document.getElementById('game-message');
const startButton = document.getElementById('start-button');
const nextLevelButton = document.getElementById('next-level');
const gameOverModal = document.getElementById('game-over');
const levelCompleteModal = document.getElementById('level-complete');
const tutorialModal = document.getElementById('tutorial');
const finalScoreElement = document.getElementById('final-score');
const finalLevelElement = document.getElementById('final-level');
const levelScoreElement = document.getElementById('level-score');
const restartButton = document.getElementById('restart-button');
const nextLevelModalButton = document.getElementById('next-level-button');
const tutorialCloseButton = document.getElementById('tutorial-close');

// 画像の代わりにカラーブロックを使用する関数
function createColorBlock(color) {
    const block = document.createElement('div');
    block.style.backgroundColor = color;
    block.style.width = '100%';
    block.style.height = '100%';
    block.style.borderRadius = '5px';
    return block;
}

// キャラクターの要素を作成する関数
function createCharacterElement(character, type, mood) {
    const element = document.createElement('div');
    element.className = `character ${type} ${mood}`;
    element.dataset.id = character.id;
    element.dataset.pairId = character.pairId;
    
    // 基本情報の表示
    const imageContainer = document.createElement('div');
    imageContainer.className = 'character-image';
    
    // 画像が存在する場合は画像を表示、存在しない場合はカラーブロックを表示
    if (character.image && character.image.startsWith('assets/')) {
        // 実際の画像を使用
        const img = document.createElement('img');
        img.src = character.image;
        img.alt = character.name;
        img.style.width = '100%';
        img.style.height = '100%';
        img.style.objectFit = 'cover';
        img.style.borderRadius = '5px';
        imageContainer.appendChild(img);
    } else {
        // 画像がない場合はカラーブロックを使用
        const colorBlock = createColorBlock(character.color);
        imageContainer.appendChild(colorBlock);
    }
    
    const nameElement = document.createElement('div');
    nameElement.className = 'character-name';
    nameElement.textContent = character.name;
    
    const moodElement = document.createElement('div');
    moodElement.className = 'character-mood';
    
    switch(mood) {
        case 'crying':
            moodElement.textContent = '泣いている';
            break;
        case 'searching':
            moodElement.textContent = '探している';
            break;
        case 'frozen':
            moodElement.textContent = '硬直している';
            break;
        case 'happy':
            moodElement.textContent = 'ニコニコしている';
            break;
    }
    
    // 詳細情報の表示（ホバー時に表示）
    const detailsElement = document.createElement('div');
    detailsElement.className = 'character-details';
    
    // タイトル（名前と説明）
    const titleElement = document.createElement('div');
    titleElement.className = 'details-title';
    titleElement.textContent = character.name;
    
    const descriptionElement = document.createElement('div');
    descriptionElement.className = 'details-description';
    descriptionElement.textContent = character.description;
    
    // 犬種（犬の場合のみ）
    if (type === 'dog' && character.breed) {
        const breedElement = document.createElement('div');
        breedElement.className = 'details-breed';
        breedElement.textContent = `犬種: ${character.breed}`;
        detailsElement.appendChild(breedElement);
    }
    
    // 特徴
    const featuresElement = document.createElement('div');
    featuresElement.className = 'details-features';
    featuresElement.textContent = `特徴: ${character.features}`;
    
    // 性格
    const personalityElement = document.createElement('div');
    personalityElement.className = 'details-personality';
    personalityElement.textContent = `性格: ${character.personality}`;
    
    // 行動パターン
    const moodDetailElement = document.createElement('div');
    moodDetailElement.className = 'details-mood';
    
    let moodText = '';
    switch(mood) {
        case 'crying':
            moodText = '現在の状態: 泣いている';
            break;
        case 'searching':
            moodText = '現在の状態: 探している';
            break;
        case 'frozen':
            moodText = '現在の状態: 硬直している';
            break;
        case 'happy':
            moodText = '現在の状態: ニコニコしている';
            break;
    }
    moodDetailElement.textContent = moodText;
    
    // 詳細情報を追加
    detailsElement.appendChild(titleElement);
    detailsElement.appendChild(descriptionElement);
    detailsElement.appendChild(featuresElement);
    detailsElement.appendChild(personalityElement);
    detailsElement.appendChild(moodDetailElement);
    
    // 基本要素を追加
    element.appendChild(imageContainer);
    element.appendChild(nameElement);
    element.appendChild(moodElement);
    
    // 詳細情報を追加
    element.appendChild(detailsElement);
    
    return element;
}

// 各レベルで表示するキャラクターペアの数
const pairsPerLevel = {
    1: 3, // レベル1では3ペア
    2: 4, // レベル2では4ペア
    3: 5  // レベル3では5ペア
};

// レベルに応じたキャラクターペアを取得する関数
function getCharactersForLevel(level) {
    // そのレベル以下のペアをフィルタリング
    const availablePairs = characterPairs.filter(pair => pair.level <= level);
    
    // レベルに応じた表示数を取得
    const pairsToShow = pairsPerLevel[level] || 3;
    
    // 表示数を制限（シャッフルしてからスライス）
    return shuffleArray([...availablePairs]).slice(0, pairsToShow);
}

// キャラクターをシャッフルする関数
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

// 配置済みのキャラクターの位置を記録する配列
const placedPositions = [];

// キャラクターをマップ上にランダムに配置する関数
function placeCharacterRandomly(element, margin = 20, minDistance = 150, maxAttempts = 50) {
    const mapRect = mapContainer.getBoundingClientRect();
    const elementWidth = 120; // キャラクターの幅
    const elementHeight = 150; // キャラクターの高さ
    
    // マップ内のランダムな位置を計算（マージンを考慮）
    const maxX = mapRect.width - elementWidth - margin * 2;
    const maxY = mapRect.height - elementHeight - margin * 2;
    
    let randomX, randomY;
    let attempts = 0;
    let validPosition = false;
    
    // 他のキャラクターと重ならない位置を見つける
    while (!validPosition && attempts < maxAttempts) {
        randomX = Math.floor(Math.random() * maxX) + margin;
        randomY = Math.floor(Math.random() * maxY) + margin;
        
        validPosition = true;
        
        // 既に配置されたキャラクターとの距離をチェック
        for (const pos of placedPositions) {
            const distance = Math.sqrt(
                Math.pow(randomX - pos.x, 2) + 
                Math.pow(randomY - pos.y, 2)
            );
            
            if (distance < minDistance) {
                validPosition = false;
                break;
            }
        }
        
        attempts++;
    }
    
    // 位置を設定
    element.style.left = `${randomX}px`;
    element.style.top = `${randomY}px`;
    
    // 配置した位置を記録
    placedPositions.push({ x: randomX, y: randomY });
}

// ゲームを初期化する関数
function initializeGame() {
    // コンテナをクリア
    mapContainer.innerHTML = '';
    
    // 配置済みの位置をリセット
    placedPositions.length = 0;
    
    // ゲーム状態をリセット
    gameState.matchedPairs = 0;
    
    // 現在のレベルに応じたキャラクターペアを取得
    const levelPairs = getCharactersForLevel(gameState.level);
    gameState.totalPairs = levelPairs.length;
    
    // 各ペアに一意のIDを割り当て
    const pairs = levelPairs.map((pair, index) => {
        const pairId = `pair-${index}`;
        
        // 飼い主データを拡張
        const owner = {
            ...pair.owner,
            id: `owner-${index}`,
            pairId: pairId
        };
        
        // 犬データを拡張
        const dog = {
            ...pair.dog,
            id: `dog-${index}`,
            pairId: pairId
        };
        
        return { owner, dog };
    });
    
    // すべてのキャラクターを1つの配列にまとめる
    const allCharacters = [];
    
    pairs.forEach(pair => {
        // ランダムな行動パターンを選択
        const randomMood = moods[Math.floor(Math.random() * moods.length)];
        
        // 飼い主と犬に同じ行動パターンを割り当てる
        const owner = { ...pair.owner, mood: randomMood };
        const dog = { ...pair.dog, mood: randomMood };
        
        allCharacters.push({ character: owner, type: 'owner' });
        allCharacters.push({ character: dog, type: 'dog' });
    });
    
    // キャラクターをシャッフル
    const shuffledCharacters = shuffleArray([...allCharacters]);
    
    // キャラクターをマップ上に配置
    shuffledCharacters.forEach(item => {
        const { character, type } = item;
        const element = createCharacterElement(character, type, character.mood);
        
        // マップにキャラクターを追加
        mapContainer.appendChild(element);
        
        // ランダムな位置に配置
        placeCharacterRandomly(element);
        
        // 犬の場合は選択可能にする
        if (type === 'dog') {
            makeSelectable(element);
        }
        // 飼い主の場合はクリックイベントを追加
        else if (type === 'owner') {
            // 既存のイベントリスナーを削除（重複防止）
            element.removeEventListener('click', ownerClickHandler);
            
            // 新しいイベントリスナーを追加
            element.addEventListener('click', ownerClickHandler);
        }
    });
    
    // UIを更新
    updateUI();
}

// UIを更新する関数
function updateUI() {
    scoreElement.textContent = gameState.score;
    timeElement.textContent = gameState.timeRemaining;
    livesElement.textContent = gameState.lives;
    levelElement.textContent = gameState.level;
}

// タイマーを開始する関数
function startTimer() {
    clearInterval(gameState.timer);
    
    gameState.timer = setInterval(() => {
        gameState.timeRemaining--;
        timeElement.textContent = gameState.timeRemaining;
        
        if (gameState.timeRemaining <= 0) {
            endGame(false);
        }
    }, 1000);
}

// ゲームを開始する関数
function startGame() {
    gameState.isPlaying = true;
    gameState.timeRemaining = 60 + (gameState.level - 1) * 15; // レベルに応じて時間を増やす
    
    initializeGame();
    startTimer();
    
    startButton.disabled = true;
    nextLevelButton.disabled = true;
    
    // チュートリアルを非表示
    tutorialModal.style.display = 'none';
}

// ゲームを終了する関数
function endGame(isLevelComplete) {
    clearInterval(gameState.timer);
    gameState.isPlaying = false;
    
    if (isLevelComplete) {
        // レベルクリア
        levelScoreElement.textContent = gameState.score;
        levelCompleteModal.style.display = 'flex';
    } else {
        // ゲームオーバー
        finalScoreElement.textContent = gameState.score;
        finalLevelElement.textContent = gameState.level;
        gameOverModal.style.display = 'flex';
    }
    
    startButton.disabled = false;
    nextLevelButton.disabled = !isLevelComplete;
}

// 次のレベルに進む関数
function goToNextLevel() {
    gameState.level++;
    levelCompleteModal.style.display = 'none';
    startGame();
}

// ゲームをリスタートする関数
function restartGame() {
    gameState.score = 0;
    gameState.lives = 3;
    gameState.level = 1;
    
    gameOverModal.style.display = 'none';
    startGame();
}

// 現在選択されている犬の要素
let selectedDog = null;

// 犬を選択可能にする関数
function makeSelectable(element) {
    console.log('犬を選択可能にしています:', element);
    
    // 既存のイベントリスナーを削除（重複防止）
    element.removeEventListener('click', dogClickHandler);
    
    // 新しいイベントリスナーを追加
    element.addEventListener('click', dogClickHandler);
}

// 犬のクリックハンドラー
function dogClickHandler(e) {
    console.log('犬がクリックされました');
    
    // イベントの伝播を停止
    e.stopPropagation();
    
    const dogElement = e.currentTarget;
    
    // すでにマッチングしている犬は選択できない
    if (dogElement.classList.contains('matched')) {
        console.log('すでにマッチングしている犬です - 無視します');
        return;
    }
    
    // 現在選択されている犬があれば選択を解除
    if (selectedDog) {
        console.log('以前の選択を解除します:', selectedDog.dataset.id);
        selectedDog.classList.remove('selected');
    }
    
    // 同じ犬をクリックした場合は選択解除
    if (selectedDog === dogElement) {
        console.log('同じ犬をクリックしました - 選択解除します');
        selectedDog = null;
        return;
    }
    
    // 新しい犬を選択
    selectedDog = dogElement;
    dogElement.classList.add('selected');
    console.log('新しい犬を選択しました:', selectedDog.dataset.id);
}

// 飼い主のクリックハンドラー
function ownerClickHandler(e) {
    console.log('飼い主がクリックされました');
    
    // イベントの伝播を停止
    e.stopPropagation();
    
    const ownerElement = e.currentTarget;
    
    // 犬が選択されていて、飼い主がクリックされた場合
    if (selectedDog) {
        console.log('マッチングをチェックします:', selectedDog.dataset.id, ownerElement.dataset.id);
        
        // マッチングをチェック
        checkMatch(selectedDog, ownerElement);
        
        // 選択状態をリセット
        selectedDog.classList.remove('selected');
        selectedDog = null;
    } else {
        console.log('犬が選択されていません');
    }
}

// マップ上のクリックイベントを設定
mapContainer.addEventListener('click', (e) => {
    console.log('マップがクリックされました');
});

// マッチングをチェックする関数
function checkMatch(dogElement, ownerElement) {
    const dogPairId = dogElement.dataset.pairId;
    const ownerPairId = ownerElement.dataset.pairId;
    
    if (dogPairId === ownerPairId) {
        // 正解
        dogElement.classList.add('matched');
        ownerElement.classList.add('matched');
        
        // 犬を飼い主のそばに移動
        moveDogToOwner(dogElement, ownerElement);
        
        // スコアを加算（レベルに応じてボーナス）
        const basePoints = 100;
        const levelBonus = gameState.level * 50;
        const timeBonus = Math.floor(gameState.timeRemaining / 5);
        const points = basePoints + levelBonus + timeBonus;
        
        gameState.score += points;
        
        // マッチしたペアをカウント
        gameState.matchedPairs++;
        
        // メッセージを表示
        gameMessageElement.textContent = `正解！ +${points}ポイント`;
        gameMessageElement.style.color = '#4caf50';
        
        // すべてのペアがマッチしたかチェック
        if (gameState.matchedPairs >= gameState.totalPairs) {
            // 少し待ってからレベルクリアを表示
            setTimeout(() => {
                endGame(true);
            }, 1500);
        }
    } else {
        // 不正解
        gameState.lives--;
        
        // メッセージを表示
        gameMessageElement.textContent = '不正解！ ライフ-1';
        gameMessageElement.style.color = '#f44336';
        
        // ライフがなくなったらゲームオーバー
        if (gameState.lives <= 0) {
            setTimeout(() => {
                endGame(false);
            }, 1000);
        }
    }
    
    // UIを更新
    updateUI();
    
    // メッセージを一定時間後に消す
    setTimeout(() => {
        gameMessageElement.textContent = '';
    }, 2000);
}

// 犬を飼い主のそばに移動させる関数
function moveDogToOwner(dogElement, ownerElement) {
    // 飼い主の位置を取得
    const ownerRect = ownerElement.getBoundingClientRect();
    const mapRect = mapContainer.getBoundingClientRect();
    
    // 飼い主の左側に配置する位置を計算
    const newLeft = (ownerRect.left - mapRect.left) - 130; // 飼い主の左側に配置
    const newTop = ownerRect.top - mapRect.top; // 同じ高さに配置
    
    // 移動前の位置を保存
    const originalLeft = parseFloat(dogElement.style.left);
    const originalTop = parseFloat(dogElement.style.top);
    
    // 移動アニメーションのためのクラスを追加
    dogElement.classList.add('moving');
    
    // 移動アニメーションを設定
    dogElement.style.transition = 'left 0.8s ease-in-out, top 0.8s ease-in-out';
    
    // 新しい位置に移動
    dogElement.style.left = `${newLeft}px`;
    dogElement.style.top = `${newTop}px`;
    
    // アニメーション完了後に行動パターンを「ニコニコ」に変更
    setTimeout(() => {
        // 移動アニメーションのクラスを削除
        dogElement.classList.remove('moving');
        
        // 行動パターンを「ニコニコ」に変更
        changeToHappyState(dogElement);
        changeToHappyState(ownerElement);
        
        // 移動が完了したことをコンソールに表示
        console.log('犬が飼い主のそばに移動しました');
    }, 800); // アニメーションの時間と同じ
}

// キャラクターの状態を「ニコニコ」に変更する関数
function changeToHappyState(element) {
    // 現在の行動パターンのクラスを削除
    element.classList.remove('crying', 'searching', 'frozen');
    
    // 「ニコニコ」クラスを追加
    element.classList.add('happy');
    
    // 表示テキストを変更
    const moodElement = element.querySelector('.character-mood');
    if (moodElement) {
        moodElement.textContent = 'ニコニコしている';
    }
    
    // 詳細情報の行動パターンも更新
    const moodDetailElement = element.querySelector('.details-mood');
    if (moodDetailElement) {
        moodDetailElement.textContent = '現在の状態: ニコニコしている';
    }
}

// イベントリスナーの設定
document.addEventListener('DOMContentLoaded', () => {
    // チュートリアルを表示
    tutorialModal.style.display = 'flex';
    
    // スタートボタン
    startButton.addEventListener('click', startGame);
    
    // 次のレベルボタン
    nextLevelButton.addEventListener('click', goToNextLevel);
    nextLevelModalButton.addEventListener('click', goToNextLevel);
    
    // リスタートボタン
    restartButton.addEventListener('click', restartGame);
    
    // チュートリアルを閉じるボタン
    tutorialCloseButton.addEventListener('click', startGame);
});
