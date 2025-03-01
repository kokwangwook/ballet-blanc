// 기본 일정 변경 데이터
const defaultScheduleChanges = [
    {
        id: 1,
        studentId: 1,
        changeType: 'temporary',
        date: '2025-02-20',
        reason: '학원 일정 변경'
    }
];

// 로컬 스토리지에서 데이터를 가져오거나 기본 데이터 사용
let scheduleChanges = JSON.parse(localStorage.getItem('ballet-blanc-schedules')) || defaultScheduleChanges;

export function addScheduleChange(change) {
    const newChange = {
        id: Date.now(),
        ...change
    };
    scheduleChanges.push(newChange);
    // 로컬 스토리지에 저장
    localStorage.setItem('ballet-blanc-schedules', JSON.stringify(scheduleChanges));
    return newChange;
}

export function deleteScheduleChange(changeId) {
    const index = scheduleChanges.findIndex(c => c.id === changeId);
    if (index !== -1) {
        scheduleChanges.splice(index, 1);
        // 로컬 스토리지에 저장
        localStorage.setItem('ballet-blanc-schedules', JSON.stringify(scheduleChanges));
    }
}

export function getScheduleChangesByStudent(studentId) {
    return scheduleChanges.filter(c => c.studentId === studentId);
}

export function getAllScheduleChanges() {
    return [...scheduleChanges];
}

export default scheduleChanges;