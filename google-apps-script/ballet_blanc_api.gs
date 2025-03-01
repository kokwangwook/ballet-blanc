// 웹 앱의 요청 처리
function doGet(request) {
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
  } 
  // 나머지 코드 생략...
  
  // 기본적으로 학생 데이터 반환 (action이 없을 경우)
  return getStudents();
}
