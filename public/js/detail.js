const params = new URLSearchParams(window.location.search);
const postId = params.get("id"); // 게시글 ID

if (!postId) {
    alert("게시글 ID가 필요합니다.");
    throw new Error("게시글 ID가 없습니다.");
}

initializeLikeStatus();
increaseViewCount();
fetchPost();
fetchComments();

// 조회수 증가
async function increaseViewCount() {
    try {
        const response = await fetch(`${window.API_BASE_URL}/api/posts/${postId}/views`, {
            method: "PATCH",
            credentials: "include",
        });

        if (!response.ok) throw new Error("조회수 증가 요청 실패");

        const { views } = await response.json();
        document.getElementById("postVisitor").innerText = views;
    } catch (error) {
        console.error(error.message);
    }
}

// 게시글 정보 가져오기
async function fetchPost() {
    try {
        const response = await fetch(`${window.API_BASE_URL}/api/posts/${postId}`, {
            method: "GET",
            credentials: "include",
        });

        if (!response.ok) throw new Error("게시글 정보 가져오기 실패");

        const post = await response.json();
        const currentUser = JSON.parse(sessionStorage.getItem("user")); // 현재 로그인한 사용자 정보

        // 게시글 정보 렌더링
        document.getElementById("postTitle").innerText = post.title || "제목 없음";
        document.getElementById("postContent").innerText = post.content || "내용 없음";
        document.getElementById("postUsername").innerText = post.author || "작성자 정보 없음";
        document.getElementById("postImage").src = post.image
            ? `${window.API_BASE_URL}/post_images/${post.image}`
            : `${window.API_BASE_URL}/default_images/default_post.jpg`;
        document.getElementById("postComment").innerText = post.comment_count || 0;
        document.getElementById("postLike").innerText = post.like_count || 0;
        document.getElementById("postVisitor").innerText = post.views || 0;

        // 작성자 프로필 이미지 설정
        const profileImage = document.getElementById("postUserProfile");
        profileImage.src = post.author_image
            ? `${window.API_BASE_URL}/profile_images/${post.author_image}`
            : `${window.API_BASE_URL}/default_images/default_profile.webp`;

        // 작성자인 경우에만 수정/삭제 버튼 표시
        const editButton = document.getElementById("editButton");
        const deleteButton = document.querySelector(".delete-button");

        if (currentUser && currentUser.user_id === post.author_id) {
            editButton.style.display = "inline-block"; // 수정 버튼 표시
            deleteButton.style.display = "inline-block"; // 삭제 버튼 표시
            editButton.href = `edit.html?id=${post.id}`; // 수정 버튼에 postId 동적 바인딩
        } else {
            editButton.style.display = "none"; // 수정 버튼 숨김
            deleteButton.style.display = "none"; // 삭제 버튼 숨김
        }
    } catch (error) {
        console.error(error.message);
        alert("게시글을 불러오는 데 문제가 발생했습니다.");
    }
}


// 좋아요 상태 초기화
async function initializeLikeStatus() {
    try {
        const response = await fetch(`${window.API_BASE_URL}/api/posts/${postId}/like-status`, {
            method: "GET",
            credentials: "include",
        });

        if (!response.ok) throw new Error("좋아요 상태 가져오기 실패");

        const { liked } = await response.json();
        const likeIcon = document.getElementById("like");
        likeIcon.classList.toggle("active", liked);

        updateLikeCount();
    } catch (error) {
        console.error(error.message);
    }
}

// 좋아요 토글
document.getElementById("likeButton").addEventListener("click", async () => {
    try {
        const response = await fetch(`${window.API_BASE_URL}/api/posts/${postId}/like`, {
            method: "POST",
            credentials: "include",
        });

        if (!response.ok) throw new Error("좋아요 토글 실패");

        const { liked } = await response.json();
        const likeIcon = document.getElementById("like");
        likeIcon.classList.toggle("active", liked);

        updateLikeCount();
    } catch (error) {
        console.error(error.message);
    }
});

