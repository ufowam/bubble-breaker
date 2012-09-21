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

	/*attributes*/
    this.score = 0;
    this.startTime = 0;
    this.board = new Array();
    this.highlighted = new Array();
    this.removed = new Array();
    this.table = document.getElementById("board");

    /*methods*/

    this.init = function () {
        this.clearBoard();
        this.fillBoard();
        this.resetStartTime();
        this.resetHighlight();
        interval = setInterval(function(){timer()}, 1000);
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
            img.setAttribute("src", "img/b.svg");
            break;
        case 2:
            var color = "g";
            img.setAttribute("src", "img/g.svg");
            break;            
        case 3:
            var color = "p";
            img.setAttribute("src", "img/p.svg");
            break;
        case 4:
            var color = "r";
            img.setAttribute("src", "img/r.svg");
            break;
        case 5:
            var color = "y";
            img.setAttribute("src", "img/y.svg");
            break;
        }

        td.appendChild(img);
        this.board[i][j] = new Bubble(color, i, j, td);
        img.onclick = function(){bubbleBreaker.processClick(i, j)};
    }
    
    /*Remove bubble from the board*/
    this.removeBubble = function (bubble) {
        bubble.color = "n";
        bubble.htmlLocation.getElementsByTagName("img")[0].setAttribute("src", "img/n.svg");
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
    
    /*Process the user's click according to the game's rules*/
    this.processClick = function (i, j) {
        if(this.board[i][j].color != "n"){
            var b = this.board[i][j]; 
            if (this.isHighlighted(b)){
            /*-remove group of highlighted bubbles DONE
              -apply gravity DONE
              -reset highlighted set DONE
              -add points to score
            */
                this.removeHighlightedBubbles();
                this.applyGravity();
                this.resetHighlight();
            }
            else{
            /*-reset highlighted set DONE
              -highlight bubbles DONE
              -show possible score
            */
                this.resetHighlight();
                this.highlight(i, j);
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
                var path = "img/" + bubble.color + ".svg";
                img.setAttribute("src", path);
                
                this.board[u][bubble.j].color = "n";
                img = this.board[u][bubble.j].htmlLocation.getElementsByTagName("img")[0];
                img.setAttribute("src", "img/n.svg");
                
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
            if(this.highlighted[e].i == bubble.i && this.highlighted[e].j == bubble.j){
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
}

function timer(){
    var dashboard = document.getElementById("dashboard");
    var table = dashboard.getElementsByTagName("table")[0];
    var tr = table.getElementsByTagName("tr")[0];
    var td = tr.getElementsByTagName("td")[0];
    var d = new Date();
    var t = new Date(d.getTime() - bubbleBreaker.startTime);
    td.innerHTML = "Time " + t.getUTCHours() + ":" + t.getUTCMinutes() + ":" + t.getUTCSeconds();
}

function main(){
    bubbleBreaker = new BubbleBreaker();
}
