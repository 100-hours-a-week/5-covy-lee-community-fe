const utils = () => {
    localStorage.clear(); // 로컬 스토리지의 모든 데이터 삭제
    alert('로그아웃 되었습니다.'); // 로그아웃 알림
    window.location.href = './login.html'; // 로그인 페이지로 리다이렉트
};

const toggleDropdown = () => {
    const dropdown = document.getElementById('dropdownMenu');
    dropdown.classList.toggle('show');
};

fetch('./components/header.html').then(response => response.text()).then(data => {
    document.getElementById('header-container').innerHTML = data;
})
    .catch(error => console.error('Error loading header:', error));