// Simple Snake Game
let snakeGame = null;
function startSnakeGame() {
  if (snakeGame) snakeGame.stop();
  snakeGame = new SnakeGame('snake-container', 'snake-score');
  snakeGame.start();
}

class SnakeGame {
  constructor(containerId, scoreId) {
    this.size = 20;
    this.rows = 20;
    this.cols = 20;
    this.dir = 'right';
    this.nextDir = 'right';
    this.snake = [{x:8,y:10},{x:7,y:10},{x:6,y:10}];
    this.food = {x:15,y:10};
    this.score = 0;
    this.interval = null;
    this.container = document.getElementById(containerId);
    this.scoreElem = document.getElementById(scoreId);
    this.canvas = null;
    this.ctx = null;
    this.running = false;
    this.handleKey = this.handleKey.bind(this);
  }
  start() {
    this.running = true;
    this.dir = 'right';
    this.nextDir = 'right';
    this.snake = [{x:8,y:10},{x:7,y:10},{x:6,y:10}];
    this.food = this.randomFood();
    this.score = 0;
    this.container.innerHTML = '';
    this.canvas = document.createElement('canvas');
    this.canvas.width = this.cols*this.size;
    this.canvas.height = this.rows*this.size;
    this.ctx = this.canvas.getContext('2d');
    this.container.appendChild(this.canvas);
    document.addEventListener('keydown', this.handleKey);
    this.draw();
    this.scoreElem.textContent = 'Score: 0';
    this.interval = setInterval(()=>this.step(), 100);
  }
  stop() {
    this.running = false;
    clearInterval(this.interval);
    document.removeEventListener('keydown', this.handleKey);
  }
  handleKey(e) {
    const map = {ArrowUp:'up',ArrowDown:'down',ArrowLeft:'left',ArrowRight:'right',w:'up',s:'down',a:'left',d:'right'};
    let d = map[e.key];
    if (!d) return;
    if ((d==='up'&&this.dir==='down')||(d==='down'&&this.dir==='up')||(d==='left'&&this.dir==='right')||(d==='right'&&this.dir==='left')) return;
    this.nextDir = d;
  }
  step() {
    this.dir = this.nextDir;
    let head = {...this.snake[0]};
    if (this.dir==='up') head.y--;
    if (this.dir==='down') head.y++;
    if (this.dir==='left') head.x--;
    if (this.dir==='right') head.x++;
    // Check collision
    if (head.x<0||head.x>=this.cols||head.y<0||head.y>=this.rows||this.snake.some(s=>s.x===head.x&&s.y===head.y)) {
      this.stop();
      this.scoreElem.textContent = 'Game Over! Score: '+this.score;
      return;
    }
    this.snake.unshift(head);
    if (head.x===this.food.x&&head.y===this.food.y) {
      this.score++;
      this.food = this.randomFood();
      this.scoreElem.textContent = 'Score: '+this.score;
    } else {
      this.snake.pop();
    }
    this.draw();
  }
  randomFood() {
    let pos;
    do {
      pos = {x:Math.floor(Math.random()*this.cols),y:Math.floor(Math.random()*this.rows)};
    } while (this.snake.some(s=>s.x===pos.x&&s.y===pos.y));
    return pos;
  }
  draw() {
    // Google Snake style background
    this.ctx.fillStyle = '#f5f5f5';
    this.ctx.fillRect(0,0,this.canvas.width,this.canvas.height);
    // Score display (top center)
    this.ctx.font = 'bold 22px Arial';
    this.ctx.fillStyle = '#222';
    this.ctx.textAlign = 'center';
    this.ctx.fillText('Score: ' + this.score, this.canvas.width/2, 30);
    // Draw snake body (rounded, spaced, Google colors)
    for (let i=0;i<this.snake.length;i++) {
      let x = this.snake[i].x*this.size+this.size/2;
      let y = this.snake[i].y*this.size+this.size/2;
      // Segment spacing (gap between segments)
      let radius = this.size/2-3;
      if (i === 0) {
        // Head: darker green, with eyes
        this.ctx.fillStyle = '#6aa84f';
        this.ctx.beginPath();
        this.ctx.arc(x, y, radius, 0, 2*Math.PI);
        this.ctx.fill();
        // Eyes (white then black)
        this.ctx.fillStyle = '#fff';
        this.ctx.beginPath();
        this.ctx.arc(x-4, y-2, 2, 0, 2*Math.PI);
        this.ctx.arc(x+4, y-2, 2, 0, 2*Math.PI);
        this.ctx.fill();
        this.ctx.fillStyle = '#222';
        this.ctx.beginPath();
        this.ctx.arc(x-4, y-2, 1, 0, 2*Math.PI);
        this.ctx.arc(x+4, y-2, 1, 0, 2*Math.PI);
        this.ctx.fill();
      } else {
        // Body: light green, rounded
        this.ctx.fillStyle = '#a8d08d';
        this.ctx.beginPath();
        this.ctx.arc(x, y, radius, 0, 2*Math.PI);
        this.ctx.fill();
      }
    }
    // Draw food: rounded yellow with orange border and dot
    let fx = this.food.x*this.size+this.size/2;
    let fy = this.food.y*this.size+this.size/2;
    this.ctx.fillStyle = '#ffb347';
    this.ctx.strokeStyle = '#e67e22';
    this.ctx.lineWidth = 2;
    this.ctx.beginPath();
    this.ctx.arc(fx, fy, this.size/2-4, 0, 2*Math.PI);
    this.ctx.fill();
    this.ctx.stroke();
    // Food dot
    this.ctx.fillStyle = '#e67e22';
    this.ctx.beginPath();
    this.ctx.arc(fx, fy, 3, 0, 2*Math.PI);
    this.ctx.fill();
  }
}
