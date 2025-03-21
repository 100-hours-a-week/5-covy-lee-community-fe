window.addEventListener('DOMContentLoaded', async () => {
    try {
        // API 호출로 세션에 저장된 사용자 정보 가져오기
        const response = await fetch(`${window.API_BASE_URL}/api/me`, {
            method: 'GET',
            credentials: 'include' // 쿠키 포함
        });
        if (!response.ok) {
            throw new Error(`API 호출 실패: ${response.statusText}`);
        }
        const data = await response.json();

        // 서버에서 반환한 데이터에 user 정보가 있을 경우 sessionStorage에 저장
        if (data.user) {
            sessionStorage.setItem('user', JSON.stringify(data.user));
            console.log('세션 스토리지에 사용자 정보 저장 완료:', data.user);
        } else {
            throw new Error('사용자 정보가 존재하지 않습니다.');
        }
    } catch (error) {
        console.error('API /api/me 호출 중 에러:', error.message);
        alert('로그인이 필요합니다.');
        window.location.replace('./login.html');
        history.pushState(null, '', './login.html');
        return;
    }

    // API 호출 후 sessionStorage에 user 정보가 저장되었는지 확인
    const user = sessionStorage.getItem('user');
    if (!user) {
        alert('로그인이 필요합니다.');
        window.location.replace('./login.html');
        history.pushState(null, '', './login.html');
    }
});





document.addEventListener('DOMContentLoaded', function() {
    // 세션 데이터가 로드될 때까지 기다리는 함수
    let attempts = 0; // 시도 횟수

    const loadUserDataAndHeader = () => {
        const user = JSON.parse(sessionStorage.getItem('user'));

        if (!user) {
            // 최대 5번까지 시도
            if (attempts < 5) {
                attempts++;
                setTimeout(loadUserDataAndHeader, 100);
                return;
            } else {
                alert("사용자 데이터를 불러올 수 없습니다.");
                return;
            }
        }

        const userImage = user.image;

        // header.html 파일 로드
        fetch('./components/header.html')
            .then(response => response.text())
            .then(data => {
                // header-container에 HTML 삽입
                document.getElementById('header-container').innerHTML = data;

                // HTML 삽입 후에 프로필 이미지 설정
                const profileImage = document.getElementById('profileImage');
                if (profileImage) {
                    profileImage.src = userImage ?
                        `${userImage}` :
                        `${window.API_BASE_URL}/default_images/default_profile.webp`;
                }

                // 이벤트 리스너 추가 (드롭다운 토글, 로그아웃 등)
                const profileButton = document.getElementById('profileButton');
                if (profileButton) {
                    profileButton.addEventListener('click', toggleDropdown);
                }

                const logoutButton = document.getElementById('logoutButton');
                if (logoutButton) {
                    logoutButton.addEventListener('click', utils);
                }
            })
            .catch(error => console.error('Error loading header:', error));
    };

    loadUserDataAndHeader(); // 함수 호출
});

const utils = async () => {
    try {
        // 서버 로그아웃 API 호출
        const response = await fetch(`${window.API_BASE_URL}/api/logout`, {
            method: 'POST',
            credentials: 'include'
        });

        if (response.ok) {
            // 클라이언트 세션 스토리지 삭제
            sessionStorage.clear();
            alert('로그아웃 되었습니다.');

            // 캐시를 방지하기 위한 추가 설정
            if ('caches' in window) {
                const cacheNames = await caches.keys();
                for (const cacheName of cacheNames) {
                    await caches.delete(cacheName);
                }
            }

            // 로그인 페이지로 리디렉션 (캐시 제거 후 이동)
            window.location.replace('./login.html');
        } else {
            alert('로그아웃에 실패했습니다. 다시 시도해주세요.');
        }
    } catch (error) {
        console.error('로그아웃 중 오류:', error);
        alert('서버와 통신 중 오류가 발생했습니다.');
    }
};




// 드롭다운 메뉴 토글 함수
function toggleDropdown() {
    const dropdown = document.getElementById('dropdownMenu');
    dropdown.classList.toggle('show');
}

// 드롭다운 외부 클릭 시 드롭다운 숨기기
window.onclick = function(event) {
    const dropdown = document.getElementById('dropdownMenu');
    const profileButton = document.querySelector('.profile-button');

    // 드롭다운, 프로필 버튼, 프로필 이미지가 아닌 곳을 클릭했을 때
    if (!dropdown.contains(event.target) && !profileButton.contains(event.target)) {
        if (dropdown.classList.contains('show')) {
            dropdown.classList.remove('show');
        }
    }
};



