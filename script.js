const successSound = document.getElementById("success-sound");
const failSound = document.getElementById("fail-sound");

function renderSuccessScreen(queueNumber) {
  document.getElementById("main-container").innerHTML = `
    <div class="box success-animate">
      <h2 style="color:#4CAF50;">จองสำเร็จ!</h2>
      <p style="font-size:20px; color:#fff;">
        ลำดับคิวของคุณคือ: <b style="color:#00e6ff;">${queueNumber}</b>
      </p>
      <a class="form-link" href="https://docs.google.com/forms/d/e/1FAIpQLSdP9N0Qjo_i3GUD9hiAHp5seuVXW-p7j7UBoiyyZBbEPhzVDQ/viewform" target="_blank">
        ไปชำระเงินที่นี่
      </a>
      <br><br>
      <button onclick="clearBooking()" class="button-confirm"></button>
    </div>
  `;
}

function renderBookingForm() {
  document.getElementById("main-container").innerHTML = `
    <img class="logo" src='https://i.postimg.cc/Jz9MdSDw/IMG-0197.png' border='0' alt='IMG-0197' width="150px">
    <div class="box">
      <h2>จองคิวJRZ</h2>
      <input type="text" id="name" placeholder="กรอกชื่อของคุณ">
      <button onclick="book(event)">จองคิว</button>
      <div id="result"></div>
    </div>
  `;
}

function book(e) {
  const name = document.getElementById("name").value.trim();
  const result = document.getElementById("result");
  const button = e.target;

  button.classList.add("bounce");
  setTimeout(() => button.classList.remove("bounce"), 300);

  if (!name) {
    result.innerText = "ใส่ชื่อก่อน!!";
    failSound.play();
    return;
  }

  google.script.run.withSuccessHandler(function(response) {
    if (response.includes("จองสำเร็จ")) {
      const queueNumber = response.match(/\d+/)?.[0] || "N/A";
      localStorage.setItem("jrzBooked", "true");
      localStorage.setItem("jrzQueue", queueNumber);
      successSound.play();
      renderSuccessScreen(queueNumber);
    } else if (response.includes("เต็มแล้ว")) {
      failSound.play();
      document.getElementById("main-container").innerHTML = `
        <div class="box"><h2 style="color:#ff4d4d;">เสียใจด้วย</h2><p style="color:#fff;">คิวเต็มแล้ว</p></div>
      `;
    } else {
      result.innerText = response;
      result.style.color = "#ff6666";
      failSound.play();
    }
  }).processBooking(name);
}

function clearBooking() {
  localStorage.removeItem("jrzBooked");
  localStorage.removeItem("jrzQueue");
  location.reload();
}

window.onload = function () {
  if (localStorage.getItem("jrzBooked") === "true") {
    const queue = localStorage.getItem("jrzQueue") || "N/A";
    renderSuccessScreen(queue);
  } else {
    renderBookingForm();
  }
};
