// 현재 날짜 설정
let currentDate = new Date();
let currentView = 'month'; // 기본 뷰는 월별

// DOM 요소
const monthViewBtn = document.getElementById('monthView');
const weekViewBtn = document.getElementById('weekView');
const weekdayViewBtn = document.getElementById('weekdayView');
const dayViewBtn = document.getElementById('dayView');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const todayBtn = document.getElementById('todayBtn');
const dateTitle = document.getElementById('dateTitle');
const calendarContainer = document.getElementById('calendarContainer');
const eventModal = document.getElementById('eventModal');
const closeModal = document.getElementById('closeModal');
const modalTitle = document.getElementById('modalTitle');
const modalTime = document.getElementById('modalTime');
const modalContent = document.getElementById('modalContent');
const modalCategory = document.getElementById('modalCategory');
const holidays = [
    {date:"2025-03-01", name:"삼일절"},
    {date:"2025-03-22", name:"test"},
]
// Date Selector Modal functionality
const dateSelectorModal = document.getElementById('dateSelectorModal');
const closeDateSelector = document.getElementById('closeDateSelector');
const selectedYear = document.getElementById('selectedYear');
const prevYearBtn = document.getElementById('prevYear');
const nextYearBtn = document.getElementById('nextYear');
const monthGrid = document.getElementById('monthGrid');

// Month names
const monthNames = ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'];

// Open date selector when clicking on date title
dateTitle.addEventListener('click', () => {
    // Set the current year in the selector
    selectedYear.textContent = currentDate.getFullYear();
    
    // Generate month grid
    generateMonthGrid();
    
    // Show the modal
    dateSelectorModal.style.display = 'block';
});

// Close date selector
closeDateSelector.addEventListener('click', () => {
    dateSelectorModal.style.display = 'none';
});

// Close when clicking outside
window.addEventListener('click', (event) => {
    if (event.target === dateSelectorModal) {
        dateSelectorModal.style.display = 'none';
    }
});

// Previous year
prevYearBtn.addEventListener('click', () => {
    selectedYear.textContent = parseInt(selectedYear.textContent) - 1;
    generateMonthGrid();
});

// Next year
nextYearBtn.addEventListener('click', () => {
    selectedYear.textContent = parseInt(selectedYear.textContent) + 1;
    generateMonthGrid();
});

