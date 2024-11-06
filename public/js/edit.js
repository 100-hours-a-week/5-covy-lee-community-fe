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
            // 수정 폼에 기존 게시글 내용 세팅
            document.getElementById('postTitle').value = post.title;
            document.getElementById('postContent').value = post.content;
        } catch (error) {
            console.error('게시글 가져오기 오류:', error);
            alert('게시글을 불러오는 데 문제가 발생했습니다.');
        }
    }

    fetchPost();
}

// 게시글 수정 제출 함수
const submitEdit = async () => {
    const postTitle = document.getElementById('postTitle').value;
    const postContent = document.getElementById('postContent').value;

    if (!postTitle || !postContent) {
        alert('제목과 내용을 입력하세요.');
        return;
    }

    const updatedPost = {
        title: postTitle,
        content: postContent,
    };

    try {
        const response = await fetch(`http://localhost:3000/api/posts/${postId}`, {
            method: 'PUT', // 수정 요청
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(updatedPost),
        });

        if (!response.ok) {
            throw new Error('게시글 수정에 실패했습니다.');
        }

        alert('게시글이 수정되었습니다.');
        window.location.href = `detail.html?id=${postId}`; // 수정 후 상세보기 페이지로 이동
    } catch (error) {
        console.error('게시글 수정 오류:', error);
        alert('게시글 수정 중 문제가 발생했습니다.');
    }
};

// 수정 버튼에 이벤트 리스너 추가
document.getElementById('submitEditButton').addEventListener('click', submitEdit);


// 드롭다운 외부 클릭 시 드롭다운 숨기기
window.onclick = (event) => {
    if (!event.target.matches('.profile-button') && !event.target.matches('.profile-button img')) {
        const dropdown = document.getElementById('dropdownMenu');
        if (dropdown.classList.contains('show')) {
            dropdown.classList.remove('show');
        }
    }
};

