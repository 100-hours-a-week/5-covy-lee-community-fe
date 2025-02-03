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
        ? `${user.image}`
        : `${window.API_BASE_URL}/default_images/default_profile.webp`;

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

// 프로필 이미지 변경 텍스트 표시/숨기기
const showChangeText = (element) => {
    element.querySelector('.change-text').style.display = 'block';
};

const hideChangeText = (element) => {
    element.querySelector('.change-text').style.display = 'none';
};

// 닉네임 중복 검사 함수
let usernameAbortController;

const validateUsername = async () => {
    const user = JSON.parse(sessionStorage.getItem('user'));
    const usernameInput = document.getElementById('username');
    const usernameValue = usernameInput.value.trim();
    const usernameError = document.getElementById('usernameError');

    // 입력값이 비어있는 경우
    if (usernameValue === "") {
        usernameError.textContent = "닉네임은 필수 입력 항목입니다.";
        usernameError.style.color = "red";
        usernameError.style.display = "block";
        return false;
    }

    // 현재 닉네임과 동일한 경우
    if (usernameValue === user.username) {
        usernameError.textContent = ""; // 메시지 초기화
        usernameError.style.display = "none"; // 숨김
        return true;
    }

    // 닉네임 형식 검사
    const usernamePattern = /^[^\s]{1,10}$/;
    if (!usernamePattern.test(usernameValue)) {
        usernameError.textContent = "닉네임은 공백 없이 1~10자여야 합니다.";
        usernameError.style.color = "red";
        usernameError.style.display = "block";
        return false;
    }

    // 기존 요청 취소
    if (usernameAbortController) {
        usernameAbortController.abort();
    }

    // 새로운 AbortController 생성
    usernameAbortController = new AbortController();

    try {
        const response = await fetch(`${window.API_BASE_URL}/api/check-username?username=${usernameValue}`, {
            signal: usernameAbortController.signal, // 요청에 AbortController 신호 추가
        });

        if (response.ok) {
            usernameError.textContent = "사용 가능한 닉네임입니다.";
            usernameError.style.color = "green";
            usernameError.style.display = "block";
            return true;
        } else {
            const data = await response.json();
            usernameError.textContent = data.message || "이미 사용 중인 닉네임입니다.";
            usernameError.style.color = "red";
            usernameError.style.display = "block";
            return false;
        }
    } catch (error) {
        if (error.name === "AbortError") {
            console.log("이전 요청이 취소되었습니다."); // 디버깅 로그
            return false;
        }
        console.error("닉네임 중복 검사 중 오류 발생:", error);
        usernameError.textContent = "중복 검사 실패. 다시 시도해주세요.";
        usernameError.style.color = "red";
        usernameError.style.display = "block";
        return false;
    }
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
    const usernameInput = document.getElementById('username');
    const username = usernameInput.value.trim(); // 닉네임 입력값
    const fileInput = document.getElementById('fileInput').files[0];

    // 닉네임 입력이 있는 경우에만 중복 검사 수행
    if (username !== user.username) { // 기존 닉네임과 다를 경우에만 검사
        const isUsernameValid = await validateUsername();
        if (!isUsernameValid) {
            return; // 닉네임 중복 검사 실패 시 함수 종료
        }
    }

    // 회원정보 수정 요청 진행
    const formData = new FormData();
    formData.append('username', username || user.username); // 닉네임이 비어 있으면 기존 닉네임 유지
    if (fileInput) {
        formData.append('profilePic', fileInput); // 새로운 프로필 이미지가 있으면 추가
    }

    try {
        const response = await fetch(`${window.API_BASE_URL}/api/user/${userId}`, {
            method: 'PUT',
            body: formData,
        });

        const result = await response.json();
        console.log('Response from server:', result);

        if (response.ok) {
            // sessionStorage 업데이트
            user.username = username || user.username; // 기존 닉네임 유지 또는 새 닉네임 업데이트
            if (result.user.image) {
                user.image = result.user.image; // 서버에서 반환된 이미지 사용
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


// 회원탈퇴 로직 (위 코드 그대로 사용)
const deleteUser = async () => {
    const user = JSON.parse(sessionStorage.getItem('user'));

    if (!user || !user.user_id) {
        alert("사용자 정보가 없습니다. 다시 로그인 해주세요.");
        return;
    }

    if (!confirm("정말로 회원탈퇴 하시겠습니까?")) {
        return; // 사용자 취소 시 함수 종료
    }

    try {
        const response = await fetch(`${window.API_BASE_URL}/api/user/${user.user_id}`, {
            method: "DELETE",
            credentials: "include",
        });

        const result = await response.json();

        if (response.ok) {
            alert("회원탈퇴가 성공적으로 처리되었습니다.");
            sessionStorage.removeItem('user');
            window.location.href = "/";
        } else {
            alert(result.message || "회원탈퇴에 실패했습니다.");
        }
    } catch (error) {
        console.error("회원탈퇴 중 오류 발생:", error.message);
        alert("서버 오류로 회원탈퇴에 실패했습니다.");
    }
};

// 이벤트 리스너 추가
document.getElementById('withdrawButton').addEventListener('click', deleteUser);
document.getElementById('editForm').addEventListener('submit', editProfile);
document.getElementById('username').addEventListener('input', validateUsername);
