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

    界面分辨率获取();


    /**
     * 以下为自定义函数
     */
    async function 界面分辨率获取() {
        let param = await androidBot.getElementRect(`com.bilibili.umamusu/android:id=content/android.widget.FrameLayout[1]`);
        Po_X = param.right.toString();
        Po_Y = param.bottom.toString();
        console("当前屏幕分辨率为");
    }

}
