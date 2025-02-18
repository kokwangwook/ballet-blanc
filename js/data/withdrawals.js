// withdrawals.js
const withdrawals = [];

export function addWithdrawal(student, reason, date) {
    withdrawals.push({
        ...student,
        withdrawalReason: reason,
        withdrawalDate: date,
        originalId: student.id,
        id: Date.now()
    });
}

export function restoreStudent(withdrawalId) {
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

export function getAllWithdrawals() {
    return [...withdrawals];
}

export default withdrawals;