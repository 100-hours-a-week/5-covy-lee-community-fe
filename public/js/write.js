window.onload = () => {
    const user = JSON.parse(sessionStorage.getItem('user')) || {}; // 세션 스토리지에서 'user' 객체 가져오기
    console.log('User Session:', user); // 세션 정보 로그로 확인

    if (!user.user_id) {
        alert('세션 정보가 없습니다! 로그인 페이지로 이동합니다.');
        window.location.href = './login.html'; // 로그인 페이지로 이동
        return;
    }
};

document.querySelector('.submit-button').addEventListener('click', async () => {
    const title = document.getElementById('title').value;
    const content = document.getElementById('content').value;
    const image = document.getElementById('image').files[0];

    // 폼 유효성 검사
    if (!title || !content) {
        alert("제목과 내용을 입력하세요.");
        return;
    }

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

    // FormData 내용 출력
    console.log('FormData 내용 확인:');
    for (const [key, value] of formData.entries()) {
        console.log(`${key}:`, value);
    }

    try {
        const response = await fetch('http://localhost:3000/api/posts', {
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


