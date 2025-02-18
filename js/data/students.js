const students = [
    // 2시 30분 등원(3시 40분 수업)
    {
        id: 1,
        name: '이제인',
        days: ['월', '화', '수', '목'],
        location: '엔젤음악학원(루벤하임앞)',
        number: '72',
        timeSlot: '14:30'
    },
    {
        id: 2,
        name: '김서아',
        number: '46',
        location: '중흥1차 정류장',
        timeSlot: '14:30'
    },
    {
        id: 3,
        name: '박가을',
        number: '43',
        timeSlot: '14:30'
    },
    {
        id: 4,
        name: '최지원',
        location: '빛누리초정문 (3:00)',
        timeSlot: '14:30'
    },
    {
        id: 5,
        name: '신나라',
        days: ['월', '수'],
        location: '에시앙1114',
        timeSlot: '14:30'
    },
    {
        id: 6,
        name: '서라온',
        days: ['월', '수'],
        location: '빛누리초 에시앙1122동',
        number: '76',
        timeSlot: '14:30'
    },
    {
        id: 7,
        name: '황인하',
        location: '키사랑어린이집(인터넷진흥원)',
        number: '4',
        timeSlot: '14:30'
    },
    {
        id: 8,
        name: '임채원',
        days: ['화', '목'],
        location: '한전KDN어린이집 (QR코드) 에시앙1116동',
        number: '65',
        memo: '3:10',
        timeSlot: '14:30'
    },
    {
        id: 9,
        name: '고보영',
        location: '중흥1동 108동',
        contact: '010-6590-1522',
        memo: '(엄마)',
        timeSlot: '14:30'
    },
    {
        id: 10,
        name: '이세빈',
        location: '부영3차 관리사무소',
        number: '27',
        timeSlot: '14:30'
    },
    {
        id: 11,
        name: '설지유',
        location: '트이다학원(석전2길 64-16) 중흥 209동',
        number: '28',
        timeSlot: '14:30'
    },

    // 3시 30분 등원(4시 40분 수업)
    {
        id: 12,
        name: '이지유',
        location: '에시앙 1120동',
        timeSlot: '15:30'
    },
    {
        id: 13,
        name: '최라온',
        location: '에시앙1111동',
        number: '57',
        memo: '12월달은 엄마가 하원',
        timeSlot: '15:30'
    },
    {
        id: 14,
        name: '허가빈',
        location: '한빛유치원(3:30)',
        timeSlot: '15:30'
    },
    {
        id: 15,
        name: '설지유',
        location: '한빛유치원(3:30)',
        timeSlot: '15:30'
    },
    {
        id: 16,
        name: '김태린',
        location: '한빛유치원(3:30)',
        timeSlot: '15:30'
    },
    {
        id: 17,
        name: '김유하',
        location: '빛누리유치원(215)',
        contact: '010-9317-2022',
        memo: '중흥3차305-303',
        number: '69',
        timeSlot: '15:30'
    },
    {
        id: 18,
        name: '구현지',
        location: '인터넷진흥원키사랑어린이집(6+종)',
        timeSlot: '15:30'
    },
    {
        id: 19,
        name: '황인아',
        location: '인터넷진흥원키사랑어린이집(6+종)',
        timeSlot: '15:30'
    },
    {
        id: 20,
        name: '이세빈',
        location: '빛누리유치원(213번)',
        timeSlot: '15:30'
    },
    {
        id: 21,
        name: '이지유',
        location: '빛누리 즐거운2반 214번',
        contact: '010-7670-5580',
        memo: '6세 코',
        timeSlot: '15:30'
    },
    {
        id: 22,
        name: '권예나',
        location: '빛누리 즐거운2반 214번',
        timeSlot: '15:30'
    },

    // 4시 50분 하원, 등원(5시 40분 수업)
    {
        id: 23,
        name: '류지후',
        location: '우미린105동',
        number: '34',
        memo: '12월 휴원',
        timeSlot: '16:50'
    },
    {
        id: 24,
        name: '최라원',
        location: '빛누리유치원 즐거운2반 214번',
        contact: '010-6608-2656',
        number: '57',
        timeSlot: '16:50'
    },
    {
        id: 25,
        name: '김유하',
        location: '빛누리유치원(215)',
        contact: '010-9317-2022',
        memo: '중흥3차305-303 행복한1반',
        number: '19',
        timeSlot: '16:50'
    },
    {
        id: 26,
        name: '박연후',
        days: ['월', '수', '금'],
        location: '대방 102동',
        number: '35',
        memo: '1월2월 휴원',
        timeSlot: '16:50'
    },
    {
        id: 27,
        name: '김지우',
        days: ['월', '수', '금'],
        location: '대광로제비앙 113동',
        number: '41',
        timeSlot: '16:50'
    },
    {
        id: 28,
        name: '김도하',
        location: '빛그린유치원 3세2반',
        contact: '010-7376-4865',
        number: '60',
        memo: '1월08일부터 15시55분16시',
        timeSlot: '16:50'
    },
    {
        id: 29,
        name: '강한서',
        location: '빛그린유치원 3세 3반',
        contact: '010-4321-1121',
        timeSlot: '16:50'
    },

    // 5시 40분 하원, 등원(6시 40분 수업)
    {
        id: 30,
        name: '고보영',
        location: '중흥1차 정류장',
        timeSlot: '17:40'
    },
    {
        id: 31,
        name: '김서아',
        location: '중흥1차 정류장',
        timeSlot: '17:40'
    },
    {
        id: 32,
        name: '이제인',
        days: ['월', '화', '수', '목'],
        location: '중흥3차 311',
        timeSlot: '17:40'
    },
    {
        id: 33,
        name: '임채원',
        location: '에시앙 1116동',
        timeSlot: '17:40'
    },
    {
        id: 34,
        name: '진서윤',
        location: '중흥 1차(버스장)',
        number: '7',
        timeSlot: '17:40'
    },
    {
        id: 35,
        name: '백가원',
        location: '(월)태권도학원(중흥2차앞), (수)조아트미술학원',
        timeSlot: '17:40'
    },
    {
        id: 36,
        name: '김유하',
        location: '써밋빌리지15',
        memo: '(수)중흥2차 몬스터매스수학학원',
        timeSlot: '17:40'
    },
    {
        id: 37,
        name: '서라온',
        days: ['월', '수'],
        location: '빛누리초 에시앙1122동',
        number: '76',
        timeSlot: '17:40'
    },
    {
        id: 38,
        name: '신나라',
        days: ['월', '수'],
        location: '에시앙1114',
        timeSlot: '17:40'
    },
    {
        id: 39,
        name: '최지원',
        days: ['월', '수'],
        location: '우미린103동, (수)중흥2차 몬스터매스수학학원',
        timeSlot: '17:40'
    },

    // 6시 40분 하원
    {
        id: 40,
        name: '임지우',
        location: '중흥 114동',
        timeSlot: '18:40'
    },
    {
        id: 41,
        name: '김지원',
        location: '중흥113동',
        number: '16',
        timeSlot: '18:40'
    },
    {
        id: 42,
        name: '황수빈',
        days: ['수'],
        location: '중흥112동',
        timeSlot: '18:40'
    },
    {
        id: 43,
        name: '이윤아',
        location: '중흥 104동',
        number: '23',
        timeSlot: '18:40'
    },
    {
        id: 44,
        name: '배지현',
        days: ['수'],
        location: '주택(중흥2차 뒤)',
        timeSlot: '18:40'
    },
    {
        id: 45,
        name: '조은서',
        location: '중흥 305동',
        timeSlot: '18:40'
    },

    // 7시 40분 하원
    {
        id: 46,
        name: '박연후',
        days: ['월', '수'],
        location: '대방 102동',
        timeSlot: '19:40'
    },
    {
        id: 47,
        name: '김지우',
        days: ['월', '수', '금'],
        location: '대광로제비앙 113동',
        timeSlot: '19:40'
    },
    {
        id: 48,
        name: '조은서',
        location: '중흥3차 305동',
        timeSlot: '19:40'
    }
];

// 데이터 변경 함수들
export function addStudent(student) {
    students.push({
        id: Date.now(),
        ...student
    });
}

export function updateStudent(updatedStudent) {
    const index = students.findIndex(s => s.id === updatedStudent.id);
    if (index !== -1) {
        students[index] = updatedStudent;
    }
}

export function deleteStudent(studentId) {
    const index = students.findIndex(s => s.id === studentId);
    if (index !== -1) {
        students.splice(index, 1);
    }
}

export function getStudentById(studentId) {
    return students.find(s => s.id === studentId);
}

export function getStudentsByTimeSlot(timeSlot) {
    return students.filter(s => s.timeSlot === timeSlot);
}

export function getStudentsByDay(day) {
    return students.filter(s => s.days && s.days.includes(day));
}

export function getAllStudents() {
    return [...students];
}

export default students;