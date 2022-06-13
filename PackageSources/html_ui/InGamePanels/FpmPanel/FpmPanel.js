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

        this.showing = true;
        
        let div = document.getElementById("fpmpanel");
        let fpmd = document.getElementById("fpmspan");
        let gfd = document.getElementById("gfspan");
        let textd = document.getElementById("textspan");
        fpm = parseInt(-fpm);
        fpmd.innerText = `${fpm}`;
        gfd.innerText = `${gforce.toFixed(2)}`;

        const [msg, color] = this.getMsgColor(fpm);

        textd.innerText = msg;
        textd.className = `blink-text font-small ${color}`;

        div.style.visibility = "visible";
        let that = this;

        setTimeout(function() {
            div.style.visibility = "hidden";
            that.showing = false;
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
            msg = "Hard Landing Landing Gear Inspection Mandatory";
            color = "orange-text";
        } else if(fpm <= -600) {
            msg = "Very Hard Landing Inspection Mandatory";
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