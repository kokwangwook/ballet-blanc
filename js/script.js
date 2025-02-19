// 시간대 관리
const timeSlots = [
    {
        time: '14:30',
        title: '2시 30분 등원(3시 40분 수업)'
    },
    {
        time: '15:30',
        title: '3시 30분 등원(4시 40분 수업)'
    },
    {
        time: '16:50',
        title: '4시 50분 하원, 등원(5시 40분 수업)'
    },
    {
        time: '17:40',
        title: '5시 40분 하원, 등원(6시 40분 수업)'
    },
    {
        time: '18:40',
        title: '6시 40분 하원'
    },
    {
        time: '19:40',
        title: '7시 40분 하원'
    }
];

// 학생 데이터 관리
let students = [
    {
        id: 1,
        name: '이제인',
        days: ['월', '화', '수', '목'],
        location: '엔젤음악학원(루벤하임앞)',
        number: '72',
        timeSlot: '14:30'
    }
];

// 일정 변경 데이터 관리
let scheduleChanges = [];

// 퇴원 학생 데이터 관리
let withdrawals = [];

// DOM 이벤트 리스너 설정
document.addEventListener('DOMContentLoaded', () => {
    // 초기 데이터 렌더링
    renderStudents();
    renderDayStudents();
    renderScheduleChanges();
    renderWithdrawals();
    
    // 폼 제출 이벤트 리스너 등록
    document.getElementById('addStudentForm').addEventListener('submit', handleAddStudent);
    document.getElementById('scheduleChangeForm').addEventListener('submit', handleScheduleChange);
    document.getElementById('editStudentForm').addEventListener('submit', handleEditStudent);
    document.getElementById('withdrawalForm').addEventListener('submit', handleWithdrawal);
    
    // 초기 탭 설정
    showTab('timeTable');
});

