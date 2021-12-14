const log = console.log;
class App {
    constructor() {
        this.addEvent();
        this.getJson();
        this.fundList=[]; //펀드 리스트
        this.invlist=[]; //투자자 리스트
        this.invdup=[]; //중복 제거 투자자 리스트
        this.page=0;
        this.fundPage=1;
        this.invPage=1;
        this.sign = new sign();
        this.moneyvalue=false;
    }
    
    menuClick = e =>{   //페이지 이동
        const menuIdx=e.target.dataset.idx;
        if(menuIdx== this.page ) {
            return;
        }
        this.page = menuIdx;
        let el = document.querySelector(".menu-page");
        let h=el.offsetHeight //현재 페이지 높이
        let re = h*menuIdx;
        window.scrollTo({
            top: re,
            left: 0,
            behavior: 'smooth'
        });
        this.drawPage();
    }
    
    getJson() { 
        fetch('js/fund.json')
        .then(res =>res.json())
        .then(json => {
            this.fundList=json;
            this.makePercent();
            this.getUser();
            this.drawPage();
        })
    }
    
    getUser() { //투자자목록 
        this.fundList.map(f => {
            f.investorList.forEach(item => {
                item.total = f.total;
                item.name = "홍길동";
                item.fundName = f.name;
                item.number = f.number;
                item.percent = item.pay / f.total * 100;
                this.invlist.push(item);
            });
            return f;
        });
        this.clearUser();
    }
    
    clearUser() {//중복
        this.invlist.forEach(f => {
            let user = this.invdup.find(e => e.number == f.number && e.email == f.email);
            if (user != undefined) {
                user.pay += f.pay;
            } else {
                const { email, pay, datetime, name,fundName, number,percent,total } = f;
                this.invdup.push({ email, pay, datetime, name,fundName, number,percent,total });
            }
        });
        this.invdup.sort((a, b) => new Date(b.datetime) - new Date(a.datetime));
    }
    
    makePercent() { 
        this.fundList = this.fundList.map(f => {
            f.percent = f.current / f.total * 100;
            return f;
        }).sort((a, b) => b.percent - a.percent);
    }
    
    mainFund() {
        const now = new Date();
        let count=0;
        let drawList=[];
        drawList = this.fundList.filter(f => {
            if(count >=4 ){
                return false;
            }
            const day= new Date(f.endDate);
            if(day > now){
                count++;
                return true;
            }
        });
        
        const el = document.querySelector('#fundMain');
        el.innerHTML="";
        drawList.forEach(f => {
            const div = document.createElement("div");
            const current = f.current.toLocaleString();
            div.classList.add("fBox");
            div.innerHTML=`
            <div class="info">
            <p title="${f.number}">${f.number}</p>
            <p title="${f.name}">${f.name}</p>
            <p title="${f.endDate}">${f.endDate}</p>
            <p title="${current}">${current}</p>
            <p title="${f.percent}">${f.percent}</p>
            <button id="btn" value="${f.number}">상세보기</button>
            <div class="progress">
            <div class="progress-bar role="progressbar" aria-valuenow="75" aria-valuemin="0" aria-valuemax="100" style="width:0"></div>
            </div>
            </div>
            `;
            let bar = div.querySelector(".progress-bar");
            new animation(bar,f);
            const btn = div.querySelector("#btn");
            btn.addEventListener("click", e=> {
                let number =btn.value;
                this.invdup.forEach( item=>{
                    if(item.number === number) {
                        new invPopup(item);
                    }
                })
            })
            el.appendChild(div);
        });
    }
    
    
    flClick =e=> { //이전
        let  p= this.fundPage;
        if(0 >=p-1) return;
        this.fundPage =p-1;
        this.fpgNum();
    }
    
    frClick =e=> { //다음
        let  p= Number(this.fundPage);
        let pa =Math.ceil(this.fundList.length/10);
        if(p+1 >pa) return;
        this.fundPage =p+1;
        this.fpgNum();
    }
    
    LlClick =e=> { //이전
        let  p= this.invPage;
        if(0 >=p-1) return;
        this.invPage =p-1;
        this.lpgNum();
    }
    
    LrClick =e=> { //다음
        let  p= Number(this.invPage);
        let pa =Math.ceil(this.invlist.length/5);
        if(p+1 >pa) return;
        this.invPage =p+1;
        this.lpgNum();
    }
    
    fpgNum() { //펀드보기 페이징
        let b=0;
        if((this.fundPage-1)%3==0) {
            let a = this.fundPage-1;
            for(let i=a; i<=a+3; i++) {
                $(".fund-btn p").eq(b).html(i+1);
                b++;
            }
        }
        if((this.fundPage+1)%3==0) {
            let a = this.fundPage+1;
            for(let i=a-3; i<=a; i++) {
                $(".fund-btn p").eq(b).html(i+1);
                b++;
            }
        }
        this.drawrFund();
    }
    
