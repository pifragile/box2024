let pg;
let cs = isRendering ? 8000 : 4000;
let cs2 = cs * 0.5;


function draw() {
    seedRandomness();
    pg.clear();
    drawArt();
    setImage();
}

function keyPressed() {
    if (keyCode === LEFT_ARROW) {
        save();
    }
}

function windowResized() {
    setImage();
}

function setup() {
    noLoop();
    is = min(windowHeight, windowWidth);
    createCanvas(is, is, WEBGL);
    pg = createGraphics(cs, cs);
    pg.colorMode(HSB);
    pg.pixelDensity(1);
}

function setImage() {
    clear();
    is = min(windowHeight, windowWidth);
    resizeCanvas(is, is);

    shader(myShader)
    myShader.setUniform("u_resolution", [is, is]);
    myShader.setUniform("u_background", pg);
    myShader.setUniform("u_pixeldensity", pixelDensity());
    rect(0, 0, cs, cs);
}


function preload() {
    myShader = loadShader("shader.vert", "shader.frag");
}
let myShader;

let palettes = [
    "https://coolors.co/f8dbbb-0065bd-ffb700-e02d26",
     "https://coolors.co/ebe7dc-ed4316-0d52da-f399bf-0c8d55-f3be0b",
];

let permutePalettes = true;

let backgroundColor;
let GR = 0.61803398875;

// palette
let palette;
function setPalette() {
    if (palettes.length > 0) {
        palette = randomElem(palettes, random1ofx);
        palette = palette
            .split("https://coolors.co/")[1]
            .split("-")
            .map((x) => pg.color(`#${x}`));
        if (permutePalettes) palette = shuffleArr(palette, random1ofx);
    }
}

////////////////////
//////Sketch
////////////////////


//params
// 0: num boxes
// 1: palette & permutation
// 2: pattern
// 3 num split
// 4: split permutation
function cornerVertex(corner) {
    pg.vertex(corner.x, corner.y);
}
let s;
let m0, m1, m2, m3, m4;
function drawArt() {
        setPalette();
        random1ofx()        
        random1ofx()
        random1ofx()
        m0 = random1ofx()
        m1 = random1ofx()
        m2 = random1ofx()
        m3 = random1ofx()
        m4 = random1ofx()
        pg.strokeWeight(0.0005 * cs)
        pg.strokeWeight(0)
        let b = new Box(0, 0, cs, cs);
        pg.stroke(palette[0]);
        pg.fill(palette[0]);
        b.rect();
        b = b.subBox(0.8);
        s = (Math.floor(m0 * 6) + 1) * 2;
        grid = b.gridify(s, s);
        const pal = palette.slice(1);
        splitBox(b, Math.floor(random1ofx() * 2), palette);
        const palFs = [
            (i, j) => 0,
            (i, j) => i + j,
            (i, j) => i,
            (i, j) => j,
            (i, j) => (j / 2) % 2,
            (i, j) => Math.floor(i / 2) % 2,
            (i, j) => Math.floor((j + i) / 2) % 2,
            (i, j) => ((i + j) % s < s / 2 ? 1 : 0),
            (i, j) => (Math.floor(Math.abs(i - s * 0.5)) > s * 0.24 ? 0 : 1),
            (i, j) => (Math.floor(Math.abs(j + 1 - s * 0.5)) > s * 0.2 ? 0 : 1),
            (i, j) =>
                Math.floor(Math.abs(i - s * 0.5)) > s * 0.2 &&
                Math.floor(Math.abs(j + 1 - s * 0.5)) > s * 0.2
                    ? 0
                    : 1,
            (i, j) =>
                Math.floor(Math.abs(i - s * 0.5)) > s * 0.25 ||
                Math.floor(Math.abs(j + 1 - s * 0.5)) > s * 0.25
                    ? 0
                    : 1,
            (i, j) => Math.floor(random1ofx()) * pal.length,
        ];
        const palF = linearElem(palFs, m1);
        for (let i = 0; i < grid.length; i++) {
            const row = grid[i];
            for (let j = 0; j < row.length; j++) {
                if (i % 2 === 1 && j % 2 === 0) {
                    let sb = grid[i][j];
                    let sbShadow = grid[i - 1][j + 1];
                    let col = pal[palF(i, j) % pal.length];
                    pg.fill(col);
                    pg.stroke(col);
                    sb.rect();
                    // if(i === splitX && j === splitY) {
                    //     splitBox(sb, 7, palette.slice(1))
                    // }

                    pg.fill(0);
                    pg.stroke(0);
                    pg.beginShape();
                    cornerVertex(sb.tl);
                    cornerVertex(sbShadow.tl);
                    cornerVertex(sbShadow.bl);
                    cornerVertex(sbShadow.br);
                    cornerVertex(sb.br);
                    cornerVertex(sb.bl);
                    cornerVertex(sb.tl);
                    pg.endShape();
                }
            }
        }
}

function shuffleArr(array, rand) {
    array = [...array];
    let currentIndex = array.length,
        randomIndex;
    while (currentIndex != 0) {
        randomIndex = Math.floor(rand() * currentIndex);
        currentIndex--;

        [array[currentIndex], array[randomIndex]] = [
            array[randomIndex],
            array[currentIndex],
        ];
    }
    return array;
}

