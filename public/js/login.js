const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const loginButton = document.getElementById("loginButton");
const emailError = document.getElementById("emailError");
const passwordError = document.getElementById("passwordError");

const validateEmail=() => {
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

const validatePassword = () => {
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

const checkFormValidity = () => {
    const isEmailValid = validateEmail();
    const isPasswordValid = validatePassword();
    const formIsValid = isEmailValid && isPasswordValid;
    loginButton.disabled = !formIsValid; // 버튼 활성화/비활성화
};

emailInput.addEventListener("input",  () => {
    validateEmail();
    checkFormValidity();
});

passwordInput.addEventListener("input", ()=>  {
    validatePassword();
    checkFormValidity();
});

// 로그인 폼 제출 이벤트 처리
document.getElementById("loginForm").addEventListener("submit", async (event) => {
    event.preventDefault(); // 기본 제출 동작 방지

    const email = emailInput.value;
    const password = passwordInput.value;

    try {
        const response = await fetch('http://localhost:3000/api/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',  // 쿠키를 포함하여 서버에 세션 정보 전달
            body: JSON.stringify({ email, password }),
        });

        const data = await response.json();

        // if (response.ok) {
        //     console.log('서버로부터 받은 데이터:', data);
        //     sessionStorage.setItem('userImage', data.user.image); // 프로필 이미지
        //     sessionStorage.setItem('userName', data.user.username); // 사용자 이름
        //
        //     alert('로그인 성공 ' + data.user.username + "님 반갑습니다!");
        //     window.location.href = './community.html';
        // } else {
        //     alert('로그인 실패: ' + data.message);
        // }
        if (response.ok) {
            console.log('서버로부터 받은 데이터:', data);
            sessionStorage.setItem('user', JSON.stringify(data.user));

            alert('로그인 성공 ' + data.user.username + "님 반갑습니다!");
            window.location.href = './community.html';
        } else {
            alert('로그인 실패: ' + data.message);
        }

    } catch (error) {
        console.error('오류 발생:', error);
        alert('서버와의 통신에 문제가 발생했습니다.');
    }
});

