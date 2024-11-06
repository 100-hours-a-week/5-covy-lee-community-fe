document.querySelector('.submit-button').addEventListener('click', () => {
    const title = document.getElementById('title').value;
    const content = document.getElementById('content').value;
    const image = document.getElementById('image').files[0];

    // 폼 유효성 검사
    if (title && content) {
        // 게시글 작성 로직 추가 (예: API 요청 등)
        console.log("제목:", title);
        console.log("내용:", content);
        if (image) {
            console.log("첨부된 이미지 파일명:", image.name);
        }
        alert("게시글이 작성되었습니다."); // 작성 완료 알림

        // 커뮤니티 페이지로 이동
        window.location.href = './community.html';
    } else {
        alert("제목과 내용을 입력하세요."); // 유효성 검사 실패 알림
    }
});