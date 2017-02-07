const btn_x = document.getElementById("btn_x");
const btn_o = document.getElementById("btn_o");
const btn_t = document.getElementById("btn_t");
const t_head =document.getElementById("t_head");
const squares = document.getElementsByTagName("td");

let playerTeam = 'X';
let compTeam = 'O'
let currTurn = ' ';
//either ' ','X','O'
let numMoves = 0;
let twoPlayer = false;

//
function newGame(team){
  twoPlayer = false;
  playerTeam = team;
  if(team==='X'){
    compTeam = 'O';
  }else{
    compTeam = 'X';
  }
  // reset letiables
  currTurn = 'X';
  numMoves = 0;
  // hide newgame buttons, alt use display
  btn_x.style.visibility = "hidden";
  btn_o.style.visibility = "hidden";
  btn_t.style.visibility = "hidden";
  
  // clear all td
  for(let i=0;i<squares.length;i++){
    squares[i].innerHTML = " ";
  }

  // X to move
  t_head.innerHTML = "X to move";
  
  //comp moves if first
  if(compTeam === 'X'){
    clickSquare(computerMove(parseBoard(playerTeam,compTeam)));
  }
}

function clickSquare(num){
  // check if player's turn
  if(currTurn === playerTeam){
    // check if square empty
    if(squares[num].innerHTML!==' '){
      return;
    }
    // apply player move
    squares[num].innerHTML = currTurn;
    numMoves++;
    
    // check winner and swap currTurn
    if(swapTurns()===false){
      // game ended, don't do computer response
      return;
    }
    if(!twoPlayer){
      clickSquare(computerMove(parseBoard(playerTeam,compTeam)));
    }
  }
  else if(currTurn === compTeam){
    if(squares[num].innerHTML===' '){
      // apply computer move
      squares[num].innerHTML = currTurn;
      numMoves++;
      //swap turns back
      swapTurns();
    }else{
      return;
    }
  }
  
}

function checkWin(team){
     //simple check for the winner, looks for the team and if there is 3 in a row
  return inLine(team, 3);
}
// alt: only check for square

//board contents to array
function parseBoard(player,comp){
  let board = [0,0,0,0,0,0,0,0,0,0];
  for(let i =0;i<squares.length;i++){
    if(squares[i].innerHTML===' '){
      board[i]=0;
    }else if(squares[i].innerHTML===player){
      board[i]=1;
    }else if(squares[i].innerHTML===comp){
      board[i]=2;
    }
  }
  return board;
}

function endGame(team,row){
  currTurn = ' ';
  if(team !== ' '){
    t_head.innerHTML = team + " wins!";
    for(let i=0;i<row.length;i++){
      //squares[row[i]].style.color = blue;
      squares[row[i]].innerHTML = '-'+team+'-';
    }
  }
  else{
    t_head.innerHTML = "It's a draw!";
  }
  
  // show newgame buttons, alt use display
  btn_x.style.visibility = "visible";
  btn_o.style.visibility = "visible";
  btn_t.style.visibility = "visible";
}

function swapTurns(){
  //check if three in row, winner
  let winner = checkWin(currTurn);
  if(winner){
    // display winner and reset
    endGame(currTurn,winner);
    return false;
  }
  // check if 9 moves already
  if(numMoves===squares.length){
    // it's a draw
    endGame(' ');
    return false;
  }
  
  if(currTurn==='X'){
    currTurn='O';
    t_head.innerHTML = "O to move";
  }else if(currTurn==='O'){
    currTurn='X';
    t_head.innerHTML = "X to move";
  }
  return true;
}

function computerMove(board){
  //input as array
  //[0,1,2,0,0,0,0,0,0]
  // 0 empty, 1 player, 2 comp
  let move;
  // if 2 own in row, fill row
  let check = inLine(compTeam,2);
  if(check){
    for(let i=0;i<check.length;i++){
      if(board[check[i]]===0){
        return check[i];
      }
    }
  }
  // if 2 player in row, block
  check = inLine(playerTeam,2);
  if(check){
    for(let i=0;i<check.length;i++){
      if(board[check[i]]===0){
        return check[i];
      }
    }
  }
//random moves
  move = Math.floor(Math.random()*9);
  while(board[move]!==0){
    move = Math.floor(Math.random()*9);
  }

  //output number of square
  return move;
}

// check if (team) has line with (num) moves and the others free
function inLine(team, num){
  let threes = [[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]];
  for(let i=0;i<threes.length;i++){
    let numMoves = 0;
    let numGaps = 0;
    for(let j=0;j<threes[i].length;j++){
      if(squares[threes[i][j]].innerHTML===team){
        numMoves++;
      }
      else if(squares[threes[i][j]].innerHTML===' '){
        numGaps++;
      }
    }
    if(numMoves === num && numGaps===3-num){
      return threes[i];
    }
  }
  return false;
}
