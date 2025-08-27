// import socket.io client (ESM)
import { io } from 'https://cdn.socket.io/4.8.1/socket.io.esm.min.js';
// import utils (เก็บ key ที่กด) จากไฟล์ utils.js
import { keys } from './utils.js';

document.addEventListener("DOMContentLoaded", function() {

	// ===== อ้างอิง element ในหน้า HTML =====
	const connectBtn = document.getElementById("connect");
	const nameInput = document.getElementById("name");
	const joinBtn = document.getElementById("join");
	const disconnectBtn = document.getElementById("disconnect");
	const shapeSelect = document.getElementById("shape");
	const gameCanvas = document.getElementById("gameCanvas");
	const colorPicker = document.getElementById("color");
	const ctxGame = gameCanvas.getContext("2d");

	// เก็บ state ของเกม
	let players = [];  // ผู้เล่นทั้งหมด (server broadcast มา)
	let me = {         // ข้อมูล player ของเราเอง
		name: "",
		color: "",
		shape: "",
		pos: { x: 0, y: 0 },
		direction: "stop"
	};

	// สร้าง socket object (ยังไม่เชื่อมต่อจนกว่าจะกด connect)
	const socket = io("http://localhost:5000", { autoConnect: false, transports: ["websocket"] });

	// ===== จัดการ UI ให้เปิด/ปิดตามสถานะการเชื่อมต่อ =====
	function UIUpdate(isConnected = false) {
		if (isConnected) {
			connectBtn.disabled = true;
			disconnectBtn.disabled = false;
			joinBtn.disabled = false;
			nameInput.disabled = false;
			shapeSelect.disabled = false;
			colorPicker.disabled = false;
		} else {
			connectBtn.disabled = false;
			disconnectBtn.disabled = true;
			joinBtn.disabled = true;
			nameInput.disabled = true;
			shapeSelect.disabled = true;
			colorPicker.disabled = true;
			joinBtn.disabled = true;
		}
	}
	// เมื่อ join เกมแล้ว → ปิดการแก้ไขตัวละคร
	function joinedGame() {
		shapeSelect.disabled = true;
		colorPicker.disabled = true;
		nameInput.disabled = true;
		joinBtn.disabled = true;
	}
	UIUpdate(); // เริ่มแรก = disconnected

	// ====== Socket Events ======
	socket.on("connect", () => {
		console.log("Connected to WebSocket server");
		UIUpdate(true);
	});

	socket.on("disconnect", () => {
		console.log("Disconnected from WebSocket server");
		UIUpdate(false);
	});

	socket.on("message", (data) => {
		console.log("Received message:", data);
	});

	// รับ state ของเกมจาก server ทุก tick
	socket.on("game_update", (data) => {
		// players = array ของ player objects
		players = data.players;
	});

	// ====== UI Events ======
	// ปุ่ม connect
	connectBtn.addEventListener("click", () => {
		socket.connect();
	});

	// ปุ่ม disconnect
	disconnectBtn.addEventListener("click", () => {
		socket.disconnect();
		// reset player ของเรา
		me = { name:"", color:"", shape:"", pos:{x:0,y:0}, direction:"stop" };
	});

	// ปุ่ม join → ส่งข้อมูลตัวละครไป server
	joinBtn.addEventListener("click", () => {
		const shape = shapeSelect.value;
		const color = colorPicker.value;
		const name = nameInput.value;
		// สุ่มตำแหน่งเริ่มต้นบน canvas
		const pos = {
			x: Math.random() * gameCanvas.width,
			y: Math.random() * gameCanvas.height 
		};
		if (shape && color && name) {
			me = { name: name, color: color, shape: shape, pos: pos, direction: "stop" };
			socket.emit("join_game", me);  // แจ้ง server ว่าเรา join
			joinedGame();
		}
	});

	// ====== Loop การวาดเกม ======
	function renderGame() {
		// ลบ canvas ก่อนวาดใหม่
		ctxGame.clearRect(0, 0, gameCanvas.width, gameCanvas.height);

		// ตรวจสอบ key กด (จาก utils.js) แล้วส่งทิศทางไป server
		if (keys['W'] || keys['w']) {
			socket.emit("move", { direction: "up" });
		} else if (keys['S'] || keys['s']) {
			socket.emit("move", { direction: "down" });
		} else if (keys['A'] || keys['a']) {
			socket.emit("move", { direction: "left" });
		} else if (keys['D'] || keys['d']) {
			socket.emit("move", { direction: "right" });
		} else {
			socket.emit("move", { direction: "stop" });
		}

		// วาด player แต่ละคน
		players.forEach(player => {
			ctxGame.fillStyle = player.color;
			switch (player.shape) {
				case "circle":
					ctxGame.beginPath();
					ctxGame.arc(player.pos.x, player.pos.y, 20, 0, Math.PI * 2);
					ctxGame.fill();
					break;
				case "square":
					ctxGame.fillRect(player.pos.x - 20, player.pos.y - 20, 40, 40);
					break;
				case "triangle":
					ctxGame.beginPath();
					ctxGame.moveTo(player.pos.x, player.pos.y - 20);
					ctxGame.lineTo(player.pos.x - 20, player.pos.y + 20);
					ctxGame.lineTo(player.pos.x + 20, player.pos.y + 20);
					ctxGame.closePath();
					ctxGame.fill();
					break;
			}
			// วาดชื่อ player ไว้เหนือหัว
			ctxGame.fillStyle = "#000";
			ctxGame.fillText(player.name, player.pos.x - 10, player.pos.y - 25);
		});

		// เรียกตัวเองใหม่ทุก frame (~60fps)
		requestAnimationFrame(renderGame);
	}
	renderGame(); // เริ่ม loop วาดเกม

});