const params = new URLSearchParams(window.location.search);
const postId = params.get('id'); // 게시글 ID

if (!postId) {
    console.error('게시글 ID가 없습니다.');
    alert('게시글 ID가 필요합니다.');
} else {
    // 게시글 정보 가져오기
    async function fetchPost() {
        try {
            const response = await fetch(`http://localhost:3000/api/posts/${postId}`, {
                method: 'GET',
                credentials: 'include'  // 쿠키를 포함하여 요청을 보냄
            });

            if (!response.ok) {
                throw new Error('게시글을 불러오는 데 실패했습니다.');
            }

            const post = await response.json();

            // 게시글 정보 설정
            document.getElementById('postTitle').innerText = post.title || '제목 없음';
            document.getElementById('postContent').innerText = post.content || '내용 없음';
            document.getElementById('postUsername').innerText = post.author || '작성자 정보 없음';

            // 이미지 설정 (이미지가 없으면 기본 이미지 사용)
            const imageUrl = post.image ? `http://localhost:3000/post_images/${post.image}` : `http://localhost:3000/post_images/default-image.jpg`;
            document.getElementById('postImage').src = imageUrl;

            // 좋아요, 방문자 수, 댓글 수 설정
            document.getElementById('postLike').innerText = post.like || 0;
            document.getElementById('postVisitor').innerText = post.visitor || 0;
            document.getElementById('postComment').innerText = post.comment || 0;

            // 수정 버튼 링크 설정
            document.getElementById('editButton').href = `./edit.html?id=${postId}`;
        } catch (error) {
            console.error('게시글 가져오기 오류:', error);
            alert('게시글을 불러오는 데 문제가 발생했습니다.');
        }
    }

    fetchPost();
}

// 게시글 삭제 API 호출
const deletePost = async () => {
    try {
        const response = await fetch(`http://localhost:3000/api/posts/${postId}`, {
            method: 'DELETE',
            credentials: 'include', // 세션 쿠키 포함
        });

        if (!response.ok) {
            // 서버에서 반환한 오류 메시지를 읽음
            const errorData = await response.json();
            alert(errorData.message || '게시글 삭제에 실패했습니다.');
            return; // 오류 발생 시 이후 코드 실행 중단
        }

        const result = await response.json();
        alert(result.message);
        window.location.href = './community.html'; // 삭제 후 목록 페이지로 이동
    } catch (error) {
        // 브라우저에 불필요한 디버깅 메시지 출력 방지
        console.error('게시글 삭제 요청 중 오류 발생:', error.message);
        alert('게시글 삭제 중 오류가 발생했습니다.');
    }
};

// 댓글 작성 함수
const submitComment = () => {
    const commentInput = document.getElementById('commentInput');
    const commentText = commentInput.value.trim();
    if (commentText) {
        const commentList = document.getElementById('commentList');
        const commentDiv = document.createElement('div');
        commentDiv.classList.add('comment');
        commentDiv.textContent = commentText;
        commentList.appendChild(commentDiv);
        commentInput.value = ''; // 입력 필드 초기화
    } else {
        alert('댓글을 입력하세요.');
    }
};

// 모달 열기 함수
const showModal = () => {
    document.getElementById('deleteModal').style.display = 'block';
};

// 모달 닫기 함수
const closeModal = () => {
    document.getElementById('deleteModal').style.display = 'none';
};

// 삭제 확인 함수
const confirmDelete = () => {
    deletePost(); // 실제 삭제 API 호출
    closeModal(); // 모달 닫기
};
