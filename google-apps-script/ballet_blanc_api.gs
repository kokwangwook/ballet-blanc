// 웹 앱의 요청 처리
function doGet(request) {
  // 요청 처리
  const output = handleRequest(request);
  
  // CORS 헤더 설정 방법 수정
  return ContentService.createTextOutput(JSON.stringify(output))
    .setMimeType(ContentService.MimeType.JSON);
}

function doPost(request) {
  // 요청 처리
  const output = handleRequest(request);
  
  // CORS 헤더 설정 방법 수정
  return ContentService.createTextOutput(JSON.stringify(output))
    .setMimeType(ContentService.MimeType.JSON);
}

// 요청 처리 핸들러
function handleRequest(request) {
  var action = request && request.parameter ? request.parameter.action : null;
  
  if (action == 'getStudents') {
    return getStudents();
  } else if (action == 'addStudent') {
    var data = JSON.parse(request.parameter.data);
    return addStudent(data);
  } else if (action == 'updateStudent') {
    var data = JSON.parse(request.parameter.data);
    return updateStudent(data);
  } else if (action == 'deleteStudent') {
    var id = request.parameter.id;
    return deleteStudent(id);
  } else if (action == 'getAttendance') {
    var date = request.parameter.date;
    return getAttendance(date);
  } else if (action == 'updateAttendance') {
    var data = JSON.parse(request.parameter.data);
    return updateAttendance(data);
  } else if (action == 'getWithdrawals') {
    return getWithdrawals();
  } else if (action == 'addWithdrawal') {
    var data = JSON.parse(request.parameter.data);
    return addWithdrawal(data);
  } else if (action == 'restoreStudent') {
    var id = request.parameter.id;
    return restoreStudent(id);
  } else if (action == 'getScheduleChanges') {
    return getScheduleChanges();
  } else if (action == 'addScheduleChange') {
    var data = JSON.parse(request.parameter.data);
    return addScheduleChange(data);
  }
  
  // 기본적으로 학생 데이터 반환 (action이 없을 경우)
  return getStudents();
}

// 학생 데이터 가져오기
function getStudents() {
  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('학생목록');
    if (!sheet) {
      // 시트가 없으면 생성
      sheet = createStudentSheet();
    }
    
    var data = sheet.getDataRange().getValues();
    var headers = data[0];
    var students = [];
    
    for (var i = 1; i < data.length; i++) {
      var student = {};
      var isEmpty = true; // 행이 비어있는지 확인
      
      for (var j = 0; j < headers.length; j++) {
        if (data[i][j] !== "") isEmpty = false;
        
        if (headers[j] == '등원요일' && data[i][j]) {
          // 등원요일은 쉼표로 구분된 문자열을 배열로 변환
          student[headers[j]] = data[i][j].split(',');
        } else {
          student[headers[j]] = data[i][j];
        }
      }
      
      // 비어있지 않은 행만 추가
      if (!isEmpty) {
        students.push(student);
      }
    }
    
    return {success: true, data: students};
  } catch (error) {
    return {success: false, error: error.toString()};
  }
}

// 학생 추가
function addStudent(studentData) {
  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('학생목록');
    if (!sheet) {
      // 시트가 없으면 생성
      sheet = createStudentSheet();
    }
    
    var headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
    
    // ID 생성 (현재 타임스탬프)
    studentData.id = new Date().getTime();
    studentData.등록일 = new Date();
    
    // 등원 요일이 배열인 경우 문자열로 변환
    if (Array.isArray(studentData.등원요일)) {
      studentData.등원요일 = studentData.등원요일.join(',');
    }
    
    var row = [];
    for (var i = 0; i < headers.length; i++) {
      var value = studentData[headers[i]] || '';
      row.push(value);
    }
    
    sheet.appendRow(row);
    
    return {success: true, data: studentData};
  } catch (error) {
    return {success: false, error: error.toString()};
  }
}

