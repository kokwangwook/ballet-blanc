// �� ���� ��û ó��
function doGet(request) {
  // ��û ó��
  const output = handleRequest(request);
  
  // CORS ��� ���� ��� ����
  return ContentService.createTextOutput(JSON.stringify(output))
    .setMimeType(ContentService.MimeType.JSON);
}

// ������ Google Apps Script �ڵ带 ���⿡ �ٿ���������.
