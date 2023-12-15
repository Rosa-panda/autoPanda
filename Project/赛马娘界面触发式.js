const AndroidBot = require('AndroidBot');//引用AndroidBot模块
global.Po_X = null;
global.Po_Y = null;

//注册主函数，安卓端连接脚本会自动调用androidMain，并传递AndroidBot对象。设置服务端监听端口，手机端默认连接端口16678
AndroidBot.registerMain(androidMain, 16678);

/**用作代码提示，androidMain函数会被多次调用，注意使用全局变量
* @param {AndroidBot} androidBot
*/
async function androidMain(androidBot) {
    //设置隐式等待(寻找元素时默认等待时间，等待时间过后依然找不到元素，才会返回失败)
    await androidBot.setImplicitTimeout(5000);
    let androidId = await androidBot.getAndroidId();
    console.log(androidId);
    /**试试赛马娘,全自动界面触发式脚本
     */
    while (true) {
        await androidBot.showToast("通知嘛,你是要通知嘛,只能在这里通知呐!!!", 3000);
        await androidBot.sleep("3000")
    }
    // await 界面分辨率获取();
    // 养成界面操作();

    /**
     * 以下为自定义函数
     */
    async function 养成界面操作() {
        /*体力条判断*/
        let col = await androidBot.getColor(Po_X * 0.5, Po_Y * 0.13961);
        if (col == "#757575") {
            console.log("体力不够了");
            await androidBot.showToast("体力不够了", 1000)
        }
    }

    async function 界面判断() {
        let initOcr = await androidBot.initOcr("127.0.0.1");
        console.log(initOcr);
        if (await androidBot.findWords("养成", { region: [0, 0, Po_X * 0.11, Po_Y * 0.07] })) {
            console.log("当前在养成界面");
        }
    }
    async function 界面分辨率获取() {
        let param = await androidBot.getElementRect(`com.bilibili.umamusu/android:id=content/android.widget.FrameLayout[1]`);
        Po_X = param.right;
        Po_Y = param.bottom;
        console.log("当前屏幕分辨率为" + Po_X + " * " + Po_Y);
    }
    async function 我的ocr() {

        let initOcr = await androidBot.initOcr("127.0.0.1");
        console.log(initOcr);
        while (true) {
            console.time("time");
            let words = await androidBot.getWords();
            console.log(words);
            console.timeEnd("time");
            await androidBot.sleep("3000");
            await androidBot.showToast("iiiii", 1000)
        }
    }

}
