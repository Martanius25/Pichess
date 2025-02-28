const socket = io("http://192.168.0.12:5000");  // Change to your server's IP
let gameRoom = "room1";  // Unique game room

socket.emit("join", { room: gameRoom });

socket.on("update_board", (moves) => {
    moves.forEach(move => game.move(move));
    board.position(game.fen());  // Update board position
});

function sendMove(move) {
    socket.emit("move", { room: gameRoom, move: move });
}




document.addEventListener("DOMContentLoaded", function () {
    let game = new Chess(); // Initialize chess.js game
    let gameMode = "ai"; // Default mode: AI opponent

    // Initialize Chessboard.js
    let board = Chessboard("board", {
        draggable: true,
        position: "start",
        onDrop: function(source, target) {
    let move = game.move({ from: source, to: target, promotion: 'q' });
    if (move === null) return 'snapback';  // Invalid move

    board.position(game.fen());  // Update board
    sendMove(move);  // Send move to server
}
    });

    // Initialize Stockfish AI
let stockfish = new Worker('stockfish-17-lite-single.js');


// Initialize Stockfish AI
//    var wasmSupported = typeof WebAssembly === 'object' && WebAssembly.validate(Uint8Array.of(0x0, 0x61, 0x73, 0x6d, 0x01, 0x00, 0x00, 0x00));
//
//var stockfish = new Worker(wasmSupported ? 'stockfish-17-lite.wasm.js' : 'stockfish-17-lite.js');
//
//stockfish.addEventListener('message', function (e) {
 // console.log(e.data);
//});

    // Game Mode Selection
    document.getElementById("gameMode").addEventListener("change", function () {
        gameMode = this.value;
        restartGame();
    });

    function handleMove(source, target) {
        let move = game.move({ from: source, to: target, promotion: "q" });

        if (move === null) return "snapback"; // Invalid move

        board.position(game.fen()); // Update board
        updateStatus();

        if (gameMode === "ai" && game.turn() === "b") {
            setTimeout(makeAIMove, 500); // AI moves as Black
        }
    }

    function makeAIMove() {
        if (!stockfish) {
            console.error("Stockfish is not initialized!");
            return;
        }

        stockfish.postMessage("position fen " + game.fen());
        stockfish.postMessage("go depth 10");

        stockfish.onmessage = function (event) {
            let match = event.data.match(/bestmove\s(\S+)/);
            if (match) {
                let bestMove = match[1];

                let move = game.move({ from: bestMove.substring(0, 2), to: bestMove.substring(2, 4), promotion: "q" });

                if (move !== null) {
                    board.position(game.fen());
                    updateStatus();
                }
            }
        };
    }

    function updateStatus() {
        let status = game.game_over()
            ? "Game Over"
            : game.in_check()
            ? "Check!"
            : "Your turn";

        console.log(status);
    }

    // 🛑 Fix: Make restartGame globally accessible
    window.restartGame = function () {
        game = new Chess(); // Reset chess.js game
        board.position("start"); // Reset board
        updateStatus();
    };
});
