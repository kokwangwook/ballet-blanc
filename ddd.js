// 데이터 imports
import timeSlots from './data/timeSlots.js';
import students, {
    addStudent,
    updateStudent,
    deleteStudent,
    getStudentById,
    getStudentsByTimeSlot,
    getStudentsByDay,
    getAllStudents
} from './data/students.js';
import scheduleChanges, {
    addScheduleChange,
    getAllScheduleChanges
} from './data/schedules.js';
import { 
    addWithdrawal, 
    restoreStudent, 
    getAllWithdrawals 
} from './data/withdrawals.js';

// DOM 이벤트 리스너 설정
document.addEventListener('DOMContentLoaded', () => {
    // 초기 데이터 렌더링
    renderDashboard();
    renderStudents();
    renderDayStudents();
    renderScheduleChanges();
    renderWithdrawals();
    
    // 폼 제출 이벤트 리스너 등록
    document.getElementById('addStudentForm').addEventListener('submit', handleAddStudent);
    document.getElementById('scheduleChangeForm').addEventListener('submit', handleAddScheduleChange);
    document.getElementById('editStudentForm').addEventListener('submit', handleEditStudent);
    document.getElementById('withdrawalForm').addEventListener('submit', handleWithdrawal);
    
    // 초기 탭 설정
    showTab('dashboard');
    
    // 자동 새로고침 설정 (5분마다)
    setInterval(refreshDashboard, 300000);
});

// 대시보드 관련 함수들
function renderDashboard() {
    updateDashboardCounts();
    renderTodaySchedule();
    renderRecentChanges();
    renderRecentStudents();
}

function updateDashboardCounts() {
    // 전체 학생 수 업데이트
    const totalStudents = getAllStudents().length;
    document.getElementById('totalStudentsCount').textContent = totalStudents;

    // 오늘 등원 예정 학생 수 계산
    const today = new Date();
    const dayNames = ['일', '월', '화', '수', '목', '금', '토'];
    const todayName = dayNames[today.getDay()];
    const todayStudents = getAllStudents().filter(student => 
        student.days && student.days.includes(todayName)
    ).length;
    document.getElementById('todayStudentsCount').textContent = todayStudents;

    // 이번 주 일정 변경 건수
    const weekStart = new Date();
    weekStart.setDate(weekStart.getDate() - weekStart.getDay());
    const weekChanges = getAllScheduleChanges().filter(change => {
        const changeDate = new Date(change.date);
        return changeDate >= weekStart;
    }).length;
    document.getElementById('scheduleChangesCount').textContent = weekChanges;

    // 이번 달 퇴원 예정 건수
    const monthStart = new Date();
    monthStart.setDate(1);
    const withdrawalCount = getAllWithdrawals().filter(w => {
        const withdrawalDate = new Date(w.withdrawalDate);
        return withdrawalDate.getMonth() === monthStart.getMonth();
    }).length;
    document.getElementById('withdrawalCount').textContent = withdrawalCount;
}

function renderTodaySchedule() {
    const today = new Date();
    const dayNames = ['일', '월', '화', '수', '목', '금', '토'];
    const todayName = dayNames[today.getDay()];
    const container = document.getElementById('todaySchedule');

    const scheduleHtml = timeSlots.map(slot => {
        const slotStudents = getStudentsByTimeSlot(slot.time)
            .filter(student => student.days && student.days.includes(todayName));

        if (slotStudents.length === 0) return '';

        return `
            <div class="border rounded-lg p-4">
                <h4 class="font-semibold text-gray-700 mb-2">${slot.title}</h4>
                <div class="space-y-2">
                    ${slotStudents.map(student => `
                        <div class="flex justify-between items-center bg-gray-50 p-2 rounded">
                            <div>
                                <span class="font-medium">${student.name}</span>
                                ${student.location ? `<span class="text-sm text-gray-600 ml-2">${student.location}</span>` : ''}
                            </div>
                            ${student.contact ? `<span class="text-sm text-gray-600">${student.contact}</span>` : ''}
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    }).join('');

    container.innerHTML = scheduleHtml || '<p class="text-gray-500 text-center">오늘은 운행 일정이 없습니다.</p>';
}

