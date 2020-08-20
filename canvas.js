var n = 10, v = [], minimDist = Infinity, p1 = {x:0,y:0}, p2 = {x:0,y:0}, cp1 = {x:0,y:0}, cp2 = {x:0,y:0}, midLine = null;
function preload() {
    img = loadImage('avion.png');
}

function setup(){
    createCanvas(window.innerWidth, window.innerHeight);
    for (var i = 0; i < n; ++i){
        var x = Math.floor(random(window.innerWidth - 100)) + 50;
        var y = Math.floor(random(window.innerHeight - 100)) + 50;
        v.push({x:x,y:y});
    }
    v.sort((a, b) => a.x - b.x);
    minDist(v, 0, n - 1);
}

function draw(){
    background(0,191,255);
    strokeWeight(4);
    stroke("black");
    if (midLine != null){
        line(midLine, 0, midLine, height);
    }
    line(cp1.x, cp1.y, cp2.x, cp2.y);
    stroke('rgb(0,100,0)');
    line(p1.x, p1.y, p2.x, p2.y);
    strokeWeight(1);
    stroke("black");
    for (let i = 0; i < n; ++i){
        imageMode(CENTER);
        image(img, v[i].x, v[i].y, 25, 25);
        textSize(14);
        text('(' + v[i].x + ',' + v[i].y + ')', v[i].x, v[i].y - 20);
    }
}


async function calcDist(a, b){
    await sleep(200);
    return (a.x - b.x) * (a.x - b.x) + (a.y - b.y) * (a.y - b.y);
}

function resetChecking(){
    cp1 = {x:0,y:0};
    cp2 = {x:0,y:0};
    workingArea = {x1:0,y1:0,x2:0,y2:0};
    midLine = null;
}

async function Merge(v, st, dr){
    var mid = Math.floor((st + dr) / 2);
    var i = st, j = mid + 1;
    var aux = [];
    while (i <= mid && j <= dr){
        if (v[i].y < v[j].y){
            aux.push(v[i++]);
        }
        else{
            aux.push(v[j++]);
        }
    }
    while (i <= mid){
        aux.push(v[i++]);
    }
    while (j <= dr){
        aux.push(v[j++]);
    }
    for (i = st, j = 0; i <= dr; ++i, ++j){
        v[i] = aux[j];
    } 
}

async function minDist(v, st, dr){
    if (dr - st + 1 == 3){
        cp1 = v[st];
        cp2 = v[st + 1];
        var dist1 = await calcDist(v[st], v[st + 1]);
        if (dist1 < minimDist){
            minimDist = dist1;
            p1 = v[st];
            p2 = v[st + 1];
        }
        cp1 = v[st];
        cp2 = v[dr];
        var dist2 = await calcDist(v[st], v[dr]);
        if (dist2 < minimDist){
            minimDist = dist2;
            p1 = v[st];
            p2 = v[dr];
        }
        cp1 = v[st + 1];
        cp2 = v[dr];
        var dist3 = await calcDist(v[st + 1], v[dr]);
        if (dist3 < minimDist){
            minimDist = dist3;
            p1 = v[st + 1];
            p2 = v[dr];
        }
        resetChecking();
    }
    else if (dr - st + 1 == 2){
        cp1 = v[st];
        cp2 = v[dr];
        var dist1 = await calcDist(v[st], v[dr]);
        if (dist1 < minimDist){
            minimDist = dist1;
            p1 = v[st];
            p2 = v[dr];
        }
        resetChecking();
    }
    else{
        var mid = Math.floor((st + dr) / 2);
        var midX = v[mid].x, stX = v[st].x, drX = v[dr].x;
        await minDist(v, st, mid);
        await minDist(v, mid + 1, dr);
        workingArea = {x1: stX, y1: 0, x2: drX, y2: window.innerHeight};
        await Merge(v, st, dr);
        midLine = midX;
        var aux = [];
        for (let i = st; i <= dr; ++i){
            cp1 = v[i];
            cp2 = {x : midX, y: v[i].y};
            var d = await calcDist({x : v[i].x, y : 0}, {x : midX, y : 0});
            if (d < minimDist){
                aux.push(v[i]);
            }
        }
        for (let i = 0; i < aux.length; ++i){
            for (let j = i + 1; j < aux.length && j - i + 1 <= 8; ++j){
                cp1 = aux[i];
                cp2 = aux[j];
                var d = await calcDist(aux[i], aux[j]);
                if (d < minimDist){
                    minimDist = d;
                    p1 = aux[i];
                    p2 = aux[j];
                }
            }
        }
    }
    resetChecking();
}
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}