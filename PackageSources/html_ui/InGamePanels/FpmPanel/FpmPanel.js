class IngamePanelFpmPanel extends TemplateElement {
    constructor() {
        super(...arguments);
        this._isConnected = false;
        this.showing = false;
        this.onground = true;
    }

    connectedCallback() {
        this._isConnected = true;
        //super.connectedCallback();        
        let that = this;
        
        let update = function() {
            that.getFpm();
            requestAnimationFrame(update);
        };
        requestAnimationFrame(update);

        document.addEventListener("keydown", function(ev) {
            if(ev.altKey && ev.keyCode == KeyCode.KEY_F) {
                that.toggleVisibility(true);
            }
        });
    }

    toggleVisibility(ui=false) {
        this.showing = !this.showing;
        let div = document.getElementById("FpmPanel");
        if(!this.showing) {
            div.classList.add("hidepanel");
            if(ui) {
                div.classList.add("hideui");
            }
        } else {
            div.classList.remove("hidepanel");
            if(ui) {
                div.classList.remove("hideui");
            }
        }
    }

    getFpm() {
        if(this.showing) {
            return;
        }
        
        try {
            if(!this._isConnected || !SimVar.IsReady()) {
                return;
            }
        } catch (e) {
            // Can't find variable: simvar
            return;
        }


        let fpm = SimVar.GetSimVarValue("PLANE TOUCHDOWN NORMAL VELOCITY", "feet per minute");
        let onground = SimVar.GetSimVarValue("SIM ON GROUND", "bool");
        let vel = SimVar.GetSimVarValue("VELOCITY BODY Z", "feet per second");
        let gforce = SimVar.GetSimVarValue("G FORCE", "GForce");

        if(onground && this.onground) {
            return;
        }

        this.onground = onground;

        if(!onground) {
            return;
        }

        if(this.onair)

        if(vel < 4) {
            return;
        }

        this.toggleVisibility();
        
        //let fpmpanel = document.getElementById("FpmPanel");
        /*if(g_externalVariables.vrMode) {
            fpmpanel.style.width = "100% !important";
        } else {
            fpmpanel.style.width = "var(--fullPageWidth)";
        }*/
        let fpmd = document.getElementById("fpmspan");
        let gfd = document.getElementById("gfspan");
        let textd = document.getElementById("textspan");
        fpm = parseInt(-fpm);
        fpmd.innerText = `${fpm}`;
        gfd.innerText = `${gforce.toFixed(2)}`;

        const [msg, color] = this.getMsgColor(fpm);

        textd.innerText = msg;
        textd.className = `blink-text font-small ${color}`;

        let that = this;

        setTimeout(function() {
            that.toggleVisibility();
        }, 5000);
    }

    getMsgColor(fpm) {
        let msg = "";
        let color = "";
        if(fpm >= -120) {
            msg = "Smooth Landing";
            color = "yellow-text";
        } else if(fpm > -240) {
            msg = "Normal Landing";
            color = "green-text";
        } else if(fpm > -360) {
            msg = "Hard Landing";
            color = "cyan-text";
        } else if(fpm > -600) {
            msg = "Hard Landing, Gear Inspection Mandatory";
            color = "orange-text";
        } else if(fpm <= -600) {
            msg = "Very Hard Landing, Inspection Mandatory";
            color = "red-text";
        }
        return [msg, color];
    }

    disconnectedCallback() {
        super.disconnectedCallback();
        this._isConnected = false;
    }
}

window.customElements.define("ingamepanel-fpm", IngamePanelFpmPanel);
checkAutoload();