function renderRecentChanges() {
    const container = document.getElementById('recentScheduleChanges');
    const recentChanges = getAllScheduleChanges()
        .sort((a, b) => new Date(b.date) - new Date(a.date))
        .slice(0, 5);

    container.innerHTML = recentChanges.map(change => {
        const student = getStudentById(parseInt(change.studentId));
        return `
            <div class="border-l-4 border-yellow-500 pl-3 py-2">
                <div class="font-medium">${student ? student.name : '알 수 없음'}</div>
                <div class="text-sm text-gray-600">
                    ${change.date} - ${change.reason}
                </div>
            </div>
        `;
    }).join('') || '<p class="text-gray-500 text-center">최근 일정 변경이 없습니다.</p>';
}
function renderRecentStudents() {
    const container = document.getElementById('recentStudents');
    const recentStudents = getAllStudents()
        .sort((a, b) => b.id - a.id)
        .slice(0, 5);

    container.innerHTML = recentStudents.map(student => `
        <div class="border-l-4 border-blue-500 pl-3 py-2">
            <div class="font-medium">${student.name}</div>
            <div class="text-sm text-gray-600">
                ${student.timeSlot} - ${student.days ? student.days.join(', ') : '미지정'}
            </div>
        </div>
    `).join('') || '<p class="text-gray-500 text-center">최근 등록된 학생이 없습니다.</p>';
}

function refreshDashboard() {
    if (document.querySelector('[data-tab="dashboard"]').classList.contains('active')) {
        renderDashboard();
    }
}

// 탭 전환 함수
window.showTab = function(tabId) {
    document.querySelectorAll('.tab-button').forEach(button => {
        button.classList.remove('active');
    });
    
    document.querySelector(`[data-tab="${tabId}"]`).classList.add('active');
    
    document.querySelectorAll('.tab-content').forEach(content => {
        content.classList.remove('active');
    });
    
    document.getElementById(tabId).classList.add('active');
    
    // 선택된 탭에 따라 적절한 렌더링 함수 호출
    if (tabId === 'dashboard') {
        renderDashboard();
    } else if (tabId === 'timeTable') {
        renderStudents();
    } else if (tabId === 'dayTable') {
        renderDayStudents();
    } else if (tabId === 'allStudents') {
        renderAllStudents();
    } else if (tabId === 'withdrawals') {
        renderWithdrawals();
    } else if (tabId === 'schedule') {
        renderScheduleChanges();
    }
};

// 모달 제어 함수들
window.showModal = function(modalId) {
    const modal = document.getElementById(modalId);
    modal.classList.add('show');
};

window.hideModal = function(modalId) {
    const modal = document.getElementById(modalId);
    modal.classList.remove('show');
};

window.showAddStudentModal = function() {
    const form = document.getElementById('addStudentForm');
    form.reset();
    showModal('addStudentModal');
};

window.showScheduleChangeModal = function() {
    const select = document.querySelector('[name="studentId"]');
    select.innerHTML = getAllStudents().map(student => 
        `<option value="${student.id}">${student.name}</option>`
    ).join('');
    
    const form = document.getElementById('scheduleChangeForm');
    form.reset();
    showModal('scheduleChangeModal');
};

