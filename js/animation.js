class animation{
    constructor(bar, data){
        this.fundData = data; //펀드 데이터
        this.startDraw();
        this.bar =bar;
    }

    startDraw() {
        let step = this.fundData.percent / 30;
        let now = 0;
        const timer = setInterval(() => {
            this.render(now);
            now += step;
            if(now >= this.fundData.percent){
                now = this.fundData.percent;
                this.render(now);
                clearInterval(timer);
            }
        }, 1000/30);
    }

    render(value) {
        value = Math.round(value*100)/100;
        this.bar.style.width=`${value}%`
    }
}