// import socket.io client แบบ ES Module
import { io } from 'https://cdn.socket.io/4.8.1/socket.io.esm.min.js';

document.addEventListener("DOMContentLoaded", function() {

	// ===== อ้างอิง element ใน HTML =====
	const connectBtn = document.getElementById("connect");
	const messageInput = document.getElementById("message");
	const sendBtn = document.getElementById("send");
	const disconnectBtn = document.getElementById("disconnect");
	const eventSelect = document.getElementById("event"); // dropdown เลือก event
	const messagesDiv = document.getElementById("messages"); // div แสดง event message
	const custom_event1Div = document.getElementById("custom_event1"); // div แสดง custom_event1
	const custom_event2Div = document.getElementById("custom_event2"); // div แสดง custom_event2
	const custom_event3Div = document.getElementById("custom_event3"); // div แสดง custom_event3
	const colorPicker = document.getElementById("color");

	// สร้าง socket object (ยังไม่เชื่อมต่อจนกว่าจะกด connect)
	const socket = io("http://localhost:5000", { autoConnect: false });

	// ===== ฟังก์ชันปรับ UI ตามสถานะการเชื่อมต่อ =====
	function UIUpdate(isConnected = false) {
		if (isConnected) {
			connectBtn.disabled = true;
			disconnectBtn.disabled = false;
			eventSelect.disabled = false;
			messageInput.disabled = false;
			sendBtn.disabled = false;
		} else {
			connectBtn.disabled = false;
			disconnectBtn.disabled = true;
			eventSelect.disabled = true;
			messageInput.disabled = true;
			sendBtn.disabled = true;
		}
	}
	UIUpdate(); // ค่าเริ่มต้น = disconnected

	// ====== Socket Events ======
	// เมื่อเชื่อมต่อสำเร็จ
	socket.on("connect", () => {
		console.log("Connected to WebSocket server");
		UIUpdate(true);
	});

	// เมื่อถูกตัดการเชื่อมต่อ
	socket.on("disconnect", () => {
		console.log("Disconnected from WebSocket server");
		UIUpdate(false);
	});

	// ====== การรับข้อความจากแต่ละ event ======
	// event message (default)
	socket.on("message", (data) => {
		console.log("Received message:", data);
		// TODO:
	});

	// event custom_event1
	// TODO:

	// event custom_event2
	// TODO:

	// event custom_event3
	// TODO:

	// ====== UI Events ======
	// ปุ่ม connect → เชื่อม socket
	connectBtn.addEventListener("click", () => {
		socket.connect();
	});

	// ปุ่ม disconnect → ตัดการเชื่อมต่อ
	disconnectBtn.addEventListener("click", () => {
		socket.disconnect();
	});

	// ปุ่ม send → ส่งข้อความไปยัง event ที่เลือกใน dropdown
	sendBtn.addEventListener("click", () => {
		const eventType = eventSelect.value;   // เลือกว่าจะส่ง event ไหน
		const message = messageInput.value;   // ข้อความที่ป้อน
		const color = colorPicker.value;      // สีที่เลือก
		if (message) {
			// ใช้ socket.emit() เพื่อส่ง event แบบกำหนดเอง
			socket.emit(eventType, { message: message, color: color });
		}
		messageInput.value = ''; // ล้าง input หลังส่ง
	});
});