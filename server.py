from flask import Flask, request
from flask_socketio import SocketIO, emit, join_room

app = Flask(__name__)
socketio = SocketIO(app, cors_allowed_origins="*")

rooms = {}  # Store active games

@app.route('/')
def home():
    return "WebSocket Server Running"

@socketio.on("join")
def on_join(data):
    room = data["room"]
    join_room(room)
    if room not in rooms:
        rooms[room] = {"moves": []}  # Store moves for this game
    emit("update_board", rooms[room]["moves"], room=room)

@socketio.on("move")
def on_move(data):
    room = data["room"]
    move = data["move"]
    if room in rooms:
        rooms[room]["moves"].append(move)
        emit("update_board", rooms[room]["moves"], room=room)  # Broadcast move to both players

if __name__ == "__main__":
    socketio.run(app, host="0.0.0.0", port=5000)
=======
from flask import Flask, request
from flask_socketio import SocketIO, emit, join_room

app = Flask(__name__)
socketio = SocketIO(app, cors_allowed_origins="*")

rooms = {}  # Store active games

@app.route('/')
def home():
    return "WebSocket Server Running"

@socketio.on("join")
def on_join(data):
    room = data["room"]
    join_room(room)
    if room not in rooms:
        rooms[room] = {"moves": []}  # Store moves for this game
    emit("update_board", rooms[room]["moves"], room=room)

@socketio.on("move")
def on_move(data):
    room = data["room"]
    move = data["move"]
    if room in rooms:
        rooms[room]["moves"].append(move)
        emit("update_board", rooms[room]["moves"], room=room)  # Broadcast move to both players

if __name__ == "__main__":
    socketio.run(app, host="0.0.0.0", port=5000)