// 좋아요 수 업데이트
async function updateLikeCount() {
    try {
        const response = await fetch(`${window.API_BASE_URL}/api/posts/${postId}/likes`, {
            method: "GET",
            credentials: "include",
        });

        if (!response.ok) throw new Error("좋아요 수 가져오기 실패");

        const { likes } = await response.json();
        document.getElementById("postLike").innerText = likes;
    } catch (error) {
        console.error(error.message);
    }
}

// 좋아요 토글
document.getElementById("likeButton").addEventListener("click", toggleLike);

async function toggleLike() {
    try {
        const response = await fetch(`${window.API_BASE_URL}/api/posts/${postId}/like`, {
            method: "POST",
            credentials: "include",
        });

        if (!response.ok) {
            throw new Error("좋아요 토글 요청 실패");
        }

        const result = await response.json();
        const likeIcon = document.getElementById("like");

        // 하트 색상 토글
        if (result.liked) {
            likeIcon.classList.add("active"); // 빨간색 하트
        } else {
            likeIcon.classList.remove("active"); // 기본 하트
        }

        // 좋아요 수 업데이트
        updateLikeCount();
    } catch (error) {
        console.error("좋아요 토글 요청 중 오류 발생:", error.message);
    }
}

// 댓글 목록 가져오기
async function fetchComments() {
    try {
        const response = await fetch(`${window.API_BASE_URL}/api/posts/${postId}/comments`, {
            method: "GET",
            credentials: "include", // 쿠키 포함
        });

        if (!response.ok) {
            throw new Error("댓글 목록을 불러오는 데 실패했습니다.");
        }

        const comments = await response.json();

        // 댓글 목록 화면에 추가
        comments.forEach(comment => addCommentToList(comment));

        // 댓글 수 업데이트
        updateCommentCount();
    } catch (error) {
        console.error("댓글 목록 가져오기 오류:", error.message);
        alert("댓글 목록을 불러오는 데 문제가 발생했습니다.");
    }
}

