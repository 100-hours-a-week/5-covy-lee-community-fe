// 페이지 로드 시 로컬 스토리지에서 데이터 가져오기
window.onload = () => {
    const userEmail = sessionStorage.getItem('userEmail') || "user@example.com"; // 기본 이메일
    const userName = sessionStorage.getItem('username') || ""; // 기본 닉네임
    const userImage = sessionStorage.getItem('userImage') || "http://localhost:3000/images/photo_1.jpeg"; // 기본 이미지 URL

    // 이메일 및 닉네임 표시
    document.getElementById('emailDisplay').innerText = userEmail;
    document.getElementById('username').value = userName;

    // 프로필 사진 미리보기
    const previewImage = document.getElementById('preview');
    previewImage.src = userImage;
    previewImage.style.display = userImage ? 'block' : 'none'; // 이미지가 있을 경우만 표시
};

const previewImage = (event) => {
    const file = event.target.files[0];
    const previewCircle = document.querySelector('.circle');

    if (file) {
        // 이미지가 선택된 경우
        previewCircle.style.backgroundImage = `url(${URL.createObjectURL(file)})`;
        previewCircle.style.backgroundSize = 'cover';
        previewCircle.style.backgroundPosition = 'center';
        previewCircle.style.backgroundColor = 'transparent'; // 배경색 투명하게 설정
        previewCircle.querySelector('span').style.display = 'none';
        document.getElementById('preview').src = URL.createObjectURL(file); // 미리보기 이미지 업데이트
    } else {
        // 이미지가 선택되지 않은 경우 (파일 입력이 비어있을 때)
        previewCircle.style.backgroundImage = 'none'; // 미리보기 초기화
        previewCircle.style.backgroundColor = '#D5C9DD'; // 기본 배경색으로 복원
        previewCircle.querySelector('span').style.display = 'block'; // '+' 아이콘 보이기
    }
}
// 드롭다운 외부 클릭 시 드롭다운 숨기기
window.onclick = (event) => {
    if (!event.target.matches('.profile-button') && !event.target.matches('.profile-button img')) {
        const dropdown = document.getElementById('dropdownMenu');
        if (dropdown.classList.contains('show')) {
            dropdown.classList.remove('show');
        }
    }
}


const showChangeText = (element) => {
    element.querySelector('.change-text').style.display = 'block';
};

const hideChangeText = (element) => {
    element.querySelector('.change-text').style.display = 'none';
};
