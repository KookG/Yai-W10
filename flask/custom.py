# eventlet: ไลบรารีช่วยให้ Flask รองรับ WebSocket + async ได้
# docs: https://eventlet.readthedocs.io/en/latest/
import eventlet
# monkey_patch(): ดัดแปลงพฤติกรรม socket/threading ของ Python
# เพื่อให้ async ทำงานได้ โดยไม่ต้องแก้โค้ดหลัก
eventlet.monkey_patch()

from flask import Flask, render_template, request
# Flask-SocketIO: ทำให้ Flask คุยกับ client แบบ real-time ผ่าน WebSocket
# docs: https://flask-socketio.readthedocs.io/en/latest/
from flask_socketio import SocketIO

# ===== สร้าง Flask app และผูกกับ SocketIO =====
app = Flask(__name__)
socketio = SocketIO(
	app,
	async_mode='eventlet',    # ใช้ eventlet เป็น async engine
	cors_allowed_origins='*'  # เปิด CORS ให้ทุกโดเมนเข้าได้ (สะดวกเวลาทดสอบ)
) 

# ===== Built-in events =====
# connect: เรียกเมื่อ client เชื่อมต่อเข้ามา
@socketio.on('connect')
def handle_connect():
	output = {
		'message': f'ยินดีต้อนรับสู่ Flask SocketIO server ! from {request.sid} {request.remote_addr}',
		'color': '#000000'
	}
	print('Client connected', request.sid, request.remote_addr) 
	# socketio.send() → ส่งไปที่ event "message" โดยอัตโนมัติ
	socketio.send(output)

# message: เรียกเมื่อ client ใช้ socket.send()
@socketio.on('message')
def handle_message(data):
	print('Received message:', data)
	output = {
		'message': f'ข้อความที่ส่งมา: {data["message"]} from {request.sid} {request.remote_addr}',
		'color': data['color']
	}
	# ตอบกลับด้วย event "message"
	socketio.send(output)

# disconnect: เรียกเมื่อ client หลุดการเชื่อมต่อ
@socketio.on('disconnect')
def handle_disconnect():
	print('Client disconnected', request.sid, request.remote_addr)

# ===== Custom events =====
# custom_event1: client ต้องใช้ socket.emit("custom_event1", {...})
# TODO:

# custom_event2: client ต้องใช้ socket.emit("custom_event2", {...})
# TODO:

# custom_event3: client ต้องใช้ socket.emit("custom_event3", {...})
# TODO:

# ===== Route ปกติของ Flask =====
@app.route('/')
def index():
	# render หน้า custom.html (อยู่ใน templates/)
	return render_template('custom.html')

# ===== main program =====
if __name__ == '__main__':
	# ใช้ socketio.run() แทน app.run()
	socketio.run(app, host="0.0.0.0", debug=True, port=5000)