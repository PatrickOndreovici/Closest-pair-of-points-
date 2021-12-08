let numberOfPlanes = 10
let p1 = {x:0,y:0}, p2 = {x:0,y:0}
let  minimDist = Infinity
let planesPosition = []
let index = -1
function preload() {
    img = loadImage('avion.png');
}

function setup(){
    createCanvas(window.innerWidth, window.innerHeight);
    for (var i = 0; i < numberOfPlanes; ++i){
        var x = Math.floor(random(window.innerWidth - 100)) + 50;
        var y = Math.floor(random(window.innerHeight - 100)) + 50;
        planesPosition.push({x:x,y:y,index:i});
    }
    planesPosition.sort((a, b) => a.x - b.x);
    minDist(planesPosition, 0, numberOfPlanes - 1);
}

function draw(){
    minimDist = Infinity
    planesPosition.sort((a, b) => a.x - b.x);
    minDist(planesPosition, 0, numberOfPlanes - 1);
    background(0,191,255);
    strokeWeight(4);
    stroke('rgb(0,100,0)');
    line(p1.x, p1.y, p2.x, p2.y);
    strokeWeight(1);
    stroke("black");
    move(index)
    for (let i = 0; i < numberOfPlanes; ++i){
        imageMode(CENTER);
        image(img, planesPosition[i].x, planesPosition[i].y, 25, 25);
        textSize(14);
        text('(' + planesPosition[i].x + ',' + planesPosition[i].y + ')', planesPosition[i].x, planesPosition[i].y - 20);
    }
}

function mouseClicked() {
    console.log("DA")
    if (index != -1){
        index = -1
    }
    else{
        let dist = Infinity
        let newIndex = -1
        for (let i = 0; i < planesPosition.length; ++i){
            let newDist = calcDist(planesPosition[i], {x: mouseX, y: mouseY})
            if (newDist < dist){
                dist = newDist
                newIndex = planesPosition[i].index
            }
        }
        if (dist <= 100 && newIndex != -1){
            index = newIndex
        }
    }
  }

function calcDist(a, b){
    return (a.x - b.x) * (a.x - b.x) + (a.y - b.y) * (a.y - b.y);
}

function move(index){
    if (index == -1){
        return
    }
    let pos
    for (let i = 0; i < planesPosition.length; ++i){
        if (planesPosition[i].index == index){
            pos = i 
            break
        }
    }
    planesPosition[pos].x = mouseX
    planesPosition[pos].y = mouseY
}


function Merge(v, st, dr){
    var mid = Math.floor((st + dr) / 2);
    var i = st, j = mid + 1;
    var aux = [];
    while (i <= mid && j <= dr){
        if (planesPosition[i].y < planesPosition[j].y){
            aux.push(planesPosition[i++]);
        }
        else{
            aux.push(planesPosition[j++]);
        }
    }
    while (i <= mid){
        aux.push(planesPosition[i++]);
    }
    while (j <= dr){
        aux.push(planesPosition[j++]);
    }
    for (i = st, j = 0; i <= dr; ++i, ++j){
        planesPosition[i] = aux[j];
    } 
}


function minDist(v, st, dr){
    if (dr - st + 1 <= 3){
       for (let i = st; i < dr; ++i){
           for (let j = i + 1; j <= dr; ++j){
               let newDist = calcDist(planesPosition[i], planesPosition[j])
               if (newDist < minimDist){
                   minimDist = newDist
                   p1 = planesPosition[i]
                   p2 = planesPosition[j]
               }
           }
       }
    }
    else{
        var mid = Math.floor((st + dr) / 2);
        var midX = planesPosition[mid].x, stX = planesPosition[st].x, drX = planesPosition[dr].x;
        minDist(planesPosition, st, mid);
        minDist(planesPosition, mid + 1, dr);
        workingArea = {x1: stX, y1: 0, x2: drX, y2: window.innerHeight};
        Merge(planesPosition, st, dr);
        midLine = midX;
        var aux = [];
        for (let i = st; i <= dr; ++i){
            var dist = calcDist({x : planesPosition[i].x, y : 0}, {x : midX, y : 0});
            if (dist < minimDist){
                aux.push(planesPosition[i]);
            }
        }
        for (let i = 0; i < aux.length; ++i){
            for (let j = i + 1; j < aux.length && j - i + 1 <= 8; ++j){
                var newDist = calcDist(aux[i], aux[j]);
                if (newDist < minimDist){
                    minimDist = newDist;
                    p1 = aux[i];
                    p2 = aux[j];
                }
            }
        }
    }
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}