const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const passwordCheckInput = document.getElementById("password_check");
const usernameInput = document.getElementById("username");
const signupButton = document.getElementById("signupButton");

const emailError = document.getElementById("emailError");
const passwordError = document.getElementById("passwordError");
const passwordMatchError = document.getElementById("passwordMatchError");
const usernameError = document.getElementById("usernameError");

// 클라이언트에서 회원가입 요청 보내기 (register.js)
const signupForm = document.getElementById("signupform");

signupForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const passwordCheck = document.getElementById("password_check").value;
    const username = document.getElementById("username").value;
    const fileInput = document.getElementById("fileInput");
    const file = fileInput.files[0];

    if (password !== passwordCheck) {
        alert("비밀번호가 일치하지 않습니다.");
        return;
    }

    const formData = new FormData();
    formData.append("email", email);
    formData.append("password", password);
    formData.append("username", username);
    if (file) formData.append("profilePic", file);  // 수정된 부분


    try {
        const response = await fetch(`${window.API_BASE_URL}/api/register`, {
            method: 'POST',
            body: formData,
        });
        const data = await response.json();

        if (response.ok) {
            alert("회원가입 성공!");
            window.location.href = './login.html'; // 로그인 페이지로 이동
        } else {
            alert(data.message || "회원가입 실패");
        }
    } catch (error) {
        console.error("회원가입 중 오류 발생:", error);
        alert("회원가입에 실패했습니다. 다시 시도해주세요.");
    }
});




const  previewImage= (event) => {
    const file = event.target.files[0];
    const previewCircle = document.querySelector('.circle');

    if (file) {
        // 이미지가 선택된 경우
        previewCircle.style.backgroundImage = `url(${URL.createObjectURL(file)})`;
        previewCircle.style.backgroundSize = 'cover';
        previewCircle.style.backgroundPosition = 'center';
        previewCircle.style.backgroundColor = 'transparent'; // 배경색 투명하게 설정
        previewCircle.querySelector('span').style.display = 'none';
    } else {
        // 이미지가 선택되지 않은 경우 (파일 입력이 비어있을 때)
        previewCircle.style.backgroundImage = 'none'; // 미리보기 초기화
        previewCircle.style.backgroundColor = '#D5C9DD'; // 기본 배경색으로 복원
        previewCircle.querySelector('span').style.display = 'block'; // '+' 아이콘 보이기
    }
}

const validateEmail = () => {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (emailInput.value === "") {
        emailError.style.display = "none"; // 비어있을 경우 오류 메시지 숨김
        return false;
    }
    if (!emailPattern.test(emailInput.value)) {
        emailError.style.display = "block";
        return false;
    } else {
        emailError.style.display = "none";
        return true;
    }
};

const validatePassword = ()  => {
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

const validateUsername = () => {
    const usernamePattern = /^[^\s]{1,10}$/;
    if (usernameInput.value === "") {
        usernameError.style.display = "none"; // 비어있을 경우 오류 메시지 숨김
        return false;
    }
    if (!usernamePattern.test(usernameInput.value)) {
        usernameError.style.display = "block";
        return false;
    } else {
        usernameError.style.display = "none";
        return true;
    }
};

const checkFormValidity = () => {
    // 모든 입력 필드의 유효성 검사 수행
    const isEmailValid = validateEmail();
    const isPasswordValid = validatePassword();
    const isPasswordMatch = validatePasswordMatch();
    const isUsernameValid = validateUsername();

    // 모든 검사가 통과했는지 확인
    const formIsValid = isEmailValid && isPasswordValid && isPasswordMatch && isUsernameValid;

    signupButton.disabled = !formIsValid; // 버튼 활성화/비활성화
    signupButton.classList.toggle("active", formIsValid); // 클래스 추가/제거
};

// 각 입력 필드에서 입력 이벤트 발생 시 오류 메시지 숨기기 및 유효성 검사
emailInput.addEventListener("input", () => {
    validateEmail();
    checkFormValidity();
});
passwordInput.addEventListener("input", ()  => {
    validatePassword();
    validatePasswordMatch();
    checkFormValidity();
});
passwordCheckInput.addEventListener("input", () => {
    validatePasswordMatch();
    checkFormValidity();
});
usernameInput.addEventListener("input", () => {
    validateUsername();
    checkFormValidity();

});