let selectedCharacter = null;


// 모달 관련 함수
function showModal(title,message) {
    $('#modalTitle').text(title);
    $('#modalMessage').text(message);
    $('#modal').css('display', 'flex');

    // 타이틀 색상 설정
    if (title === '오류') {
        $('#modalTitle').addClass('error');
    } else {
        $('#modalTitle').removeClass('error');
    }
}

// 모달 함수 (확인)
function showModal(title, message, onConfirm) {
    $('#modalTitle').text(title);
    $('#modalMessage').text(message);
    
    // 타이틀 색상 설정
    if (title === '오류') {
        $('#modalTitle').addClass('error');
    } else {
        $('#modalTitle').removeClass('error');
    }
    
     // 기존 확인 버튼에 이벤트 바인딩
    $('#modalClose').off('click').on('click', function() {
        $('#modal').hide();
        if (typeof onConfirm === 'function') {
            onConfirm();
        }
    });
        // 확인 버튼만 있는 경우
        $('#modalButtons').html(`
            <button class="modal-button confirm" id="modalConfirm">확인</button>
        `);
        
        $('#modalConfirm').off('click').on('click', function() {
            hideModal();
        });
    
    $('#modal').css('display', 'flex');
}

function hideModal() {
    $('#modal').hide();
}

// 모달 닫기 이벤트
$('#modalClose').on('click', hideModal);

// 모달 배경 클릭시 닫기
$('#modal').on('click', function(e) {
    if (e.target === this) {
        hideModal();
    }
});

$(document).ready(function() {
    let selectedIndex = null;
    // 캐릭터 클릭 이벤트
    $('.characterOption').on('click', function() {
        const $this = $(this);
        console.log($this);
        const characterIndex = $this.data('index');
        
        // 같은 캐릭터를 다시 클릭한 경우 (선택 해제)
        if (selectedIndex === characterIndex && $this.hasClass('character-selected')) {
            // 선택 해제
            $this.removeClass('character-selected');
            $('.character-info-slide').removeClass('show');
            $('#characterGrid').removeClass('expanded');
            $('#confirmCharacter').removeClass('active');
            
            selectedCharacter = null;
            selectedIndex = null;
            
            console.log('캐릭터 선택 해제');
            return;
        }
        
        // 캐릭터 데이터 가져오기
        const name = $this.data('name');
        const birthday = $this.data('birthday');
        const description = $this.data('description');
        const alias = $this.data('alias');
        const authority = $this.data('authority');
        const picture = $this.data('picture');
        
        // 다른 캐릭터들의 선택 상태 제거
        $('.characterOption').removeClass('character-selected');
        $('.character-info-slide').removeClass('show');
        $('#characterGrid').removeClass('expanded');
        
        // 현재 캐릭터 선택 상태로 변경
        $this.addClass('character-selected');
        
        // 해당하는 정보창 찾기
        const $infoSlide = $(`.character-info-slide[data-character="${characterIndex}"]`);
        
        // 정보 슬라이드에 데이터 입력
        $infoSlide.find('.name-value').text(name || '미상');
        $infoSlide.find('.alias-value').text(alias || '미상');
        $infoSlide.find('.birthday-value').text(birthday || '미상');
        $infoSlide.find('.description-value').text(description || '정보 없음');
        $infoSlide.find('.picture-value').text(picture || '정보 없음');
        
        // 그리드를 5열로 확장하고 정보창 표시
        $('#characterGrid').addClass('expanded');
        $infoSlide.addClass('show');
        
        // 선택된 캐릭터 저장
        selectedCharacter = {
            name: name,
            alias: alias,
            birthday: birthday,
            description: description,
            authority : authority,
            picture : picture
        };
        selectedIndex = characterIndex;
        
        // 확정 버튼 활성화
        $('#confirmCharacter').addClass('active');
        
        console.log('캐릭터 선택:', selectedCharacter);
    });
});
    
    // 캐릭터 확정 버튼 클릭 이벤트
    $('#confirmCharacter').on('click', function() {
        if (!$(this).hasClass('active') || !selectedCharacter) {
            return;
        }
        
        showModal('선택',selectedCharacter.name+'을(를) 선택하시겠습니까?', function(){
            // 선택 확정 애니메이션
            $('#confirmCharacter').text('확정 중...');
            console.log('최종 선택된 캐릭터:', selectedCharacter);
            
            // localStorage에 캐릭터 정보 저장
            localStorage.setItem('selectedCharacter', JSON.stringify(selectedCharacter));
            
            setTimeout(function() {
                    // 페이지 이동
                    window.location.href = './blackRoom.html';
            }, 500);

            $('#confirmCharacter').text('캐릭터 확정');

            /* $.ajax({
                url: '/character/select',
                method: 'POST',
                data: {
                    characterName: selectedCharacter.name,
                    alias : selectedCharacter.alias,
                    birthday: selectedCharacter.birthday,
                    description: selectedCharacter.description,
                    authority : selectedCharacter.authority,
                    picture : selectedCharacter.picture
                },
                success: function(response) {
                    window.location.href = '/game/blackRoom';
                },
                error: function() {
                    showModal('오류','캐릭터 선택 중 오류가 발생했습니다.');
                    $('#confirmCharacter').text('캐릭터 확정');
                }
            }); */
        }, function() {
            // 취소 버튼을 눌렀을 때는 아무것도 하지 않음 (버튼 텍스트 그대로 유지)
            console.log('캐릭터 선택 취소됨');
        });
    });
    
    // 호버 효과를 위한 추가 이벤트 (선택사항)
    $('.characterOption').hover(
        function() {
            if (!$(this).hasClass('selected')) {
                $(this).find('.characterImg').css('filter', 'brightness(1.2)');
            }
        },
        function() {
            if (!$(this).hasClass('selected')) {
                $(this).find('.characterImg').css('filter', 'brightness(1)');
            }
        }
    );