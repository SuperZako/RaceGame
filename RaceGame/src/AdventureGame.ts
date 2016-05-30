//------------------------------------------------------------
//画像表示枠クラス
class ImgFrame {
    imgNo = -1;	//画像番号

    state = -1;		//状態（-1:非表示, 0:表示, 1:フェードイン中, 2:フェードアウト中）


    a = 100;		//不透明度（%）
    constructor(public x: number, public y: number) {

    }

    //----------------------------------------
    move() {
        switch (this.state) {
            case -1://非表示
            case 0:	//表示
                break;

            case 1:	//フェードイン中
                this.a += 10;
                if (this.a >= 100)
                    this.state = 0;
                return false;


            case 2:	//フェードアウト中
                this.a -= 10;
                if (this.a <= 0)
                    this.state = -1;
                return false;
            default:
                break;
        }
        return (true);
    }

    draw(context: CanvasRenderingContext2D, imgs: HTMLImageElement[]) {
        if (this.state != -1 && this.imgNo > -1) {
            context.globalAlpha = this.a / 100;
            context.drawImage(imgs[this.imgNo], this.x, this.y);
        }
    }

    //画像変更
    //@param imgNo:	変更画像番号（-1で非表示）
    changeImg(imgNo: number) {
        this.imgNo = imgNo;
        if (imgNo < 0)
            this.state = -1;
        else
            this.state = 0;
    }

    //フェードインorアウト
    //@param imgNo: 変更後画像番号（-1でフェードアウト）
    fade(imgNo: number) {
        if (imgNo < 0) {	//フェードアウト
            this.state = 2;
            this.a = 100;
        }
        else {			//フェードイン
            this.state = 1;
            this.imgNo = imgNo
            this.a = 0;
        }
    }
}

//グラフィック管理クラス
class Graphic {
    fileName = "imglist.txt";
    context: CanvasRenderingContext2D; //canvasコンテキスト

    //画像データ
    imgs: HTMLImageElement[];				//画像データ
    src: string[];				//画像ソース

    loadCount = 0;

    //表示枠	
    stand = [
        new ImgFrame(70, 0),	//立ち絵
        new ImgFrame(220, 0),
        new ImgFrame(370, 0),];
    back = new ImgFrame(0, 0);	//背景
    constructor() {
    }


    //----------------------------------------
    initialize() {
        //canvasのコンテキスト取得
        var canvas = <HTMLCanvasElement>document.getElementById("graphic");
        this.context = canvas.getContext('2d');
    }

    move() {
        var ret = true;

        ret = ret && this.back.move(); //背景

        for (var i = 0; i < this.stand.length; i++) {
            ret = ret && this.stand[i].move(); //立ち絵
        }

        return (ret);
    }

    draw() {
        this.context.clearRect(0, 0, 1000, 1000);

        this.back.draw(this.context, this.imgs); //背景

        for (var i = 0; i < this.stand.length; i++) {
            this.stand[i].draw(this.context, this.imgs); //立ち絵
        }
    }

    //画像データロード
    //@param callBack: ロード完了時のコールバック関数
    load(callBack: () => void) {
        var me = this;

        //画像リストファイル取得
        var url = location.href
        var path = url.substring(0, url.lastIndexOf("/") + 1) + this.fileName;
        var req = new XMLHttpRequest();

        req.open("GET", path + "?" + new Date().getTime() * 1, false);
        req.send(null)
        if (req.status != 200) {
            alert("image list not found");
            return (false);
        }
        var res = req.responseText;

        this.src = res.split("\r\n");

        //コメント部分除去
        for (var i = 0; i < this.src.length; i++) {
            this.src[i] = this.src[i].split("//")[0].replace(/^[\s　]+|[\s　]+$/g, '');
            if (this.src[i] == "") {
                this.src.splice(i, 1);
                i--;
            }
        }

        //画像データ取得
        this.imgs = new Array(this.src.length);

        for (var i = 0; i < this.src.length; i++) {
            if (this.src[i] == "-1") { //無効データ
                this.loadCount++;
                continue;
            }
            this.imgs[i] = new Image();
            this.imgs[i].onload = function () {
                me.loadCount++;
                if (me.loadCount >= me.src.length) {
                    callBack();
                }
            }
            this.imgs[i].src = this.src[i] + "?" + new Date().getTime();
        }
    }

    //立ち絵即時変更
    //@param standNo:	立ち絵枠番号
    //		 imgNo:		画像番号（-1で非表示）
    changeStand(standNo: number, imgNo: number) {
        this.stand[standNo].changeImg(imgNo);
    }

    //立ち絵フェードイン/アウト
    //@param standNo:	立ち絵枠番号
    //		 imgNo:		画像番号（-1でフェードアウト）
    fadeStand(standNo: number, imgNo: number) {
        this.stand[standNo].fade(imgNo);
    }

    //背景即時変更
    //@param imgNo:		画像番号（-1で非表示）
    changeBack(imgNo: number) {
        this.back.changeImg(imgNo);
    }

    //背景フェードイン/アウト
    //@param imgNo:		画像番号（-1でフェードアウト）
    fadeBack(imgNo: number) {
        this.back.fade(imgNo);
    }
}



