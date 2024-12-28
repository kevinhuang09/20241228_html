let video;          // 用來存取相機影像
let faceapi;        // 人臉辨識模型
let detections;     // 辨識結果
let registeredFace; // 註冊的臉部特徵數據

const MODEL_URL = 'https://cdn.jsdelivr.net/npm/@vladmandic/face-api/model/'; // FaceAPI 模型路徑

// 初始化相機與模型
async function setup() {
  video = document.getElementById('video');
  const stream = await navigator.mediaDevices.getUserMedia({ video: {} });
  video.srcObject = stream;

  console.log('正在加載模型...');
  await faceapi.nets.ssdMobilenetv1.loadFromUri(MODEL_URL);
  await faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL);
  await faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL);
  console.log('模型加載完成');
}

// 註冊臉部特徵
async function registerFace() {
  console.log('註冊按鈕被按下');
  const detections = await faceapi.detectAllFaces(video).withFaceLandmarks().withFaceDescriptors();
  console.log('偵測結果：', detections);
  if (detections.length === 0) {
    alert('無法偵測到人臉，請再試一次！');
    return;
  }
  registeredFace = detections[0].descriptor; // 儲存臉部特徵
  console.log('註冊成功，特徵數據已儲存');
  alert('註冊成功！');
}

// 登入比對
async function login() {
  if (!registeredFace) {
    alert('尚未註冊人臉，請先註冊！');
    return;
  }
  const detections = await faceapi.detectAllFaces(video).withFaceLandmarks().withFaceDescriptors();
  console.log('登入偵測結果：', detections);
  if (detections.length === 0) {
    alert('無法偵測到人臉，請再試一次！');
    return;
  }
  const currentFace = detections[0].descriptor;

  // 計算特徵向量距離
  const distance = faceapi.euclideanDistance(currentFace, registeredFace);
  console.log('臉部距離：', distance);

  if (distance < 0.6) { // 距離越小代表相似度越高，0.6 是一個常用閾值
    alert('登入成功！');
    window.location.href = 'a002.html'; // 導向成功頁面
  } else {
    alert('登入失敗，請再試一次！');
  }
}

// 綁定按鈕事件
document.getElementById('register').addEventListener('click', registerFace);
document.getElementById('login').addEventListener('click', login);

// 初始化
setup();
