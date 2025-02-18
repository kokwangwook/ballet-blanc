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
    }
    // 여기에 더 많은 학생 데이터를 추가할 수 있습니다
];

// 일정 변경 데이터
let scheduleChanges = [];

// 퇴원 학생 데이터
let withdrawals = [];

// 기본 함수들
function showTab(tabId) {
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
    
    // 탭에 따른 컨텐츠 렌더링
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

// 렌더링 함수들
function renderStudents() {
    const container = document.getElementById('studentsList');
    container.innerHTML = timeSlots.map(slot => {
        const slotStudents = getStudentsByTimeSlot(slot.time);
        if (slotStudents.length === 0) return '';

        return `
            <div class="time-slot-card">
                <h2 class="text-xl font-bold">${slot.title}</h2>
                <div class="grid gap-4">
                    ${slotStudents.map(student => `
                        <div class="student-card">
                            <div class="flex justify-between items-start">
                                <div>
                                    <h3 class="text-lg font-medium">${student.name}</h3>
                                    ${student.number ? `<span class="text-sm text-gray-500">#${student.number}</span>` : ''}
                                    ${student.contact ? `<p class="text-sm text-gray-600">연락처: ${student.contact}</p>` : ''}
                                    ${student.location ? `<p class="text-sm text-gray-600">탑승 위치: ${student.location}</p>` : ''}
                                    ${student.days ? `<p class="text-sm text-gray-600">등원 요일: ${student.days.join(', ')}</p>` : ''}
                                </div>
                                <div class="flex gap-2">
                                    <button onclick="editStudent(${student.id})" 
                                        class="text-sm px-3 py-1 bg-blue-500 text-white rounded">
                                        수정
                                    </button>
                                    <button onclick="showWithdrawalModal(${student.id})" 
                                        class="text-sm px-3 py-1 bg-yellow-500 text-white rounded">
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
            <div class="time-slot-card">
                <h2 class="text-xl font-bold">${day}요일</h2>
                <div class="grid gap-4">
                    ${dayStudents.map(student => `
                        <div class="student-card">
                            <div class="flex justify-between items-start">
                                <div>
                                    <h3 class="text-lg font-medium">${student.name}</h3>
                                    ${student.number ? `<span class="text-sm text-gray-500">#${student.number}</span>` : ''}
                                    ${student.contact ? `<p class="text-sm text-gray-600">연락처: ${student.contact}</p>` : ''}
                                    ${student.location ? `<p class="text-sm text-gray-600">탑승 위치: ${student.location}</p>` : ''}
                                    <p class="text-sm text-gray-600">등원 시간: ${formatTimeSlot(student.timeSlot)}</p>
                                </div>
                                <div class="flex gap-2">
                                    <button onclick="editStudent(${student.id})" 
                                        class="text-sm px-3 py-1 bg-blue-500 text-white rounded">
                                        수정
                                    </button>
                                    <button onclick="showWithdrawalModal(${student.id})" 
                                        class="text-sm px-3 py-1 bg-yellow-500 text-white rounded">
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
                        <td class="p-3">
                            <div class="flex gap-2">
                                <button onclick="editStudent(${student.id})" 
                                        class="px-3 py-1 text-sm bg-blue-500 text-white rounded">
                                    수정
                                </button>
                                <button onclick="showWithdrawalModal(${student.id})" 
                                        class="px-3 py-1 text-sm bg-yellow-500 text-white rounded">
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

// 초기화
document.addEventListener('DOMContentLoaded', () => {
    // 폼 제출 이벤트 리스너 등록
    document.getElementById('addStudentForm').addEventListener('submit', handleAddStudent);
    document.getElementById('editStudentForm').addEventListener('submit', handleEditStudent);
    
    // 초기 데이터 렌더링
    renderStudents();
    renderDayStudents();
    
    // 초기 탭 설정
    showTab('timeTable');
});
