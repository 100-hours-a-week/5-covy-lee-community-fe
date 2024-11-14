window.onload = () => {
    const user = JSON.parse(sessionStorage.getItem('user')) || {}; // 세션 스토리지에서 'user' 객체 가져오기
    console.log(user); // 세션 정보 로그로 확인

    if (!user) {
        alert('세션 정보가 없습니다!');
        return;
    }

    const userEmail = user.email || "user@example.com"; // 기본 이메일
    const userName = user.username || "기본 이름"; // 기본 닉네임
    const userImage = user.image ? `http://localhost:3000/routes/uploads/${user.image}` : "http://localhost:3000/routes/uploads/profile_img.webp";

    // 이메일 및 닉네임 표시
    document.getElementById('emailDisplay').innerText = userEmail;
    document.getElementById('username').value = userName;

    // 프로필 사진 미리보기
    const previewImage = document.getElementById('preview');
    previewImage.src = userImage;
    previewImage.style.display = userImage ? 'block' : 'none'; // 이미지가 있을 경우만 표시
};




// 프로필 이미지 미리보기
const previewImage = (event) => {
    const file = event.target.files[0];
    const previewCircle = document.querySelector('.circle');

    if (file) {
        previewCircle.style.backgroundImage = `url(${URL.createObjectURL(file)})`;
        previewCircle.style.backgroundSize = 'cover';
        previewCircle.style.backgroundPosition = 'center';
        previewCircle.style.backgroundColor = 'transparent'; // 배경색 투명하게 설정
        document.getElementById('preview').src = URL.createObjectURL(file); // 미리보기 이미지 업데이트
    } else {
        previewCircle.style.backgroundImage = 'none'; // 미리보기 초기화
        previewCircle.style.backgroundColor = '#D5C9DD'; // 기본 배경색으로 복원
    }
}

// 프로필 이미지 변경 텍스트 보여주기
const showChangeText = (element) => {
    element.querySelector('.change-text').style.display = 'block';
};

const hideChangeText = (element) => {
    element.querySelector('.change-text').style.display = 'none';
};

const editProfile = async (event) => {
    event.preventDefault(); // 폼 제출 기본 동작 막기

    // 세션 스토리지에서 사용자 정보 가져오기
    const user = JSON.parse(sessionStorage.getItem('user'));

    console.log('User from sessionStorage:', user); // user 객체 확인

    // user가 없거나 user.user_id가 없으면, 오류 처리
    if (!user || !user.user_id) {
        console.log('User or user.user_id is missing!');
        alert('사용자 정보가 없습니다. 다시 로그인 해주세요.');
        return;
    }

    const userId = user.user_id; // 사용자 ID를 user.user_id로 수정

    const formData = new FormData();
    const username = document.getElementById('username').value;
    const fileInput = document.getElementById('fileInput').files[0];

    // 사용자 이름과 이미지 파일 추가
    formData.append('username', username);
    if (fileInput) {
        formData.append('profilePic', fileInput);
    }

    try {
        const response = await fetch(`http://localhost:3000/api/user/${userId}`, {
            method: 'PUT',
            body: formData
        });

        const result = await response.json();

        if (response.ok) {
            // 수정 완료 시 사용자 정보를 갱신
            user.username = username;
            if (fileInput) {
                user.image = fileInput.name; // 파일 이름으로 사용자 이미지 갱신
            }
            sessionStorage.setItem('user', JSON.stringify(user)); // 세션 스토리지에 사용자 정보 저장

            alert('회원정보가 성공적으로 수정되었습니다!');
        } else {
            alert(result.message || '회원정보 수정에 실패했습니다.');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('서버 오류가 발생했습니다.');
    }
};



document.getElementById('editForm').addEventListener('submit', editProfile);