// 탭 전환 함수
window.showTab = function(tabId) {
    // 모든 탭 버튼에서 active 클래스 제거
    document.querySelectorAll('.tab-button').forEach(button => {
        button.classList.remove('active');
    });
    
    // 선택된 탭 버튼에 active 클래스 추가
    document.querySelector(`[data-tab="${tabId}"]`).classList.add('active');
    
    // 모든 탭 컨텐츠에서 active 클래스 제거
    document.querySelectorAll('.tab-content').forEach(content => {
        content.classList.remove('active');
    });
    
    // 선택된 탭 컨텐츠에 active 클래스 추가
    document.getElementById(tabId).classList.add('active');
    
    // 선택된 탭에 따라 적절한 렌더링 함수 호출
    if (tabId === 'timeTable') {
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

// 학생 관리 함수들
function addStudent(student) {
    students.push({
        id: Date.now(),
        ...student
    });
}

function updateStudent(updatedStudent) {
    const index = students.findIndex(s => s.id === updatedStudent.id);
    if (index !== -1) {
        students[index] = updatedStudent;
    }
}

function deleteStudent(studentId) {
    const index = students.findIndex(s => s.id === studentId);
    if (index !== -1) {
        students.splice(index, 1);
    }
}

function getStudentById(studentId) {
    return students.find(s => s.id === studentId);
}

function getStudentsByTimeSlot(timeSlot) {
    return students.filter(s => s.timeSlot === timeSlot);
}

function getStudentsByDay(day) {
    return students.filter(s => s.days && s.days.includes(day));
}

function getAllStudents() {
    return [...students];
}

// 일정 변경 관리 함수들
function addScheduleChange(change) {
    scheduleChanges.push({
        id: Date.now(),
        ...change
    });
}

function deleteScheduleChange(changeId) {
    const index = scheduleChanges.findIndex(c => c.id === changeId);
    if (index !== -1) {
        scheduleChanges.splice(index, 1);
    }
}

function getScheduleChangesByStudent(studentId) {
    return scheduleChanges.filter(c => c.studentId === studentId);
}

// 퇴원 관리 함수들
function addWithdrawal(student, reason, date) {
    withdrawals.push({
        ...student,
        withdrawalReason: reason,
        withdrawalDate: date,
        originalId: student.id,
        id: Date.now()
    });
}

function restoreStudent(withdrawalId) {
    const index = withdrawals.findIndex(w => w.id === withdrawalId);
    if (index !== -1) {
        const student = withdrawals[index];
        withdrawals.splice(index, 1);
        return {
            ...student,
            id: student.originalId,
            withdrawalReason: undefined,
            withdrawalDate: undefined,
            originalId: undefined
        };
    }
    return null;
}

// 렌더링 함수들
function renderStudents() {
    const container = document.getElementById('studentsList');
    container.innerHTML = timeSlots.map(slot => {
        const slotStudents = getStudentsByTimeSlot(slot.time);
        if (slotStudents.length === 0) return '';

        return `
            <div class="time-slot-section">
                <div class="time-slot-header">
                    <h2 class="time-slot-title">${slot.title}</h2>
                </div>
                <div class="student-list">
                    ${slotStudents.map(student => `
                        <div class="student-card">
                            <div class="student-info">
                                <div>
                                    <h3 class="student-name">${student.name}</h3>
                                    ${student.number ? `<span class="student-number">#${student.number}</span>` : ''}
                                    ${student.contact ? `<p class="student-details">연락처: ${student.contact}</p>` : ''}
                                    ${student.location ? `<p class="student-details">탑승 위치: ${student.location}</p>` : ''}
                                    ${student.days ? `<p class="student-details">등원 요일: ${student.days.join(', ')}</p>` : ''}
                                </div>
                                <div class="button-group">
                                    <button onclick="editStudent(${student.id})" class="btn btn-primary">
                                        수정
                                    </button>
                                    <button onclick="showWithdrawalModal(${student.id})" class="btn btn-warning">
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
            <div class="time-slot-section">
                <div class="time-slot-header">
                    <h2 class="time-slot-title">${day}요일</h2>
                </div>
                <div class="student-list">
                    ${dayStudents.map(student => `
                        <div class="student-card">
                            <div class="student-info">
                                <div>
                                    <h3 class="student-name">${student.name}</h3>
                                    ${student.number ? `<span class="student-number">#${student.number}</span>` : ''}
                                    ${student.contact ? `<p class="student-details">연락처: ${student.contact}</p>` : ''}
                                    ${student.location ? `<p class="student-details">탑승 위치: ${student.location}</p>` : ''}
                                    <p class="student-details">등원 시간: ${formatTimeSlot(student.timeSlot)}</p>
                                </div>
                                <div class="button-group">
                                    <button onclick="editStudent(${student.id})" class="btn btn-primary">
                                        수정
                                    </button>
                                    <button onclick="showWithdrawalModal(${student.id})" class="btn btn-warning">
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
        <div class="form-group">
            <input type="text" 
                   id="studentSearch" 
                   class="form-control" 
                   placeholder="학생 이름, 위치, 번호로 검색"
                   onkeyup="filterStudents()">
        </div>
    `;

    const allStudents = getAllStudents();
    
    // 테이블 생성
    const tableHtml = `
        <div class="table-responsive">
            <table class="w-full">
                <thead>
                    <tr>
                        <th>번호</th>
                        <th>이름</th>
                        <th>등원 요일</th>
                        <th>탑승 위치</th>
                        <th>시간대</th>
                        <th>연락처</th>
                        <th>관리</th>
                    </tr>
                </thead>
                <tbody id="studentsTableBody">
                    ${allStudents.map(student => `
                        <tr>
                            <td>${student.number || '-'}</td>
                            <td>${student.name}</td>
                            <td>${student.days ? student.days.join(', ') : '미지정'}</td>
                            <td>${student.location || '-'}</td>
                            <td>${formatTimeSlot(student.timeSlot)}</td>
                            <td>${student.contact || '-'}</td>
                            <td>
                                <div class="button-group">
                                    <button onclick="editStudent(${student.id})" class="btn btn-primary">
                                        수정
                                    </button>
                                    <button onclick="showWithdrawalModal(${student.id})" class="btn btn-warning">
                                        퇴원
                                    </button>
                                </div>
                            </td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        </div>
    `;

    container.innerHTML = searchHtml + tableHtml;
}

function renderWithdrawals() {
    const container = document.getElementById('withdrawalsList');
    container.innerHTML = `
        <div class="table-responsive">
            <table class="w-full">
                <thead>
                    <tr>
                        <th>이름</th>
                        <th>퇴원일</th>
                        <th>퇴원사유</th>
                        <th>마지막 등원 시간</th>
                        <th>연락처</th>
                        <th>관리</th>
                    </tr>
                </thead>
                <tbody>
                    ${withdrawals.map(student => `
                        <tr>
                            <td>${student.name}</td>
                            <td>${student.withdrawalDate}</td>
                            <td>${student.withdrawalReason}</td>
                            <td>${formatTimeSlot(student.timeSlot)}</td>
                            <td>${student.contact || '-'}</td>
                            <td>
                                <button onclick="restoreWithdrawalStudent(${student.id})" 
                                        class="btn btn-primary">
                                    재등록
                                </button>
                            </td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        </div>
    `;
}

function renderScheduleChanges() {
    const container = document.getElementById('scheduleList');
    container.innerHTML = scheduleChanges.map(change => {
        const student = getStudentById(parseInt(change.studentId));
        return `
            <div class="student-card">
                <div class="student-info">
                    <div>
                        <h3 class="student-name">${student ? student.name : '알 수 없음'}</h3>
                        <p class="student-details">변경 유형: ${change.changeType === 'temporary' ? '임시 변경' : '정기 변경'}</p>
                        <p class="student-details">변경 날짜: ${change.date}</p>
                        <p class="student-details">변경 사유: ${change.reason}</p>
                    </div>
                    <div class="button-group">
                        <button onclick="deleteScheduleChange(${change.id})" class="btn btn-warning">
                            삭제
                            </button>
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

// 이벤트 핸들러들
function handleAddStudent(event) {
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
    hideModal('addStudentModal');
    form.reset();
}

function handleScheduleChange(event) {
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
    hideModal('scheduleChangeModal');
    form.reset();
}

function editStudent(studentId) {
    const student = getStudentById(studentId);
    if (!student) return;
    
    const form = document.getElementById('editStudentForm');
    
    form.studentId.value = student.id;
    form.name.value = student.name;
    form.contact.value = student.contact || '';
    form.location.value = student.location || '';
    form.shortPhone.value = student.shortPhone || '';
    form.timeSlot.value = student.timeSlot;
    
    Array.from(form.days).forEach(checkbox => {
        checkbox.checked = student.days && student.days.includes(checkbox.value);
    });
    
    showModal('editStudentModal');
}

function handleEditStudent(event) {
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
    hideModal('editStudentModal');
}

function handleWithdrawal(event) {
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
        hideModal('withdrawalModal');
    }
}

window.showWithdrawalModal = function(studentId) {
    const form = document.getElementById('withdrawalForm');
    form.studentId.value = studentId;
    
    // 현재 날짜를 기본값으로 설정
    const today = new Date().toISOString().split('T')[0];
    form.date.value = today;
    
    showModal('withdrawalModal');
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
            alert(`${student.name} 학생이 재등록되었습니다.`);
        }
    }
};

// 유틸리티 함수들
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

function filterStudents() {
    const searchTerm = document.getElementById('studentSearch').value.toLowerCase();
    const tbody = document.getElementById('studentsTableBody');
    const rows = tbody.getElementsByTagName('tr');

    for (let row of rows) {
        const text = row.textContent.toLowerCase();
        row.style.display = text.includes(searchTerm) ? '' : 'none';
    }
}

// 데이터 저장 및 불러오기
function saveData() {
    localStorage.setItem('students', JSON.stringify(students));
    localStorage.setItem('scheduleChanges', JSON.stringify(scheduleChanges));
    localStorage.setItem('withdrawals', JSON.stringify(withdrawals));
}

function loadData() {
    const savedStudents = localStorage.getItem('students');
    const savedScheduleChanges = localStorage.getItem('scheduleChanges');
    const savedWithdrawals = localStorage.getItem('withdrawals');

    if (savedStudents) students = JSON.parse(savedStudents);
    if (savedScheduleChanges) scheduleChanges = JSON.parse(savedScheduleChanges);
    if (savedWithdrawals) withdrawals = JSON.parse(savedWithdrawals);
}

// 데이터 변경 시 자동 저장
['addStudent', 'updateStudent', 'deleteStudent', 'addScheduleChange', 
 'deleteScheduleChange', 'addWithdrawal', 'restoreStudent'].forEach(funcName => {
    const originalFunc = window[funcName];
    window[funcName] = function(...args) {
        const result = originalFunc.apply(this, args);
        saveData();
        return result;
    };
});

// 초기 데이터 로드
loadData();

// 학생 데이터 관리 (localStorage 사용)
function saveData() {
    localStorage.setItem('ballet-students', JSON.stringify(students));
    localStorage.setItem('ballet-schedules', JSON.stringify(scheduleChanges));
    localStorage.setItem('ballet-withdrawals', JSON.stringify(withdrawals));
}

function loadData() {
    const savedStudents = localStorage.getItem('ballet-students');
    const savedSchedules = localStorage.getItem('ballet-schedules');
    const savedWithdrawals = localStorage.getItem('ballet-withdrawals');

    if (savedStudents) students = JSON.parse(savedStudents);
    if (savedSchedules) scheduleChanges = JSON.parse(savedSchedules);
    if (savedWithdrawals) withdrawals = JSON.parse(savedWithdrawals);
}

// 데이터 변경 시마다 자동 저장
function wrapWithSave(func) {
    return function(...args) {
        const result = func.apply(this, args);
        saveData();
        return result;
    };
}

// 데이터 수정 함수들에 자동 저장 기능 추가
addStudent = wrapWithSave(addStudent);
updateStudent = wrapWithSave(updateStudent);
deleteStudent = wrapWithSave(deleteStudent);
addWithdrawal = wrapWithSave(addWithdrawal);
restoreStudent = wrapWithSave(restoreStudent);
addScheduleChange = wrapWithSave(addScheduleChange);
deleteScheduleChange = wrapWithSave(deleteScheduleChange);

// 페이지 로드 시 데이터 불러오기
document.addEventListener('DOMContentLoaded', () => {
    loadData();
    renderStudents();
    renderDayStudents();
    renderScheduleChanges();
    renderWithdrawals();
    
    // 폼 이벤트 리스너 등록
    document.getElementById('addStudentForm').addEventListener('submit', handleAddStudent);
    document.getElementById('scheduleChangeForm').addEventListener('submit', handleScheduleChange);
    document.getElementById('editStudentForm').addEventListener('submit', handleEditStudent);
    document.getElementById('withdrawalForm').addEventListener('submit', handleWithdrawal);
    
    // 초기 탭 설정
    showTab('timeTable');
});
