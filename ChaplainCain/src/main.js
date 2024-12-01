const {HtmlTelegramBot, userInfoToString} = require("./bot");
const ChatGptService = require("./gpt");
const {defaultArgs} = require("puppeteer");

class MyTelegramBot extends HtmlTelegramBot {
    constructor(token) {
        super(token);
        this.mode = null;
        this.fool = false;
        this.counter = 1;
    }

    async defaultDialog(msg){
        const text = msg.text;
        if(this.mode === "train" && !this.fool){
            await this.trainDialog(text);
        }
    }

    async start(){
        this.mode = "start"
        const text = this.loadMessage("start");
        await this.sendImage("start");
        await this.sendText(text);

        await this.showMainMenu({
            "/start":"Join to Space Marines",
            "/doctrine":"Doctrine studies",
            "/train":"Practice you knowledge",

        })

    }

    async doctrine(){
        this.mode = "doctrine";
        this.fool = false;
        const text = this.loadMessage("doctrine");
        await this.sendImage("doctrine");
        await this.sendText(text);
    }

    async train(){
        this.mode = "train";
        this.counter = 1;
        const text = this.loadMessage("train");
        await this.sendImage("train");
        await this.sendText(text);
    }
    async trainDialog(msg){
        if(this.counter === 1){
            if(msg === "To serve the Emperor's will"){
                this.counter++;
                await this.sendText("What is the Emperor's will?");
            }else{
                await this.failedTrain();
            }
        }else if(this.counter === 2){
            if(msg === "That we fight and die"){
                this.counter++;
                await this.sendText("What is death?");
            }else{
                await this.failedTrain();
            }
        }else if(this.counter === 3){
            if(msg === "It is our duty"){
                this.counter++;
                await this.sendText("Success!!");
            }else{
                await this.failedTrain();
            }
        }

    }

    async failedTrain(){
        this.fool = true;
        const fail = this.loadMessage("fail");
        await this.sendText(fail);
    }
}

const bot = new MyTelegramBot("7752515810:AAEAo-E3e0V7tRGgRaCUeueXLBUOWVCPY2k");
bot.onCommand(/\/start/,bot.start);
bot.onCommand(/\/doctrine/,bot.doctrine);
bot.onCommand(/\/train/,bot.train);
bot.onTextMessage(bot.defaultDialog);