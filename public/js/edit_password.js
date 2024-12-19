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
        return false;
    } else {
        passwordError.style.display = "none";
        return true;
    }
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
        return false;
    } else {
        passwordMatchError.style.display = "none";
        return true;
    }
};

const checkFormValidity = () => {
    const isPasswordValid = validatePassword();
    const isPasswordMatch = validatePasswordMatch();
    const formIsValid = isPasswordValid && isPasswordMatch;

    document.getElementById("updatePassword").disabled = !formIsValid; // 버튼 활성화/비활성화
};

// 입력 이벤트 리스너 추가
document.getElementById("password").addEventListener("input", checkFormValidity);
document.getElementById("password_check").addEventListener("input", checkFormValidity);

// 폼 제출 처리
document.getElementById("editForm").addEventListener("submit", async (e) => {
    e.preventDefault(); // 기본 제출 방지

    const newPassword = document.getElementById("password").value;
    const confirmPassword = document.getElementById("password_check").value;

    try {
        const response = await fetch(`${window.API_BASE_URL}/api/user/password`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include',
            body: JSON.stringify({ newPassword, confirmPassword })
        });

        const result = await response.json();
        if (response.ok) {
            alert(result.message || '비밀번호가 성공적으로 변경되었습니다!');
            document.getElementById("editForm").reset(); // 폼 초기화
            document.getElementById("updatePassword").disabled = true;
        } else {
            alert(result.message || '비밀번호 변경 중 오류가 발생했습니다.');
        }
    } catch (error) {
        console.error('비밀번호 변경 요청 중 오류 발생:', error);
        alert('서버와의 통신 중 문제가 발생했습니다.');
    }
});

