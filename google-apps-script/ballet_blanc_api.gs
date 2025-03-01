// �� ���� ��û ó��
function doGet(request) {
  // ��û ó��
  const output = handleRequest(request);
  
  // CORS ��� ���� ��� ����
  return ContentService.createTextOutput(JSON.stringify(output))
    .setMimeType(ContentService.MimeType.JSON);
}

// ��û ó�� �ڵ鷯
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
  // ������ �ڵ� ����...
  
  // �⺻������ �л� ������ ��ȯ (action�� ���� ���)
  return getStudents();
}
