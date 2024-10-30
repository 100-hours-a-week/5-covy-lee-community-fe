// URL 파라미터에서 게시글 ID 가져오기
const params = new URLSearchParams(window.location.search);
const postId = params.get('id'); // 게시글 ID

if (!postId) {
    console.error('게시글 ID가 없습니다.');
    alert('게시글 ID가 필요합니다.');
} else {
    // 게시글 정보 가져오기
    async function fetchPost() {
        try {
            const response = await fetch(`http://localhost:3000/api/posts/${postId}`);
            if (!response.ok) {
                throw new Error('게시글을 불러오는 데 실패했습니다.');
            }
            const post = await response.json();
            document.getElementById('postTitle').innerText = post.title;
            document.getElementById('postContent').innerText = post.content;
            document.getElementById('postUsername').innerText = post.username || "작성자 정보 없음";
            document.getElementById('postLike').innerText = post.like;
            document.getElementById('postImage').src = 'http://localhost:3000/photo_4.jpeg';
            document.getElementById('postVisitor').innerText = post.visitor;
            document.getElementById('postComment').innerText = post.comment;
            document.getElementById('postDate').innerText = new Date(post.createdAt).toLocaleDateString(); // 작성일자 포맷팅
            document.getElementById('editButton').href = `./edit.html?id=${postId}`;
        } catch (error) {
            console.error('게시글 가져오기 오류:', error);
            alert('게시글을 불러오는 데 문제가 발생했습니다.');
        }
    }

    fetchPost();
}

function submitComment() {
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
}

function toggleDropdown() {
    const dropdown = document.getElementById('dropdownMenu');
    dropdown.classList.toggle('show');
}

// 클릭 외부 시 드롭다운 닫기
window.onclick = function(event) {
    if (!event.target.matches('.profile-button') && !event.target.matches('#profileImage')) {
        const dropdowns = document.getElementsByClassName("dropdown-menu");
        for (let i = 0; i < dropdowns.length; i++) {
            const openDropdown = dropdowns[i];
            if (openDropdown.classList.contains('show')) {
                openDropdown.classList.remove('show');
            }
        }
    }
}

// 모달 열기 함수
function showModal() {
    document.getElementById('deleteModal').style.display = 'block';
}

// 모달 닫기 함수
function closeModal() {
    document.getElementById('deleteModal').style.display = 'none';
}

// 삭제 확인 함수
function confirmDelete() {
    // 삭제 로직 실행 (예: API 요청 등)
    alert("게시글이 삭제되었습니다.");
    closeModal();
    // 필요에 따라 삭제 후 페이지 이동 로직 추가
}
