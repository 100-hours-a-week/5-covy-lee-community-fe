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
                        `http://localhost:3000/routes/uploads/${userImage}` :
                        "http://localhost:3000/routes/uploads/profile_img.webp";
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

const toggleDropdown = () => {
    const dropdown = document.getElementById('dropdownMenu');
    if (dropdown) {
        dropdown.classList.toggle('show');
    }
};
