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
import attendanceModule, {
    initDailyAttendance,
    updateAttendanceStatus,
    updateBoardingStatus,
    getAttendanceByTimeSlot,
    getAllAttendance,
    getAttendanceStats
} from './data/attendance.js';

// 글로벌 상태
let currentDate = new Date().toISOString().split('T')[0];

// DOM 이벤트 리스너 설정
document.addEventListener('DOMContentLoaded', () => {
    // 초기 데이터 렌더링
    renderStudents();
    renderDayStudents();
    renderScheduleChanges();
    renderWithdrawals();
    
    // 출석 데이터 초기화
    initDailyAttendance(getAllStudents());
    
    // 폼 제출 이벤트 리스너 등록
    document.getElementById('addStudentForm').addEventListener('submit', handleAddStudent);
    document.getElementById('scheduleChangeForm').addEventListener('submit', handleAddScheduleChange);
    document.getElementById('editStudentForm').addEventListener('submit', handleEditStudent);
    document.getElementById('withdrawalForm').addEventListener('submit', handleWithdrawal);
    
    // 날짜 선택 업데이트 이벤트 리스너
    const dateSelector = document.getElementById('attendanceDateSelector');
    if (dateSelector) {
        dateSelector.value = currentDate;
        dateSelector.addEventListener('change', handleDateChange);
    }
    
    // 초기 탭 설정
    showTab('timeTable');
});

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
    } else if (tabId === 'attendance') {
        renderAttendance();
    }
};

// 날짜 선택 핸들러
window.handleDateChange = function(event) {
    currentDate = event.target.value;
    renderAttendance();
};

// 출석 상태 업데이트 핸들러
window.updateStudentAttendance = function(studentId, status) {
    let reason = '';
    
    // 결석인 경우 사유 입력 받기
    if (status === '결석') {
        reason = prompt('결석 사유를 입력해주세요:');
        if (reason === null) return; // 취소 시 업데이트 중단
    }
    
    updateAttendanceStatus(parseInt(studentId), status, reason);
    renderAttendance();
};