// 렌더링 함수들
function renderStudents() {
    const container = document.getElementById('studentsList');
    container.innerHTML = timeSlots.map(slot => {
        const slotStudents = getStudentsByTimeSlot(slot.time);
        if (slotStudents.length === 0) return '';

        return `
            <div class="time-slot-card mb-6">
                <h2 class="text-xl font-bold mb-4 bg-gray-100 p-3 rounded">
                    ${slot.title}
                </h2>
                <div class="grid gap-4">
                    ${slotStudents.map(student => `
                        <div class="student-card">
                            <div class="flex justify-between items-start">
                                <div>
                                    <div class="flex items-center gap-2">
                                        <h3 class="text-lg font-medium">${student.name}</h3>
                                        ${student.number ? `<span class="text-sm text-gray-500">#${student.number}</span>` : ''}
                                    </div>
                                    ${student.contact ? `<p class="text-sm text-gray-600">연락처: ${student.contact}</p>` : ''}
                                    ${student.location ? `<p class="text-sm text-gray-600">탑승 위치: ${student.location}</p>` : ''}
                                    ${student.days && student.days.length > 0 ? 
                                        `<p class="text-sm text-gray-600">등원 요일: ${student.days.join(', ')}</p>` : ''}
                                    ${student.shortPhone ? `<p class="text-sm text-gray-600">단축번호: ${student.shortPhone}</p>` : ''}
                                </div>
                                <div class="flex gap-2">
                                    <button onclick="editStudent(${student.id})" 
                                        class="text-sm px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600">
                                        수정
                                    </button>
                                    <button onclick="showWithdrawalModal(${student.id})" 
                                        class="text-sm px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600">
                                        퇴원
                                    </button>
                                </div>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    }).join('');
}

function renderDayStudents() {
    const container = document.getElementById('dayStudentsList');
    container.innerHTML = ['월', '화', '수', '목', '금'].map(day => {
        const dayStudents = getStudentsByDay(day);
        if (dayStudents.length === 0) return '';

        return `
            <div class="time-slot-card mb-6">
                <h2 class="text-xl font-bold mb-4 bg-gray-100 p-3 rounded">
                    ${day}요일
                </h2>
                <div class="grid gap-4">
                    ${dayStudents.map(student => `
                        <div class="student-card">
                            <div class="flex justify-between items-start">
                                <div>
                                    <div class="flex items-center gap-2">
                                        <h3 class="text-lg font-medium">${student.name}</h3>
                                        ${student.number ? `<span class="text-sm text-gray-500">#${student.number}</span>` : ''}
                                    </div>
                                    ${student.contact ? `<p class="text-sm text-gray-600">연락처: ${student.contact}</p>` : ''}
                                    ${student.location ? `<p class="text-sm text-gray-600">탑승 위치: ${student.location}</p>` : ''}
                                    <p class="text-sm text-gray-600">등원 시간: ${formatTimeSlot(student.timeSlot)}</p>
                                    ${student.shortPhone ? `<p class="text-sm text-gray-600">단축번호: ${student.shortPhone}</p>` : ''}
                                </div>
                                <div class="flex gap-2">
                                    <button onclick="editStudent(${student.id})" 
                                        class="text-sm px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600">
                                        수정
                                    </button>
                                    <button onclick="showWithdrawalModal(${student.id})" 
                                        class="text-sm px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600">
                                        퇴원
                                    </button>
                                </div>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    }).join('');
}

