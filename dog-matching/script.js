document.addEventListener('DOMContentLoaded', () => {
    // 画面の要素を取得
    const titleScreen = document.getElementById('title-screen');
    const gameScreen = document.getElementById('game-screen');
    const clearScreen = document.getElementById('clear-screen');
    const startBtn = document.getElementById('start-btn');
    const toTitleBtn = document.getElementById('to-title-btn');
    
    // スタートボタンのイベントリスナー
    startBtn.addEventListener('click', () => {
        titleScreen.classList.remove('active');
        gameScreen.classList.add('active');
        initGame(); // ゲームを初期化
    });
    
    // タイトルへ戻るボタンのイベントリスナー
    toTitleBtn.addEventListener('click', () => {
        clearScreen.classList.remove('active');
        titleScreen.classList.add('active');
        resetGameState(); // ゲームの状態をリセット
    });
    
    // ゲームの状態をリセット
    function resetGameState() {
        gameState.selectedPerson = null;
        gameState.selectedDog = null;
        gameState.connections = [];
        gameState.completedMatches = [];
        gameState.currentPage = 0;
        
        // 配列をシャッフル
        shuffleArray(people);
    }
    // 配列をシャッフルする関数
    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    // ゲームの状態を管理するオブジェクト
    const gameState = {
        selectedPerson: null,
        selectedDog: null,
        connections: [],
        correctAnswers: {
            '真田広之': 'ドーベルマン',
            '北川景子': 'チワワ',
            '木村拓哉': 'ゴールデンレトリバー',
            '綾瀬はるか': 'トイプードル',
            '阿部寛': 'セントバーナード',
            '石原さとみ': 'ポメラニアン',
            '松本人志': 'ブルドッグ',
            '新垣結衣': 'シベリアンハスキー'
        },
        // 一度に表示する数
        displayCount: 3,
        // 現在のページ
        currentPage: 0,
        // 完了したマッチング
        completedMatches: []
    };

    // 飼い主データ
    const people = [
        { id: 'person1', name: '真田広之', image: 'images/sanada.jpg' },
        { id: 'person2', name: '北川景子', image: 'images/kitagawa.jpg' },
        { id: 'person3', name: '木村拓哉', image: 'images/kimura.jpg' },
        { id: 'person4', name: '綾瀬はるか', image: 'images/ayase.webp' },
        { id: 'person5', name: '阿部寛', image: 'images/abe.jpeg' },
        { id: 'person6', name: '石原さとみ', image: 'images/ishihara.jpg' },
        { id: 'person7', name: '松本人志', image: 'images/matsumoto.webp' },
        { id: 'person8', name: '新垣結衣', image: 'images/aragaki.jpg' }
    ];

    // 犬データ
    const dogs = [
        { id: 'dog1', name: 'ドーベルマン', image: 'images/doberman.jpg' },
        { id: 'dog2', name: 'チワワ', image: 'images/chihuahua.webp' },
        { id: 'dog3', name: 'ゴールデンレトリバー', image: 'images/golden.jpg' },
        { id: 'dog4', name: 'トイプードル', image: 'images/toypoodle.jpg' },
        { id: 'dog5', name: 'セントバーナード', image: 'images/stbernard.jpg' },
        { id: 'dog6', name: 'ポメラニアン', image: 'images/pomeranian.jpg' },
        { id: 'dog7', name: 'ブルドッグ', image: 'images/bulldog.jpeg' },
        { id: 'dog8', name: 'シベリアンハスキー', image: 'images/husky.jpg' }
    ];
    
    // 初期表示時に人物の配列をシャッフル
    shuffleArray(people);

    // DOM要素の取得
    const ownersContainer = document.getElementById('owners-container');
    const dogsContainer = document.getElementById('dogs-container');
    const canvas = document.getElementById('connection-canvas');
    const scoreElement = document.getElementById('score');
    const totalElement = document.getElementById('total');
    const correctFeedback = document.getElementById('correct-feedback');
    const incorrectFeedback = document.getElementById('incorrect-feedback');

    // キャンバスのコンテキストを取得
    const ctx = canvas.getContext('2d');

    // キャンバスのサイズを設定
    function resizeCanvas() {
        const canvasContainer = canvas.parentElement;
        canvas.width = canvasContainer.offsetWidth;
        canvas.height = canvasContainer.offsetHeight;
        drawConnections();
    }

    // 現在のページの飼い主と犬を取得
    function getCurrentPageItems() {
        // まだマッチングしていない飼い主を取得
        const remainingPeople = people.filter(person => 
            !gameState.completedMatches.some(match => match.personId === person.id)
        );
        
        // 残りの飼い主をシャッフル
        const shuffledPeople = [...remainingPeople];
        shuffleArray(shuffledPeople);
        
        // 表示する飼い主（最大3人）
        const displayPeople = shuffledPeople.slice(0, gameState.displayCount);
        
        // 表示する飼い主に対応する正解の犬を取得
        const displayDogs = [];
        
        // 各飼い主に対応する正解の犬を追加
        displayPeople.forEach(person => {
            const correctDogName = gameState.correctAnswers[person.name];
            const correctDog = dogs.find(dog => dog.name === correctDogName);
            
            // 既に追加されていなければ追加
            if (!displayDogs.some(dog => dog.id === correctDog.id)) {
                displayDogs.push(correctDog);
            }
        });
        
        // 犬の順番をシャッフル
        shuffleArray(displayDogs);
        
        return { displayPeople, displayDogs };
    }

    // 飼い主と犬の要素を作成して表示
    function renderGame() {
        // 同じgetCurrentPageItems関数の結果を使用
        const { displayPeople, displayDogs } = getCurrentPageItems();
        
        // 飼い主を表示
        ownersContainer.innerHTML = '';
        displayPeople.forEach(person => {
            const personElement = document.createElement('div');
            personElement.className = 'person';
            personElement.dataset.id = person.id;
            personElement.dataset.name = person.name;
            
            personElement.innerHTML = `
                <img src="${person.image}" alt="${person.name}">
            `;
            
            personElement.addEventListener('click', () => selectPerson(person));
            ownersContainer.appendChild(personElement);
        });
        
        // 犬を表示
        dogsContainer.innerHTML = '';
        displayDogs.forEach(dog => {
            const dogElement = document.createElement('div');
            dogElement.className = 'dog';
            dogElement.dataset.id = dog.id;
            dogElement.dataset.name = dog.name;
            
            dogElement.innerHTML = `
                <img src="${dog.image}" alt="${dog.name}">
            `;
            
            dogElement.addEventListener('click', () => selectDog(dog));
            dogsContainer.appendChild(dogElement);
        });
    }

    // 接続を削除する関数
    function removeConnection(id, type) {
        const index = gameState.connections.findIndex(conn => 
            (type === 'person' && conn.personId === id) || 
            (type === 'dog' && conn.dogId === id)
        );
        
        if (index !== -1) {
            gameState.connections.splice(index, 1);
            drawConnections();
            
            // 正解・不正解のクラスを削除
            document.querySelectorAll('.person, .dog').forEach(el => {
                el.classList.remove('correct', 'incorrect');
            });
            
            // スコアをリセット
            scoreElement.textContent = '0';
            
            return true;
        }
        
        return false;
    }

    // 飼い主を選択
    function selectPerson(person) {
        // 既に正解済みの飼い主はクリックできないようにする
        if (document.querySelector(`.person[data-id="${person.id}"]`).classList.contains('correct')) {
            return;
        }
        
        // 以前に選択された飼い主の選択を解除
        if (gameState.selectedPerson) {
            document.querySelector(`.person[data-id="${gameState.selectedPerson.id}"]`).classList.remove('selected');
        }
        
        // 新しい飼い主を選択
        gameState.selectedPerson = person;
        document.querySelector(`.person[data-id="${person.id}"]`).classList.add('selected');
        
        // 犬も選択されていれば接続を作成
        if (gameState.selectedDog) {
            createConnection();
        }
    }

    // 犬を選択
    function selectDog(dog) {
        // 既に正解済みの犬はクリックできないようにする
        if (document.querySelector(`.dog[data-id="${dog.id}"]`).classList.contains('correct')) {
            return;
        }
        
        // 以前に選択された犬の選択を解除
        if (gameState.selectedDog) {
            document.querySelector(`.dog[data-id="${gameState.selectedDog.id}"]`).classList.remove('selected');
        }
        
        // 新しい犬を選択
        gameState.selectedDog = dog;
        document.querySelector(`.dog[data-id="${dog.id}"]`).classList.add('selected');
        
        // 飼い主も選択されていれば接続を作成
        if (gameState.selectedPerson) {
            createConnection();
        }
    }

    // 接続を作成
    function createConnection() {
        const connection = {
            personId: gameState.selectedPerson.id,
            personName: gameState.selectedPerson.name,
            dogId: gameState.selectedDog.id,
            dogName: gameState.selectedDog.name
        };
        
        gameState.connections.push(connection);
        
        // 選択をリセット
        gameState.selectedPerson = null;
        gameState.selectedDog = null;
        
        document.querySelectorAll('.selected').forEach(el => el.classList.remove('selected'));
        
        // 接続を描画
        drawConnections();
        
        // 正解かどうかをチェック
        const isCorrect = gameState.correctAnswers[connection.personName] === connection.dogName;
        
        const personElement = document.querySelector(`.person[data-id="${connection.personId}"]`);
        const dogElement = document.querySelector(`.dog[data-id="${connection.dogId}"]`);
        
        if (isCorrect) {
            // 正解の場合
            personElement.classList.add('correct');
            dogElement.classList.add('correct');
            
            // 完了したマッチングに追加
            gameState.completedMatches.push(connection);
            
            // スコアを更新
            scoreElement.textContent = gameState.completedMatches.length;
            
            // 正解演出を表示
            showCorrectFeedback();
            
            // 現在のセットがすべて正解したか、または残りの選択肢がなくなったかチェック
            checkSetCompletion();
        } else {
            // 不正解の場合
            personElement.classList.add('incorrect');
            dogElement.classList.add('incorrect');
            
            // 不正解演出を表示
            showIncorrectFeedback();
            
            // 少し時間をおいてから接続を削除（時間を短縮）
            setTimeout(() => {
                // 接続を削除
                const index = gameState.connections.findIndex(conn => 
                    conn.personId === connection.personId && conn.dogId === connection.dogId
                );
                
                if (index !== -1) {
                    gameState.connections.splice(index, 1);
                    drawConnections();
                }
                
                // 不正解のクラスを削除
                personElement.classList.remove('incorrect');
                dogElement.classList.remove('incorrect');
            }, 800);
        }
    }
    
    // 不正解演出を表示
    function showIncorrectFeedback() {
        incorrectFeedback.classList.add('show');
        
        setTimeout(() => {
            incorrectFeedback.classList.remove('show');
        }, 1000);
    }

    // 現在表示されている人たちが全て正解したかチェック
    function checkSetCompletion() {
        // 現在表示されている飼い主を取得
        const currentPeopleElements = document.querySelectorAll('.person');
        const currentPeopleIds = Array.from(currentPeopleElements).map(el => el.dataset.id);
        
        // 現在表示されている飼い主が全て正解したかチェック
        const allCurrentCorrect = currentPeopleIds.every(id => 
            gameState.completedMatches.some(match => match.personId === id)
        );
        
        if (allCurrentCorrect) {
            // 全問正解の演出を表示
            setTimeout(() => {
                showAllCorrectFeedback();
                
                // すべてのマッチングが完了したかチェック
                setTimeout(() => {
                    if (gameState.completedMatches.length === people.length) {
                        // ゲーム終了
                        showGameComplete();
                    } else {
                        // 次のステージボタンを表示
                        showNextStageButton();
                    }
                }, 1500);
            }, 1000);
        }
    }
    
    // 次のステージボタンを表示
    function showNextStageButton() {
        // 既存のボタンがあれば削除
        const existingButton = document.getElementById('next-stage-btn');
        if (existingButton) {
            existingButton.remove();
        }
        
        // 次のステージボタンを作成
        const nextStageButton = document.createElement('button');
        nextStageButton.id = 'next-stage-btn';
        nextStageButton.className = 'next-stage-btn';
        nextStageButton.textContent = '次のステージ';
        
        // ボタンをクリックしたときの処理
        nextStageButton.addEventListener('click', () => {
            // 次のセットを表示
            gameState.connections = [];
            renderGame();
            resizeCanvas();
            
            // ボタンを削除
            nextStageButton.remove();
        });
        
        // ボタンを追加
        document.querySelector('.controls').appendChild(nextStageButton);
    }
    
    // 全問正解演出を表示
    function showAllCorrectFeedback() {
        // 全問正解の演出を表示
        const allCorrectMessage = document.createElement('div');
        allCorrectMessage.className = 'all-correct-message';
        allCorrectMessage.textContent = '全問正解！';
        document.body.appendChild(allCorrectMessage);
        
        // アニメーション終了後に要素を削除
        setTimeout(() => {
            allCorrectMessage.remove();
        }, 1500);
    }

    // ゲーム終了表示
    function showGameComplete() {
        // ゲーム画面を非表示にし、クリア画面を表示
        gameScreen.classList.remove('active');
        clearScreen.classList.add('active');
        
        // キャンバスをクリア
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    }

    // 正解演出を表示
    function showCorrectFeedback() {
        correctFeedback.classList.add('show');
        
        setTimeout(() => {
            correctFeedback.classList.remove('show');
        }, 1000);
    }

    // 飼い主が既に接続されているかチェック
    function isPersonConnected(personId) {
        return gameState.connections.some(conn => conn.personId === personId);
    }

    // 犬が既に接続されているかチェック
    function isDogConnected(dogId) {
        return gameState.connections.some(conn => conn.dogId === dogId);
    }

    // 接続を描画
    function drawConnections() {
        // キャンバスをクリア
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        gameState.connections.forEach(connection => {
            const personElement = document.querySelector(`.person[data-id="${connection.personId}"]`);
            const dogElement = document.querySelector(`.dog[data-id="${connection.dogId}"]`);
            
            if (personElement && dogElement) {
                const personRect = personElement.getBoundingClientRect();
                const dogRect = dogElement.getBoundingClientRect();
                const canvasRect = canvas.getBoundingClientRect();
                
                // キャンバス上の座標に変換
                const startX = 0;
                const startY = personRect.top + personRect.height / 2 - canvasRect.top;
                const endX = canvas.width;
                const endY = dogRect.top + dogRect.height / 2 - canvasRect.top;
                
                // 線を描画
                ctx.beginPath();
                ctx.moveTo(startX, startY);
                ctx.lineTo(endX, endY);
                
                // 答え合わせ後の色分け
                if (personElement.classList.contains('correct')) {
                    ctx.strokeStyle = '#52c41a'; // 正解の色
                } else if (personElement.classList.contains('incorrect')) {
                    ctx.strokeStyle = '#f5222d'; // 不正解の色
                } else {
                    ctx.strokeStyle = '#1890ff'; // デフォルトの色
                }
                
                ctx.lineWidth = 2;
                ctx.stroke();
            }
        });
    }

    // イベントリスナーを設定
    window.addEventListener('resize', resizeCanvas);

    // ゲームを初期化
    function initGame() {
        renderGame();
        resizeCanvas();
        
        // 合計数を設定
        totalElement.textContent = people.length;
    }

    // ゲームを開始
    initGame();
});
