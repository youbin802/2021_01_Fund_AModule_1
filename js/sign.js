class sign 
{
    constructor() {
        this.canvas = document.querySelector("#popup canvas");
        this.ctx = this.canvas.getContext("2d");
        this.isDraw = false; 
        this.addEvent();
        this.start = {x:0, y:0};
        this.isSigned = false;
    }

    addEvent(){
        const c = this.canvas;
        const El = document.querySelector("#setWidth");
        El.addEventListener("change", this.lineTo);
        c.addEventListener("mousedown", this.startDraw);
        c.addEventListener("mousemove", this.drawMove);
        c.addEventListener("mouseup", this.endDraw);
        c.addEventListener("mouseout",this.over);
    }

    lineTo=e=> {
        this.ctx.lineWidth= e.target.value;
    }

    over =e=> {
        this.isDraw = false;
    }

    startDraw = e => {
        this.isDraw = true;
        const {offsetX:x, offsetY: y} = e;
        this.start = {x, y};
        
    }

    drawMove = e => {
        if(!this.isDraw) return;
        const {offsetX:x, offsetY: y} = e;
        const s = this.start;
        this.ctx.beginPath();
        this.ctx.moveTo(s.x, s.y);
        this.ctx.lineTo(x, y);
        this.ctx.stroke();
        this.start = {x,y};
        this.isSigned = true;
    }

    reset(){
        this.ctx.clearRect(0, 0, 660, 100);
        this.ctx.lineWidth=1;
        $("#setWidth option:eq(0)").prop("selected", true);
    }

    getImage(){
        return this.canvas.toDataURL();
    }
}