// Generate month grid
function generateMonthGrid() {
    monthGrid.innerHTML = '';
    const year = parseInt(selectedYear.textContent);
    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();
    
    monthNames.forEach((month, index) => {
        const monthItem = document.createElement('div');
        monthItem.className = 'month-item';
        
        // Highlight current month
        if (index === currentMonth && year === currentYear) {
            monthItem.classList.add('selected');
        }
        
        monthItem.textContent = month;
        
        // Set click event
        monthItem.addEventListener('click', () => {
            // Update current date
            currentDate.setFullYear(year);
            currentDate.setMonth(index);
            
            // Update view
            updateView();
            
            // Close modal
            dateSelectorModal.style.display = 'none';
        });
        
        monthGrid.appendChild(monthItem);
    });
}
// 샘플 데이터 (실제로는 localStorage에서 가져옴)
const sampleEvents = [
    // {date:"2024-03-05", time_start:"0105", time_end:"0731", title:"테스트 제목", content:"데이터 테스트", category:"work"},
    // {date:"2024-03-22", time_start:"1000", time_end:"1100", title:"프로젝트 기획 회의", content:"월간 보고서 작성을 위한 프로젝트 기획 회의\n참석자: 김대리, 박과장, 이사원", category:"work"},
    // {date:"2024-03-22", time_start:"1400", time_end:"1600", title:"발표 준비", content:"클라이언트 미팅을 위한 발표 자료 준비\n발표 내용: 신규 프로젝트 진행 상황", category:"work"},
    // {date:"2024-03-22", time_start:"1900", time_end:"2100", title:"저녁 약속", content:"친구들과 삼겹살 먹기로 한 약속\n장소: 강남역 맛집", category:"personal"},
    // {date:"2025-03-23", time_start:"0900", time_end:"1000", title:"아침 미팅", content:"주간 업무 계획 수립 회의\n회의실: 3층 대회의실", category:"work"},
    // {date:"2025-03-23", time_start:"1100", time_end:"1200", title:"웹사이트 디자인 검토", content:"신규 웹사이트 디자인 검토 회의\n주요 논의사항: 색상 팔레트, 레이아웃 결정", category:"work"},
    // {date:"2025-03-23", time_start:"1500", time_end:"1600", title:"헬스장", content:"개인 PT 세션\n트레이너: 김트레이너", category:"health"},
    // {date:"2025-03-23", time_start:"1700", time_end:"1800", title:"헬스장", content:"개인 PT 세션\n트레이너: 김트레이너", category:"health"},
    // {date:"2025-03-23", time_start:"1800", time_end:"1900", title:"헬스장", content:"개인 PT 세션\n트레이너: 김트레이너", category:"health"},
    // {date:"2025-03-24", time_start:"1000", time_end:"1130", title:"의사 예약", content:"정기 건강 검진\n병원: 서울 메디컬 센터", category:"health"},
    // {date:"2025-03-24", time_start:"1300", time_end:"1400", title:"점심 약속", content:"팀원들과 점심 식사\n메뉴: 이탈리안", category:"personal"},
    // {date:"2025-03-24", time_start:"1600", time_end:"1700", title:"화상 회의", content:"해외 지사와 화상 회의\n주제: 글로벌 마케팅 전략", category:"work"},
    // {date:"2025-03-25", time_start:"0930", time_end:"1030", title:"코드 리뷰", content:"신규 기능 코드 리뷰 세션\n담당자: 개발팀", category:"work"},
    // {date:"2025-03-25", time_start:"1400", time_end:"1500", title:"인터뷰", content:"신입 개발자 인터뷰\n지원자: 3명", category:"work"},
    // {date:"2025-03-25", time_start:"1800", time_end:"2000", title:"영화 관람", content:"신작 영화 관람\n영화관: CGV 용산", category:"personal"},
    // {date:"2025-03-26", time_start:"1000", time_end:"1100", title:"제품 데모", content:"신규 제품 데모 세션\n참석자: 마케팅팀, 영업팀", category:"work"},
    // {date:"2025-03-26", time_start:"1200", time_end:"1300", title:"런치 미팅", content:"신규 파트너십 논의\n장소: 회사 근처 레스토랑", category:"work"},
    // {date:"2025-03-26", time_start:"1500", time_end:"1700", title:"코딩 시간", content:"신규 기능 개발\n- 사용자 인증 기능 구현\n- 대시보드 UI 개선", category:"work"},
    // {date:"2025-03-27", time_start:"0900", time_end:"1000", title:"팀 회의", content:"주간 진행 상황 점검\n논의 사항: 일정 조정, 자원 할당", category:"work"},
    // {date:"2025-03-27", time_start:"1300", time_end:"1400", title:"멘토링 세션", content:"주니어 개발자 멘토링\n주제: 코드 최적화", category:"education"},
    // {date:"2025-03-27", time_start:"1800", time_end:"1900", title:"요가 수업", content:"주간 요가 수업\n강사: 이요가", category:"health"},
    // {date:"2025-03-28", time_start:"1100", time_end:"1200", title:"클라이언트 미팅", content:"신규 클라이언트 미팅\n미팅 장소: 클라이언트 사무실", category:"work"},
    // {date:"2025-03-28", time_start:"1400", time_end:"1600", title:"워크샵", content:"UX 디자인 워크샵\n강사: 김디자인", category:"education"},
    // {date:"2025-03-28", time_start:"1800", time_end:"2000", title:"친구 생일", content:"친구 생일 저녁 식사\n장소: 명동 레스토랑\n선물: 책", category:"personal"},
    // {date:"2025-03-29", time_start:"1000", time_end:"1100", title:"프로젝트 리뷰", content:"월간 프로젝트 리뷰\n담당자: 프로젝트 매니저", category:"work"},
    // {date:"2025-03-29", time_start:"1200", time_end:"1300", title:"팀 런치", content:"팀 빌딩 런치\n장소: 회사 근처 한식당", category:"work"},
    // {date:"2025-03-29", time_start:"1600", time_end:"1700", title:"주간 회고", content:"주간 업무 회고 및 다음 주 계획\n참석자: 전체 팀원", category:"work"},
    // {date:"2025-03-30", time_start:"1000", time_end:"1200", title:"주말 브런치", content:"가족과 함께 브런치\n장소: 카페", category:"personal"},
    // {date:"2025-03-30", time_start:"1500", time_end:"1700", title:"쇼핑", content:"생필품 쇼핑\n장소: 이마트", category:"personal"},
    // {date:"2025-03-31", time_start:"1100", time_end:"1300", title:"가족 모임", content:"월간 가족 모임\n장소: 부모님 댁", category:"personal"},
    // {date:"2025-03-31", time_start:"1600", time_end:"1800", title:"독서 시간", content:"신간 도서 읽기\n책 제목: 마케팅의 미래", category:"personal"},

    {date:"2025-03-24", time_start:"1440", time_end:"1500", title:"종목선정", content:"", category:"stock"},
    {date:"2025-03-24", time_start:"1531", time_end:"1551", title:"모니터링 데이터 생성", content:"", category:"stock"},
    {date:"2025-03-24", time_start:"0900", time_end:"0920", title:"[005930]삼성전자 3.00%, 매도 기준 익률값 설정 : 3.2", content:"", category:"stock"},
    {date:"2025-03-24", time_start:"0901", time_end:"0921", title:"[026890]스틱인베스트먼트 3.85%, 매도 기준 익률값 설정 : 3.2", content:"", category:"stock"},
    {date:"2025-03-24", time_start:"0901", time_end:"0921", title:"[이탈] [177350] 베셀 손절률(-10%) 이탈했습니다. 대응하세요 : -13.14%", content:"", category:"stock"},
    {date:"2025-03-24", time_start:"0902", time_end:"0922", title:"[매도]005930 / 주문번호 : 0002052700 / 주문일시 : 090210", content:"", category:"stock"},
    {date:"2025-03-24", time_start:"0903", time_end:"0923", title:"[001250]GS글로벌 3.52%, 매도 기준 익률값 설정 : 3.2", content:"", category:"stock"},
    {date:"2025-03-24", time_start:"0905", time_end:"0925", title:"[232140] AUTO BUY 와이씨 현재가:12450", content:"", category:"stock"},
    {date:"2025-03-24", time_start:"0905", time_end:"0925", title:"[매수]232140 수량:160 / 주문번호 : 0002679600 / 주문일시 : 090534", content:"", category:"stock"},
    {date:"2025-03-24", time_start:"0905", time_end:"0925", title:"[매수]232140 수량:160 / 주문번호 : 0002679600 / 주문일시 : 090534", content:"", category:"stock"},
    {date:"2025-03-24", time_start:"0906", time_end:"0926", title:"[001250]GS글로벌 7.39%, 매도 기준 익률값 설정 : 6.2", content:"", category:"stock"},

];

