# eventlet: ไลบรารีที่ช่วยให้ Flask ทำงานกับ WebSocket และ async ได้
# docs: https://eventlet.readthedocs.io/en/latest/
import eventlet
# monkey_patch(): ดัดแปลงไลบรารีมาตรฐาน (socket, threading ฯลฯ) 
# ให้รองรับ async โดยไม่ต้องแก้โค้ดหลัก
eventlet.monkey_patch()

from flask import Flask, render_template, request
# Flask-SocketIO: เพิ่มความสามารถ WebSocket ให้ Flask
# docs: https://flask-socketio.readthedocs.io/en/latest/
from flask_socketio import SocketIO

# ===== สร้าง Flask app ก่อน =====
app = Flask(__name__)

# ===== ผูก SocketIO เข้ากับ Flask app =====
socketio = SocketIO(
	app,
	async_mode='eventlet',    # ใช้ eventlet ทำงานแบบ async
	cors_allowed_origins='*'  # เปิด CORS ให้ทุกโดเมนเข้าได้ (เพื่อทดสอบ)
) 

# ====== Built-in Events ======
# connect: เรียกเมื่อ client เชื่อมต่อสำเร็จ
# TODO:

# message: เรียกเมื่อ client ใช้ socket.send() (built-in event "message")
# TODO:

# disconnect: เรียกเมื่อ client ตัดการเชื่อมต่อ
# TODO:

# ====== Flask route ปกติ ======
@app.route('/')
def index():
	# render หน้า basic.html (อยู่ในโฟลเดอร์ templates)
	return render_template('basic.html')

# ===== main program =====
if __name__ == '__main__':
	# ต้องใช้ socketio.run() แทน app.run()
	# เพื่อให้ WebSocket ทำงานร่วมกับ Flask ได้
	socketio.run(app, host="0.0.0.0", debug=True, port=5000)