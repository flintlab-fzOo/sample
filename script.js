function toggleMenu() {
    const menu = document.querySelector('.menu');
    menu.classList.toggle('open');
}

function changeContent(section) {
    // 메뉴 닫기 (모바일에서)
    const menu = document.querySelector('.menu');
    menu.classList.remove('open');

    // 모든 콘텐츠 섹션을 숨김
    const sections = document.querySelectorAll('.content-section');
    sections.forEach(sec => {
        sec.classList.add('hidden');
        sec.style.display = 'none';
    });

    // 선택된 섹션 보여줌
    const selectedSection = document.getElementById(`${section}-content`);
    selectedSection.style.display = 'block';
    setTimeout(() => {
        selectedSection.classList.remove('hidden');
    }, 10); // 작은 딜레이로 애니메이션 트리거

    // 메뉴 아이템 활성화 스타일 (선택 사항)
    const menuItems = document.querySelectorAll('.menu-item');
    menuItems.forEach(item => item.style.backgroundColor = '');
    event.target.style.backgroundColor = '';
}

function toggleTheme() {
    const body = document.body;
    const themeIcon = document.getElementById('theme-icon');

    if (body.classList.contains('light-theme')) {
        body.classList.remove('light-theme');
        body.classList.add('dark-theme');
        themeIcon.textContent = '☀️'; // 다크 모드일 때 태양 아이콘
        localStorage.setItem('theme', 'dark'); // 테마 저장
    } else {
        body.classList.remove('dark-theme');
        body.classList.add('light-theme');
        themeIcon.textContent = '🌙'; // 라이트 모드일 때 달 아이콘
        localStorage.setItem('theme', 'light'); // 테마 저장
    }
}

// 페이지 로드 시 저장된 테마 적용
window.onload = function() {
    const savedTheme = localStorage.getItem('theme');
    const themeIcon = document.getElementById('theme-icon');
    if (savedTheme === 'dark') {
        document.body.classList.remove('light-theme');
        document.body.classList.add('dark-theme');
        themeIcon.textContent = '☀️';
    } else {
        document.body.classList.add('light-theme');
        themeIcon.textContent = '🌙';
    }
}