// 카테고리별 색상 (이벤트 시각화를 위한 색상 매핑)
const categoryColors = {
    'work': '#4285f4',       // 파란색
    'personal': '#0f9d58',   // 녹색
    'health': '#db4437',     // 빨간색
    'education': '#f4b400',  // 노란색
    'default': '#3f51b5'     // 기본 색상
};

// 카테고리 이름 매핑
const categoryNames = {
    'work': '업무',
    'personal': '개인',
    'health': '건강',
    'education': '교육',
    'default': '기타'
};

// localStorage에 샘플 데이터 저장
function initializeLocalStorage() {
    if (!localStorage.getItem('calendarEvents')) {
        localStorage.setItem('calendarEvents', JSON.stringify(sampleEvents));
    }
}

// localStorage에서 이벤트 가져오기
function getEvents() {
    const events = localStorage.getItem('calendarEvents');
    if (!events) {
        // localStorage에 데이터가 없으면 샘플 데이터 저장
        localStorage.setItem('calendarEvents', JSON.stringify(sampleEvents));
        return sampleEvents;
    }
    return JSON.parse(events);
}
// localStorage에서 현재 뷰 모드 가져오기
function getSavedViewMode() {
    const savedView = localStorage.getItem('calendarViewMode');
    if (savedView && ['month', 'week', 'weekday', 'day'].includes(savedView)) {
        return savedView;
    }
    return 'month'; // 기본값
}

// 현재 뷰 모드를 localStorage에 저장
function saveViewMode(viewMode) {
    localStorage.setItem('calendarViewMode', viewMode);
}
// 날짜 포매팅 함수
function formatDate(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

// 시간 포매팅 함수 (HHMM -> HH:MM)
function formatTime(time) {
    if (time.length !== 4) return time;
    return `${time.substring(0, 2)}:${time.substring(2, 4)}`;
}
// 요일 이름 배열
const weekdayNames = ['일', '월', '화', '수', '목', '금', '토'];

// 날짜 한글 포매팅 함수
function formatKoreanDate(dateStr) {
    const date = new Date(dateStr);
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const weekday = weekdayNames[date.getDay()];
    return `${year}년 ${month}월 ${day}일 (${weekday})`;
}



// 카테고리에 따른 색상 가져오기
function getCategoryColor(category) {
    return categoryColors[category] || categoryColors['default'];
}

// 카테고리 이름 가져오기
function getCategoryName(category) {
    return categoryNames[category] || categoryNames['default'];
}

// 이벤트를 시간순으로 정렬
function sortEventsByTime(events) {
    return events.sort((a, b) => {
        if (a.date !== b.date) {
            return a.date.localeCompare(b.date);
        }
        return a.time_start.localeCompare(b.time_start);
    });
}

// 월별 뷰 렌더링
function renderMonthView() {
    // 현재 월의 첫 날과 마지막 날 구하기
    const firstDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    const lastDay = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
    
    // 이전 달의 마지막 날들 구하기 (첫 주를 채우기 위해)
    const prevMonthLastDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), 0);
    const startingDayOfWeek = firstDay.getDay(); // 첫 날의 요일 (0: 일요일)
    
    // 날짜 타이틀 업데이트
    dateTitle.textContent = `${currentDate.getFullYear()}년 ${currentDate.getMonth() + 1}월`;
    
    // 월별 뷰 HTML 생성
    let html = '<div class="month-view">';
    
    // 요일 헤더 추가
    weekdayNames.forEach(day => {
        html += `<div class="day-header">${day}</div>`;
    });
    
    // 이전 달의 날짜들 추가
    let day = prevMonthLastDay.getDate() - startingDayOfWeek + 1;
    for (let i = 0; i < startingDayOfWeek; i++) {
        const prevDate = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, day);
        html += `<div class="day-cell other-month" data-day="${i}" data-date="${formatDate(prevDate)}">
                    <div class="day-number">${day}</div>
                    <div class="day-events"></div>
                </div>`;
        day++;
    }
    
    // 현재 월의 날짜들 추가
    const today = new Date();
    for (let i = 1; i <= lastDay.getDate(); i++) {
        const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), i);
        const dateStr = formatDate(date);
        const dayOfWeek = date.getDay();
        const isToday = today.getFullYear() === date.getFullYear() && 
                        today.getMonth() === date.getMonth() && 
                        today.getDate() === i;
        
        // 휴일 체크
        const holiday = holidays.find(h => h.date === dateStr);
        const isHoliday = holiday || dayOfWeek === 0;  // 일요일이거나 공휴일
        
        html += `<div class="day-cell ${isToday ? 'today' : ''} ${isHoliday ? 'holiday' : ''}" 
                        data-day="${dayOfWeek}" 
                        data-date="${dateStr}">
                    <div class="day-number">${i}</div>
                    ${holiday ? `<div class="holiday-name">${holiday.name}</div>` : ''}
                    <div class="day-events"></div>
                </div>`;
    }
    
    // 다음 달의 날짜들 추가
    let nextMonthDay = 1;
    const remainingCells = 7 - ((startingDayOfWeek + lastDay.getDate()) % 7);
    if (remainingCells < 7) {
        for (let i = 1; i <= remainingCells; i++) {
            const nextDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, nextMonthDay);
            html += `<div class="day-cell other-month" data-day="${(lastDay.getDay() + i) % 7}" data-date="${formatDate(nextDate)}">
                        <div class="day-number">${nextMonthDay}</div>
                        <div class="day-events"></div>
                    </div>`;
            nextMonthDay++;
        }
    }
    
    html += '</div>';
    calendarContainer.innerHTML = html;
    
    // 이벤트 추가
    addEventsToMonthView();
}