// 학생 정보 수정
function updateStudent(studentData) {
  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('학생목록');
    var data = sheet.getDataRange().getValues();
    var headers = data[0];
    var idColumnIndex = headers.indexOf('id');
    
    if (idColumnIndex === -1) {
      return {success: false, error: 'ID 컬럼을 찾을 수 없습니다'};
    }
    
    // 등원 요일이 배열인 경우 문자열로 변환
    if (Array.isArray(studentData.등원요일)) {
      studentData.등원요일 = studentData.등원요일.join(',');
    }
    
    // 학생 ID로 행 찾기
    for (var i = 1; i < data.length; i++) {
      if (data[i][idColumnIndex] == studentData.id) {
        // 모든 필드 업데이트
        for (var j = 0; j < headers.length; j++) {
          var value = studentData[headers[j]];
          if (value !== undefined) {
            sheet.getRange(i + 1, j + 1).setValue(value);
          }
        }
        return {success: true, data: studentData};
      }
    }
    
    return {success: false, error: '학생을 찾을 수 없습니다'};
  } catch (error) {
    return {success: false, error: error.toString()};
  }
}

// 학생 삭제
function deleteStudent(id) {
  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('학생목록');
    var data = sheet.getDataRange().getValues();
    var headers = data[0];
    var idColumnIndex = headers.indexOf('id');
    
    if (idColumnIndex === -1) {
      return {success: false, error: 'ID 컬럼을 찾을 수 없습니다'};
    }
    
    // 학생 ID로 행 찾기
    for (var i = 1; i < data.length; i++) {
      if (data[i][idColumnIndex] == id) {
        sheet.deleteRow(i + 1);
        return {success: true};
      }
    }
    
    return {success: false, error: '학생을 찾을 수 없습니다'};
  } catch (error) {
    return {success: false, error: error.toString()};
  }
}

// 출석 기록 가져오기
function getAttendance(date) {
  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('출석기록');
    if (!sheet) {
      // 시트가 없으면 생성
      sheet = createAttendanceSheet();
    }
    
    var data = sheet.getDataRange().getValues();
    var headers = data[0];
    var dateColumnIndex = headers.indexOf('날짜');
    var attendanceRecords = {};
    
    if (dateColumnIndex === -1) {
      return {success: false, error: '날짜 컬럼을 찾을 수 없습니다'};
    }
    
    for (var i = 1; i < data.length; i++) {
      if (data[i][dateColumnIndex] == date) {
        var record = {};
        for (var j = 0; j < headers.length; j++) {
          record[headers[j]] = data[i][j];
        }
        
        var studentId = record.학생id;
        attendanceRecords[studentId] = record;
      }
    }
    
    return {success: true, data: attendanceRecords};
  } catch (error) {
    return {success: false, error: error.toString()};
  }
}

// 출석 상태 업데이트
function updateAttendance(attendanceData) {
  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('출석기록');
    if (!sheet) {
      // 시트가 없으면 생성
      sheet = createAttendanceSheet();
    }
    
    var data = sheet.getDataRange().getValues();
    var headers = data[0];
    var studentIdColumnIndex = headers.indexOf('학생id');
    var dateColumnIndex = headers.indexOf('날짜');
    
    if (studentIdColumnIndex === -1 || dateColumnIndex === -1) {
      return {success: false, error: '필수 컬럼을 찾을 수 없습니다'};
    }
    
    // 이미 해당 날짜, 학생ID의 기록이 있는지 확인
    for (var i = 1; i < data.length; i++) {
      if (data[i][studentIdColumnIndex] == attendanceData.학생id && 
          data[i][dateColumnIndex] == attendanceData.날짜) {
        // 상태 업데이트
        var statusColumnIndex = headers.indexOf('상태');
        sheet.getRange(i + 1, statusColumnIndex + 1).setValue(attendanceData.상태);
        
        // 타임스탬프 업데이트
        var timestampColumnIndex = headers.indexOf('타임스탬프');
        sheet.getRange(i + 1, timestampColumnIndex + 1).setValue(new Date());
        
        return {success: true};
      }
    }
    
    // 새 기록 추가
    var row = [];
    attendanceData.id = new Date().getTime();
    attendanceData.타임스탬프 = new Date();
    
    for (var i = 0; i < headers.length; i++) {
      var value = attendanceData[headers[i]] || '';
      row.push(value);
    }
    
    sheet.appendRow(row);
    
    return {success: true};
  } catch (error) {
    return {success: false, error: error.toString()};
  }
}