function renderAllStudents() {
    const container = document.getElementById('allStudentsList');
    
    // 검색 바 추가
    const searchHtml = `
        <div class="mb-4">
            <input type="text" 
                   id="studentSearch" 
                   placeholder="학생 이름, 위치, 번호로 검색" 
                   class="w-full p-2 border rounded"
                   onkeyup="filterStudents()">
        </div>
    `;

    const allStudents = getAllStudents();
    
    // 테이블 생성
    const tableHtml = `
        <table class="w-full border-collapse">
            <thead>
                <tr class="border-b bg-gray-50">
                    <th class="p-3 text-left">번호</th>
                    <th class="p-3 text-left">이름</th>
                    <th class="p-3 text-left">등원 요일</th>
                    <th class="p-3 text-left">탑승 위치</th>
                    <th class="p-3 text-left">시간대</th>
                    <th class="p-3 text-left">연락처</th>
                    <th class="p-3 text-left">단축번호</th>
                    <th class="p-3 text-left">관리</th>
                </tr>
            </thead>
            <tbody id="studentsTableBody">
                ${allStudents.map(student => `
                    <tr class="border-b hover:bg-gray-50">
                        <td class="p-3">${student.number || '-'}</td>
                        <td class="p-3">${student.name}</td>
                        <td class="p-3">${student.days ? student.days.join(', ') : '미지정'}</td>
                        <td class="p-3">${student.location || '-'}</td>
                        <td class="p-3">${formatTimeSlot(student.timeSlot)}</td>
                        <td class="p-3">${student.contact || '-'}</td>
                        <td class="p-3">${student.shortPhone || '-'}</td>
                        <td class="p-3">
                            <div class="flex gap-2">
                                <button onclick="editStudent(${student.id})" 
                                        class="px-3 py-1 text-sm bg-blue-500 text-white rounded-md hover:bg-blue-600">
                                    수정
                                </button>
                                <button onclick="showWithdrawalModal(${student.id})" 
                                        class="px-3 py-1 text-sm bg-yellow-500 text-white rounded-md hover:bg-yellow-600">
                                    퇴원
                                </button>
                            </div>
                        </td>
                    </tr>
                `).join('')}
            </tbody>
        </table>
    `;

    container.innerHTML = searchHtml + tableHtml;
}
function renderWithdrawals() {
    const container = document.getElementById('withdrawalsList');
    container.innerHTML = `
        <div class="mb-4">
            <h2 class="text-xl font-bold">퇴원 학생 목록</h2>
        </div>
        <table class="w-full border-collapse">
            <thead>
                <tr class="border-b bg-gray-50">
                    <th class="p-3 text-left">이름</th>
                    <th class="p-3 text-left">퇴원일</th>
                    <th class="p-3 text-left">퇴원사유</th>
                    <th class="p-3 text-left">마지막 등원 시간</th>
                    <th class="p-3 text-left">연락처</th>
                    <th class="p-3 text-left">단축번호</th>
                    <th class="p-3 text-left">관리</th>
                </tr>
            </thead>
            <tbody>
                ${getAllWithdrawals().map(student => `
                    <tr class="border-b hover:bg-gray-50">
                        <td class="p-3">${student.name}</td>
                        <td class="p-3">${student.withdrawalDate}</td>
                        <td class="p-3">${student.withdrawalReason}</td>
                        <td class="p-3">${formatTimeSlot(student.timeSlot)}</td>
                        <td class="p-3">${student.contact || '-'}</td>
                        <td class="p-3">${student.shortPhone || '-'}</td>
                        <td class="p-3">
                            <button onclick="restoreWithdrawalStudent(${student.id})" 
                                    class="px-3 py-1 text-sm bg-green-500 text-white rounded-md hover:bg-green-600">
                                재등록
                            </button>
                        </td>
                    </tr>
                `).join('')}
            </tbody>
        </table>
    `;
}

function renderScheduleChanges() {
    const container = document.getElementById('scheduleList');
    container.innerHTML = getAllScheduleChanges().map(change => {
        const student = getStudentById(parseInt(change.studentId));
        return `
            <div class="student-card">
                <h3 class="text-lg font-medium">${student ? student.name : '알 수 없음'}</h3>
                <p class="text-sm text-gray-600">변경 유형: ${change.changeType === 'temporary' ? '임시 변경' : '정기 변경'}</p>
                <p class="text-sm text-gray-600">변경 날짜: ${change.date}</p>
                <p class="text-sm text-gray-600">변경 사유: ${change.reason}</p>
            </div>
        `;
    }).join('');
}

// 폼 처리 함수들
window.handleAddStudent = function(event) {
    event.preventDefault();
    const form = event.target;
    
    const newStudent = {
        name: form.name.value,
        contact: form.contact.value,
        location: form.location.value,
        shortPhone: form.shortPhone.value,
        timeSlot: form.timeSlot.value,
        days: Array.from(form.days)
            .filter(checkbox => checkbox.checked)
            .map(checkbox => checkbox.value)
    };
    
    addStudent(newStudent);
    renderStudents();
    renderDayStudents();
    renderAllStudents();
    renderDashboard();
    hideModal('addStudentModal');
    form.reset();
};

window.handleAddScheduleChange = function(event) {
    event.preventDefault();
    const form = event.target;
    
    const newChange = {
        studentId: form.studentId.value,
        changeType: form.changeType.value,
        date: form.date.value,
        reason: form.reason.value
    };
    
    addScheduleChange(newChange);
    renderScheduleChanges();
    renderDashboard();
    hideModal('scheduleChangeModal');
    form.reset();
};

