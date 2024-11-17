window.onload = () => {
    const user = JSON.parse(sessionStorage.getItem('user')) || {}; // 세션 스토리지에서 'user' 객체 가져오기
    console.log(user); // 세션 정보 로그로 확인

    if (!user.user_id) {
        alert('세션 정보가 없습니다!');
        return;
    }

    const userEmail = user.email || "user@example.com";
    const userName = user.username || "기본 이름";
    const userImage = user.image ? `http://localhost:3000/routes/uploads/${user.image}` : "http://localhost:3000/routes/uploads/profile_img.webp";

    document.getElementById('emailDisplay').innerText = userEmail;
    document.getElementById('username').value = userName;

    const previewImage = document.getElementById('preview');
    previewImage.src = userImage;
    previewImage.style.display = userImage ? 'block' : 'none';
};

// 프로필 이미지 미리보기
const previewImage = (event) => {
    const file = event.target.files[0];
    const previewCircle = document.querySelector('.circle');

    if (file) {
        const imageUrl = URL.createObjectURL(file);
        previewCircle.style.backgroundImage = `url(${imageUrl})`;
        previewCircle.style.backgroundSize = 'cover';
        previewCircle.style.backgroundPosition = 'center';
        document.getElementById('preview').src = imageUrl;
    } else {
        previewCircle.style.backgroundImage = 'none';
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
    event.preventDefault();

    const user = JSON.parse(sessionStorage.getItem('user'));
    console.log('User from sessionStorage before update:', user);

    if (!user || !user.user_id) {
        alert('사용자 정보가 없습니다. 다시 로그인 해주세요.');
        return;
    }

    const userId = user.user_id;
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
        console.log('Response from server:', result);

        if (response.ok) {
            // 수정된 사용자 정보를 세션 스토리지에 업데이트
            user.username = username;
            if (fileInput) {
                user.image = fileInput.name; // 서버에서 이미지 파일 이름을 응답으로 제공해야 정확하게 업데이트 가능
            }
            sessionStorage.setItem('user', JSON.stringify(user));
            console.log('Updated user saved to sessionStorage:', JSON.parse(sessionStorage.getItem('user')));

            // 이미지 미리보기 갱신
            if (fileInput) {
                const imageUrl = `http://localhost:3000/routes/uploads/${fileInput.name}`;
                document.getElementById('preview').src = imageUrl;
                document.querySelector('.circle').style.backgroundImage = `url(${imageUrl})`;
            }

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


