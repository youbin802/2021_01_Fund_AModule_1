
class invPopup {
    constructor(data) {
        this.data= data;
        this.popup= document.querySelector("#view");
        this.popup.classList.add("active");
        const set = this.set();
        this.el= document.querySelector(".vBox");
        this.el.appendChild(set);
        this.button();
    }

    set() {
        const f = this.data;
        $(".v-text p").eq(0).html(f.number);
        $(".v-text p").eq(1).html(f.fundName);
        $(".v-text p").eq(2).html(f.datetime);
        $(".v-text p").eq(3).html(f.pay +" of " +f.total);
        const div= document.createElement("div");
        div.classList.add("nBoxin");
        div.innerHTML=`
        <p>${f.number}</p>
        <p title="${f.fundName}">${f.fundName}</p>
        <p>${f.name}</p>
        <p title="${f.pay}">${f.pay}</p>
        <div class="progress">
        <div class="progress-bar role="progressbar" aria-valuenow="75" aria-valuemin="0" aria-valuemax="100" style="width:${f.percent}%"></div>
        </div>
        <p title="${f.percent}">${f.percent}%</p>
        `;
        return div;
    }

    button() {
        document.querySelector("#exclose").addEventListener("click",e=> {
            this.popup.classList.remove("active");
            this.el.innerHTML="";
        })

    }
}