// 탑승 상태 업데이트 핸들러
window.updateStudentBoarding = function(studentId, boardingStatus) {
    updateBoardingStatus(parseInt(studentId), boardingStatus);
    renderAttendance();
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

// 출석 관리 렌더링 함수
function renderAttendance() {
    const container = document.getElementById('attendanceList');
    if (!container) return;
    
    // 날짜 선택기 추가
    const datePickerHtml = `
        <div class="mb-4 flex items-center">
            <label class="mr-2 font-medium">날짜:</label>
            <input type="date" id="attendanceDateSelector" value="${currentDate}" class="p-2 border rounded" />
            <div class="ml-auto">
                <button onclick="exportAttendanceData()" class="bg-green-500 text-white px-4 py-2 rounded mr-2">
                    출석부 내보내기
                </button>
            </div>
        </div>
    `;
    
    // 시간대별 출석 데이터 렌더링
    const attendanceData = getAllAttendance();
    
    // 출석 통계 계산
    const stats = getAttendanceStats(currentDate);
    
    const statsHtml = `
        <div class="mb-6 bg-blue-50 p-4 rounded-lg shadow">
            <h3 class="text-lg font-bold mb-2">오늘의 출석 현황</h3>
            <div class="grid grid-cols-5 gap-4 text-center">
                <div class="bg-white p-2 rounded shadow">
                    <div class="text-sm text-gray-600">전체</div>
                    <div class="font-bold text-lg">${stats.total}명</div>
                </div>
                <div class="bg-green-100 p-2 rounded shadow">
                    <div class="text-sm text-gray-600">출석</div>
                    <div class="font-bold text-lg text-green-700">${stats.present}명</div>
                </div>
                <div class="bg-red-100 p-2 rounded shadow">
                    <div class="text-sm text-gray-600">결석</div>
                    <div class="font-bold text-lg text-red-700">${stats.absent}명</div>
                </div>
                <div class="bg-yellow-100 p-2 rounded shadow">
                    <div class="text-sm text-gray-600">지각</div>
                    <div class="font-bold text-lg text-yellow-700">${stats.late}명</div>
                </div>
                <div class="bg-gray-100 p-2 rounded shadow">
                    <div class="text-sm text-gray-600">등원예정</div>
                    <div class="font-bold text-lg text-gray-700">${stats.pending}명</div>
                </div>
            </div>
        </div>
    `;
    
    const timeTablesHtml = timeSlots.map(slot => {
        // 해당 시간대의 출석 데이터 필터링
        const slotStudents = attendanceData.filter(record => 
            record.timeSlot === slot.time && record.status !== '해당없음'
        );
        
        if (slotStudents.length === 0) return '';
        
        return `
            <div class="time-slot-card mb-6">
                <h2 class="text-xl font-bold mb-4 bg-gray-100 p-3 rounded flex justify-between items-center">
                    <span>${slot.title}</span>
                    <span class="text-sm text-gray-600">학생 ${slotStudents.length}명</span>
                </h2>
                
                <div class="overflow-x-auto">
                    <table class="min-w-full bg-white">
                        <thead>
                            <tr class="bg-gray-100 text-gray-700">
                                <th class="py-2 px-4 border-b text-left">이름</th>
                                <th class="py-2 px-4 border-b text-left">탑승위치</th>
                                <th class="py-2 px-4 border-b text-left">요일</th>
                                <th class="py-2 px-4 border-b text-left">출석상태</th>
                                <th class="py-2 px-4 border-b text-left">탑승상태</th>
                                <th class="py-2 px-4 border-b text-left">관리</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${slotStudents.map(record => {
                                const student = getStudentById(record.studentId);
                                if (!student) return '';
                                
                                // 출석 상태에 따른 배경색 설정
                                let statusClass = '';
                                switch(record.status) {
                                    case '출석': statusClass = 'bg-green-100 text-green-800'; break;
                                    case '결석': statusClass = 'bg-red-100 text-red-800'; break;
                                    case '지각': statusClass = 'bg-yellow-100 text-yellow-800'; break;
                                    case '조퇴': statusClass = 'bg-orange-100 text-orange-800'; break;
                                    default: statusClass = 'bg-gray-100 text-gray-800';
                                }
                                
                                // 탑승 상태에 따른 배경색 설정
                                let boardingClass = '';
                                switch(record.boardingStatus) {
                                    case '탑승': boardingClass = 'bg-blue-100 text-blue-800'; break;
                                    case '하차': boardingClass = 'bg-purple-100 text-purple-800'; break;
                                    default: boardingClass = 'bg-gray-100 text-gray-800';
                                }
                                
                                return `
                                    <tr class="border-b hover:bg-gray-50">
                                        <td class="py-2 px-4">
                                            <div class="font-medium">${student.name}</div>
                                            ${student.number ? `<div class="text-xs text-gray-500">#${student.number}</div>` : ''}
                                        </td>
                                        <td class="py-2 px-4">${student.location || '-'}</td>
                                        <td class="py-2 px-4">${student.days ? student.days.join(', ') : '-'}</td>
                                        <td class="py-2 px-4">
                                            <span class="px-2 py-1 rounded text-xs font-medium ${statusClass}">
                                                ${record.status}
                                            </span>
                                            ${record.reason ? `<div class="text-xs text-gray-500 mt-1">사유: ${record.reason}</div>` : ''}
                                        </td>
                                        <td class="py-2 px-4">
                                            <span class="px-2 py-1 rounded text-xs font-medium ${boardingClass}">
                                                ${record.boardingStatus}
                                            </span>
                                        </td>
                                        <td class="py-2 px-4">
                                            <div class="flex flex-wrap gap-1">
                                                <div class="mb-1">
                                                    <select class="text-xs border rounded p-1" 
                                                            onchange="updateStudentAttendance(${record.studentId}, this.value); this.selectedIndex=0;">
                                                        <option value="">출석 상태 변경</option>
                                                        <option value="출석">출석</option>
                                                        <option value="결석">결석</option>
                                                        <option value="지각">지각</option>
                                                        <option value="조퇴">조퇴</option>
                                                    </select>
                                                </div>
                                                <div>
                                                    <select class="text-xs border rounded p-1" 
                                                            onchange="updateStudentBoarding(${record.studentId}, this.value); this.selectedIndex=0;">
                                                        <option value="">탑승 상태 변경</option>
                                                        <option value="대기중">대기중</option>
                                                        <option value="탑승">탑승</option>
                                                        <option value="하차">하차</option>
                                                    </select>
                                                </div>
                                            </div>
                                        </td>
                                    </tr>
                                `;
                            }).join('')}
                        </tbody>
                    </table>
                </div>
            </div>
        `;
    }).join('');
    
    container.innerHTML = datePickerHtml + statsHtml + timeTablesHtml;
}

// 출석 데이터 내보내기 함수
window.exportAttendanceData = function() {
    const attendanceData = getAllAttendance();
    const stats = getAttendanceStats(currentDate);
    
    // CSV 데이터 생성
    let csvContent = '이름,시간대,요일,출석상태,탑승상태,사유\n';
    
    attendanceData.forEach(record => {
        if (record.status === '해당없음') return;
        
        const student = getStudentById(record.studentId);
        if (!student) return;
        
        const timeSlotText = formatTimeSlot(record.timeSlot);
        const days = student.days ? student.days.join(' ') : '-';
        
        csvContent += `${student.name},${timeSlotText},${days},${record.status},${record.boardingStatus},${record.reason}\n`;
    });
    
    // 파일 다운로드
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    link.setAttribute('href', url);
    link.setAttribute('download', `출석부_${currentDate}.csv`);
    link.style.visibility = 'hidden';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
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
                                    <p class="text-sm text-gray-600">등원 시간: ${