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
                        `${window.API_BASE_URL}/profile_images/${userImage}` :
                        `${window.API_BASE_URL}/profile_images/profile_img.webp`;
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


const utils = () => {
    sessionStorage.clear(); // 세션 스토리지 데이터 삭제
    alert('로그아웃 되었습니다.');
    window.location.href = './login.html'; // 로그인 페이지로 이동
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

