
const validatePassword = () => {
    const passwordInput = document.getElementById("password");
    const passwordError = document.getElementById("passwordError");
    const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,20}$/;

    if (passwordInput.value === "") {
        passwordError.style.display = "none"; // 비어있을 경우 오류 메시지 숨김
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
        passwordMatchError.style.display = "none"; // 비어있을 경우 오류 메시지 숨김
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

const checkFormValidity = ()=> {
    const isPasswordValid = validatePassword();
    const isPasswordMatch = validatePasswordMatch();
    const formIsValid = isPasswordValid && isPasswordMatch;

    document.getElementById("loginButton").disabled = !formIsValid; // 버튼 활성화/비활성화
};

// 각 입력 필드에서 입력 이벤트 발생 시 오류 메시지 숨기기 및 유효성 검사
document.getElementById("password").addEventListener("input", () => {
    validatePassword();
    checkFormValidity();
});

document.getElementById("password_check").addEventListener("input", () => {
    validatePasswordMatch();
    checkFormValidity();
});