    lpgNum() { //투자자목록 페이징
        let b=0;
        if((this.invPage-1)%3==0) {
            let a = this.invPage-1;
            for(let i=a; i<=a+3; i++) {
                $(".list-btn p").eq(b).html(i+1);
                b++;
            }
        }
        if((this.invPage+1)%3==0) {
            let a = this.invPage+1;
            for(let i=a-3; i<=a; i++) {
                $(".list-btn p").eq(b).html(i+1);
                b++;
            }
        }
        this.selectOP();
    }
    
    drawrFund() {
        const list = document.querySelector(".fund-list .con");
        list.innerHTML="";
        
        let pg = this.fundPage-1;
        let ing = this.fundList.length-pg*10;
        if(ing >10) {
            ing =10;
        }
        
        for(let a = pg*10; a<pg*10+ing; a++) {
            const div = document.createElement("div");
            div.classList.add("fund");
            let f= this.fundList[a];
            const fCurrent =f.current;
            const fTotal = f.total;
            const leg = fCurrent +"/" +fTotal;
            div.innerHTML = `
            <div class="info">
            <p title="${f.number}">${f.number}</p>
            <p title="${f.name}">${f.name}</p>
            <div class="progress">
            <div class="progress-bar role="progressbar" aria-valuenow="75" aria-valuemin="0" aria-valuemax="100" style="width:0%"></div>
            </div>
            <p title="${leg}">${leg}</p>
            <p title="${f.endDate}">${f.endDate}</p>
            <p title="${f.percent}">${f.percent}</p>
            <button id="open" value="${f.number}">상세보기</button>
            <div class="menu-bar">
            </div>`;
            let bar = div.querySelector(".progress-bar");
            new animation(bar,f);
            const btn = div.querySelector("#open");
            btn.addEventListener("click", e=> {
                let number=btn.value;
                this.invdup.forEach( item=>{
                    if(item.number === number) {
                        new invPopup(item);
                    }
                })
                
            })
            const popup = document.querySelector("#popup");
            const menuBar = div.querySelector(".menu-bar");
            const now = new Date();
            const d = new Date(f.endDate);
            if(now > d) {
                menuBar.innerHTML = "<h4>모집완료</h4>";
            }else {
                menuBar.innerHTML=`<button id="next">투자하기</button>`;
                div.querySelector("#next").addEventListener("click", e=> {
                    this.sign.reset();
                    this.valueCheck();
                    popup.classList.add("active");
                    popup.querySelector("#fnumber").value= f.number;
                    popup.querySelector("#fname").value= f.name;
                    popup.querySelector("#iname").value= "홍길동";

                    popup.querySelector("#close").addEventListener("click",e=> {
                        popup.classList.remove("active");
                        popup.querySelector("#money").value="";
                    })
                    popup.querySelector("#submit").addEventListener("click",e=> {
                        popup.classList.remove("active");
                        popup.querySelector("#money").value="";
                    })
                })
            }
            list.appendChild(div);
        }
    }
    

    selectOP=e=> {
        let arr = this.selectopion();
        
        const dom = document.querySelector(".inv-list");
        dom.innerHTML = "";
        let pg = this.invPage-1;
        let ing = arr.length-pg*5;
        if(ing >5) {
            ing = 5;
        }
        
        for(let a = pg*5; a<pg*5+ing; a++) {
            let i= arr[a];
            const div = document.createElement("div");
            div.classList.add("inv");
            const f= this.fundList;
            this.pervalue =Math.ceil(f.pay / f.total * 10000) / 100;
            div.innerHTML = `
            <p title="${i.number}">${i.number}</p>
            <p title="${i.fundName}">${i.fundName}</p>
            <p title="${i.name}">${i.name}</p>
            <p title="${i.pay}">${i.pay}</p>
            <div class="progress">
            <div class="progress-bar role="progressbar" aria-valuenow="75" aria-valuemin="0" aria-valuemax="100" style="width:${i.percent}%"></div>
            </div>
            <p title="${i.percent}%">${i.percent}%</p>
            `;
            dom.appendChild(div);
        }
    }
    
    selectopion() {
        let target = document.querySelector("#select");
        let val = target.options[target.selectedIndex].value;
        let arr=[];
        this.invdup.forEach(f => {
            arr.push(f);
        })
        if(val=="number") {
            arr.sort((a, b) => {
                return b.number > a.number ?  -1: b.number == a.number ?0 :-1;
            });
        }
        else if(val="name") {
            arr.sort((a, b) => {
                return b.name > a.name ?  -1: b.name == a.name ?0 :-1;
            }); 
        }
        else if(val="datetime") {
            this.invdup.sort((a, b) => new Date(b.datetime) - new Date(a.datetime));               
        }
        return arr;
    }
    