function randomElem(array, rand) {
    return array[Math.floor(rand() * array.length)];
}

function linearElem(array, val) {
    return array[Math.floor(val * array.length)];
}

Box = class {
    constructor(x, y, w, h) {
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
        this.c = createVector(x + w * 0.5, y + h * 0.5);
        this.tl = createVector(x, y);
        this.tr = createVector(x + w, y);
        this.br = createVector(x + w, y + h);
        this.bl = createVector(x, y + h);
        this.tc = createVector(x + w * 0.5, y);
        this.rc = createVector(x + w, y + h * 0.5);
        this.bc = createVector(x + w * 0.5, y + h);
        this.lc = createVector(x, y + h * 0.5);
    }
    gridify(gridWidth, gridHeight) {
        let grid = [];
        let boxWidth = this.w / gridWidth;
        let boxHeight = this.h / gridHeight;

        for (let i = 0; i < gridWidth; i++) {
            grid.push([]);
            for (let j = 0; j < gridHeight; j++) {
                grid[i].push(
                    new Box(
                        this.x + boxWidth * i,
                        this.y + boxHeight * j,
                        boxWidth,
                        boxHeight
                    )
                );
            }
        }
        return grid;
    }
    randomPoint(rand) {
        return createVector(this.x + rand() * this.w, this.y + rand() * this.h);
    }

    coords(xRatio, yRatio) {
        return [this.xc(xRatio), this.yc(yRatio)];
    }

    xc(ratio) {
        return this.x + this.w * ratio;
    }

    yc(ratio) {
        return this.y + this.h * ratio;
    }

    mirrorH() {
        let img = pg.get(
            Math.floor(this.x),
            Math.floor(this.y),
            Math.ceil(this.w),
            Math.ceil(this.h)
        );
        pg.push();
        pg.scale(-1, 1);
        pg.translate(-(2 * Math.ceil(this.x) + Math.floor(this.w)), 0);
        pg.image(
            img,
            Math.floor(this.x),
            Math.floor(this.y),
            Math.ceil(this.w),
            Math.ceil(this.h)
        );
        pg.pop();
    }

    mirrorV() {
        let img = pg.get(
            Math.floor(this.x),
            Math.floor(this.y),
            Math.ceil(this.w),
            Math.ceil(this.h)
        );
        pg.push();
        pg.scale(1, -1);
        pg.translate(0, -(2 * Math.floor(this.y) + Math.ceil(this.h)));
        pg.image(
            img,
            Math.floor(this.x),
            Math.floor(this.y),
            Math.ceil(this.w),
            Math.ceil(this.h)
        );
        pg.pop();
    }

    rotate(rotation) {
        let img = pg.get(this.x, this.y, this.w, this.h);
        pg.push();
        pg.translate(this.c.x, this.c.y);
        pg.rotate(rotation * PI * 0.5);
        pg.translate(-this.c.x, -this.c.y);
        pg.image(img, this.x, this.y, this.w, this.h);
        pg.pop();
    }

    rect() {
        pg.rect(this.x, this.y, this.w, this.h);
    }

    subBox(ratio) {
        const ratio2 = (1 - ratio) * 0.5;
        return new Box(
            this.x + ratio2 * this.w,
            this.y + ratio2 * this.h,
            ratio * this.w,
            ratio * this.h
        );
    }

    subBoxRect() {
        if (this.w > this.h) {
            const diff = this.w - this.h;
            return new Box(this.x + diff * 0.5, this.y, this.w - diff, this.h);
        } else {
            const diff = this.h - this.w;
            return new Box(this.x, this.y + diff * 0.5, this.w, this.h - diff);
        }
    }

    triangle2(oriantation) {
        switch (oriantation) {
            case "tl":
                vecTriangle(this.tl, this.tr, this.bl);
                break;
            case "tr":
                vecTriangle(this.tl, this.tr, this.br);
                break;
            case "br":
                vecTriangle(this.br, this.tr, this.bl);
                break;
            case "bl":
                vecTriangle(this.bl, this.tl, this.br);
                break;
        }
    }

    triangle4(oriantation) {
        switch (oriantation) {
            case "l":
                vecTriangle(this.tl, this.bl, this.c);
                break;
            case "t":
                vecTriangle(this.tl, this.tr, this.c);
                break;
            case "r":
                vecTriangle(this.tr, this.br, this.c);
                break;
            case "b":
                vecTriangle(this.bl, this.br, this.c);
                break;
        }
    }

    circle(r) {
        pg.circle(this.c.x, this.c.y, r * Math.min(this.w, this.h));
    }
};

function splitBox(b, depth, colors) {
    if (depth == 0) {
        c = colors[Math.floor(random1ofx() * colors.length)];
        pg.fill(c);
        pg.stroke(c);
        b.rect();
    } else {
        var d = depth - 1;
        gr = 0.5;
        let offset = Math.round(m2)
        if (offset) {
            // vertical split
            var s = gr * b.w;
            splitBox(new Box(b.x + s, b.y, b.w - s, b.h), d, colors);
            splitBox(new Box(b.x, b.y, s, b.h), d, colors);
        } else {
            // horizontal split
            var s = gr * b.h;
            splitBox(new Box(b.x, b.y + s, b.w, b.h - s), d, colors);
            splitBox(new Box(b.x, b.y, b.w, s), d, colors);
        }
    }
}