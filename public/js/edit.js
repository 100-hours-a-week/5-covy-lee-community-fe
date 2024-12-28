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
            const response = await fetch(`${window.API_BASE_URL}/api/posts/${postId}`, {
                method: 'GET',
                credentials: 'include' // 쿠키를 포함하여 요청을 보냄
            });
            if (!response.ok) {
                throw new Error('게시글을 불러오는 데 실패했습니다.');
            }
            const post = await response.json();

            // 수정 폼에 기존 게시글 내용 세팅
            document.getElementById('postTitle').value = post.title.trim();
            document.getElementById('postContent').value = post.content.trim();

            // 이미지 이름 표시 및 파일 입력 값 설정
            const imageInput = document.getElementById('image');

            if (post.image) {

                // File 객체 생성 (더미 데이터로 설정)
                const myFile = new File([''], post.image, { type: 'image/jpeg' });
                const dataTransfer = new DataTransfer();
                dataTransfer.items.add(myFile);
                imageInput.files = dataTransfer.files;


                if (imageInput.webkitEntries.length) {
                    imageInput.dataset.file = `${dataTransfer.files[0].name}`;
                }
            }
        } catch (error) {
            console.error('게시글 가져오기 오류:', error);
            alert('게시글을 불러오는 데 문제가 발생했습니다.');
        }
    }

    fetchPost();
}


// 제목 입력 길이 제한 및 공백 처리
const postTitleInput = document.getElementById('postTitle');
postTitleInput.addEventListener('input', () => {
    postTitleInput.value = postTitleInput.value.replace(/^\s+/, ''); // 앞쪽 공백 제거
    if (postTitleInput.value.length > 26) {
        postTitleInput.value = postTitleInput.value.slice(0, 26); // 최대 26자 제한
    }
});

// 게시글 수정 제출 함수
const submitEdit = async () => {
    const postTitle = document.getElementById('postTitle').value.trim(); // 앞뒤 공백 제거
    const postContent = document.getElementById('postContent').value.trim(); // 앞뒤 공백 제거
    const imageInput = document.getElementById('image');

    // 제목 및 내용 검증
    if (!postTitle && !postContent) {
        alert('제목과 내용을 입력하세요.');
        return;
    } else if (!postTitle) {
        alert('제목을 입력하세요. 공백만 입력할 수 없습니다.');
        return;
    } else if (!postContent) {
        alert('내용을 입력하세요. 공백만 입력할 수 없습니다.');
        return;
    }

    // FormData를 사용해 데이터와 파일 전송 준비
    const formData = new FormData();
    formData.append('title', postTitle);
    formData.append('content', postContent);
    if (imageInput.files[0]) {
        formData.append('postImage', imageInput.files[0]); // 서버에서 'postImage'를 기대
    }

    try {
        const response = await fetch(`${window.API_BASE_URL}/api/posts/${postId}`, {
            method: 'PUT', // 수정 요청
            credentials: 'include', // 쿠키 포함
            body: formData,
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || '게시글 수정에 실패했습니다.');
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



