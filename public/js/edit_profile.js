window.onload = () => {
    const user = JSON.parse(sessionStorage.getItem('user')) || {};
    console.log(user);

    if (!user.user_id) {
        alert('세션 정보가 없습니다!');
        return;
    }

    const userEmail = user.email || "user@example.com";
    const userName = user.username || "기본 이름";
    const userImage = user.image
        ? `http://localhost:3000/profile_images/${user.image}`
        : "http://localhost:3000/profile_images/profile_img.webp";

    document.getElementById('emailDisplay').innerText = userEmail;
    document.getElementById('username').value = userName;

    const previewImage = document.getElementById('preview');
    previewImage.src = userImage;
    previewImage.style.display = userImage ? 'block' : 'none';
};

// 토스트 메시지 표시 함수
const showToast = (message) => {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.className = "toast show";

    setTimeout(() => {
        toast.className = toast.className.replace("show", "");
    }, 3000);
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
};

const updateSessionOnServer = async (user) => {
    try {
        const response = await fetch('http://localhost:3000/api/update-session', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify(user)
        });

        if (!response.ok) {
            throw new Error('세션 업데이트 실패');
        }

        console.log('서버 세션이 성공적으로 업데이트되었습니다.');
    } catch (error) {
        console.error('서버 세션 업데이트 오류:', error.message);
    }
};


// 프로필 이미지 변경 텍스트 표시/숨기기
const showChangeText = (element) => {
    element.querySelector('.change-text').style.display = 'block';
};

const hideChangeText = (element) => {
    element.querySelector('.change-text').style.display = 'none';
};

// 회원정보 수정
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

    formData.append('username', username);
    if (fileInput) {
        formData.append('profilePic', fileInput);
    }

    try {
        const response = await fetch(`http://localhost:3000/api/user/${userId}`, {
            method: 'PUT',
            body: formData,
        });

        const result = await response.json();
        console.log('Response from server:', result);

        if (response.ok) {
            // sessionStorage 업데이트
            user.username = username;
            if (result.user.image) {
                user.image = result.user.image; // 서버에서 반환된 이미지 이름 사용
            }
            sessionStorage.setItem('user', JSON.stringify(user));
            console.log('Updated user saved to sessionStorage:', JSON.parse(sessionStorage.getItem('user')));

            // UI 업데이트 및 성공 메시지
            showToast('회원정보가 성공적으로 수정되었습니다!');

            // 페이지 새로고침
            setTimeout(() => {
                location.reload(); // 페이지 새로고침
            }, 1500); // 토스트 메시지 표시 후 새로고침
        } else {
            alert(result.message || '회원정보 수정에 실패했습니다.');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('서버 오류가 발생했습니다.');
    }
};



document.getElementById('editForm').addEventListener('submit', editProfile);


