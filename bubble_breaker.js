/*Constructor for the bubble object
color is one of "r" "g" "b" "y" or "p" x is line position
y is column position in the table*/
function Bubble(color, i, j, td) {
    this.color = color;
    this.htmlLocation = td;
    this.i = i;
    this.j = j;
}

/*Constructor for the BubbleBreaker object*/
function BubbleBreaker() {

    this.score = 0;
    this.startTime = 0;
    this.board = new Array();
    this.highlighted = new Array();
    this.removed = new Array();
    this.table = document.getElementById("board");

    this.init = function () {
        this.clearBoard();
        this.fillBoard();
        this.resetStartTime();
        this.resetHighlight();
        this.score = 0;
        this.updateScore();
        interval = setInterval(function(){timer()}, 1000);
        
        var howto = document.getElementById("howto");
        howto.setAttribute("style","visibility:hidden");
    }
    
    this.resetStartTime = function () {
        var d = new Date();
        this.startTime = d.getTime();
    }
    
    /*Add a bubble to the html document and the corresponding
    reference the the board array*/
    this.addBubble = function (td, i, j) {    
        var img = document.createElement("img");

        /*randomly choose color of bubble to be added*/
        var n = Math.floor((Math.random()*5)+1);
        switch(n)
        {
        case 1:
            var color = "b";
            img.setAttribute("src", "img/b.png");
            break;
        case 2:
            var color = "g";
            img.setAttribute("src", "img/g.png");
            break;            
        case 3:
            var color = "p";
            img.setAttribute("src", "img/p.png");
            break;
        case 4:
            var color = "r";
            img.setAttribute("src", "img/r.png");
            break;
        case 5:
            var color = "y";
            img.setAttribute("src", "img/y.png");
            break;
        }

        td.appendChild(img);
        this.board[i][j] = new Bubble(color, i, j, td);
        img.onclick = function(){bubbleBreaker.playMove(i, j)};
    }
    
    /*Remove bubble from the board*/
    this.removeBubble = function (bubble) {
        bubble.color = "n";
        bubble.htmlLocation.getElementsByTagName("img")[0].setAttribute("src", "img/n.png");
    }

    /*Fill the html document and corresponding board array with
    bubbles*/
    this.fillBoard = function () {    
       	for (var i=0; i<8; i = i + 1) {
           	var tr = document.createElement("tr");
         	this.table.appendChild(tr);

            this.board[i] = new Array();
           	for(var j=0; j<15; j = j + 1) {
               	var td = document.createElement("td");
               	tr.appendChild(td);
               	this.addBubble(td, i, j);
           	}
    	}
    }

    /*Clear the html*/
    this.clearBoard = function () {
        var len = this.table.childNodes.length;
        if(len > 1){
        for(var i = 1; i < len; i = i + 1){
            this.table.removeChild(this.table.childNodes[1]);
        }
        }
    }
    
    /*Return true is the game is over, false otherwise*/
    this.isGameOver = function () {
        for (var i = 0; i < this.board.length; i = i + 1) {
            for (var j = 0; j < this.board[i].length; j = j + 1) {
                var bubble = this.board[i][j];
                if (bubble.color != "n") {
                    if (j > 0 && bubble.color == this.board[i][j-1].color) {
                        return false;
                    }
                    else if (j < 14 && bubble.color == this.board[i][j+1].color) {
                        return false;
                    }
                    else if (i > 0 && bubble.color == this.board[i-1][j].color) {
                        return false;
                    }
                    else if (i < 7 && bubble.color == this.board[i+1][j].color) {
                        return false;
                    }
                }
            }
        }
        return true;
    }
    
    this.endGame = function() {
        this.resetStartTime();
        clearInterval(interval);
        alert("Game Over");
    }
    
    /*Process the user's click according to the game's rules*/
    this.playMove = function (i, j) {
        if(this.board[i][j].color != "n"){
            var b = this.board[i][j]; 
            if (this.isHighlighted(b)){
            /*-remove group of highlighted bubbles DONE
              -apply gravity DONE
              -reset highlighted set DONE
              -add points to score
              - see if won
            */
                this.hidePossibleScore();
                this.removeHighlightedBubbles();
                this.applyGravity();
                this.score = this.score + Math.pow(this.highlighted.length, 2);
                this.updateScore();
                this.resetHighlight();
                if (this.isGameOver()){
                    this.endGame();
                }
            }
            else{
            /*-reset highlighted set DONE
              -highlight bubbles DONE
              -show possible score
            */
                this.resetHighlight();
                this.highlight(i, j);
                this.showPossibleScore(Math.pow(this.highlighted.length, 2));
                
            }
        }
    }
    
    /*I don't know how to explain it, but it's neat stuff :)*/
    this.applyGravity = function () {
    
        var stack = this.highlighted.slice(0);
        stack.sort(function(a,b){return a.i-b.i});
        while(stack.length > 0){
            var bubble = stack.pop();
            var u = bubble.i - 1;
            while(u > 0 && this.board[u][bubble.j].color == "n"){
                u = u - 1;
            }

            if(u >= 0 && this.board[u][bubble.j].color != "n"){
                bubble.color = this.board[u][bubble.j].color;
                var img = bubble.htmlLocation.getElementsByTagName("img")[0];
                var path = "img/" + bubble.color + ".png";
                img.setAttribute("src", path);
                
                this.board[u][bubble.j].color = "n";
                img = this.board[u][bubble.j].htmlLocation.getElementsByTagName("img")[0];
                img.setAttribute("src", "img/n.png");
                
                stack.unshift(this.board[u][bubble.j]);
            }
        }
    }
    
    /*Reset highlight*/
    this.resetHighlight = function () {
        for (var i = 0; i < this.highlighted.length; i = i + 1) {
            this.highlighted[i].htmlLocation.setAttribute("style", "");
        }
        this.highlighted = new Array();
    }
    
    /*Remove bubbles in the highlighted array*/
    this.removeHighlightedBubbles = function (){
            for (var i = 0; i < this.highlighted.length; i = i +1){
                this.removeBubble(this.highlighted[i]);
            }
    }
    
    /*Check if a bubble is in the highlighted array*/
    this.isHighlighted = function (bubble) {
        for (e in this.highlighted){
            if(this.highlighted[e].i == bubble.i 
                && this.highlighted[e].j == bubble.j){
                return true;
            }
        }
        return false;
    }
    
    /*Fill the highlighted array with bubble of position i,j
    and bubbles of the same color adjacent to it*/
    this.fillHighlighted = function (i,j) {
        var bubble = this.board[i][j];
        
        if(this.isHighlighted(bubble) == false){
            this.highlighted.push(bubble);
        
            if (j > 0 && bubble.color == this.board[i][j-1].color) {
                this.fillHighlighted(i, j-1);
            }
            if (j < 14 && bubble.color == this.board[i][j+1].color) {
                this.fillHighlighted(i, j+1);
            }
            if (i > 0 && bubble.color == this.board[i-1][j].color) {
                this.fillHighlighted(i-1, j);
            }
            if (i < 7 && bubble.color == this.board[i+1][j].color) {
                this.fillHighlighted(i+1, j);
            }
        }
    }
    
    /*Highlight set of adjacent bubbles of the same color
    starting from bubble at position i,j*/
    this.highlight = function (i, j) {
        this.fillHighlighted(i, j);
        if (this.highlighted.length > 1) {
            for (var a = 0; a < this.highlighted.length; a = a + 1) {
                var b = this.highlighted[a];
                var style = "";
                
                if (b.j > 0) {
                    var c = this.board[b.i][b.j - 1];
                    if(this.isHighlighted(c) == false){
                        style = "border-left-color:white;";
                    }
                }
                else {
                    style = "border-left-color:white;";
                }
                
                if (b.j < 14) {
                    c = this.board[b.i][b.j + 1];
                    if(this.isHighlighted(c) == false){
                        style = style + "border-right-color:white;";
                    }
                }
                else {
                    style = style + "border-right-color:white;";
                }
                
                if (b.i > 0) {
                    c = this.board[b.i - 1][b.j];
                    if(this.isHighlighted(c) == false){
                        style = style + "border-top-color:white;";
                    }
                }
                else {
                    style = style + "border-top-color:white;";
                }
                
                if (b.i < 7) {
                    c = this.board[b.i + 1][b.j];
                    if(this.isHighlighted(c) == false){
                        style = style + "border-bottom-color:white;"
                    }
                }
                else {
                    style = style + "border-bottom-color:white;"
                }
                b.htmlLocation.setAttribute("style", style);
            }
        }
        else{
            this.highlighted = new Array();
        }
    }
        
    this.updateScore = function () {
        var dashboard = document.getElementById("dashboard");
        var table = dashboard.getElementsByTagName("table")[0];
        var tr = table.getElementsByTagName("tr")[1];
        var td = tr.getElementsByTagName("td")[0];
        
        td.innerHTML = "Score " + this.score;
    }
    
    this.showPossibleScore = function (score) {
        document.getElementById("possibleScore").innerHTML = "+ " + score; 
    }
    
    this.hidePossibleScore = function () {
        document.getElementById("possibleScore").innerHTML = "";        
    }
}

function timer(){
    var time = document.getElementById("time");
    var d = new Date();
    var t = new Date(d.getTime() - bubbleBreaker.startTime);
    time.innerHTML = "Time " + t.getUTCHours() + ":" + t.getUTCMinutes() + ":" 
        + t.getUTCSeconds();
}

function howto(){
    var howto = document.getElementById("howto");
    var attr = howto.getAttribute("style");
    
    if(attr == "visibility:hidden" || attr == null){
        howto.setAttribute("style","visibility:visible");
    }
    else{
        howto.setAttribute("style","visibility:hidden");
    }
}

function main(){
    bubbleBreaker = new BubbleBreaker();
}
