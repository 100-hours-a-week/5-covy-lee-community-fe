const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const passwordCheckInput = document.getElementById("password_check");
const usernameInput = document.getElementById("username");
const signupButton = document.getElementById("signupButton");

const emailError = document.getElementById("emailError");
const passwordError = document.getElementById("passwordError");
const passwordMatchError = document.getElementById("passwordMatchError");
const usernameError = document.getElementById("usernameError");

const signupForm = document.getElementById("signupform");
const fileInput = document.getElementById("fileInput");

// 비밀번호 확인
signupForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const email = emailInput.value;
    const password = passwordInput.value;
    const passwordCheck = passwordCheckInput.value;
    const username = usernameInput.value;
    const file = fileInput.files[0];

    if (password !== passwordCheck) {
        alert("비밀번호가 일치하지 않습니다.");
        return;
    }

    const formData = new FormData();
    formData.append("email", email);
    formData.append("password", password);
    formData.append("username", username);
    if (file) formData.append("profilePic", file);

    try {
        const response = await fetch(`${window.API_BASE_URL}/api/register`, {
            method: "POST",
            body: formData,
        });
        const data = await response.json();

        if (response.ok) {
            alert("회원가입 성공!");
            window.location.href = "./login.html";
        } else {
            alert(data.message || "회원가입 실패");
        }
    } catch (error) {
        console.error("회원가입 중 오류 발생:", error);
        alert("회원가입에 실패했습니다. 다시 시도해주세요.");
    }
});

// 이미지 미리보기
const previewImage = (event) => {
    const file = event.target.files[0];
    const previewCircle = document.querySelector(".circle");

    if (file) {
        previewCircle.style.backgroundImage = `url(${URL.createObjectURL(file)})`;
        previewCircle.style.backgroundSize = "cover";
        previewCircle.style.backgroundPosition = "center";
        previewCircle.style.backgroundColor = "transparent";
        previewCircle.querySelector("span").style.display = "none";
    } else {
        previewCircle.style.backgroundImage = "none";
        previewCircle.style.backgroundColor = "#D5C9DD";
        previewCircle.querySelector("span").style.display = "block";
    }
};

// 유효성 검사
const validateEmail = () => {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const emailValue = emailInput.value;

    if (emailValue === "") {
        emailError.style.display = "none";
        return false;
    }
    if (!emailPattern.test(emailValue)) {
        emailError.style.display = "block";
        return false;
    }
    emailError.style.display = "none";
    return true;
};

let emailDebounceTimeout;

const validateEmailDuplication = async () => {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const emailValue = emailInput.value.trim(); // 앞뒤 공백 제거

    // 이메일 입력란이 비어 있는 경우 메시지 숨기기
    if (emailValue === "") {
        clearTimeout(emailDebounceTimeout); // 이전 타임아웃 초기화
        emailError.textContent = ""; // 메시지 초기화
        emailError.style.display = "none"; // 메시지 숨김
        return false;
    }

    // 이메일 형식 확인
    if (!emailPattern.test(emailValue)) {
        clearTimeout(emailDebounceTimeout); // 이전 타임아웃 초기화
        emailError.textContent = "유효한 이메일 형식을 입력해주세요.";
        emailError.style.color = "red";
        emailError.style.display = "block";
        return false;
    }

    clearTimeout(emailDebounceTimeout);

    // 중복 검사 API 요청
    return new Promise((resolve) => {
        emailDebounceTimeout = setTimeout(async () => {
            try {
                const response = await fetch(
                    `${window.API_BASE_URL}/api/check-email?email=${emailValue}`
                );

                if (response.ok) {
                    emailError.textContent = "사용 가능한 이메일입니다.";
                    emailError.style.color = "green";
                    emailError.style.display = "block";
                    resolve(true);
                } else {
                    const data = await response.json();
                    emailError.textContent = data.message || "이미 등록된 이메일입니다.";
                    emailError.style.color = "red";
                    emailError.style.display = "block";
                    resolve(false);
                }
            } catch (error) {
                console.error("이메일 중복 검사 중 오류 발생:", error);
                emailError.textContent = "중복 검사 실패. 다시 시도해주세요.";
                emailError.style.color = "red";
                emailError.style.display = "block";
                resolve(false);
            }
        }, 300);
    });
};

