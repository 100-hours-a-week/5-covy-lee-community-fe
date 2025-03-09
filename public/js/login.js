const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const loginButton = document.getElementById("loginButton");
const emailError = document.getElementById("emailError");
const passwordError = document.getElementById("passwordError");

const validateEmail = () => {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (emailInput.value === "") {
        emailError.style.display = "none"; // 비어있을 경우 오류 메시지 숨김
        return false;
    }
    if (!emailPattern.test(emailInput.value)) {
        emailError.style.display = "block";
        emailError.textContent = "유효한 이메일 주소를 입력해주세요.";
        return false;
    } else {
        emailError.style.display = "none";
        return true;
    }
};

const validatePassword = () => {
    const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+=~`|<>?/\\{}[\]:;'",.-])[A-Za-z\d!@#$%^&*()_+=~`|<>?/\\{}[\]:;'",.-]{8,20}$/;
    if (passwordInput.value === "") {
        passwordError.style.display = "none"; // 비어있을 경우 오류 메시지 숨김
        return false;
    }
    if (!passwordPattern.test(passwordInput.value)) {
        passwordError.style.display = "block";
        passwordError.textContent = "비밀번호는 8~20자, 대소문자, 숫자, 특수문자를 포함해야 합니다.";
        return false;
    } else {
        passwordError.style.display = "none";
        return true;
    }
};

const checkFormValidity = () => {
    const isEmailValid = validateEmail();
    const isPasswordValid = validatePassword();
    const formIsValid = isEmailValid && isPasswordValid;

    // 로그인 버튼 활성화/비활성화
    loginButton.disabled = !formIsValid;
};

// 이벤트 리스너 추가
emailInput.addEventListener("input", () => {
    validateEmail();
    checkFormValidity();
});

passwordInput.addEventListener("input", () => {
    validatePassword();
    checkFormValidity();
});

// 로그인 폼 제출 이벤트 처리
document.getElementById("loginForm").addEventListener("submit", async (event) => {
    event.preventDefault(); // 기본 제출 동작 방지

    const email = emailInput.value.trim(); // 입력값 정리
    const password = passwordInput.value;

    try {
        const response = await fetch(`${window.API_BASE_URL}/api/login`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include", // 쿠키 포함하여 서버에 세션 정보 전달
            body: JSON.stringify({ email, password }),
        });

        const data = await response.json();

        if (response.ok) {
            console.log("서버로부터 받은 데이터:", data);

            // HTML 디코딩 함수
            const decodeHtml = (input) => {
                const txt = document.createElement("textarea");
                txt.innerHTML = input;
                return txt.value;
            };

            // 디코딩된 username 처리
            const user = {
                ...data.user,
                username: decodeHtml(data.user.username), // username 디코딩
            };

            // 세션 스토리지에 저장
            sessionStorage.setItem("user", JSON.stringify(user));

            alert("로그인 성공 " + user.username + "님 반갑습니다!");
            window.location.href = "./community.html";
        } else {
            alert("로그인 실패: " + data.message);
        }
    } catch (error) {
        console.error("오류 발생:", error);
        alert("서버와의 통신에 문제가 발생했습니다.");
    }
});

document.addEventListener("DOMContentLoaded", function () {
    const kakaoLoginBtn = document.getElementById("kakaoLogin");

    // ✅ 1. 카카오 로그인 버튼 클릭 → 로그인 URL 요청 → 이동
    kakaoLoginBtn.addEventListener("click", function (event) {
        event.preventDefault(); // 기본 동작 방지

        fetch("http://localhost:3000/oauth/kakao")
            .then(response => response.text()) // 로그인 URL 받아오기
            .then(kakaoLoginUrl => {
                window.location.href = kakaoLoginUrl; // 카카오 로그인 페이지로 이동
            })
            .catch(error => console.error("카카오 로그인 요청 실패:", error));
    });

    // ✅ 2. 로그인 성공 후 URL에서 토큰 가져오기
    const urlParams = new URLSearchParams(window.location.search);
    const accessToken = urlParams.get("token");

    if (accessToken) {
        console.log("🔑 Access Token:", accessToken); // 디버깅용

        // ✅ 3. 백엔드에 사용자 정보 요청
        fetch(`http://localhost:3000/oauth/kakao/userinfo?token=${accessToken}`)
            .then(response => response.json())
            .then(userInfo => {
                console.log("👤 User Info:", userInfo);
                alert(`환영합니다, ${userInfo.nickname}! 🎉`);

                // ✅ 4. 닉네임과 프로필 이미지를 화면에 표시
                document.getElementById("userNickname").textContent = userInfo.nickname;
                document.getElementById("userProfileImage").src = userInfo.profile_image;
                document.getElementById("userProfileImage").style.display = "block";
            })
            .catch(error => console.error("사용자 정보 요청 실패:", error));
    }
});
