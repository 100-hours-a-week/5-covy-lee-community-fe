window.onload = async () => {
    try {
        // 서버에서 현재 세션 정보 가져오기
        const response = await fetch(`${window.API_BASE_URL}/api/check-session`, {
            method: 'GET',
            credentials: 'include', // 쿠키 포함
        });

        if (response.ok) {
            const result = await response.json();
            console.log('User session from server:', result.user);
            sessionStorage.setItem('user', JSON.stringify(result.user)); // 세션 정보를 sessionStorage에 저장
        } else {
            alert('로그인 정보가 유효하지 않습니다. 다시 로그인해주세요.');
            window.location.href = '/login.html'; // 로그인 페이지로 리다이렉트
        }
    } catch (error) {
        console.error('세션 정보를 가져오는 중 오류 발생:', error);
        alert('서버와의 통신 중 문제가 발생했습니다.');
    }
};

// 유효성 검사 함수
const validateCurrentPassword = () => {
    const currentPasswordInput = document.getElementById("currentPassword");
    const currentPasswordError = document.getElementById("currentPasswordError");
    const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+=~`|<>?/\\{}[\]:;'",.-])[A-Za-z\d!@#$%^&*()_+=~`|<>?/\\{}[\]:;'",.-]{8,20}$/;

    if (currentPasswordInput.value.trim() === "") {
        currentPasswordError.style.display = "none";
        return false;
    }

    if (!passwordPattern.test(currentPasswordInput.value.trim())) {
        currentPasswordError.style.display = "block";
        currentPasswordError.textContent = "비밀번호는 8자 이상 20자 이하이며 대문자, 소문자, 숫자, 특수문자를 포함해야 합니다.";
        return false;
    }

    currentPasswordError.style.display = "none";
    return true;
};

const validatePassword = () => {
    const passwordInput = document.getElementById("password");
    const passwordError = document.getElementById("passwordError");
    const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+=~`|<>?/\\{}[\]:;'",.-])[A-Za-z\d!@#$%^&*()_+=~`|<>?/\\{}[\]:;'",.-]{8,20}$/;

    if (passwordInput.value === "") {
        passwordError.style.display = "none";
        return false;
    }

    if (!passwordPattern.test(passwordInput.value)) {
        passwordError.style.display = "block";
        passwordError.textContent = "비밀번호는 8자 이상 20자 이하이며 대문자, 소문자, 숫자, 특수문자를 포함해야 합니다.";
        return false;
    }

    passwordError.style.display = "none";
    return true;
};

const validatePasswordMatch = () => {
    const passwordInput = document.getElementById("password");
    const passwordCheckInput = document.getElementById("password_check");
    const passwordMatchError = document.getElementById("passwordMatchError");

    if (passwordCheckInput.value === "") {
        passwordMatchError.style.display = "none";
        return false;
    }

    if (passwordInput.value !== passwordCheckInput.value) {
        passwordMatchError.style.display = "block";
        passwordMatchError.textContent = "새 비밀번호가 일치하지 않습니다.";
        return false;
    }

    passwordMatchError.style.display = "none";
    return true;
};

const checkFormValidity = () => {
    const isCurrentPasswordValid = validateCurrentPassword();
    const isPasswordValid = validatePassword();
    const isPasswordMatch = validatePasswordMatch();

    const formIsValid = isCurrentPasswordValid && isPasswordValid && isPasswordMatch;
    document.getElementById("updatePassword").disabled = !formIsValid; // 버튼 활성화/비활성화
};

// 입력 이벤트 리스너 추가
document.getElementById("currentPassword").addEventListener("input", checkFormValidity);
document.getElementById("password").addEventListener("input", checkFormValidity);
document.getElementById("password_check").addEventListener("input", checkFormValidity);

// 폼 제출 처리
document.getElementById("editForm").addEventListener("submit", async (e) => {
    e.preventDefault(); // 기본 제출 방지

    const currentPassword = document.getElementById("currentPassword").value.trim();
    const newPassword = document.getElementById("password").value.trim();
    const confirmPassword = document.getElementById("password_check").value.trim();

    try {
        const response = await fetch(`${window.API_BASE_URL}/api/user/password`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include',
            body: JSON.stringify({ currentPassword, newPassword, confirmPassword })
        });

        const result = await response.json();
        if (response.ok) {
            alert(result.message || '비밀번호가 성공적으로 변경되었습니다!');

            // 비밀번호 변경 후 로그아웃
            const logoutResponse = await fetch(`${window.API_BASE_URL}/api/logout`, {
                method: 'POST',
                credentials: 'include'
            });

            if (logoutResponse.ok) {
                // 클라이언트 세션 스토리지 삭제
                sessionStorage.clear();
                alert('비밀번호 변경이 완료되었습니다. 다시 로그인해 주세요.');
                window.location.href = './login.html'; // 로그인 페이지로 이동
            } else {
                alert('로그아웃 중 문제가 발생했습니다. 다시 시도해주세요.');
            }
        } else {
            alert(result.message || '비밀번호 변경 중 오류가 발생했습니다.');
        }
    } catch (error) {
        console.error('비밀번호 변경 요청 중 오류 발생:', error);
        alert('서버와의 통신 중 문제가 발생했습니다.');
    }
});