window.editStudent = function(studentId) {
    const student = getStudentById(studentId);
    if (!student) return;
    
    const form = document.getElementById('editStudentForm');
    
    // 폼에 현재 학생 정보 채우기
    form.studentId.value = student.id;
    form.name.value = student.name;
    form.contact.value = student.contact || '';
    form.location.value = student.location || '';
    form.shortPhone.value = student.shortPhone || '';
    form.timeSlot.value = student.timeSlot;
    
    // 요일 체크박스 설정
    Array.from(form.days).forEach(checkbox => {
        checkbox.checked = student.days && student.days.includes(checkbox.value);
    });
    
    showModal('editStudentModal');
};

window.handleEditStudent = function(event) {
    event.preventDefault();
    const form = event.target;
    
    const studentId = parseInt(form.studentId.value);
    const student = getStudentById(studentId);
    
    const updatedStudent = {
        ...student,
        name: form.name.value,
        contact: form.contact.value,
        location: form.location.value,
        shortPhone: form.shortPhone.value,
        timeSlot: form.timeSlot.value,
        days: Array.from(form.days)
            .filter(checkbox => checkbox.checked)
            .map(checkbox => checkbox.value)
    };
    
    updateStudent(updatedStudent);
    renderStudents();
    renderDayStudents();
    renderAllStudents();
    renderDashboard();
    hideModal('editStudentModal');
    alert('학생 정보가 수정되었습니다.');
};

window.deleteStudent = function() {
    const form = document.getElementById('editStudentForm');
    const studentId = parseInt(form.studentId.value);
    const student = getStudentById(studentId);
    
    if (confirm(`정말 ${student.name} 학생의 정보를 삭제하시겠습니까?`)) {
        deleteStudent(studentId);
        renderStudents();
        renderDayStudents();
        renderAllStudents();
        renderDashboard();
        hideModal('editStudentModal');
        alert('학생 정보가 삭제되었습니다.');
    }
};

window.showWithdrawalModal = function(studentId) {
    const form = document.getElementById('withdrawalForm');
    form.studentId.value = studentId;
    
    // 현재 날짜를 기본값으로 설정
    const today = new Date().toISOString().split('T')[0];
    form.date.value = today;
    
    showModal('withdrawalModal');
};

window.handleWithdrawal = function(event) {
    event.preventDefault();
    const form = event.target;
    const studentId = parseInt(form.studentId.value);
    const student = getStudentById(studentId);
    
    if (student) {
        addWithdrawal(student, form.reason.value, form.date.value);
        deleteStudent(studentId);
        renderStudents();
        renderDayStudents();
        renderAllStudents();
        renderWithdrawals();
        renderDashboard();
        hideModal('withdrawalModal');
        alert(`${student.name} 학생이 퇴원 처리되었습니다.`);
    }
};

window.restoreWithdrawalStudent = function(withdrawalId) {
    if (confirm('해당 학생을 재등록하시겠습니까?')) {
        const student = restoreStudent(withdrawalId);
        if (student) {
            addStudent(student);
            renderStudents();
            renderDayStudents();
            renderAllStudents();
            renderWithdrawals();
            renderDashboard();
            alert(`${student.name} 학생이 재등록되었습니다.`);
        }
    }
};

window.filterStudents = function() {
    const searchTerm = document.getElementById('studentSearch').value.toLowerCase();
    const tbody = document.getElementById('studentsTableBody');
    const rows = tbody.getElementsByTagName('tr');

    for (let row of rows) {
        const text = row.textContent.toLowerCase();
        row.style.display = text.includes(searchTerm) ? '' : 'none';
    }
};

// 유틸리티 함수
function formatTimeSlot(timeSlot) {
    const timeSlotMap = {
        '14:30': '2시 30분 등원(3시 40분 수업)',
        '15:30': '3시 30분 등원(4시 40분 수업)',
        '16:50': '4시 50분 하원, 등원(5시 40분 수업)',
        '17:40': '5시 40분 하원, 등원(6시 40분 수업)',
        '18:40': '6시 40분 하원',
        '19:40': '7시 40분 하원'
    };
    return timeSlotMap[timeSlot] || timeSlot;
}