    valueCheck() {
        $("#money").on("input",  (e) => {
            const number= document.querySelector("#fnumber").value;
            const list = this.fundList.find(x=>x.number === number);
            let max=list.total;
            let value = e.currentTarget.value;
            value = (value.replaceAll(/[^0-9]/g, "") * 1).toLocaleString();
            if (value * 1 >= max) {
                value = max;
                value = (value.toString().replaceAll(/[^0-9]/g, "") * 1).toLocaleString();
            }
            e.currentTarget.value = value;
            this.moneyvalue= true;
        });
    }

    
    register() {
        let ch1 = /[0-9]/;
        let ch2 = /[a-zA-Z]/;
        let ch3= /[~!@#$%^&*()_+|<>?:{}]/;
        let ch4= /[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/;
        let ch5= /^[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*@[a-z]{1,2}\.[a-z]{1,3}$/;
        let emailMsg =$("#emailMsg");
        let logMsg =$("#lnameMsg");
        let passMsg =$("#pMsg");
        let passchMsg =$("#pcMsg");
        
        let email = $("#email").val();
        let name = $("#lname").val();
        let  pass= $("#Pass").val();
        let  passch= $("#passc").val();
        
        $("#email").on("input", function() {
            email = $(this).val();
        })
        
        $("#lname").on("input", function() {
            name = $(this).val();
        })
        
        $("#pass").on("input", function() {
            pass = $(this).val();
        })
        
        $("#passc").on("input", function() {
            passch = $(this).val();
        })
        
        $("#email").blur(function() {
            if(email=="") {
                emailMsg.html("필수 정보입니다.");
                $("#emailIcon").css('color','red');
            }
            else if(email.match(ch5)==null) {
                emailMsg.html("이메일 형식이 올바르지 않습니다.");
                $("#emailIcon").css('color','red');
            }else {
                emailMsg.html("");
                $("#emailIcon").css('color','green');
            }
        })
        
        $("#lname").blur(function() {
            if(name=="") {
                logMsg.html("필수 정보입니다.");
                $("#nameIcon").css('color','red');
            }else {
                logMsg.html("");
                $("#nameIcon").css('color','green');
            }
        })
        
        $("#pass").blur(function() {
            if(pass=="") {
                passMsg.html("필수 정보입니다.");
                $("#pIcon").css('color','red');
            }else if(!(ch1.test(pass)) || !(ch2.test(pass)) || !(ch3.test(pass)) || ch4.test(pass)) {
                passMsg.html("영문 특문 숫자");
                $("#pIcon").css('color','red');
            }else {{
                passMsg.html("");
                $("#pIcon").css('color','green');
            }}
        })
        $("#passc").blur(function() {
            if(passch=="") {
                $("#pcIcon").css('color','red');
                passchMsg.html("필수 정보입니다.");
                
            }else if(passch!= pass) {
                passchMsg.html("불일치");
                $("#pcIcon").css('color','red');
            }else {{
                passchMsg.html("");
                $("#pcIcon").css('color','green');
            }}
        })
        document.querySelector("#join").addEventListener("click", e=> { 
            if( email=="" || name=="" || pass=="" || passch=="" ) {
                this.toastform("안됨join");
            }else if( !emailMsg.text()=="" || !logMsg.text()=="" || !passMsg.text()=="" || !passchMsg.text()=="") {
                this.toastform("안됨dd");
            }else {
                alert("가입완료");
            }
        });
    }
    
    toastform(text) {
        log("happen");
        let $elem = $("<div class='toastWrap'>" + text + "<b></b></div>");
        $("#toast").prepend($elem); 
        $elem.slideToggle(100, function() {
            let a=0;
            const timer=setInterval(() => {
                a++;
                $('.timerWrap', this).first().outerWidth($elem.find('.toast').first().outerWidth() - 10);
                if(a>=3) {
                    clearInterval(timer);
                    $elem.fadeOut(function() {
                        $(this).remove();
                    });
                }
            }, 1000);
        });
        $("#toast").on("click", "b", function() {
            $(this).closest('.toastWrap').remove();
        })
    }
    
    submit() {
        $("#total").on("input", (e) => {
            let value = e.currentTarget.value;
            value = (value.replaceAll(/[^0-9]/g, "") * 1).toLocaleString();
            e.currentTarget.value = value;
        });
        
        let endTime=document.querySelector("#endDate").value;
        let name =$("#name").val();
        let total=$("#total").val();
        let expl=$("#expl").val();
        let img=$("#file").val()
        
        let nameMsg =  $("#nameMsg");
        let timeMsg  = $("#dateMsg");
        let totalMsg = $("#totalMsg");
        let fileMsg  = $("#fileMsg");
        let exMsg   = $("#exMsg");
        
        document.querySelector("#endDate").addEventListener("input",e=> {
            const now = new Date();
            const d = new Date(e.target.value);
            endTime = d;
            if(now>d) {
                timeMsg.html("이전 날짜 불가능");
                $("#dateIcon").css('color','red');
            }else {
                timeMsg.html("");
                $("#dateIcon").css('color','green');
            }
        });
        document.querySelector("#file").addEventListener("input",e=> {
            let fileSize = document.querySelector("#file").files[0].size;
            if((e.target.value.slice(-3) == "png" || e.target.value.slice(-3) == "jpg")&& fileSize <= 5 * 1024 * 1024 ) {
                fileMsg.html("");
                img= e.target.value;
                
                $("#fileIcon").css('color','green');
            }else {
                e.target.value = "";
                fileMsg.html("첨부파일 사이즈는 5MB 이내로 등록 가능합니다.");
                $("#fileIcon").css('color','red');
            }
        });  
        
        let ch=/^[가-힣a-zA-Z\s]+$/;
        
        $("#name").on("input", function() {
            name = $(this).val();
        })
        
        $("#total").on("input", function() {
            total = $(this).val();
        })
        
        $("#expl").on("input", function() {
            expl = $(this).val();
            if(expl.length>499) {
                exMsg.html("500자 초과되면 입력할 수 없습니다.");
            }
        })
        $("#name").blur(function() {
            if(name=="") {
                nameMsg.html("필수 정보입니다.");
                $("#fnameIcon").css('color','red');
            }else if(!ch.test(name)) {
                nameMsg.html("한글, 영문, 띄어쓰기만 가능합니다.");
                $("#fnameIcon").css('color','red');
            }
            else {
                nameMsg.html("");
                $("#fnameIcon").css('color','green');
            }
        })
        
        $('#endDate').blur(function() {
            if(endTime=="") {
                timeMsg.html("필수정보");
            }
        })
        
        $('#total').blur(function() {
            if(total=="") {
                totalMsg.html("필수정보");
            }else{
                totalMsg.html("");
            }
        })
        
        $('#expl').blur(function() {
            if(expl=="") {
                exMsg.html("필수정보");
            }else{
                exMsg.html("");
            }
        })
        
        document.querySelector("#creat").addEventListener("click", e=> {
            if(img=="" || name=="" || total=="" || expl=="" || endDate=="") {
                this.toastform("안됨create");
            }else if(!nameMsg.text()=="" || !fileMsg.text()=="" || !totalMsg.text()=="" ||!exMsg.text()=="" || !timeMsg.text()=="") {
                this.toastform("안됨dd");
            }
            else {
                alert("등록 완료");
                document.querySelector(`#navMenu > div:nth-child(1)`).click();
            }
        })
    }

    InputReset() {
        $("#emailMsg").html("");
        $("#lnameMsg").html("");
        $("#pMsg").html("");
        $("#pcMsg").html("");

        $("#emailIcon").css('color','#ddd');
        $("#nameIcon").css('color','#ddd');
        $("#pIcon").css('color','#ddd');
        $("#pcIcon").css('color','#ddd');
        
        $("#nameMsg").html("");
        $("#dateMsg").html("");
        $("#totalMsg").html("");
        $("#fileMsg").html("");
        $("#exMsg").html("");

        $("#dateIcon").css('color','#ddd');
        $("#fileIcon").css('color','#ddd');
        $("#fnameIcon").css('color','#ddd');
    }
    
    drawPage() {
        if(this.page ==0) {
            this.mainFund();
        }
        if(this.page==1) {
            this.drawrFund();
        }
        if(this.page==2) {
            this.submit();
            this.InputReset();
        }
        if(this.page==3) {
            this.selectOP();
        }
        if(this.page==4) {
            this.register();
            this.InputReset();
        }
    }

    addEvent() {
        document.querySelector("#navMenu").addEventListener("click", this.menuClick);
        document.querySelector("#flbtn").addEventListener("click", this.flClick);
        document.querySelector("#frbtn").addEventListener("click", this.frClick);
        document.querySelector("#lLbtn").addEventListener("click", this.LlClick);
        document.querySelector("#lrbtn").addEventListener("click", this.LrClick);
        document.querySelector("#select").addEventListener("change", this.selectOP);
    }
}

window.onload=()=> {
    window.app = new App();
}
