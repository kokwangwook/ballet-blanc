// attendance.js - 학생 출석 관리 모듈

// 오늘 날짜의 출석 데이터를 저장할 배열
let dailyAttendance = [];

/**
 * 오늘 날짜의 출석 데이터 초기화
 * @param {Array} studentsArray - 학생 목록 배열
 */
export function initDailyAttendance(studentsArray) {
    const today = new Date().toISOString().split('T')[0];
    
    // 로컬 스토리지에서 오늘 데이터 확인
    const storedData = localStorage.getItem(`attendance_${today}`);
    
    if (storedData) {
        // 이미 저장된 데이터가 있으면 불러오기
        dailyAttendance = JSON.parse(storedData);
    } else {
        // 없으면 새로 초기화
        dailyAttendance = studentsArray.map(student => ({
            studentId: student.id,
            name: student.name,
            date: today,
            timeSlot: student.timeSlot,
            days: student.days || [],
            status: '등원예정', // 기본값: 등원예정, 출석, 결석, 지각, 조퇴
            boardingStatus: '대기중', // 기본값: 대기중, 탑승, 하차
            reason: '',
            updatedAt: new Date().toISOString()
        }));
        
        // 해당 요일에 등원하지 않는 학생은 '해당없음'으로 설정
        const todayDay = getDayOfWeek();
        dailyAttendance.forEach(record => {
            if (record.days.length > 0 && !record.days.includes(todayDay)) {
                record.status = '해당없음';
            }
        });
        
        // 로컬 스토리지에 저장
        saveAttendanceData();
    }
    
    return dailyAttendance;
}

/**
 * 학생의 출석 상태 업데이트
 * @param {number} studentId - 학생 ID
 * @param {string} status - 새 상태 (등원예정, 출석, 결석, 지각, 조퇴)
 * @param {string} reason - 사유 (선택 사항)
 */
export function updateAttendanceStatus(studentId, status, reason = '') {
    const recordIndex = dailyAttendance.findIndex(record => record.studentId === studentId);
    
    if (recordIndex !== -1) {
        dailyAttendance[recordIndex].status = status;
        
        if (reason) {
            dailyAttendance[recordIndex].reason = reason;
        }
        
        dailyAttendance[recordIndex].updatedAt = new Date().toISOString();
        saveAttendanceData();
        return true;
    }
    
    return false;
}

/**
 * 학생의 탑승 상태 업데이트
 * @param {number} studentId - 학생 ID
 * @param {string} boardingStatus - 새 탑승 상태 (대기중, 탑승, 하차)
 */
export function updateBoardingStatus(studentId, boardingStatus) {
    const recordIndex = dailyAttendance.findIndex(record => record.studentId === studentId);
    
    if (recordIndex !== -1) {
        dailyAttendance[recordIndex].boardingStatus = boardingStatus;
        dailyAttendance[recordIndex].updatedAt = new Date().toISOString();
        
        // 탑승 상태가 변경되면 필요에 따라 출석 상태도 업데이트
        if (boardingStatus === '탑승' && dailyAttendance[recordIndex].status === '등원예정') {
            dailyAttendance[recordIndex].status = '출석';
        }
        
        saveAttendanceData();
        return true;
    }
    
    return false;
}

/**
 * 특정 시간대의 출석 데이터 조회
 * @param {string} timeSlot - 시간대
 * @returns {Array} - 해당 시간대 학생들의 출석 데이터
 */
export function getAttendanceByTimeSlot(timeSlot) {
    return dailyAttendance.filter(record => record.timeSlot === timeSlot);
}

/**
 * 특정 학생의 출석 데이터 조회
 * @param {number} studentId - 학생 ID
 * @returns {Object|null} - 해당 학생의 출석 데이터 또는 null
 */
export function getStudentAttendance(studentId) {
    return dailyAttendance.find(record => record.studentId === studentId) || null;
}

/**
 * 모든 출석 데이터 조회
 * @returns {Array} - 모든 출석 데이터
 */
export function getAllAttendance() {
    return [...dailyAttendance];
}

/**
 * 출석 데이터를 로컬 스토리지에 저장
 */
function saveAttendanceData() {
    const today = new Date().toISOString().split('T')[0];
    localStorage.setItem(`attendance_${today}`, JSON.stringify(dailyAttendance));
}

/**
 * 오늘의 요일을 한글로 반환
 * @returns {string} - 요일 (월, 화, 수, 목, 금)
 */
function getDayOfWeek() {
    const days = ['일', '월', '화', '수', '목', '금', '토'];
    const today = new Date().getDay();
    return days[today];
}

/**
 * 특정 날짜의 출석 데이터 불러오기
 * @param {string} date - 날짜 (YYYY-MM-DD 형식)
 * @returns {Array} - 해당 날짜의 출석 데이터
 */
export function getAttendanceByDate(date) {
    const storedData = localStorage.getItem(`attendance_${date}`);
    return storedData ? JSON.parse(storedData) : [];
}

/**
 * 특정 날짜의 출석 통계 조회
 * @param {string} date - 날짜 (YYYY-MM-DD 형식)
 * @returns {Object} - 출석 통계 정보
 */
export function getAttendanceStats(date) {
    const records = getAttendanceByDate(date);
    
    return {
        total: records.filter(r => r.status !== '해당없음').length,
        present: records.filter(r => r.status === '출석').length,
        absent: records.filter(r => r.status === '결석').length,
        late: records.filter(r => r.status === '지각').length,
        earlyLeave: records.filter(r => r.status === '조퇴').length,
        pending: records.filter(r => r.status === '등원예정').length
    };
}

export default {
    initDailyAttendance,
    updateAttendanceStatus,
    updateBoardingStatus,
    getAttendanceByTimeSlot,
    getStudentAttendance,
    getAllAttendance,
    getAttendanceByDate,
    getAttendanceStats
};