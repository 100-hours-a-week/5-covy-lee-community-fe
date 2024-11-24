const params = new URLSearchParams(window.location.search);
const postId = params.get('id'); // 게시글 ID

if (!postId) {
    console.error('게시글 ID가 없습니다.');
    alert('게시글 ID가 필요합니다.');
} else {
    // 게시글 정보 및 댓글 목록 가져오기
    fetchPost();
    fetchComments();
}

// 게시글 정보 가져오기
async function fetchPost() {
    try {
        const response = await fetch(`http://localhost:3000/api/posts/${postId}`, {
            method: 'GET',
            credentials: 'include', // 쿠키를 포함하여 요청을 보냄
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
        const imageUrl = post.image
            ? `http://localhost:3000/post_images/${post.image}`
            : `http://localhost:3000/post_images/default-image.jpg`;
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

// 댓글 목록 가져오기
async function fetchComments() {
    try {
        const response = await fetch(`http://localhost:3000/posts/${postId}/comments`, {
            method: 'GET',
            credentials: 'include', // 쿠키 포함
        });

        if (!response.ok) {
            throw new Error('댓글 목록을 불러오는 데 실패했습니다.');
        }

        const comments = await response.json();

        // 댓글 목록 화면에 추가
        comments.forEach(comment => addCommentToList(comment));
    } catch (error) {
        console.error('댓글 목록 가져오기 오류:', error);
        alert('댓글 목록을 불러오는 데 문제가 발생했습니다.');
    }
}

// 댓글 작성
const submitComment = async () => {
    const commentInput = document.getElementById('commentInput');
    const commentText = commentInput.value.trim();

    if (!commentText) {
        alert('댓글을 입력하세요.');
        return;
    }

    try {
        const response = await fetch(`http://localhost:3000/api/posts/${postId}/comments`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include', // 쿠키 포함
            body: JSON.stringify({ content: commentText }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            alert(errorData.message || '댓글 작성에 실패했습니다.');
            return;
        }

        // 서버에서 반환된 댓글 데이터
        const result = await response.json();

        // 작성된 댓글을 화면에 추가
        addCommentToList(result); // 서버 응답 데이터 그대로 사용

        commentInput.value = ''; // 입력 필드 초기화
    } catch (error) {
        console.error('댓글 작성 요청 중 오류 발생:', error.message);
        alert('댓글 작성 중 오류가 발생했습니다.');
    }
};


// 댓글 리스트에 댓글 추가
function addCommentToList(comment) {
    const commentList = document.getElementById('commentList');

    const commentDiv = document.createElement('div');
    commentDiv.classList.add('comment');
    commentDiv.style.display = "flex"; // 댓글과 버튼들을 한 줄에 정렬
    commentDiv.style.justifyContent = "space-between"; // 양쪽 정렬

    // 댓글 정보 컨테이너
    const commentInfoDiv = document.createElement('div');
    commentInfoDiv.classList.add('comment-info');

    const authorDiv = document.createElement('div');
    authorDiv.classList.add('comment-author');
    authorDiv.textContent = comment.author || '익명';

    const contentDiv = document.createElement('div');
    contentDiv.classList.add('comment-content');
    contentDiv.textContent = comment.content;

    const dateDiv = document.createElement('div');
    dateDiv.classList.add('comment-date');
    const createdAt = new Date(comment.created_at);
    dateDiv.textContent = !isNaN(createdAt) ? createdAt.toLocaleString() : '알 수 없는 날짜';

    commentInfoDiv.appendChild(authorDiv);
    commentInfoDiv.appendChild(contentDiv);
    commentInfoDiv.appendChild(dateDiv);

    // 수정 및 삭제 버튼 컨테이너
    const commentActionsDiv = document.createElement('div');
    commentActionsDiv.classList.add('comment-actions');

    // 수정 버튼
    const editButton = document.createElement('button');
    editButton.classList.add('edit-comment-btn');
    editButton.textContent = '수정';
    editButton.style.marginRight = "5px"; // 버튼 간 간격
    editButton.onclick = () => editComment(comment.comment_id); // 수정 함수 호출

    // 삭제 버튼
    const deleteButton = document.createElement('button');
    deleteButton.classList.add('delete-comment-btn');
    deleteButton.textContent = '삭제';
    deleteButton.onclick = () => deleteComment(comment.comment_id); // 삭제 함수 호출

    commentActionsDiv.appendChild(editButton);
    commentActionsDiv.appendChild(deleteButton);

    // 댓글 정보와 버튼 컨테이너 추가
    commentDiv.appendChild(commentInfoDiv);
    commentDiv.appendChild(commentActionsDiv);

    // 댓글 리스트의 맨 위에 추가
    commentList.prepend(commentDiv);
}




// 게시글 삭제
async function deletePost() {
    try {
        const response = await fetch(`http://localhost:3000/api/posts/${postId}`, {
            method: 'DELETE',
            credentials: 'include', // 세션 쿠키 포함
        });

        if (!response.ok) {
            const errorData = await response.json();
            alert(errorData.message || '게시글 삭제에 실패했습니다.');
            return;
        }

        const result = await response.json();
        alert(result.message);
        window.location.href = './community.html'; // 삭제 후 목록 페이지로 이동
    } catch (error) {
        console.error('게시글 삭제 요청 중 오류 발생:', error.message);
        alert('게시글 삭제 중 오류가 발생했습니다.');
    }
}

// 모달 열기
function showModal() {
    document.getElementById('deleteModal').style.display = 'block';
}

// 모달 닫기
function closeModal() {
    document.getElementById('deleteModal').style.display = 'none';
}

// 삭제 확인
function confirmDelete() {
    deletePost(); // 실제 삭제 API 호출
    closeModal(); // 모달 닫기
}