// 주별 뷰 렌더링
function renderWeekView() {
    // 현재 주의 시작일 (일요일)
    const currentDay = currentDate.getDay();
    const startDate = new Date(currentDate);
    startDate.setDate(currentDate.getDate() - currentDay);
    
    // 날짜 타이틀 업데이트
    const endDate = new Date(startDate);
    endDate.setDate(startDate.getDate() + 6);
    
    const startMonth = startDate.getMonth() + 1;
    const endMonth = endDate.getMonth() + 1;
    
    if (startDate.getMonth() === endDate.getMonth()) {
        dateTitle.textContent = `${startDate.getFullYear()}년 ${startMonth}월`;
    } else {
        dateTitle.textContent = `${startDate.getFullYear()}년 ${startMonth}월 - ${endMonth}월`;
    }
    
    // 주별 뷰 HTML 생성
    let html = '<div class="week-view">';
    
    // 시간 마커 추가
    html += '<div class="week-day-header"></div>';
    
    // 요일 헤더 추가
    const today = new Date();
    for (let i = 0; i < 7; i++) {
        const date = new Date(startDate);
        date.setDate(startDate.getDate() + i);
        const dateStr = formatDate(date);
        
        const isToday = today.getFullYear() === date.getFullYear() && 
                        today.getMonth() === date.getMonth() && 
                        today.getDate() === date.getDate();
        
        // 휴일 체크 추가
        const holiday = holidays.find(h => h.date === dateStr);
        const isHoliday = holiday || date.getDay() === 0;  // 일요일이거나 공휴일
        
        html += `<div class="week-day-header ${isToday ? 'today-header' : ''} ${isHoliday ? 'holiday' : ''}" data-date="${dateStr}">
                    ${weekdayNames[i]}
                    <div class="week-day-number">${date.getDate()}</div>
                    ${holiday ? `<div class="holiday-name">${holiday.name}</div>` : ''}
                </div>`;
    }
    
    // 시간 슬롯 추가
    for (let hour = 0; hour < 24; hour++) {
        const formattedHour = hour.toString().padStart(2, '0') + ':00';
        html += `<div class="time-marker">${formattedHour}</div>`;
        
        for (let i = 0; i < 7; i++) {
            const date = new Date(startDate);
            date.setDate(startDate.getDate() + i);
            const dateStr = formatDate(date);
            const holiday = holidays.find(h => h.date === dateStr);
            const isHoliday = holiday || date.getDay() === 0;
            
            html += `<div class="week-time-slot ${isHoliday ? 'holiday' : ''}" 
                    data-hour="${hour}" data-date="${dateStr}"></div>`;
        }
    }
    
    html += '</div>';
    calendarContainer.innerHTML = html;
    
    // 이벤트 추가
    addEventsToWeekView();
    
    // 현재 시간 표시선 추가
    addCurrentTimeLine();
}

