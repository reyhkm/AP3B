const chatLog = document.getElementById('chatLog');
const userInput = document.getElementById('userInput');

const scheduleData = [
  { kelas: '2IA16', hari: 'Senin', mataKuliah: 'Komputasi Big Data', waktu: 'UGTV', ruang: 'TEAM TEACHING', dosen: 'TEAM TEACHING' },
  { kelas: '2IA16', hari: 'Selasa', mataKuliah: 'Informatika Kesehatan', waktu: '6/7', ruang: 'G143', dosen: 'GHIFARI PRAMESWARI NATAKUSUMAH' },
  { kelas: '2IA16', hari: 'Selasa', mataKuliah: 'Matematika Lanjut 1', waktu: '8/9/10', ruang: 'G143', dosen: 'JULLYSAVA C AZIZ' },
  { kelas: '2IA16', hari: 'Rabu', mataKuliah: 'Matematika Informatika 3', waktu: '5/6/7', ruang: 'G133', dosen: 'DIAH PRASTIWI' },
  { kelas: '2IA16', hari: 'Kamis', mataKuliah: 'Pengantar Sains Data', waktu: '1/2', ruang: 'D644', dosen: 'PARNO' },
  { kelas: '2IA16', hari: 'Kamis', mataKuliah: 'Bahasa Indonesia', waktu: '4/5', ruang: 'D665', dosen: 'RAFIQA MAULIDIA' },
  { kelas: '2IA16', hari: 'Kamis', mataKuliah: 'Statistika 1', waktu: '6/7/8', ruang: 'D665', dosen: 'RINA SUGIARTI' },
  { kelas: '2IA16', hari: 'Jumat', mataKuliah: 'Struktur Data', waktu: '2/3/4', ruang: 'G434', dosen: 'YENI SETIANI' },
  { kelas: '2IA16', hari: 'Jumat', mataKuliah: 'Organisasi Sistem Komputer', waktu: '7/8', ruang: 'G144', dosen: 'FEBRIANTI DWIANJANI' },
  { kelas: '2IA16', hari: 'Jumat', mataKuliah: 'Algoritma & Pemrograman 3', waktu: '9/10', ruang: 'G144', dosen: 'ARY BIMA KURNIAWAN' },
  { kelas: '2IA16', hari: 'Sabtu', mataKuliah: 'Praktikum Komputasi Big Data', waktu: '6/7', ruang: '', dosen: 'TIM DOSEN' },
];

function handleScheduleInquiry(userInput) {
  const days = ['minggu', 'senin', 'selasa', 'rabu', 'kamis', 'jumat', 'sabtu'];
  const today = new Date().getDay();
  let day;

  if (userInput.toLowerCase().includes('hari ini')) {
    day = days[today];
  } else if (userInput.toLowerCase().includes('besok')) {
    day = days[(today + 1) % 7];
  } else if (userInput.toLowerCase().includes('kemarin')) {
    day = days[(today - 1 + 7) % 7];
  } else {
    const matchingKeywords = days.filter((keyword) => userInput.toLowerCase().includes(keyword));
    if (matchingKeywords.length === 0) {
      addChatResponse('Asisten : Maaf, untuk saat ini saya hanya tersedia untuk menjawab pertanyaan terkait jadwal :)', true);
      return;
    }
    day = matchingKeywords[0];
  }

  let matchingSchedules = scheduleData.filter((schedule) => schedule.hari.toLowerCase() === day);

  if (matchingSchedules.length === 0) {
    addChatResponse(`Asisten : Maaf, tidak ada jadwal pada hari ${day}.`, true);
    return;
  }

  let scheduleResponse = `<strong>Berikut adalah jadwal pada hari ${day}:</strong><br>`;

  matchingSchedules.forEach((schedule) => {
    scheduleResponse += `<strong>Kelas:</strong> ${schedule.kelas}<br>
                         <strong>Mata Kuliah:</strong> ${schedule.mataKuliah}<br>
                         <strong>Waktu:</strong> ${schedule.waktu}<br>
                         <strong>Ruang:</strong> ${schedule.ruang}<br>
                         <strong>Dosen:</strong> ${schedule.dosen}<br><br>`;
  });

  addChatResponse('Asisten : ' + scheduleResponse, true);
}

function addChatResponse(message, isAI) {
  const chatDiv = document.createElement('div');
  chatDiv.classList.add('chat-response');

  if (isAI) {
    chatDiv.classList.add('chat-ai');
    chatDiv.innerHTML = '<em>Asisten sedang mengetik...</em>'; // Pesan loading
    chatLog.appendChild(chatDiv);
    chatLog.scrollTop = chatLog.scrollHeight;

    setTimeout(() => {
      // Tambahkan delay sebelum pesan asisten ditampilkan
      chatDiv.innerHTML = message;
    }, 1000); // Delay 1 detik
  } else {
    chatDiv.innerHTML = message;
    chatLog.appendChild(chatDiv);
    chatLog.scrollTop = chatLog.scrollHeight;
  }
}

userInput.addEventListener('keyup', function (event) {
  if (event.key === 'Enter') {
    sendMessage();
  }
});

function sendMessage() {
  const message = userInput.value.trim();

  if (message !== '') {
    addChatResponse('Anda : ' + message, false);
    handleScheduleInquiry(message);
    userInput.value = '';
  }
}

sendButton.addEventListener('click', sendMessage); // add event listener to the send button
userInput.addEventListener('keyup', function (event) {
  if (event.key === 'Enter') {
    sendMessage();
  }
});

window.onload = function () {
  const currentHour = new Date().getHours();
  let greeting;

  if (currentHour >= 0 && currentHour < 12) {
    greeting = 'Selamat pagi!';
  } else if (currentHour >= 12 && currentHour < 15) {
    greeting = 'Selamat siang!';
  } else if (currentHour >= 15 && currentHour < 18) {
    greeting = 'Selamat sore!';
  } else {
    greeting = 'Selamat malam!';
  }

  addChatResponse(`Asisten : <strong>${greeting} ;) </strong>`, true);
};