// 퇴원 학생 목록 가져오기
function getWithdrawals() {
  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('퇴원학생');
    if (!sheet) {
      // 시트가 없으면 생성
      sheet = createWithdrawalSheet();
    }
    
    var data = sheet.getDataRange().getValues();
    var headers = data[0];
    var withdrawals = [];
    
    for (var i = 1; i < data.length; i++) {
      var withdrawal = {};
      var isEmpty = true; // 행이 비어있는지 확인
      
      for (var j = 0; j < headers.length; j++) {
        if (data[i][j] !== "") isEmpty = false;
        
        if (headers[j] == '등원요일' && data[i][j]) {
          // 등원요일은 쉼표로 구분된 문자열을 배열로 변환
          withdrawal[headers[j]] = data[i][j].split(',');
        } else {
          withdrawal[headers[j]] = data[i][j];
        }
      }
      
      // 비어있지 않은 행만 추가
      if (!isEmpty) {
        withdrawals.push(withdrawal);
      }
    }
    
    return {success: true, data: withdrawals};
  } catch (error) {
    return {success: false, error: error.toString()};
  }
}

// 퇴원 처리
function addWithdrawal(withdrawalData) {
  try {
    // 학생 정보 가져오기
    var studentSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('학생목록');
    var studentData = studentSheet.getDataRange().getValues();
    var studentHeaders = studentData[0];
    var idColumnIndex = studentHeaders.indexOf('id');
    var studentInfo = null;
    
    // 학생 ID로 행 찾기
    for (var i = 1; i < studentData.length; i++) {
      if (studentData[i][idColumnIndex] == withdrawalData.학생id) {
        studentInfo = {};
        for (var j = 0; j < studentHeaders.length; j++) {
          studentInfo[studentHeaders[j]] = studentData[i][j];
        }
        break;
      }
    }
    
    if (!studentInfo) {
      return {success: false, error: '학생을 찾을 수 없습니다'};
    }
    
    // 퇴원 학생 시트 가져오기
    var withdrawalSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('퇴원학생');
    if (!withdrawalSheet) {
      // 시트가 없으면 생성
      withdrawalSheet = createWithdrawalSheet();
    }
    
    var withdrawalHeaders = withdrawalSheet.getRange(1, 1, 1, withdrawalSheet.getLastColumn()).getValues()[0];
    
    // 퇴원 정보 추가
    var withdrawalRecord = {
      id: new Date().getTime(),
      원래id: studentInfo.id,
      이름: studentInfo.이름,
      연락처: studentInfo.연락처,
      탑승위치: studentInfo.탑승위치,
      단축번호: studentInfo.단축번호,
      시간대: studentInfo.시간대,
      등원요일: studentInfo.등원요일,
      메모: studentInfo.메모,
      퇴원일: withdrawalData.날짜,
      퇴원사유: withdrawalData.사유,
      퇴원처리일: new Date()
    };
    
    var row = [];
    for (var i = 0; i < withdrawalHeaders.length; i++) {
      var value = withdrawalRecord[withdrawalHeaders[i]] || '';
      row.push(value);
    }
    
    withdrawalSheet.appendRow(row);
    
    // 학생 목록에서 삭제
    deleteStudent(withdrawalData.학생id);
    
    return {success: true, data: withdrawalRecord};
  } catch (error) {
    return {success: false, error: error.toString()};
  }
}

