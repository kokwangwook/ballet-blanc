// withdrawals.js - LocalStorage 적용
let withdrawals = [];

// 초기화 - 로컬 스토리지에서 데이터 로드
export function initWithdrawals() {
    const savedWithdrawals = localStorage.getItem('withdrawals');
    if (savedWithdrawals) {
        withdrawals = JSON.parse(savedWithdrawals);
    }
    return withdrawals;
}

// 로컬 스토리지에 퇴원 학생 데이터 저장
function saveWithdrawalsToLocalStorage() {
    localStorage.setItem('withdrawals', JSON.stringify(withdrawals));
}

export function addWithdrawal(student, reason, date) {
    withdrawals.push({
        ...student,
        withdrawalReason: reason,
        withdrawalDate: date,
        originalId: student.id,
        id: Date.now()
    });
    saveWithdrawalsToLocalStorage();
}

export function restoreStudent(withdrawalId) {
    const index = withdrawals.findIndex(w => w.id === withdrawalId);
    if (index !== -1) {
        const student = withdrawals[index];
        withdrawals.splice(index, 1);
        saveWithdrawalsToLocalStorage();
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

export function getAllWithdrawals() {
    return [...withdrawals];
}

export default withdrawals;