//------------------------------------------------------------
//メッセージボックス制御クラス
class MsgBox {
    box = document.getElementById("msgBox");

    msg = "";
    strCnt = 0;

    clickFlg = false;
    readFlg = false;

    constructor() {
    }

    //----------------------------------------
    initialize() {
        var me = this;
        this.box = document.getElementById("msgBox");

        //クリックイベント設定
        this.box.onclick = function () {
            me.clickFlg = true;
            return false;
        }
        this.box.ondblclick = function () {
            me.clickFlg = true;
            return false;
        }
    }

    move() {

        if (this.clickFlg) {	//クリック有
            if (this.strCnt < this.msg.length)
                this.strCnt = this.msg.length; //文全表示
            else
                this.readFlg = true; //読み終り
        }
        else {	//クリック無
            this.strCnt++;
        }

        this.clickFlg = false;

        if (this.readFlg)
            return (true);
        else
            return (false);
    }

    draw() {
        if (this.strCnt <= this.msg.length) {
            this.box.innerHTML = this.msg.substr(0, this.strCnt);
        }
        else {
            //メッセージ全表示後の矢印点滅
            if (this.strCnt % 16 == 0)
                this.box.innerHTML = this.msg + " ▼";
            else if (this.strCnt % 16 == 8)
                this.box.innerHTML = this.msg;
        }
    }

    //新規メッセージ出力
    //@param	msg: 出力メッセージ
    setMsg(msg: string) {
        this.msg = msg;
        this.strCnt = 0;
        this.readFlg = false;
    }
}



//------------------------------------------------------------
//スクリプトリスト管理クラス
class ScriptManager {
    list: string[];		//スクリプトリスト
    pointer = 0;	//現在位置

    fileName = "script.txt";
    constructor() { }


    initialize() {
    }

    //スクリプトファイルのロード
    load() {
        var url = location.href
        var path = url.substring(0, url.lastIndexOf("/") + 1) + this.fileName;
        var req = new XMLHttpRequest();

        req.open("GET", path + "?" + new Date().getTime() * 1, false);
        req.send(null)
        if (req.status != 200) {
            alert("script not found");
            return (false);
        }
        var res = req.responseText;

        this.list = res.split("\r\n");
    }

    //次命令取得
    next() {
        //コメントを除いて返す
        while (this.pointer < this.list.length) {
            let nextLine = this.list[this.pointer].split("//")[0];

            if (nextLine != "") {
                this.pointer++;
                return (nextLine);
            }

            this.pointer++;
        }

        //EOF
        return ("@end");
    }
}



//------------------------------------------------------------
//メイン
class GameMain {
    script = new ScriptManager();
    msgBox = new MsgBox();
    graphic = new Graphic();

    constructor() { }


    initialize() {
        this.script.initialize();
        this.msgBox.initialize();
        this.graphic.initialize();

        this.script.load();
        this.graphic.load(() => { this.loaded() });
    }

    loaded() {

        setInterval(() => { this.mainLoop() }, 50);
    }

    mainLoop() {
        let ret = false;

        ret = this.move();
        this.draw();

        //次ステップ実行
        if (ret) {
            var next = this.script.next();

            if (next.substr(0, 1) == "@")
                this.command(next);			//スクリプトコマンド
            else
                this.msgBox.setMsg(next);	//メッセージ
        }
    }

    move() {
        let ret = true;
        ret = ret && this.msgBox.move();
        ret = ret && this.graphic.move();

        return ret;
    }

    draw() {
        this.msgBox.draw();
        this.graphic.draw();
    }


    //スクリプトコマンド実行メソッド
    command(cmd: string) {
        let param = cmd.split(",");
        let ret = false;

        //スペース除去
        for (let i = 0; i < param.length; i++) {
            param[i] = param[i].replace(/^[\s　]+|[\s　]+$/g, '');
        }

        //コマンド分類
        switch (param[0]) {
            case "@cs":	//立ち絵変更
                ret = this.cs(param);
                break;
            case "@cb":	//背景変更
                ret = this.cb(param);
                break;
            case "@end": //スクリプト終了
                ret = true;
                break;
            default:
                ret = false;
        }

        if (!ret)
            alert("コマンドエラー: " + cmd);
    }


    //各スクリプトコマンドメソッド群
    //@param	param:コマンドパラメータ配列
    //@return	false -> コマンドエラー

    cs(param: any) {	//立ち絵変更
        //コマンドパラメータ
        //位置番号, 画像番号, フェード（0->無/1->有）

        if (param.length < 4) return (false);

        param[1] = parseInt(param[1]);
        param[2] = parseInt(param[2]);

        if (param[3] == "0")
            this.graphic.changeStand(param[1], param[2]);
        else
            this.graphic.fadeStand(param[1], param[2]);

        return (true);
    }

    cb(param: any) {	//背景変更
        //コマンドパラメータ
        //画像番号, フェード（0->無/1->有）

        if (param.length < 3)
            return (false);

        param[1] = parseInt(param[1]);

        if (param[2] == "0")
            this.graphic.changeBack(param[1]);
        else
            this.graphic.fadeBack(param[1]);

        return true;
    }
}