// 평일 뷰 렌더링 (월~금)
function renderWeekdayView() {
    // 현재 날짜가 속한 주의 월요일 찾기
    const currentDay = currentDate.getDay(); // 0: 일요일, 1: 월요일, ..., 6: 토요일
    let startDate = new Date(currentDate);
    
    // 현재 날짜가 주말이면 다음 주 월요일로 설정
    if (currentDay === 0) { // 일요일
        startDate.setDate(currentDate.getDate() + 1);
    } else if (currentDay === 6) { // 토요일
        startDate.setDate(currentDate.getDate() + 2);
    } else {
        // 현재 날짜가 평일이면 해당 주의 월요일로 설정
        startDate.setDate(currentDate.getDate() - currentDay + 1);
    }
    
    // 날짜 타이틀 업데이트
    const endDate = new Date(startDate);
    endDate.setDate(startDate.getDate() + 4); // 월요일부터 금요일까지
    
    const startMonth = startDate.getMonth() + 1;
    const endMonth = endDate.getMonth() + 1;
    
    if (startDate.getMonth() === endDate.getMonth()) {
        dateTitle.textContent = `${startDate.getFullYear()}년 ${startMonth}월 (평일)`;
    } else {
        dateTitle.textContent = `${startDate.getFullYear()}년 ${startMonth}월 - ${endMonth}월 (평일)`;
    }
    
    // 평일 뷰 HTML 생성
    let html = '<div class="week-view weekday-view">'; // 주간 뷰와 유사하지만 클래스 추가
    
    // 시간 마커 추가
    html += '<div class="week-day-header"></div>';
    
    // 요일 헤더 추가 (월~금만)
    const today = new Date();
    const weekdayNames = ['월', '화', '수', '목', '금']; // 평일만
    
    for (let i = 0; i < 5; i++) {
        const date = new Date(startDate);
        date.setDate(startDate.getDate() + i);
        const dateStr = formatDate(date);
        
        const isToday = today.getFullYear() === date.getFullYear() && 
                        today.getMonth() === date.getMonth() && 
                        today.getDate() === date.getDate();
        
        // 휴일 체크 추가
        const holiday = holidays.find(h => h.date === dateStr);
        const isHoliday = holiday; // 공휴일만 체크 (주말은 표시하지 않음)
        
        html += `<div class="week-day-header ${isToday ? 'today-header' : ''} ${isHoliday ? 'holiday' : ''}" data-date="${dateStr}">
                    ${weekdayNames[i]}
                    <div class="week-day-number">${date.getDate()}</div>
                    ${holiday ? `<div class="holiday-name">${holiday.name}</div>` : ''}
                </div>`;
    }
    
    // 시간 슬롯 추가
    for (let hour = 0; hour < 24; hour++) {
        const formattedHour = hour.toString().padStart(2, '0') + ':00';
        html += `<div class="time-marker">${formattedHour}</div>`;
        
        for (let i = 0; i < 5; i++) { // 월~금만
            const date = new Date(startDate);
            date.setDate(startDate.getDate() + i);
            const dateStr = formatDate(date);
            const holiday = holidays.find(h => h.date === dateStr);
            const isHoliday = holiday;
            
            html += `<div class="week-time-slot ${isHoliday ? 'holiday' : ''}" 
                    data-hour="${hour}" data-date="${dateStr}"></div>`;
        }
    }
    
    html += '</div>';
    calendarContainer.innerHTML = html;
    
    // 이벤트 추가 (주간 뷰와 동일한 방식으로)
    addEventsToWeekView();
    
    // 현재 시간 표시선 추가
    addCurrentTimeLine();
}

// 일별 뷰 렌더링
function renderDayView() {
    // 날짜 타이틀 업데이트
    dateTitle.textContent = formatKoreanDate(formatDate(currentDate));
    
    // 일별 뷰 HTML 생성
    let html = '<div class="day-view">';
    
    // 시간 마커 추가
    for (let hour = 0; hour < 24; hour++) {
        const formattedHour = hour.toString().padStart(2, '0') + ':00';
        html += `<div class="time-marker">${formattedHour}</div>`;
        html += `<div class="time-slot" data-hour="${hour}" data-date="${formatDate(currentDate)}"></div>`;
    }
    
    html += '</div>';
    calendarContainer.innerHTML = html;
    
    // 이벤트 추가
    addEventsToDayView();
    
    // 현재 시간 표시선 추가
    addCurrentTimeLine();
}

// 월별 뷰에 이벤트 추가
function addEventsToMonthView() {
    const events = getEvents();
    const dayCells = document.querySelectorAll('.day-cell[data-date]');
    
    // 날짜별로 이벤트 그룹화
    const eventsByDate = {};
    events.forEach(event => {
        if (!eventsByDate[event.date]) {
            eventsByDate[event.date] = [];
        }
        eventsByDate[event.date].push(event);
    });
    
    // 각 날짜 셀에 이벤트 추가
    dayCells.forEach(cell => {
        const dateStr = cell.getAttribute('data-date');
        const dayEvents = cell.querySelector('.day-events');
        
        if (eventsByDate[dateStr]) {
            // 이벤트 정렬
            const sortedEvents = sortEventsByTime(eventsByDate[dateStr]);
            
            // 최대 3개까지만 표시하고 나머지는 "더보기"로 표시
            const maxVisibleEvents = 3;
            const visibleEvents = sortedEvents.slice(0, maxVisibleEvents);
            
            visibleEvents.forEach(event => {
                const eventEl = document.createElement('div');
                eventEl.className = 'event';
                eventEl.style.backgroundColor = getCategoryColor(event.category);
                eventEl.innerHTML = `
                    <span class="event-time">${formatTime(event.time_start)}</span>
                    <span class="event-title" title="${event.title}">${event.title}</span>
                `;
                
                // 이벤트 클릭 시 모달 표시
                eventEl.addEventListener('click', (e) => {
                    e.stopPropagation(); // day-cell 클릭 이벤트 전파 방지
                    showEventModal(event);
                });
                
                dayEvents.appendChild(eventEl);
            });
            
            // 더 많은 이벤트가 있으면 "더보기" 표시
            if (sortedEvents.length > maxVisibleEvents) {
                const moreEl = document.createElement('div');
                moreEl.className = 'event-more';
                moreEl.textContent = `+ ${sortedEvents.length - maxVisibleEvents}개 더보기`;
                
                // 더보기 클릭 시 해당 날짜의 일별 뷰로 전환
                moreEl.addEventListener('click', (e) => {
                    e.stopPropagation(); // 이벤트 버블링 방지
                    const clickedDate = new Date(dateStr);
                    currentDate = clickedDate;
                    currentView = 'day';
                    updateView();
                });
                
                dayEvents.appendChild(moreEl);
            }
            
        }
    });
}

