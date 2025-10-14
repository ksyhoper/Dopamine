$(document).ready(function() {
    let gameState = {
        hasFlashlight: false,
        flashLightOn: false,
        hasKey: false,
        hasInvitation: false,
        doorUnlocked: false,
        inventory: [],
        currentDialogueIndex: 0,
        currentScene: 'intro',
        health: 3,
        maxHealth: 3,
        chosenActions: [], // 선택했던 action들을 기록
        selectedItem: null  // 선택된 아이템 추가
    };

    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;

    // 화면 크기 기준으로 스포트라이트 크기 계산
    function getSpotlightSize() {
        const screenAvg = (window.innerWidth + window.innerHeight) / 2;
        return screenAvg * 0.15;
    }

    // 아이템이 손전등 범위 안에 있는지 체크
    function checkItemVisibility(mouseX, mouseY, radius) {
        $('.room-item, .interactive-object').each(function() {
            const $item = $(this);
            const itemRect = this.getBoundingClientRect();
            
            // 아이템 내부에서 마우스의 상대 위치 계산
            const relativeX = mouseX - itemRect.left;
            const relativeY = mouseY - itemRect.top;
            
            // 아이템의 중심과 마우스의 거리
            const itemCenterX = itemRect.width / 2;
            const itemCenterY = itemRect.height / 2;
            
            // 마우스와 아이템 중심의 거리 계산
            const distance = Math.sqrt(
                Math.pow(mouseX - (itemRect.left + itemCenterX), 2) + 
                Math.pow(mouseY - (itemRect.top + itemCenterY), 2)
            );
            
            // 거리가 반경 안이면 마스크 적용, 아니면 완전히 숨기기
            if (distance < radius * 0.6) {
                $item.css({
                    'opacity': '1',
                    '-webkit-mask': `radial-gradient(circle ${radius * 0.8}px at ${relativeX}px ${relativeY}px, black 0%, black 70%, transparent 100%)`,
                    'mask': `radial-gradient(circle ${radius * 0.8}px at ${relativeX}px ${relativeY}px, black 0%, black 70%, transparent 100%)`
                });
            } else {
                $item.css({
                    'opacity': '0',
                    '-webkit-mask': 'none',
                    'mask': 'none'
                });
            }
        });
    }

    // 마우스 움직임 추적 (손전등용)
    $(document).mousemove(function(e) {
        mouseX = e.clientX;
        mouseY = e.clientY;
        
        if (gameState.flashLightOn) {
            const spotlightSize = getSpotlightSize();
            $('#darkness').css('background', 
                `radial-gradient(
                    circle ${spotlightSize}px at ${mouseX}px ${mouseY}px,
                    rgba(0, 0, 0, 0.01) 0%,
                    rgba(0, 0, 0, 0.3) 30%,
                    rgba(0, 0, 0, 0.7) 60%,
                    rgba(0, 0, 0, 0.95) 100%
                )`
            );
            // 손전등 범위 안의 물건만 보이게
            checkItemVisibility(mouseX, mouseY, spotlightSize);
        }
    });
    
    // 캐릭터별 대사 시나리오
    const characterName = $('.speaker-name').text().trim();
    const authority = $('.character-authority').val();

    var dialogueScenarios;
    if(authority != 1){
        dialogueScenarios = {
            'intro': [
                { speaker: characterName, text: '...어? 여기가 어디지?' },
                { speaker: characterName, text: '분명 김승연이 불러서 왔는데 깜깜해서 아무것도 안 보여...' },
                { speaker: characterName, text: '나 갇혔구나... 김승연 이 개새...' },
                { 
                    speaker: characterName, 
                    text: '어떻게 할까?',
                    choices: [
                        { text: '주변을 둘러본다', action: 'lookAround' },
                        { text: '소리를 질러본다', action: 'shout' },
                        { text: '무작정 앞으로 달려본다', action: 'runBlindly', danger: true },
                        { text: '허공을 더듬어본다.', action: 'fumbleAir', danger: true }
                    ]
                }
            ],
            /* 둘러보기 선택지 */
            'lookAround': [
                { speaker: characterName, text: '천천히 주변을 살펴본다...' },
                { speaker: characterName, text: '너무 어두워서 아무것도 보이지 않는다..' },
                { speaker: characterName, text: '아 나 야맹증이지..' },
                { speaker: '시스템', text: '어떻게 하시겠습니까?',
                    choices: [
                        { text: '계속 주변을 둘러본다', action: 'keepLookAround' },
                        { text: '소리를 지른다', action: 'shout'},
                        { text: '무작정 앞으로 달려본다', action: 'runBlindly', danger: true },
                        { text: '허공을 더듬어본다', action: 'fumbleAir', danger:true }
                    ]
                }
            ],
            'keepLookAround': [
                { speaker: characterName, text: '천천히 주변을 살펴본다...' },
                { speaker: characterName, text: '칠흙같다.. 조금씩 앞이 보이긴 개뿔. 아무것도 보이지 않는다.' },
                { speaker: characterName, text: '진짜 김승연.. 나한테 왜 그래..' },
                { speaker: '시스템', text: '어떻게 하시겠습니까?',
                    choices: [
                        { text: '주변을 둘러본다', action: 'keepLookAround' },
                        { text: '소리를 질러본다', action: 'shout' },
                        { text: '무작정 앞으로 달려본다', action: 'runBlindly', danger: true },
                        { text: '허공을 더듬어본다', action: 'fumbleAir', danger:true }
                    ]
                }
            ],
            /* 소리 지르기 선택지 */
            'shout': [
                { speaker: characterName, text: '아아아아아아아아아아ㅏ아아아아아아아악' },
                { speaker: '...', text: '...' },
                { speaker: characterName, text: '고요하다... 다른 방법을 찾아야겠어..' },
                { speaker: '시스템', text: '어떻게 하시겠습니까?',
                    choices: [
                        { text: '주변을 둘러본다', action: 'lookAround' },
                        { text: '계속 소리를 지른다', action: 'keepShouting', danger: true },
                        { text: '무작정 앞으로 달려본다', action: 'runBlindly', danger: true },
                        { text: '허공을 더듬어본다', action: 'fumbleAir', danger:true }
                    ]
                }
            ],
            'keepShouting': [
                { speaker: characterName, text: '(소리치면 언젠간 누군가가 듣겠지)' },
                { speaker: characterName, text: '아아아아아악 살려주세요~!~!~!~!~!~! 여기 사람 있어요!!!!!!!!!!!' },
                { speaker: '시스템', text: '목이 쉬어서 아프다...' },
                { speaker: '시스템', text: '생명이 1 감소했습니다.', damage: 1 },
                { speaker: characterName, text: 'ㅁㅊ.. 어디다가 가둬놓은거야..?' },
                { speaker: characterName, text: '이제 무엇을 할까?',
                    choices : [
                        { text : '주변을 둘러본다', action : 'lookAround'},
                        { text: '계속 소리를 지른다', action: 'keepShouting', danger: true },
                        { text: '무작정 앞으로 달려본다', action: 'runBlindly', danger: true },
                        { text: '허공을 더듬어본다', action: 'fumbleAir', danger:true }
                    ]
                }
            ],
            /* 달리는 선택지 */
            'runBlindly': [
                { speaker: characterName, text: '앞이 안 보이지만 일단 달린다!' },
                { speaker: '시스템', text: '쾅!' },
                { speaker: characterName, text: '아악 ㅅㅂ 이거 뭐야?' },
                { speaker: '시스템', text: '생명이 1 감소했습니다.', damage: 1 },
                { speaker: characterName, text: '개아프네... 다음부터 조심해야겠어.' },
                { speaker: characterName, text: '이제 무엇을 할까?',
                    choices : [
                        {text : '주변을 둘러본다', action : 'lookAround'},
                        {text : '소리를 질러본다', action : 'shout'},
                        { text: '무작정 앞으로 달려본다', action: 'runBlindly', danger: true },
                        {text: '허공을 더듬어본다', action: 'fumbleAir', danger:true }
                    ]
                }
            ],
            /* 허공을 더듬어보는 선택지 */
            'fumbleAir': [
                { speaker: characterName, text: '손으로 허공을 더듬어본다..' },
                { speaker: characterName, text: '벽이 느껴진다..!' },
                { speaker: characterName, text: '(전등 스위치.. 전등 스위치.. 없나..?)' },
                { speaker: characterName, text: '아얏..!' },
                { speaker: '시스템', text: '튀어나와있는 못에 손을 다쳤다..' },
                { speaker: '시스템', text: '생명이 1 감소했습니다.', damage:1 },
                { speaker: characterName, text: '아니.. 못인가..? 에바'},
                { speaker: characterName, text: '이제 무엇을 할까?',
                    choices: [
                        { text: '주변을 둘러본다', action: 'lookAround' },
                        { text: '소리를 지른다', action: 'shout' },
                        { text: '무작정 앞으로 달려본다', action: 'runBlindly', danger: true },
                        { text: '계속 더듬어본다', action: 'keepFumble' }
                    ]
                }
            ],
            'keepFumble': [
                { speaker: characterName, text: '계속 손으로 주변을 더듬어본다..' },
                { speaker: characterName, text: '뭔가 있다? 어...이게 뭐지..?' },
                { speaker: '시스템', text: '손전등을 획득했습니다'},
                { speaker: characterName, text: '손전등을 켜볼까?',
                    choices: [
                        { text: '손전등을 켠다', action: 'turnOnFlashlight' },
                        { text: '아껴두자', action: 'saveFlashLight' }
                        
                    ]
                }
            ],
            /* 손전등 */
            'turnOnFlashlight': [
                { speaker: '시스템', text: '찰칵!' },
                { speaker: characterName, text: '오! 주변이 보인다!' },
                { speaker: '시스템', text: '마우스를 움직여서 주변을 탐색해보자!' }
            ],
            'saveFlashlight': [
                { speaker: characterName, text: '일단 아껴두자. 나중에 필요할 수도 있어.' },
                { speaker: '시스템', text: '인벤토리에서 손전등을 클릭하면 켤 수 있습니다.' }
            ],
            'examineDesk': [
                { speaker: characterName, text: '책상 위에는 책 여러 권이 놓여있다.' },
                { speaker: characterName, text: '책상 서랍은 잠겨있다.' },
            ],
            'examineBook':[
                {speaker:'시스템', text: '가장 위에 있는 책은 <아오야마 고쇼-명탐정 코난>이다.'},
                {speaker:characterName, text: '이거 재밌지...ㅎ'},
                {speaker:'시스템', text: '중간에 있는 책은 <스즈키 코지-링>이다.'},
                {speaker:characterName, text: '영화가 더 유명하지 않나..? 이거는..?'},
                {speaker:'시스템', text: '가장 아래에 있는 책은 <김의경-처음이라는 도파민>이다.'},
                {speaker:characterName, text: '이 책은 뭐지..?'},
                {speaker:characterName, text: '책을 살펴볼까?',
                    choices:[
                        {text: '명탐정 코난을 읽어본다.', action:'FirstBook'},
                        {text: '링을 읽어본다.', action:'SecondBook'},
                        {text: '처음이라는 도파민을 읽어본다.', action:'ThirdBook'},
                        {text: '책 볼 시간이 없어. 다른 데를 더 찾아보자.', action:'leaveBook'}
                    ]
                }
            ],
            'FirstBook':[
                {speaker:characterName, text:'역시 코난이야! 범인은 바로 하나!!!! (아닌가..?)'},
                {speaker:characterName, text:'그냥 즐거웠다...'},
                {speaker:characterName, text: '다른 책을 살펴볼까?',
                    choices:[
                        {text: '명탐정 코난을 읽어본다.', action:'FirstBook'},
                        {text: '링을 읽어본다.', action:'SecondBook'},
                        {text: '처음이라는 도파민을 읽어본다.', action:'ThirdBook'},
                        {text: '책 볼 시간이 없어. 다른 데를 더 찾아보자.', action:'leaveBook'}
                    ]
                }

            ],
            'SecondBook':[
                {speaker:characterName, text:'와.. 링이 원작이 책이었구나.. 으으 소름끼쳐'},
                {speaker:'시스템', text:'툭'},
                {speaker:'시스템', text:'책 사이에서 무언가 떨어졌다!',
                    choices: [
                        { text: '주워본다', action: 'pickupKey' }
                    ]
                }
            ],
            'ThirdBook':[
                {speaker:characterName, text:'이거 처음 보는 책인데 역시 첫키스는 조심스럽게하는구나. 우마이'},
                {speaker:characterName, text:'성장통 오네..'},
                {speaker:characterName, text: '다른 책을 살펴볼까?',
                    choices:[
                        {text: '명탐정 코난을 읽어본다.', action:'FirstBook'},
                        {text: '링을 읽어본다.', action:'SecondBook'},
                        {text: '처음이라는 도파민을 읽어본다.', action:'ThirdBook'},
                        {text: '책 볼 시간이 없어. 다른 데를 더 찾아보자.', action:'leaveBook'}
                    ]
                }

            ],
            'leaveBook':[
                {speaker:characterName, text:'책 볼 시간 없어. 어두워서 눈도 나빠져'}
            ],
            'pickupKey': [
                { speaker: characterName, text: '작은 열쇠다!' },
                { speaker: '시스템', text: '열쇠를 획득했습니다.' },
                { speaker: characterName, text: '이걸로 뭘 열 수 있을까?'}
            ],
            'openDrawer': [
                { speaker: characterName, text: '열쇠로 서랍을 연다...' },
                { speaker: '시스템', text: '찰칵!' },
                { speaker: characterName, text: '서랍 안에 초대장이 있다!' },
                { speaker: '시스템', text: '초대장을 획득했습니다.' },
                { speaker: characterName, text: '...잠깐, 뭔가 소리가 들린다.' },
                { speaker: '시스템', text: '철컥... 문이 열리는 소리가 들렸다!' },
                { speaker: characterName, text: '드디어 나갈 수 있겠어!' }
            ],
            'lookDrawer':[
                { speaker: characterName, text: '서랍 안에 뭔가 있다!' },
                { speaker: '시스템', text: '초대장을 획득했습니다.' },
            ],
            'lookDoor' : [
                { speaker: characterName, text: '어? 문이 열려있잖아?' },
                { speaker: characterName, text: '나갈까?' ,
                    choices:[
                        {text:'나가자!!!!!!!!!', action:'exitRoom'},
                        {text:'아니야.. 뭔가 구려..', action:'continueExplore'}
                    ]
                },
            ],
            'continueExplore': [
                { speaker: characterName, text: '좀 더 탐색해보자...' }
            ]
        };
    }else{
        $('#interactionModal').css('display', 'flex');
        $('#interactionTitle').text('독촉장');
        $('#interactionMessage').text('빨리 초대장을 쓰세요!');
        
        $('#interactionConfirm').off('click').on('click', function() {
            location.href="/";
        });
        
        $('#interactionCancel').hide();
        return;
    }
    
    let currentScenario = [];
    let currentDialogueIndex = 0;
    let isTyping = false;
    
    // 생명 감소 함수
    function loseHealth(amount = 1) {
        gameState.health = Math.max(0, gameState.health - amount);
        updateHealthDisplay();
        
        // 캐릭터 흔들림 애니메이션
        $('#playerSprite').addClass('hurt');
        setTimeout(() => {
            $('#playerSprite').removeClass('hurt');
        }, 500);
        
        if (gameState.health <= 0) {
            gameOver();
        }
    }
    
    // 생명 표시 업데이트
    function updateHealthDisplay() {
        for (let i = 1; i <= gameState.maxHealth; i++) {
            const $heart = $(`.heart[data-heart="${i}"]`);
            if (i > gameState.health) {
                $heart.addClass('lost');
            } else {
                $heart.removeClass('lost');
            }
        }
    }
    
    // 게임 오버
    function gameOver() {
        setTimeout(() => {
            $('#interactionModal').css('display', 'flex');
            $('#interactionTitle').text('Game Over');
            $('#interactionMessage').text('생명이 모두 소진되었습니다...');
            
            $('#interactionConfirm').off('click').on('click', function() {
                location.reload();
            });
            
            $('#interactionCancel').hide();
        }, 1000);
    }
    
    // 타이핑 효과로 대사 표시
    function typeDialogue(text, callback) {
        isTyping = true;
        let index = 0;
        $('#dialogueText').text('');
        $('#continueBtn').hide();
        
        const typingInterval = setInterval(() => {
            if (index < text.length) {
                $('#dialogueText').text($('#dialogueText').text() + text[index]);
                index++;
            } else {
                clearInterval(typingInterval);
                isTyping = false;
                $('#continueBtn').show();
                if (callback) callback();
            }
        }, 50);
    }
    
    // 대사 표시
    function showDialogue(dialogue) {
        $('#speakerName').text(dialogue.speaker);

        // 데미지가 있는 경우 생명 감소
        if (dialogue.damage) {
            loseHealth(dialogue.damage);
        }
        
        // 캐릭터가 말할 때 애니메이션
        if (dialogue.speaker === characterName) {
            $('#playerSprite').addClass('talking');
            $('#characterDisplay').show();

        }else{
            $('#characterDisplay').hide();
        }
        
        typeDialogue(dialogue.text, () => {
            $('#playerSprite').removeClass('talking');
            
            // 선택지가 있는 경우
            if (dialogue.choices) {
                showChoices(dialogue.choices);
            }
        });
    }
    
    // 선택지 표시
    function showChoices(choices) {
        $('#choiceMenu').show();
        $('#choiceContainer').empty();
        $('#continueBtn').hide();
        
        // 이미 선택한 것들 제외
        const availableChoices = choices.filter(choice => 
            !gameState.chosenActions.includes(choice.action)
        );
        
        // 선택지가 하나도 없으면 첫 번째만 표시 (무한루프 방지)
        const displayChoices = availableChoices.length > 0 ? availableChoices : [choices[0]];
        
        displayChoices.forEach(choice => {
            const btn = $('<button class="choice-btn"></button>')
                .text(choice.text)
                .on('click', function() {
                    $('#choiceMenu').hide();
                    handleChoice(choice.action);
                });
            $('#choiceContainer').append(btn);
        });
    }

    // 선택 처리
    function handleChoice(action) {
        currentDialogueIndex = 0;

        // 선택한 action 기록
        if (!gameState.chosenActions.includes(action)) {
            gameState.chosenActions.push(action);
        }
    
        currentDialogueIndex = 0;
        
        switch(action) {
            case 'lookAround':
                currentScenario = dialogueScenarios['lookAround'];
                break;
            case 'keepLookAround' :
                currentScenario = dialogueScenarios['keepLookAround'];
                break;
            case 'shout':
                currentScenario = dialogueScenarios['shout'];
                break;
            case 'keepShouting':
                currentScenario = dialogueScenarios['keepShouting'];
                break;
            case 'runBlindly':
                currentScenario = dialogueScenarios['runBlindly'];
                break;
            case 'fumbleAir':
                currentScenario = dialogueScenarios['fumbleAir'];
                break;
            case 'keepFumble' :
                currentScenario = dialogueScenarios['keepFumble'];
                gameState.hasFlashlight=true;
                setTimeout(() => {
                    addToInventory('손전등');
                }, 3000);
                break;
            case 'turnOnFlashlight':
                currentScenario = dialogueScenarios['turnOnFlashlight'];
                gameState.flashLightOn = true;
                $('#darkness').addClass('flashlight-on');
                $('.room-item').addClass('flashlight-active');
                // 초기 스포트라이트 위치 설정
                const spotlightSize = getSpotlightSize();
                $('#darkness').css('background', 
                    `radial-gradient(
                        circle ${spotlightSize}px at ${mouseX}px ${mouseY}px,
                        rgba(0, 0, 0, 0.01) 0%,
                        rgba(0, 0, 0, 0.3) 30%,
                        rgba(0, 0, 0, 0.7) 60%,
                        rgba(0, 0, 0, 0.95) 100%
                    )`
                );
                 // 초기 위치에서 아이템 가시성 체크
                checkItemVisibility(mouseX, mouseY, spotlightSize);
                break;
            case 'saveFlashlight':
                currentScenario = dialogueScenarios['saveFlashlight'];
                break;
            case 'examineDesk':
                currentScenario = dialogueScenarios['examineDesk'];
                break;
            case 'examineBook':
                currentScenario = dialogueScenarios['examineBook'];
                break;
            case 'FirstBook':
                currentScenario = dialogueScenarios['FirstBook'];
                break;
            case 'SecondBook':
                currentScenario = dialogueScenarios['SecondBook'];
                break;
            case 'ThirdBook':
                currentScenario = dialogueScenarios['ThirdBook'];
                break;
             case 'leaveBook':
                currentScenario = dialogueScenarios['leaveBook'];
                break;
            case 'pickupKey':
                currentScenario = dialogueScenarios['pickupKey'];
                gameState.hasKey = true;
                  setTimeout(() => {
                    addToInventory('열쇠');
                }, 3000);
                break;
            case 'openDrawer':
                currentScenario = dialogueScenarios['openDrawer'];
                gameState.doorUnlocked = true;
                $('#door').css('background', 'linear-gradient(45deg, #228B22, #32CD32)');
                setTimeout(() => {
                    $('#victoryModal').css('display', 'flex');
                }, 3000);
                break;
            case 'lookDrawer':
                currentScenario = dialogueScenarios['lookDrawer'];
                gameState.hasInvitation = true;
                addToInventory('초대장');
                break;
            case 'lookDoor':
                currentScenario = dialogueScenarios['lookDoor'];
                break;
            case 'continueExplore':
                currentScenario = dialogueScenarios['continueExplore'];
                break;
        }
        
        showNextDialogue();
    }
    
    // 다음 대사 표시
    function showNextDialogue() {
        if (isTyping) return;
        
        if (currentDialogueIndex < currentScenario.length) {
            showDialogue(currentScenario[currentDialogueIndex]);
            currentDialogueIndex++;
        } else {
            // 시나리오 끝
            $('#continueBtn').hide();
        }
    }
    
    // 계속 버튼 클릭
    $('#continueBtn').on('click', function() {
        if (!isTyping) {
            showNextDialogue();
        }
    });
    
    // 인벤토리에 아이템 추가
    function addToInventory(item) {
        if (!gameState.inventory.includes(item)) {
            gameState.inventory.push(item);
            const itemDiv = $('<div class="inventory-item">' + item + '</div>');
            $('#inventoryItems').append(itemDiv);
            
            itemDiv.on('click', function() {
                selectItem(item, $(this));
            });
        }
    }

    // 아이템 선택/해제 함수 추가
    function selectItem(item, $element) {
        // 이미 선택된 아이템을 다시 클릭하면 해제
        if (gameState.selectedItem === item) {
            gameState.selectedItem = null;
            $('.inventory-item').removeClass('selected');
            $('#gameScreen').css('cursor', 'default');
        } else {
            // 새 아이템 선택
            gameState.selectedItem = item;
            $('.inventory-item').removeClass('selected');
            $element.addClass('selected');
            
            // 커서 변경 (선택된 아이템에 따라)
            if (item === '열쇠') {
                $('#gameScreen').css('cursor', 'url(/resources/images/key-cursor.png), auto');
            } else if (item === '초대장') {
                $('#gameScreen').css('cursor', 'url(/resources/images/invitation-cursor.png), auto');
            } else {
                $('#gameScreen').css('cursor', 'pointer');
            }
        }
    }
    
     // 아이템 사용
    function useItem(item) {
        if (item === '손전등' && !gameState.flashLightOn) {
            currentScenario = [
                { speaker: '시스템', text: '찰칵!' },
                { speaker: characterName, text: '손전등을 켰다! 이제 주변이 보인다!' },
                { speaker: '시스템', text: '마우스를 움직여서 주변을 탐색해보자!' }
            ];
            currentDialogueIndex = 0;
            gameState.flashLightOn = true;
            $('#darkness').addClass('flashlight-on');
            $('.room-item').addClass('flashlight-active');

            // 초기 스포트라이트 위치 설정
            const spotlightSize = getSpotlightSize();
            $('#darkness').css('background', 
                `radial-gradient(
                    circle ${spotlightSize}px at ${mouseX}px ${mouseY}px,
                    rgba(0, 0, 0, 0.01) 0%,
                    rgba(0, 0, 0, 0.3) 30%,
                    rgba(0, 0, 0, 0.7) 60%,
                    rgba(0, 0, 0, 0.95) 100%
                )`
            );

           // 초기 위치에서 아이템 가시성 체크
            checkItemVisibility(mouseX, mouseY, spotlightSize);
            showNextDialogue();

        } else if (item === '열쇠') {
            if ($('#table:visible').length > 0 && !gameState.hasInvitation) {
                currentScenario = [
                    { speaker: characterName, text: '열쇠로 책상 서랍을 열어볼까?' }
                ];
                currentDialogueIndex = 0;
                showNextDialogue();
            } else {
                typeDialogue('열쇠를 사용할 곳이 없는 것 같다.');
            }
        } else if (item === '초대장') {
            typeDialogue('초대장이다. 이걸로 나갈 수 있을 것 같다.');
        }
    }
    
    // 방 아이템 클릭
    $('#door').on('click', function() {
        if(!gameState.flashLightOn) return;
        // 열쇠가 선택된 상태에서 문 클릭
        if (gameState.selectedItem === '열쇠' && !gameState.doorUnlocked) {
            currentScenario = [
                { speaker: characterName, text: '뭐야..? 열쇠구멍이 없잖아!' },
                { speaker: characterName, text: '다른 곳에 사용해야 할 것 같은데...' }
            ];
            currentDialogueIndex = 0;
            showNextDialogue();
        }else if (gameState.doorUnlocked) {
            $('#victoryModal').css('display', 'flex');
        } else {
            typeDialogue('문이 잠겨있다. 어떻게 열어야 할까?');
        }
    });
    
    //테이블 클릭
    $('#table').on('click', function() {
        if(!gameState.flashLightOn) return;
        // 열쇠가 선택된 상태에서 책상 클릭
        if (gameState.selectedItem === '열쇠' && gameState.hasKey && !gameState.hasInvitation) {
            currentScenario = [
                { speaker: characterName, text: '열쇠로 서랍을 열어볼까?' },
                { speaker: '시스템', text: '찰칵! 서랍이 열렸다!' },
                { speaker: '시스템', text: '철컥... 문이 열리는 소리가 들렸다!' },
                { speaker: characterName, text: '뭐지? 문도 열렸나..? 드디어?',
                    choices:[
                        {text:'서랍을 확인한다.', action:'lookDrawer'},
                        {text:'문을 확인한다.', action:'lookDoor'},
                    ]
                }
            ];
            currentDialogueIndex = 0;
            gameState.hasInvitation = true;
            gameState.doorUnlocked = true;
            gameState.selectedItem = null; // 아이템 사용 후 선택 해제
            $('.inventory-item').removeClass('selected');
            $('#gameScreen').css('cursor', 'default');
            
            setTimeout(() => {
                addToInventory('초대장');
            }, 2000);
            
            showNextDialogue();
        }
        // 일반 클릭 (열쇠 없을 때)
        else if (!gameState.hasKey) {
            currentScenario = dialogueScenarios['examineDesk'];
            currentDialogueIndex = 0;
            showNextDialogue();
        }
        // 이미 초대장을 얻었을 때
        else if (gameState.hasInvitation) {
            typeDialogue('더 이상 특별한 것이 없다.');
        }
        // 열쇠는 있지만 선택하지 않았을 때
        else {
            currentScenario = [
                { speaker: characterName, text: '서랍이 잠겨있다.' },
                { speaker: characterName, text: '인벤토리에서 열쇠를 선택해서 사용해보자.' }
            ];
            currentDialogueIndex = 0;
            showNextDialogue();
        }
    });

    $('#book').on('click', function() {
    if(!gameState.flashLightOn) return;
    if (!gameState.hasKey) {
        currentScenario = dialogueScenarios['examineDesk'];
        currentDialogueIndex = 0;
        showNextDialogue();
    } else {
        typeDialogue('이미 책을 확인했다.');
    }
});

    $('#chair').on('click', function() {
        if(!gameState.flashLightOn) return;
        typeDialogue('평범한 의자다. 특별한 것은 없어 보인다.');
    });
    

    // 승리 모달 버튼
    $('#nextStageBtn').on('click', function() {
        alert('다음 단계가 준비 중입니다!');
    });
    
    $('#restartBtn').on('click', function() {
        location.reload();
    });
    
    // 모달 배경 클릭시 닫기
    $('.modal-overlay').on('click', function(e) {
        if (e.target === this) {
            $(this).hide();
        }
    });
    
    // 게임 시작
    currentScenario = dialogueScenarios['intro'];
    showNextDialogue();
});