// 퇴원 학생 재등록
function restoreStudent(withdrawalId) {
  try {
    var withdrawalsSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('퇴원학생');
    var withdrawalsData = withdrawalsSheet.getDataRange().getValues();
    var headers = withdrawalsData[0];
    var idColumnIndex = headers.indexOf('id');
    
    if (idColumnIndex === -1) {
      return {success: false, error: 'ID 컬럼을 찾을 수 없습니다'};
    }
    
    // 퇴원 학생 ID로 행 찾기
    for (var i = 1; i < withdrawalsData.length; i++) {
      if (withdrawalsData[i][idColumnIndex] == withdrawalId) {
        // 학생 데이터 추출
        var studentData = {};
        for (var j = 0; j < headers.length; j++) {
          // 퇴원 관련 필드는 제외
          if (headers[j] != 'id' && 
              headers[j] != '퇴원일' && 
              headers[j] != '퇴원사유' && 
              headers[j] != '퇴원처리일') {
            if (headers[j] == '원래id') {
              studentData['id'] = withdrawalsData[i][j]; // 원래 ID 복원
            } else {
              studentData[headers[j]] = withdrawalsData[i][j];
            }
          }
        }
        
        // 학생 추가
        var result = addStudent(studentData);
        
        // 퇴원 목록에서 삭제
        if (result.success) {
          withdrawalsSheet.deleteRow(i + 1);
        }
        
        return result;
      }
    }
    
    return {success: false, error: '퇴원 학생을 찾을 수 없습니다'};
  } catch (error) {
    return {success: false, error: error.toString()};
  }
}

// 일정 변경 내역 가져오기
function getScheduleChanges() {
  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('일정변경');
    if (!sheet) {
      // 시트가 없으면 생성
      sheet = createScheduleChangeSheet();
    }
    
    var data = sheet.getDataRange().getValues();
    var headers = data[0];
    var scheduleChanges = [];
    
    for (var i = 1; i < data.length; i++) {
      var change = {};
      var isEmpty = true; // 행이 비어있는지 확인
      
      for (var j = 0; j < headers.length; j++) {
        if (data[i][j] !== "") isEmpty = false;
        change[headers[j]] = data[i][j];
      }
      
      // 비어있지 않은 행만 추가
      if (!isEmpty) {
        scheduleChanges.push(change);
      }
    }
    
    return {success: true, data: scheduleChanges};
  } catch (error) {
    return {success: false, error: error.toString()};
  }
}

// 일정 변경 추가
function addScheduleChange(scheduleData) {
  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('일정변경');
    if (!sheet) {
      // 시트가 없으면 생성
      sheet = createScheduleChangeSheet();
    }
    
    var headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
    
    // ID 생성
    scheduleData.id = new Date().getTime();
    scheduleData.타임스탬프 = new Date();
    
    var row = [];
    for (var i = 0; i < headers.length; i++) {
      var value = scheduleData[headers[i]] || '';
      row.push(value);
    }
    
    sheet.appendRow(row);
    
    return {success: true, data: scheduleData};
  } catch (error) {
    return {success: false, error: error.toString()};
  }
}

// 시트 존재 여부 확인 및 생성 함수들
function createStudentSheet() {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().insertSheet('학생목록');
  sheet.appendRow([
    'id', '이름', '단축번호', '연락처', '탑승위치', '시간대', '등원요일', '메모', '등록일'
  ]);
  return sheet;
}

function createAttendanceSheet() {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().insertSheet('출석기록');
  sheet.appendRow([
    'id', '학생id', '날짜', '상태', '타임스탬프'
  ]);
  return sheet;
}

function createWithdrawalSheet() {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().insertSheet('퇴원학생');
  sheet.appendRow([
    'id', '원래id', '이름', '단축번호', '연락처', '탑승위치', '시간대', '등원요일',
    '메모', '퇴원일', '퇴원사유', '퇴원처리일'
  ]);
  return sheet;
}

function createScheduleChangeSheet() {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().insertSheet('일정변경');
  sheet.appendRow([
    'id', '학생id', '학생이름', '변경유형', '날짜', '사유', '타임스탬프'
  ]);
  return sheet;
}