// 주별 뷰에 이벤트 추가
function addEventsToWeekView() {
    const events = getEvents();
    const timeSlots = document.querySelectorAll('.week-time-slot');
    
    // Group events by date
    const eventsByDate = {};
    events.forEach(event => {
        if (!eventsByDate[event.date]) {
            eventsByDate[event.date] = [];
        }
        eventsByDate[event.date].push(event);
    });
    
    // Process each date's events
    Object.keys(eventsByDate).forEach(dateStr => {
        const dateEvents = eventsByDate[dateStr];
        
        // Sort events by start time
        dateEvents.sort((a, b) => a.time_start.localeCompare(b.time_start));
        
        // Find overlapping events
        const overlappingGroups = findOverlappingEvents(dateEvents);
        
        // Add events to the calendar
        overlappingGroups.forEach(group => {
            group.forEach((event, index) => {
                const startHour = parseInt(event.time_start.substring(0, 2));
                const startMinute = parseInt(event.time_start.substring(2, 4));
                const endHour = parseInt(event.time_end.substring(0, 2));
                const endMinute = parseInt(event.time_end.substring(2, 4));
                
                const startPosition = startHour + (startMinute / 60);
                const duration = (endHour + (endMinute / 60)) - startPosition;
                
                const slot = document.querySelector(`.week-time-slot[data-date="${dateStr}"][data-hour="${Math.floor(startPosition)}"]`);
                
                if (slot) {
                    const eventEl = document.createElement('div');
                    eventEl.className = 'time-event';
                    
                    // Calculate width and position dynamically based on number of overlapping events
                    const totalEvents = group.length;
                    const eventWidth = 99 / totalEvents; // 95% divided by number of events
                    const eventLeft = index * (99 / totalEvents); // Position based on index
                    
                    eventEl.style.width = `${eventWidth}%`;
                    eventEl.style.left = `${eventLeft}%`;
                    
                    eventEl.style.backgroundColor = getCategoryColor(event.category);
                    eventEl.style.top = `${(startPosition % 1) * 40}px`;
                    eventEl.style.height = `${Math.max(duration * 40, 20)}px`; // Minimum height of 20px
                    
                    // Create a more detailed tooltip with formatted content
                    const tooltipContent = `${event.title}\n${formatTime(event.time_start)} - ${formatTime(event.time_end)}${event.content ? '\n\n' + event.content : ''}`;
                    eventEl.title = tooltipContent;
                    eventEl.setAttribute('data-tooltip', 'true');
                    
                    // For very short events, add a special class
                    if (duration <= 0.5) { // 30 minutes or less
                        eventEl.classList.add('short-event');
                    }
                    
                    eventEl.innerHTML = `<div class="event-title">${event.title}</div>`;
                    eventEl.addEventListener('click', () => showEventModal(event));
                    slot.appendChild(eventEl);
                }
            });
        });
    });
}


// Helper function to check if a column is occupied
function isColumnOccupied(eventColumns, start, end, column) {
    for (let [key, existingEnd] of eventColumns.entries()) {
        if (key.startsWith(`${column}-`)) {
            const existingStart = parseFloat(key.split('-')[1]);
            if (!(start >= existingEnd || end <= existingStart)) {
                return true;
            }
        }
    }
    return false;
}


function findOverlappingEvents(events) {
    const groups = [];
    let currentGroup = [];
    
    events.forEach(event => {
        const eventStart = parseInt(event.time_start);
        const eventEnd = parseInt(event.time_end);
        
        // Check if this event overlaps with the current group
        const overlapsWithCurrentGroup = currentGroup.some(groupEvent => {
            const groupEventStart = parseInt(groupEvent.time_start);
            const groupEventEnd = parseInt(groupEvent.time_end);
            return !(eventStart >= groupEventEnd || eventEnd <= groupEventStart);
        });
        
        if (overlapsWithCurrentGroup) {
            currentGroup.push(event);
        } else {
            if (currentGroup.length > 0) {
                groups.push([...currentGroup]);
            }
            currentGroup = [event];
        }
    });
    
    if (currentGroup.length > 0) {
        groups.push(currentGroup);
    }
    
    return groups;
}

// 일별 뷰에 이벤트 추가
function addEventsToDayView() {
    const events = getEvents();
    const dateStr = formatDate(currentDate);
    
    // Filter events for the current date
    const dateEvents = events.filter(event => event.date === dateStr);
    
    // Sort events by start time
    dateEvents.sort((a, b) => a.time_start.localeCompare(b.time_start));
    
    // Find overlapping events
    const overlappingGroups = findOverlappingEvents(dateEvents);
    
    // Add events to the calendar
    overlappingGroups.forEach(group => {
        group.forEach((event, index) => {
            const startHour = parseInt(event.time_start.substring(0, 2));
            const startMinute = parseInt(event.time_start.substring(2, 4));
            const endHour = parseInt(event.time_end.substring(0, 2));
            const endMinute = parseInt(event.time_end.substring(2, 4));
            
            const startPosition = startHour + startMinute / 60;
            const duration = (endHour + endMinute / 60) - startPosition;
            
            const slot = document.querySelector(`.time-slot[data-hour="${Math.floor(startPosition)}"]`);
            
            if (slot) {
                const eventEl = document.createElement('div');
                eventEl.className = 'time-event';
                
                // Calculate width and position dynamically
                const totalEvents = group.length;
                const eventWidth = 99 / totalEvents;
                const eventLeft = index * (99 / totalEvents);
                
                eventEl.style.width = `calc(${eventWidth}% - 1px)`;
                eventEl.style.left = `${eventLeft}%`;
                
                eventEl.style.backgroundColor = getCategoryColor(event.category);
                eventEl.style.top = `${(startPosition % 1) * 40}px`;
                eventEl.style.height = `${Math.max(duration * 40, 20)}px`;
                
                // Create a more detailed tooltip with formatted content
                const tooltipContent = `${event.title}\n${formatTime(event.time_start)} - ${formatTime(event.time_end)}${event.content ? '\n\n' + event.content : ''}`;
                eventEl.title = tooltipContent;
                eventEl.setAttribute('data-tooltip', 'true');
                
                // For very short events, add a special class
                if (duration <= 0.5) {
                    eventEl.classList.add('short-event');
                }
                
                eventEl.innerHTML = `<div class="event-title">${event.title}</div>`;
                eventEl.addEventListener('click', () => showEventModal(event));
                slot.appendChild(eventEl);
            }
        });
    });
}

