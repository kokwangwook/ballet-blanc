// 웹 앱의 요청 처리
function doGet(request) {
  // 요청 처리
  const output = handleRequest(request);
  
  // CORS 헤더 설정 방법 수정
  return ContentService.createTextOutput(JSON.stringify(output))
    .setMimeType(ContentService.MimeType.JSON);
}

// 나머지 Google Apps Script 코드를 여기에 붙여넣으세요.
