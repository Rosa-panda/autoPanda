const AndroidBot = require('AndroidBot');//引用AndroidBot模块

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

    let imagePath1 = "/storage/emulated/0/Android/data/com.aibot.client/files/小猫.png";
    do {
        let 开关 = await androidBot.appIsRunnig("com.bilibili.umamusu");
        if (开关) {
            console.log(开关, "状态");
            await androidBot.startApp("com.bilibili.umamusu");
            await androidBot.sleep(1000);
            await androidBot.click(402, 816);
        }
        console.log(开关);
        await androidBot.sleep(3000);
    } while (true);


}