// 현재 시간 표시선 추가
function addCurrentTimeLine() {
    if (currentView === 'day' || currentView === 'week' || currentView === 'weekday') {
        // 기존 시간 표시선 제거
        const existingLines = document.querySelectorAll('.current-time-line, .current-time-marker');
        existingLines.forEach(line => line.remove());

        const now = new Date();
        const currentHour = now.getHours();
        const currentMinute = now.getMinutes();
        const currentPosition = currentHour + currentMinute / 60;
        
        // 현재 시간이 표시 범위 내에 있는 경우에만 표시
        if (currentHour < 24) {
            const container = currentView === 'day' ? 
                document.querySelector(`.time-slot[data-hour="${Math.floor(currentPosition)}"]`) :
                document.querySelector(`.week-time-slot[data-date="${formatDate(now)}"][data-hour="${Math.floor(currentPosition)}"]`);
            
            if (container) {
                const line = document.createElement('div');
                line.className = 'current-time-line';
                line.style.top = `${(currentPosition % 1) * 40}px`;
                
                const marker = document.createElement('div');
                marker.className = 'current-time-marker';
                marker.style.top = `${(currentPosition % 1) * 40}px`;
                
                container.appendChild(line);
                container.appendChild(marker);
            }
        }
    }
}

// 이벤트 모달 표시
function showEventModal(event) {
    modalTitle.textContent = event.title;
    modalTime.textContent = `${formatKoreanDate(event.date)} ${formatTime(event.time_start)} - ${formatTime(event.time_end)}`;
    modalContent.textContent = event.content;
    modalCategory.textContent = getCategoryName(event.category);
    modalCategory.style.backgroundColor = getCategoryColor(event.category);
    
    eventModal.style.display = 'block';
}

// 모달 닫기
function closeEventModal() {
    eventModal.style.display = 'none';
}

// 스크롤 위치 저장 함수
function saveScrollPosition() {
    let scrollContainer;
    
    // 현재 뷰에 따라 적절한 스크롤 컨테이너 선택
    if (currentView === 'day') {
        scrollContainer = document.querySelector('.day-view');
    } else if (currentView === 'week' || currentView === 'weekday') {
        scrollContainer = document.querySelector('.week-view');
    } else {
        scrollContainer = calendarContainer; // 월별 뷰 또는 기본값
    }
    
    if (scrollContainer) {
        const scrollPosition = scrollContainer.scrollTop;
        localStorage.setItem('calendarScrollPosition', scrollPosition);
        localStorage.setItem('calendarViewMode', currentView);
        localStorage.setItem('calendarDate', formatDate(currentDate));
    }
}

// 스크롤 위치 복원 함수
function restoreScrollPosition() {
    const savedPosition = localStorage.getItem('calendarScrollPosition');
    const savedView = localStorage.getItem('calendarViewMode');
    const savedDate = localStorage.getItem('calendarDate');
    
    // 저장된 날짜와 현재 날짜, 저장된 뷰와 현재 뷰가 같을 때만 스크롤 위치 복원
    if (savedPosition && savedView === currentView && savedDate === formatDate(currentDate)) {
        setTimeout(() => {
            let scrollContainer;
            
            // 현재 뷰에 따라 적절한 스크롤 컨테이너 선택
            if (currentView === 'day') {
                scrollContainer = document.querySelector('.day-view');
            } else if (currentView === 'week' || currentView === 'weekday') {
                scrollContainer = document.querySelector('.week-view');
            } else {
                scrollContainer = calendarContainer;
            }
            
            if (scrollContainer) {
                // 부드러운 스크롤 적용
                scrollContainer.scrollTo({
                    top: parseInt(savedPosition),
                    behavior: 'smooth'
                });
            }
        }, 100);
    }
}

