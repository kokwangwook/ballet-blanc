// 시간대 데이터
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

// 학생 데이터
let students = [
    {
        id: 1,
        name: '이제인',
        days: ['월', '화', '수', '목'],
        location: '엔젤음악학원(루벤하임앞)',
        number: '72',
        timeSlot: '14:30'
    },
    // ... 나머지 학생 데이터도 동일하게 복사
];

// 일정 변경 데이터
let scheduleChanges = [];

// 퇴원 학생 데이터
let withdrawals = [];

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

function getAllScheduleChanges() {
    return [...scheduleChanges];
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

function getAllWithdrawals() {
    return [...withdrawals];
}

// UI 관련 함수들
function showTab(tabId) {
    document.querySelectorAll('.tab-button').forEach(button => {
        button.classList.remove('active');
    });
    
    document.querySelector(`[data-tab="${tabId}"]`).classList.add('active');
    
    document.querySelectorAll('.tab-content').forEach(content => {
        content.classList.remove('active');
    });
    
    document.getElementById(tabId).classList.add('active');
    
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
}

function showModal(modalId) {
    const modal = document.getElementById(modalId);
    modal.classList.add('show');
}

function hideModal(modalId) {
    const modal = document.getElementById(modalId);
    modal.classList.remove('show');
}

function showAddStudentModal() {
    const form = document.getElementById('addStudentForm');
    form.reset();
    showModal('addStudentModal');
}

function showScheduleChangeModal() {
    const select = document.querySelector('[name="studentId"]');
    select.innerHTML = getAllStudents().map(student => 
        `<option value="${student.id}">${student.name}</option>`
    ).join('');
    
    const form = document.getElementById('scheduleChangeForm');
    form.reset();
    showModal('scheduleChangeModal');
}

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
                                    ${student.contact ? `<p class="text-sm text-gray-600">연락처: ${student.contact}
                                    </p>` : ''}
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

// 이벤트 핸들러 함수들
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

function handleAddScheduleChange(event) {
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
    alert('학생 정보가 수정되었습니다.');
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
        alert(`${student.name} 학생이 퇴원 처리되었습니다.`);
    }
}

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

// 초기화
document.addEventListener('DOMContentLoaded', () => {
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
    showTab('timeTable');
});
