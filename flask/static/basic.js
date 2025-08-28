// import socket.io client แบบ ES Module
import { io } from 'https://cdn.socket.io/4.8.1/socket.io.esm.min.js';

document.addEventListener("DOMContentLoaded", function() {

	// อ้างอิง element ในหน้า HTML
	const connectBtn = document.getElementById("connect");
	const messageInput = document.getElementById("message");
	const sendBtn = document.getElementById("send");
	const disconnectBtn = document.getElementById("disconnect");
	const messagesDiv = document.getElementById("messages");
	const colorPicker = document.getElementById("color");

	// สร้าง socket object (autoConnect=false = ยังไม่เชื่อมต่อจนกว่าจะกดปุ่ม connect)
	// TODO:
	const socket = io("http://https://3551e0d5a3c1.ngrok-free.app/", { autoConnect: false });


	// ฟังก์ชันปรับ UI ตามสถานะการเชื่อมต่อ
	function UIUpdate(isConnected = false) {
		if (isConnected) {
			connectBtn.disabled = true;       // ปุ่ม connect กดไม่ได้ (เพราะเชื่อมแล้ว)
			disconnectBtn.disabled = false;   // เปิดปุ่ม disconnect
			messageInput.disabled = false;    // เปิด input ข้อความ
			sendBtn.disabled = false;         // เปิดปุ่มส่งข้อความ
		} else {
			connectBtn.disabled = false;
			disconnectBtn.disabled = true;
			messageInput.disabled = true;
			sendBtn.disabled = true;
		}
	}
	UIUpdate(); // เริ่มแรก = disconnected

	// ====== Socket Events ======
	// เมื่อเชื่อมต่อสำเร็จ "connect"
	// TODO:
	socket.on("connect", () => {
		UIUpdate(true); // ปรับ UI เป็น connected
		const msg = document.createElement("div");
		msg.innerHTML = `<em>Connected to server</em>`;
		messagesDiv.appendChild(msg);
	});

	// เมื่อถูกตัดการเชื่อมต่อ "disconnect"
	// TODO:
	socket.on("disconnect", () => {
		UIUpdate(false); // ปรับ UI เป็น disconnected
		const msg = document.createElement("div");
		msg.innerHTML = `<em>Disconnected from server</em>`;
		messagesDiv.appendChild(msg);
	});

	// เมื่อได้รับข้อความจาก server (event "message" เป็นค่า default ของ socket.send())
	// TODO:
	socket.on("message", (data)=>{
		console.log(data);
		const div = document.createElement("div")
		div.style.color = data.color; // css style
		div.innerText = data.message;
		messagesDiv.appendChild(div);
	});

	// ====== UI Events ======
	// เมื่อกดปุ่ม connect → สั่งเชื่อม socket
	connectBtn.addEventListener("click", () => {
		socket.connect();
	});

	// เมื่อกดปุ่ม disconnect → ตัดการเชื่อมต่อ
	disconnectBtn.addEventListener("click", () => {
		socket.disconnect();
	});

	// เมื่อกดปุ่ม send → ส่งข้อความไปที่ server
	sendBtn.addEventListener("click", () => {
		const message = messageInput.value;
		const color = colorPicker.value;
		if (message) {
			// socket.send() = ส่งไปยัง event "message" (built-in)
			socket.send({ message: message, color: color });
		}
		// ล้างกล่องข้อความหลังส่ง
		messageInput.value = '';
	});
});