const validatePassword = () => {
    const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+=~`|<>?/\\{}[\]:;'",.-])[A-Za-z\d!@#$%^&*()_+=~`|<>?/\\{}[\]:;'",.-]{8,20}$/;
    const passwordValue = passwordInput.value;

    if (passwordValue === "") {
        passwordError.style.display = "none";
        return false;
    }
    if (!passwordPattern.test(passwordValue)) {
        passwordError.style.display = "block";
        return false;
    }
    passwordError.style.display = "none";
    return true;
};

const validatePasswordMatch = () => {
    if (passwordCheckInput.value === "") {
        passwordMatchError.style.display = "none";
        return false;
    }
    if (passwordInput.value !== passwordCheckInput.value) {
        passwordMatchError.style.display = "block";
        return false;
    }
    passwordMatchError.style.display = "none";
    return true;
};

let usernameDebounceTimeout;

const validateUsername = async () => {
    const usernamePattern = /^[^\s]{1,10}$/;
    const usernameValue = usernameInput.value.trim(); // 앞뒤 공백 제거

    // 닉네임 입력란이 비어 있는 경우 메시지 숨기기
    if (usernameValue === "") {
        clearTimeout(usernameDebounceTimeout); // 이전 타임아웃 초기화
        usernameError.textContent = ""; // 메시지 초기화
        usernameError.style.display = "none"; // 메시지 숨김
        return false;
    }

    // 패턴 확인: 공백 없이 1~10자 조건 확인
    if (!usernamePattern.test(usernameValue)) {
        clearTimeout(usernameDebounceTimeout); // 이전 타임아웃 초기화
        usernameError.textContent = "사용자 이름은 공백 없이 1~10자여야 합니다.";
        usernameError.style.color = "red";
        usernameError.style.display = "block";
        return false;
    }

    clearTimeout(usernameDebounceTimeout);

    // 중복 검사 API 요청
    return new Promise((resolve) => {
        usernameDebounceTimeout = setTimeout(async () => {
            try {
                const response = await fetch(
                    `${window.API_BASE_URL}/api/check-username?username=${usernameValue}`
                );

                if (response.ok) {
                    usernameError.textContent = "사용 가능한 사용자 이름입니다.";
                    usernameError.style.color = "green";
                    usernameError.style.display = "block";
                    resolve(true);
                } else {
                    const data = await response.json();
                    usernameError.textContent = data.message || "이미 사용 중인 사용자 이름입니다.";
                    usernameError.style.color = "red";
                    usernameError.style.display = "block";
                    resolve(false);
                }
            } catch (error) {
                console.error("닉네임 중복 검사 중 오류 발생:", error);
                usernameError.textContent = "중복 검사 실패. 다시 시도해주세요.";
                usernameError.style.color = "red";
                usernameError.style.display = "block";
                resolve(false);
            }
        }, 300);
    });
};



const checkFormValidity = async () => {
    const isEmailValid = validateEmail() && await validateEmailDuplication(); // 이메일 중복 검사 포함
    const isPasswordValid = validatePassword();
    const isPasswordMatch = validatePasswordMatch();
    const isUsernameValid = await validateUsername();

    const formIsValid = isEmailValid && isPasswordValid && isPasswordMatch && isUsernameValid;

    signupButton.disabled = !formIsValid;
    signupButton.classList.toggle("active", formIsValid);
};

// 이벤트 리스너
emailInput.addEventListener("input", () => {
    validateEmail();
    validateEmailDuplication();
    checkFormValidity();
});
passwordInput.addEventListener("input", () => {
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