// 댓글 작성
const submitComment = async () => {
    const commentInput = document.getElementById("commentInput");
    const commentText = commentInput.value.trim();

    if (!commentText) {
        alert("댓글을 입력하세요.");
        return;
    }

    try {
        const response = await fetch(`${window.API_BASE_URL}/api/posts/${postId}/comments`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include", // 쿠키 포함
            body: JSON.stringify({ content: commentText }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            alert(errorData.message || "댓글 작성에 실패했습니다.");
            return;
        }

        // 서버에서 반환된 댓글 데이터
        const result = await response.json();

        // 작성된 댓글을 화면에 추가
        addCommentToList(result); // 서버 응답 데이터 그대로 사용

        // 댓글 수 업데이트
        updateCommentCount();
        window.location.reload();

        commentInput.value = ""; // 입력 필드 초기화
    } catch (error) {
        console.error("댓글 작성 요청 중 오류 발생:", error.message);
        alert("댓글 작성 중 오류가 발생했습니다.");
    }
};

function addCommentToList(comment) {
    const commentList = document.getElementById("commentList");
    const currentUser = JSON.parse(sessionStorage.getItem("user")); // 현재 로그인한 사용자 정보
    const isAuthor = currentUser && currentUser.user_id === comment.author_id; // 작성자인지 확인

    // 댓글 컨테이너
    const commentDiv = document.createElement("div");
    commentDiv.classList.add("comment");
    commentDiv.setAttribute("data-id", comment.comment_id);

    // 댓글 헤더 (작성자 + 작성일자 + 액션 버튼)
    const commentHeaderDiv = document.createElement("div");
    commentHeaderDiv.classList.add("comment-header");
    commentHeaderDiv.style.display = "flex";
    commentHeaderDiv.style.justifyContent = "space-between";
    commentHeaderDiv.style.alignItems = "center";

    // 작성자 정보 (프사 + 이름)
    const authorInfoDiv = document.createElement("div");
    authorInfoDiv.classList.add("author-info");
    authorInfoDiv.style.display = "flex";
    authorInfoDiv.style.alignItems = "center";

    const authorImage = document.createElement("img");
    authorImage.src = comment.author_image
        ? `${window.API_BASE_URL}/profile_images/${comment.author_image}`
        : `${window.API_BASE_URL}/default_images/default_profile.webp`;
    authorImage.alt = "작성자 이미지";
    authorImage.style.width = "30px";
    authorImage.style.height = "30px";
    authorImage.style.borderRadius = "50%";
    authorImage.style.marginRight = "10px";

    const authorName = document.createElement("div");
    authorName.classList.add("comment-author");
    authorName.textContent = comment.author || "익명";

    authorInfoDiv.appendChild(authorImage);
    authorInfoDiv.appendChild(authorName);

    // 작성일자
    const dateDiv = document.createElement("div");
    dateDiv.classList.add("comment-date");
    const createdAt = new Date(comment.created_at);
    dateDiv.textContent = !isNaN(createdAt) ? createdAt.toLocaleString() : "알 수 없는 날짜";

    // 수정/삭제 버튼 (작성자만 표시)
    const commentActionsDiv = document.createElement("div");
    commentActionsDiv.classList.add("comment-actions");
    commentActionsDiv.style.display = "flex";

    if (isAuthor) {
        const editButton = document.createElement("button");
        editButton.textContent = "수정";
        editButton.onclick = () => editComment(comment.comment_id);

        const deleteButton = document.createElement("button");
        deleteButton.textContent = "삭제";
        deleteButton.onclick = () => deleteComment(comment.comment_id);

        commentActionsDiv.appendChild(editButton);
        commentActionsDiv.appendChild(deleteButton);
    }

    // 헤더 조립
    commentHeaderDiv.appendChild(authorInfoDiv); // 작성자 정보
    commentHeaderDiv.appendChild(dateDiv); // 작성일자
    commentHeaderDiv.appendChild(commentActionsDiv); // 수정/삭제 버튼 (작성자만 추가)

    // 댓글 내용 (줄바꿈 처리)
    const contentDiv = document.createElement("div");
    contentDiv.classList.add("comment-content");
    contentDiv.innerHTML = comment.content
        .replace(/</g, "&lt;") // HTML 태그 이스케이프
        .replace(/>/g, "&gt;")
        .replace(/\n/g, "<br>"); // 줄바꿈을 <br>로 변환

    // 댓글 컨테이너에 요소 추가
    commentDiv.appendChild(commentHeaderDiv);
    commentDiv.appendChild(contentDiv);

    commentList.prepend(commentDiv);
}



// 댓글 수정
function editComment(commentId) {
    const commentDiv = document.querySelector(`[data-id='${commentId}']`);
    const contentDiv = commentDiv.querySelector(".comment-content");
    const originalContent = contentDiv.textContent;

    // 이미 수정 중인지 확인 후 처리
    const existingEditForm = commentDiv.querySelector(".edit-form");
    if (existingEditForm) {
        // 이전 수정 폼이 남아있다면 삭제 (취소 버튼 눌렀을 경우)
        existingEditForm.remove();
        contentDiv.style.display = "block"; // 원래 내용 표시
        resetButtons(commentDiv); // 버튼 초기화
        return; // 더 이상의 처리 없이 함수 종료
    }

    // 댓글 내용을 숨김
    contentDiv.style.display = "none";

    // 댓글 입력 폼 생성
    const editForm = document.createElement("textarea");
    editForm.classList.add("edit-form");
    editForm.value = originalContent;
    editForm.rows = 3;
    editForm.style.width = "100%";
    editForm.style.marginBottom = "10px";

    // 수정 폼을 댓글 영역에 추가
    commentDiv.insertBefore(editForm, contentDiv);

    // 버튼 동적 변경
    const actionsDiv = commentDiv.querySelector(".comment-actions");
    const editButton = actionsDiv.querySelector("button:nth-child(1)");
    const deleteButton = actionsDiv.querySelector("button:nth-child(2)");

    editButton.textContent = "수정하기";
    deleteButton.textContent = "취소";

    // 수정하기 버튼 클릭 이벤트
    editButton.onclick = async () => {
        const newContent = editForm.value.trim();
        if (!newContent) {
            alert("내용을 입력하세요.");
            return;
        }

        try {
            const response = await fetch(`${window.API_BASE_URL}/api/comments/${commentId}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({ content: newContent }),
            });

            if (!response.ok) throw new Error("댓글 수정에 실패했습니다.");

            // 성공 시 메시지 표시 및 페이지 새로고침
            alert("수정되었습니다.");
            window.location.reload();
        } catch (error) {
            console.error("댓글 수정 중 오류:", error.message);
            alert("댓글 수정에 실패했습니다.");
        }
    };

    // 취소 버튼 클릭 이벤트
    deleteButton.onclick = () => {
        editForm.remove(); // 입력 폼 제거
        contentDiv.style.display = "block"; // 기존 내용 다시 표시
        resetButtons(commentDiv); // 버튼 초기화
    };
}

// 댓글 삭제
async function deleteComment(commentId) {
    if (!confirm("정말로 이 댓글을 삭제하시겠습니까?")) {
        return; // 사용자가 삭제를 취소한 경우
    }

    try {
        const response = await fetch(`${window.API_BASE_URL}/api/comments/${commentId}`, {
            method: "DELETE",
            credentials: "include",
        });

        if (!response.ok) throw new Error("댓글 삭제에 실패했습니다.");

        // 삭제 성공 메시지 표시
        alert("댓글이 성공적으로 삭제되었습니다.");

        // 페이지 새로고침
        window.location.reload();
    } catch (error) {
        console.error("댓글 삭제 중 오류:", error.message);
        alert("댓글 삭제 중 문제가 발생했습니다.");
    }
}

// 버튼 초기화 함수
function resetButtons(commentDiv) {
    const actionsDiv = commentDiv.querySelector(".comment-actions");
    const editButton = actionsDiv.querySelector("button:nth-child(1)");
    const deleteButton = actionsDiv.querySelector("button:nth-child(2)");

    editButton.textContent = "수정";
    editButton.onclick = () => editComment(commentDiv.getAttribute("data-id"));

    deleteButton.textContent = "삭제";
    deleteButton.onclick = () => deleteComment(commentDiv.getAttribute("data-id"));
}

// 댓글 수 업데이트
function updateCommentCount() {
    const commentCount = document.getElementById("commentList").children.length;
    document.getElementById("postComment").innerText = commentCount;
}

// 게시글 삭제
async function deletePost() {
    try {
        const response = await fetch(`${window.API_BASE_URL}/api/posts/${postId}`, {
            method: "DELETE",
            credentials: "include",
        });

        if (!response.ok) throw new Error("게시글 삭제에 실패했습니다.");

        // 삭제 성공 메시지 표시
        alert("게시글이 성공적으로 삭제되었습니다.");

        // 삭제 성공 후 페이지 이동
        window.location.href = "./community.html";
    } catch (error) {
        console.error(error.message);
        alert("게시글 삭제 중 문제가 발생했습니다."); // 실패 메시지 표시
    }
}

// 모달 열기/닫기
function showModal() {
    const modal = document.getElementById("deleteModal");
    modal.classList.add("show"); // 모달 활성화
    modal.style.display = "flex"; // Flexbox 활성화
}

function closeModal() {
    const modal = document.getElementById("deleteModal");
    modal.classList.remove("show"); // 모달 비활성화
    modal.style.display = "none"; // Flexbox 비활성화
}

function confirmDelete() {
    deletePost();
    closeModal();
}
