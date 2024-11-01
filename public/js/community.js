const postsPerPage = 3;
const maxPagesToShow = 5; // 한 번에 보여줄 최대 페이지 수
let currentPage = 1;
let posts = []; // 게시글 데이터를 저장할 변수
let totalPages = 0; // 총 페이지 수

// 게시글 데이터를 가져오는 함수
async function fetchPosts() {
    try {
        const response = await fetch('http://localhost:3000/api/posts');
        if (!response.ok) {
            throw new Error('네트워크 응답이 좋지 않습니다.');
        }
        posts = await response.json(); // JSON 형태로 변환하여 posts에 저장
        totalPages = Math.ceil(posts.length / postsPerPage);
        displayPosts(); // 게시글 표시
    } catch (error) {
        console.error('게시글 가져오기 오류:', error);
    }
}

function displayPosts() {
    const cardContainer = document.getElementById('cardContainer');
    cardContainer.innerHTML = '';

    const startIndex = (currentPage - 1) * postsPerPage;
    const endIndex = startIndex + postsPerPage;
    const postsToDisplay = posts.slice(startIndex, endIndex);

    postsToDisplay.forEach(post => {
        const card = document.createElement('div');
        card.classList.add('card');
        card.innerHTML = `
            <h3>${post.title}</h3>
            <p>${post.content}</p>
            <p>작성자: ${post.username}</p>
            <p>추천수: ${post.like}, 방문자 수: ${post.visitor}, 댓글 수: ${post.coment}</p>
            <button class="details-button" onclick="showDetails(${post.id})">자세히 보기</button>
        `;
        cardContainer.appendChild(card);
    });

    updatePagination();
}

function updatePagination() {
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
}

function goToPage(pageNumber) {
    currentPage = pageNumber;
    displayPosts();
}

function previousPage() {
    if (currentPage > 1) {
        currentPage--;
        displayPosts();
    }
}

function nextPage() {
    if (currentPage < totalPages) {
        currentPage++;
        displayPosts();
    }
}

function showDetails(postId) {
    // URL에 ID를 쿼리 스트링 형태로 추가
    const url = `detail.html?id=${postId}`;
    window.location.href = url; // 상세 페이지로 이동
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

// 페이지 로드 시 게시글 데이터를 가져옴
fetchPosts();
