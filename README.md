## JavaScript Library
- **Socket.IO (Client)** — JavaScript WebSocket framework  
  <a href="https://socket.io/docs/v4/client-initialization/" target="_blank" rel="noopener noreferrer">https://socket.io/docs/v4/client-initialization/</a>

## Python Packages
- **Flask** — Web framework สำหรับ backend/API  
- **eventlet** — เปลี่ยนงาน I/O ให้เป็น asynchronous (ใช้กับ Flask-SocketIO ได้ดี)  
  <a href="https://eventlet.readthedocs.io/en/latest/" target="_blank" rel="noopener noreferrer">https://eventlet.readthedocs.io/en/latest/</a>  
- **Flask-SocketIO** — เพิ่มความสามารถ WebSocket ให้ Flask  
  <a href="https://flask-socketio.readthedocs.io/en/latest/" target="_blank" rel="noopener noreferrer">https://flask-socketio.readthedocs.io/en/latest/</a>



### flask template ใน Week10
```
flask/
├──static/
|	├──basic.js
|	├──custom.js
|	├──game.js
|	└──utils.js
├──templates/
|	├──basic.html
|	├──custom.html
|	└──game.html
├──basic.py
├──custom.py
└──game.py
```
### **Workshops**
### **basic (html,js ⇄ python)** - Basic WebSocket (Code Template)
- (frontend) เชื่อมต่อ Server, ส่งข้อมูล (Message), ตัดการเชื่อมต่อ, แสดงข้อมูล (Message) จาก Server
- (backend) รับการเชื่อมต่อ, รับและส่งข้อมูลกลับ(ทุกคน), ตัดการเชื่อมต่อ 
---
### **custom (html,js ⇄ python)** - Custom events (Code Template)
- (frontend) เชื่อมต่อ Server, ส่งข้อมูลแบบระบุเหตการณ์เอง, ตัดการเชื่อมต่อ, แสดงข้อมูลตามเหตุการณ์ต่างๆ
- (backend) รับการเชื่อมต่อ, รับและส่งข้อมูลกลับตามเหตุการณ์ที่กำหนดเอง(ทุกคน), ตัดการเชื่อมต่อ 
---
### **game (html,js ⇄ python)** - Game sample (Code Sample)
- (frontend) Canvas 800×600, เลือก shape/color/name, กด WASD ส่ง move ไป server, วาด state ที่ server broadcast มา
- (backend) เก็บ players เป็น dict, มี background task (socketio.start_background_task) ที่อัปเดตตำแหน่งตาม tickrate แล้ว emit('game_update', state) ให้ทุกคน
---

### **เพิ่มเติม**
- การส่ง message ระหว่ากัน ใช้ send() และ emit() โดย send() จะล็อคไปที่ event "message" และ emit จะกำหนด event เองได้
- การรับ message ระหว่ากัน จะรับโดยกำหนด event โดย event มีทั้ง build-in event เช่น "connect", "message", "disconnect" และ event ที่กำหนดชื่อเองได้ แต่ต้องส่ง message ด้วย emit()
- การส่ง message frontend->backend หากส่งเป็น json มา ในส่วน backend จะแปลงข้อมูนนั้นเป็น dict ให้อัตโนมัติ และการส่ง message backend->frontend หากส่งเป็น dict มา ในส่วน frontend จะแปลงข้อมูลนั้นเป็น json ให้อัตโนมัติ