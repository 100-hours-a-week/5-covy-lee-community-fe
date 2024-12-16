const postsPerPage = 3;
const maxPagesToShow = 5; // 한 번에 보여줄 최대 페이지 수
let currentPage = 1;
let posts = []; // 게시글 데이터를 저장할 변수
let totalPages = 0; // 총 페이지 수
let filteredPosts = []; // 필터된 게시글을 저장할 변수

const checkSession = async () => {
    try {
        const response = await fetch(`${window.API_BASE_URL}/api/check-session`, {
            method: 'GET',
            credentials: 'include'
        });

        if (!response.ok) {
            console.error('Failed to check session:', response.statusText);
            window.location.href = './login.html';
            return;
        }

        const data = await response.json();
        const serverUser = data.user; // 서버에서 최신 사용자 데이터

        if (serverUser) {
            // 항상 서버 데이터를 `sessionStorage`에 반영
            sessionStorage.setItem('user', JSON.stringify({
                user_id: serverUser.id,
                email: serverUser.email,
                username: serverUser.username,
                image: serverUser.image
            }));

            sessionStorage.removeItem('userImage'); // userImage 등 중복 항목 제거
            console.log('세션 정보가 갱신되었습니다:', serverUser);
        } else {
            console.error('No user data in server session.');
            window.location.href = './login.html';
        }
    } catch (error) {
        console.error('세션 체크 오류:', error.message);
        window.location.href = './login.html';
    }
};

// 페이지가 로드될 때 세션 체크
window.onload = checkSession;

// 게시글을 가져오는 함수
const fetchPosts = async () => {
    try {
        const response = await fetch(`${window.API_BASE_URL}/api/posts`, {
            method: 'GET',
            credentials: 'include' // 쿠키 포함 설정
        });

        if (response.status === 401) {
            throw new Error('로그인이 필요합니다.');
        }

        if (!response.ok) {
            throw new Error('네트워크 응답이 좋지 않습니다.');
        }

        const fetchedPosts = await response.json(); // 게시물 데이터 가져오기

        posts = fetchedPosts.map(post => ({
            ...post,
            views: post.views || 0 // 조회수 기본값 설정
        }));

        filteredPosts = [...posts]; // posts를 기반으로 초기화

        totalPages = Math.ceil(filteredPosts.length / postsPerPage); // 총 페이지 수 계산
        displayPosts(); // 게시물 표시

    } catch (error) {
        console.error('게시글 가져오기 오류:', error.message);
        alert(error.message);
    }
};

// 게시글을 화면에 표시하는 함수
const displayPosts = () => {
    const cardContainer = document.getElementById('cardContainer');
    cardContainer.innerHTML = '';

    if (filteredPosts.length === 0) {
        console.log('게시글이 없습니다.');
        cardContainer.innerHTML = '<p>게시글이 없습니다.</p>'; // 게시글이 없을 때 표시
        return;
    }

    const startIndex = (currentPage - 1) * postsPerPage;
    const endIndex = startIndex + postsPerPage;
    const postsToDisplay = filteredPosts.slice(startIndex, endIndex);

    postsToDisplay.forEach(post => {
        const profileImageUrl = post.author_image
            ? `${window.API_BASE_URL}/profile_images/${post.author_image}`
            : `${window.API_BASE_URL}/default_images/default_profile.webp`; // 기본 이미지 경로

        const card = document.createElement('div');
        card.classList.add('card');

        card.onclick = () => showDetails(post.id); // 카드 전체를 클릭하면 상세 페이지로 이동

        const createdAt = new Date(post.created_at);
        const formattedDate = `${createdAt.toLocaleDateString()} ${createdAt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })}`;

        card.innerHTML = `
            <h3>${post.title}</h3>
            <div class="stats-row">
                <div class="stats">
                    <span>❤️&nbsp;${post.like_count || 0}</span>
                    <span>💬&nbsp;${post.comment_count || 0}</span>
                    <span>👁️&nbsp;${post.views || 0}</span>
                </div>
                <p class="date">${formattedDate}</p>
            </div>
            <div class="horizontal-rule"></div>
            <div class="post-info">
                <div class="author-info">
                    <img class="author-profile" src="${profileImageUrl}" alt="작성자 이미지">
                    <p class="author">${post.author}</p>
                </div>
            </div>
        `;
        cardContainer.appendChild(card);
    });

    updatePagination();
};

// 페이지네이션 업데이트 함수
const updatePagination = () => {
    document.getElementById('prevButton').classList.toggle('disabled', currentPage === 1);
    document.getElementById('nextButton').classList.toggle('disabled', currentPage === totalPages);

    const pageNumbers = document.getElementById('pageNumbers');
    pageNumbers.innerHTML = '';

    const startPage = Math.floor((currentPage - 1) / maxPagesToShow) * maxPagesToShow + 1;
    const endPage = Math.min(startPage + maxPagesToShow - 1, totalPages);

    for (let i = startPage; i <= endPage; i++) {
        const button = document.createElement('button');
        button.innerText = i;
        button.onclick = () => goToPage(i);
        if (i === currentPage) {
            button.style.backgroundColor = '#666488'; // 현재 페이지 강조
            button.style.color = 'white';
        } else {
            button.style.backgroundColor = '#ccc'; // 나머지 페이지 버튼 색상
            button.style.color = 'black'; // 나머지 페이지 글자색
        }
        pageNumbers.appendChild(button);
    }
};

// 페이지 이동 함수
const goToPage = (pageNumber) => {
    currentPage = pageNumber;
    displayPosts();
};

// 이전 페이지 함수
const previousPage = () => {
    if (currentPage > 1) {
        currentPage--;
        displayPosts();
    }
};

// 다음 페이지 함수
const nextPage = () => {
    if (currentPage < totalPages) {
        currentPage++;
        displayPosts();
    }
};

// 게시글 상세 페이지로 이동하는 함수
const showDetails = (postId) => {
    const url = `detail.html?id=${postId}`;
    window.location.href = url; // 상세 페이지로 이동
};

// 게시글 검색 함수
const searchPosts = () => {
    const searchInput = document.getElementById('searchInput').value.toLowerCase();

    filteredPosts = posts.filter(post =>
        post.title.toLowerCase().includes(searchInput) || // 제목 검색
        post.author.toLowerCase().includes(searchInput)  // 작성자 검색
    );

    currentPage = 1; // 페이지와 게시글 갱신
    totalPages = Math.ceil(filteredPosts.length / postsPerPage);

    displayPosts();
};

// 페이지 클릭 시 드롭다운 숨기는 함수
window.onclick = (event) => {
    if (!event.target.matches('.profile-button') && !event.target.matches('#profileImage')) {
        const dropdowns = document.getElementsByClassName("dropdown-menu");
        for (let i = 0; i < dropdowns.length; i++) {
            const openDropdown = dropdowns[i];
            if (openDropdown.classList.contains('show')) {
                openDropdown.classList.remove('show');
            }
        }
    }
};

// 페이지 로드 시 게시글 가져오기
fetchPosts();



