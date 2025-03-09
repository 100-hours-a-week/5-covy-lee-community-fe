window.addEventListener('DOMContentLoaded', async () => {
    // 1. 세션 정보를 서버에서 재요청하여 sessionStorage에 저장
    try {
        const response = await fetch(`${window.API_BASE_URL}/api/me`, {
            method: 'GET',
            credentials: 'include' // 쿠키 포함
        });
        if (!response.ok) {
            throw new Error(`API 호출 실패: ${response.statusText}`);
        }
        const data = await response.json();
        if (!data.user) {
            throw new Error('사용자 정보가 없습니다.');
        }
        // sessionStorage에 사용자 정보 저장
        sessionStorage.setItem('user', JSON.stringify(data.user));
    } catch (error) {
        console.error('API /api/me 호출 중 에러:', error.message);
        alert('세션 정보가 없습니다! 로그인 페이지로 이동합니다.');
        window.location.href = './login.html';
        return;
    }

    // 2. 저장된 세션 정보를 읽어와서 페이지에 반영
    const user = JSON.parse(sessionStorage.getItem('user')) || {}; // 세션 스토리지에서 'user' 객체 가져오기
    console.log('User Session:', user); // 세션 정보 로그로 확인

    if (!user.user_id) {
        alert('세션 정보가 없습니다! 로그인 페이지로 이동합니다.');
        window.location.href = './login.html'; // 로그인 페이지로 이동
        return;
    }

    // 3. 게시글 작성 관련 입력 필드 설정

    // 제목 입력 필드 길이 제한 및 공백 처리
    const titleInput = document.getElementById('title');
    titleInput.addEventListener('input', () => {
        titleInput.value = titleInput.value.replace(/^\s+/, ''); // 앞쪽 공백 제거
        if (titleInput.value.length > 26) {
            titleInput.value = titleInput.value.slice(0, 26); // 초과된 부분 잘라냄
        }
    });

    // 내용 입력 필드 길이 제한 및 공백 처리
    const contentInput = document.getElementById('content');
    const maxContentLength = 5000; // 글자 수 제한 설정 (예: 5000자)
    contentInput.addEventListener('input', () => {
        if (contentInput.value.length > maxContentLength) {
            contentInput.value = contentInput.value.slice(0, maxContentLength); // 초과된 부분 잘라냄
            alert(`게시글 내용은 최대 ${maxContentLength}자까지 작성 가능합니다.`);
        }
    });
});

document.querySelector('.submit-button').addEventListener('click', async () => {
    let title = document.getElementById('title').value.trim(); // 제목 공백 제거
    let content = document.getElementById('content').value.trim(); // 내용 공백 제거
    const image = document.getElementById('image').files[0];

    const maxContentLength = 5000; // 동일한 글자 제한 적용
    if (content.length > maxContentLength) {
        alert(`게시글 내용은 최대 ${maxContentLength}자까지 작성 가능합니다.`);
        return;
    }

    // 제목과 내용 유효성 검사 및 메시지 분리
    if (!title && !content) {
        alert("제목과 내용을 모두 입력하세요.");
        return;
    } else if (!title) {
        alert("제목을 입력하세요. 공백만 입력할 수 없습니다.");
        return;
    } else if (!content) {
        alert("내용을 입력하세요. 공백만 입력할 수 없습니다.");
        return;
    }

    // 세션에서 사용자 정보를 다시 확인
    const user = JSON.parse(sessionStorage.getItem('user')) || {};
    if (!user.user_id) {
        alert('세션 정보가 없습니다! 로그인 페이지로 이동합니다.');
        window.location.href = './login.html'; // 로그인 페이지로 이동
        return;
    }

    const formData = new FormData();
    formData.append('title', title);
    formData.append('content', content);
    formData.append('user_id', user.user_id); // user_id 추가
    if (image) {
        formData.append('postImage', image);
    }

    // FormData 내용 로그로 확인
    console.log('FormData 내용 확인:');
    for (const [key, value] of formData.entries()) {
        console.log(`${key}:`, value);
    }

    try {
        const response = await fetch(`${window.API_BASE_URL}/api/posts`, {
            method: 'POST',
            body: formData,
            credentials: 'include' // 세션 쿠키 포함
        });

        const result = await response.json();

        if (response.ok) {
            alert(result.message);
            window.location.href = './community.html'; // 게시글 작성 완료 후 이동
        } else {
            alert(result.message || '게시글 작성 중 오류가 발생했습니다.');
        }
    } catch (error) {
        console.error('API 요청 실패:', error);
        alert('서버와의 연결에 실패했습니다.');
    }
});
