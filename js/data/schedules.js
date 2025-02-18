const scheduleChanges = [
    {
        id: 1,
        studentId: 1,
        changeType: 'temporary',
        date: '2025-02-20',
        reason: '학원 일정 변경'
    }
];

export function addScheduleChange(change) {
    scheduleChanges.push({
        id: Date.now(),
        ...change
    });
}

export function deleteScheduleChange(changeId) {
    const index = scheduleChanges.findIndex(c => c.id === changeId);
    if (index !== -1) {
        scheduleChanges.splice(index, 1);
    }
}

export function getScheduleChangesByStudent(studentId) {
    return scheduleChanges.filter(c => c.studentId === studentId);
}

export function getAllScheduleChanges() {
    return [...scheduleChanges];
}

export default scheduleChanges;