// 스크롤 이벤트 리스너 추가
function addScrollListener() {
    // 기존 스크롤 이벤트 리스너 제거
    const scrollContainers = [
        document.querySelector('.day-view'),
        document.querySelector('.week-view'),
        calendarContainer
    ].filter(container => container !== null); // null 제거
    
    // 현재 뷰에 따라 적절한 스크롤 컨테이너 선택
    let scrollContainer;
    if (currentView === 'day') {
        scrollContainer = document.querySelector('.day-view');
    } else if (currentView === 'week' || currentView === 'weekday') {
        scrollContainer = document.querySelector('.week-view');
    } else {
        scrollContainer = calendarContainer; // 월별 뷰 또는 기본값
    }
    
    // 새 스크롤 이벤트 리스너 추가
    if (scrollContainer) {
        // 스크롤 이벤트에 디바운스 적용
        let scrollTimeout;
        const scrollHandler = () => {
            clearTimeout(scrollTimeout);
            scrollTimeout = setTimeout(() => {
                saveScrollPosition();
            }, 200); // 200ms 디바운스
        };
        
        // 이전 이벤트 리스너 제거 후 새로운 리스너 추가
        scrollContainer.removeEventListener('scroll', scrollHandler);
        scrollContainer.addEventListener('scroll', scrollHandler);
    }
}

// 현재 뷰 업데이트
function updateView() {
    // 활성 버튼 스타일 업데이트
    monthViewBtn.classList.toggle('active', currentView === 'month');
    weekViewBtn.classList.toggle('active', currentView === 'week');
    weekdayViewBtn.classList.toggle('active', currentView === 'weekday');
    dayViewBtn.classList.toggle('active', currentView === 'day');
    // 현재 뷰 모드 저장
    saveViewMode(currentView);
    
    // 선택된 뷰 렌더링
    switch (currentView) {
        case 'month':
            renderMonthView();
            break;
        case 'week':
            renderWeekView();
            break;
        case 'weekday':
            renderWeekdayView();
            break;
        case 'day':
            renderDayView();
            break;
    }
    
    // 스크롤 위치 복원
    restoreScrollPosition();
    
    // 스크롤 이벤트 리스너 추가
    addScrollListener();
}

// 이벤트 리스너 설정
monthViewBtn.addEventListener('click', () => {
    currentView = 'month';
    updateView();
});

weekViewBtn.addEventListener('click', () => {
    currentView = 'week';
    updateView();
});

weekdayViewBtn.addEventListener('click', () => { // Add weekday view button listener
    currentView = 'weekday';
    updateView();
});

dayViewBtn.addEventListener('click', () => {
    currentView = 'day';
    updateView();
});

prevBtn.addEventListener('click', () => {
    switch (currentView) {
        case 'month':
            currentDate.setMonth(currentDate.getMonth() - 1);
            break;
        case 'week':
            currentDate.setDate(currentDate.getDate() - 7);
            break;
        case 'weekday':
            currentDate.setDate(currentDate.getDate() - 5);
            break;
        case 'day':
            currentDate.setDate(currentDate.getDate() - 1);
            break;
    }
    updateView();
});

nextBtn.addEventListener('click', () => {
    switch (currentView) {
        case 'month':
            currentDate.setMonth(currentDate.getMonth() + 1);
            break;
        case 'week':
            currentDate.setDate(currentDate.getDate() + 7);
            break;
        case 'weekday':
            currentDate.setDate(currentDate.getDate() + 5);
            break;
        case 'day':
            currentDate.setDate(currentDate.getDate() + 1);
            break;
    }
    updateView();
});

todayBtn.addEventListener('click', () => {
    currentDate = new Date();
    updateView();
});

closeModal.addEventListener('click', closeEventModal);

// 모달 외부 클릭 시 닫기
window.addEventListener('click', (event) => {
    if (event.target === eventModal) {
        closeEventModal();
    }
});

// 키보드 단축키 이벤트 리스너 추가
document.addEventListener('keydown', (e) => {
    // input 요소나 textarea에서 입력 중일 때는 단축키 동작하지 않도록
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
        return;
    }
    
    // 모달이 열려있을 때는 단축키 동작하지 않도록
    if (eventModal.style.display === 'block' || dateSelectorModal.style.display === 'block') {
        return;
    }

    switch (e.key.toUpperCase()) {
        case 'M':
            currentView = 'month';
            monthViewBtn.click();
            break;
        case 'W':
            currentView = 'week';
            weekViewBtn.click();
            break;
        case 'D':
            currentView = 'day';
            dayViewBtn.click();
            break;
    }
});

// 뷰 버튼에 단축키 힌트 추가
monthViewBtn.setAttribute('title', '월별 보기 (M)');
weekViewBtn.setAttribute('title', '주별 보기 (W)');
dayViewBtn.setAttribute('title', '일별 보기 (D)');

// 초기화 및 이벤트 리스너 설정
document.addEventListener('DOMContentLoaded', () => {
    // localStorage 초기화 및 데이터 로드
    getEvents();  // initializeLocalStorage() 대신 getEvents() 호출
    
    // 저장된 뷰 모드 불러오기
    currentView = getSavedViewMode();
    
    // 저장된 날짜가 있으면 복원
    const savedDate = localStorage.getItem('calendarDate');
    if (savedDate) {
        const dateParts = savedDate.split('-');
        if (dateParts.length === 3) {
            currentDate = new Date(dateParts[0], dateParts[1] - 1, dateParts[2]);
        }
    }

    // 기본 뷰 표시
    updateView();
    
    // 1분마다 현재 시간 표시선 업데이트
    setInterval(() => {
        if (currentView === 'week' || currentView === 'day') {
            addCurrentTimeLine();
        }
    }, 60000);
});
