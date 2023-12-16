const AndroidBot = require('AndroidBot');//引用AndroidBot模块
global.Po_X = null;     //屏幕横坐标
global.Po_Y = null;     //屏幕纵坐标
global.事件名 = null;     //存储当前事件名

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
    // while (true) {
    //     await androidBot.showToast("通知嘛,你是要通知嘛,只能在这里通知呐!!!", 3000);
    //     await androidBot.sleep("3000");
    // }


    await 界面分辨率获取();
    // 养成界面操作();
    界面判断();
    // 我的ocr();
    // 少女事件界面选择();



    /**********************************************************以下为函数区域******************************************************/

    /**
     * 判断进入了养成界面后,进行的操作
     */
    async function 养成界面操作() {
        let initOcr = await androidBot.initOcr("127.0.0.1");
        let col1 = await androidBot.getColor(Math.ceil(Po_X * 0.206666666), Math.ceil(Po_Y * 0.8775));
        if (col1 != "#a29fa4") {
            await androidBot.click(Math.ceil(Po_X * 0.206666666), Math.ceil(Po_Y * 0.8775));//点击医务室按钮
            await 找到字后再点击(0.39, 0.3, 0.61, 0.35, 0.73, 0.65, "医务室确认");
            return;
        }
        /*如果不是极佳,先去散步*/
        if (!await androidBot.findWords("极佳", { region: [Math.ceil(Po_X * 0.736), Math.ceil(Po_Y * 0.1), Math.ceil(Po_X * 0.89), Math.ceil(Po_Y * 0.15)] })) {
            await androidBot.click(Math.ceil(Po_X * 0.5), Math.ceil(Po_Y * 0.9));//点击外出按钮
            await 找到字后再点击(0.39, 0.3, 0.61, 0.35, 0.73, 0.65, "外出确认");
            return;
        }
        /*通过找色,做体力条判断*/
        let col2 = await androidBot.getColor(Math.ceil(Po_X * 0.5), Math.ceil(Po_Y * 0.134));
        if (col2 == "#757575") {
            console.log("体力不够了");
            await androidBot.showToast("体力不够了", 1000);
            await androidBot.click(Math.ceil(Po_X * 0.5), Math.ceil(Po_Y * 0.9));//点击休息按钮
            await 找到字后再点击(0.39, 0.3, 0.61, 0.35, 0.73, 0.65, "休息确认");
            return;
        }
    }
    /**
     * 区域找字,找到相应的字以后,会则点击相应的按钮,若长时间(30秒)找不到字,依然会点击相应的按钮.
     * @param {找字区域右上横坐标} x1 
     * @param {找字区域右上纵坐标} y1 
     * @param {找字区域右下横坐标} x2 
     * @param {找字区域右下纵坐标} y2 
     * @param {要点击的按钮横坐标} x3 
     * @param {要点击的按钮纵坐标} y3 
     * @param {要找的字} str 
     */
    async function 找到字后再点击(x1, y1, x2, y2, x3, y3, str) {
        let initOcr = await androidBot.initOcr("127.0.0.1");
        while (true) {
            if (await androidBot.findWords(str, { region: [Math.ceil(Po_X * x1), Math.ceil(Po_Y * y1), Math.ceil(Po_X * x2), Math.ceil(Po_Y * y2)] })) {
                await androidBot.sleep("250");//OCR找的也太快了吧,找到以后还需要加延时才能反应过来.
                await androidBot.click(Math.ceil(Po_X * x3), Math.ceil(Po_Y * y3));//点击确定
                break;
            }
            //如果接近30秒都找不到的话,也跳出,可能是ocr出问题了
            for (i = 0; i < 900; i++) {
                await androidBot.sleep("30");
                await androidBot.click(Math.ceil(Po_X * x3), Math.ceil(Po_Y * y3));//保险再点击个确定
                break;
            }
        }
    }
    /**
     * 总入口
     */
    async function 界面判断() {
        let initOcr = await androidBot.initOcr("127.0.0.1");
        console.log(initOcr);
        if (await androidBot.findWords("养成", { region: [0, 0, Math.ceil(Po_X * 0.11), Math.ceil(Po_Y * 0.07)] })) {
            console.log("当前在养成界面");

        }
        if (await androidBot.findWords("训练", { region: [0, 0, Math.ceil(Po_X * 0.11), Math.ceil(Po_Y * 0.07)] })) {
            console.log("当前在训练界面");
        }
        if (await androidBot.findWords("少女事件", { region: [Math.ceil(Po_X * 0.26), Math.ceil(Po_Y * 0.16), Math.ceil(Po_X * 0.39), Math.ceil(Po_Y * 0.19)] })) {
            console.log("当前在少女事件界面");
            await 少女事件界面选择();
        }
        if (await androidBot.findWords("比赛日", { region: [Math.ceil(Po_X * 0), Math.ceil(Po_Y * 0.088), Math.ceil(Po_X * 0.214), Math.ceil(Po_Y * 0.131875)] })) {
            console.log("当前在比赛日界面");
        }
    }
    async function 界面分辨率获取() {
        let param = await androidBot.getElementRect(`com.bilibili.umamusu/android:id=content/android.widget.FrameLayout[1]`);
        Po_X = param.right;
        Po_Y = param.bottom;
        console.log("当前屏幕分辨率为" + Po_X + " * " + Po_Y);
        // await androidBot.showToast("当前屏幕分辨率为" + Po_X + " * " + Po_Y, 3000);
    }

    /**
     * 循环打印输出ocr找到的文字
     */
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

    /**
     * 目前没用,还没做
     */
    async function 强制关闭() { //不是这么玩的,这样游戏关不掉.
        for (i = 0; i < 10; i++) {
            //疯狂的调用十次退出键，从而关闭软件，aibote没有关闭软件的调用功能，离谱！
            await androidBot.back();
            await androidBot.sleep("100");
        }
    }

    /**
     * 进入了比赛界面的操作
     */
    async function 进行比赛() {
        let initOcr = await androidBot.initOcr("127.0.0.1");
        await androidBot.click(Math.ceil(Po_X * 0.7), Math.ceil(Po_Y * 0.84));//点击比赛按钮
        await androidBot.sleep(2000);
        await androidBot.click(Math.ceil(Po_X * 0.7), Math.ceil(Po_Y * 0.84));//点击参赛按钮
        await 找到字后再点击(0.38, 0.226, 0.6, 0.29, 0.73, 0.65, "赛事详情");
    }

    /**
     * 进入了少女事件界面的操作
     * @returns 
     */
    async function 少女事件界面选择() {
        let initOcr = await androidBot.initOcr("127.0.0.1");
        /*获取当前事件*/
        事件名 = await androidBot.getWords({ region: [Math.ceil(Po_X * 0.15), Math.ceil(Po_Y * 0.19), Math.ceil(Po_X * 0.8), Math.ceil(Po_Y * 0.23)] });
        if (事件名 != null) {
            if (await 二项目事件本大全(事件名)) {
                console.log("点击选项2");
                await androidBot.click(Math.ceil(Po_X * 0.5), Math.ceil(Po_Y * 0.65));//点击选项2
                return;
            }
            await androidBot.click(Math.ceil(Po_X * 0.5), Math.ceil(Po_Y * 0.56));//点击选项1
            console.log("点击选项1");
            return;
        } else {
            console.log("ocr可能出问题了,找不到事件,但是,不要怕,遇事不决就选1");
            await androidBot.click(Math.ceil(Po_X * 0.5), Math.ceil(Po_Y * 0.56));//点击选项1
            return;
            // await androidBot.click(Math.ceil(Po_X * 0.5), Math.ceil(Po_Y * 0.65));//点击选项2
        }
    }
    /**
     * 返回布尔值,真则选二,假则选一
     * @param {OCR获取的事件名} 事件名 
     * @returns 
     */
    async function 二项目事件本大全(事件名) {
        /*以下只能放置双选项事件,请将想选2的事件添加入组内,事件名不用整体全部输入,保证特征即可.*/

        /**马娘
         * 只能放置双选项事件,请将想选2的事件添加入组内
         */
        let 重炮 = ["向星星许愿", "成年人的什锦火锅", "成熟模特的秘诀"];
        let 通用 = ["追加的自主训练", "不许逞强"];
        let 成田白仁 = ["肉食"];
        let 鲁道夫象征 = ["无论何时", "突然的好意", "言出必行", "皇帝的饱餐"];
        let 气槽 = ["站在身旁的是", "永不停止磨炼", "努力试吃"];
        let 青云天空 = ["策略家", "在外面也擅长放松"];
        let 琵琶晨光 = ["还是舍弃", "捉迷藏大师", "香蕉前辈"];
        let 黄金船 = ["吃撑勿论", "多人折扣的惯犯", "遗失的物品是"];
        let 小栗帽 = ["超越娃娃", "浪得虚名"];

        /**协助卡
         * 只能放置双选项事件,请将想选2的事件添加入组内
         */
        let 一颗安心糖 = ["贴心关怀"];
        let 北黑 = ["啊，友情"];

        //存储数组名
        let arrRet = [通用, 重炮, 成田白仁, 鲁道夫象征, 气槽, 青云天空, 琵琶晨光, 黄金船, 小栗帽, 一颗安心糖, 北黑];
        总事件表 = [];               //存储,全部双选项事件中想选第二个选项的事件名(默认会点第一个选项)
        /*以上事件收集完毕,以下合成数组,以便于进行相关操作*/

        //合并所有表
        for (i = 0; i < arrRet.length; i++) {
            for (z = 0; z < arrRet[i].length; z++) {
                总事件表.push(arrRet[i][z]);
            }
        }
        for (i = 0; 总事件表.length; i++) {
            let fruit = await arrCompare(总事件表[i], 事件名);
            return fruit;
        }

    }
    /**
     * 两字符串相匹配,用布尔值返回,表示有没有匹配上,目前的设定是3连续字符串相等,这就算是匹配上了.
     * @param {预设的字符串} arr1 
     * @param {OCR找到的字符串} arr2 
     */
    async function arrCompare(arr1, arr2) {
        if (arr1 != null || arr2 != null) {
            for (i = 0; i < arr1.length; i++) {
                for (z = 0; z < arr2.length; z++) {
                    if (arr1[i] == arr2[z]) {
                        if (arr1[i + 1] == arr2[z + 1]) {
                            //预设字符串长度只有2位的时候
                            if (arr1.length == 1) {
                                return true;
                            }
                            //连续三个字符匹配
                            if (arr1[i + 2 == arr2[z + 2]]) {
                                return true;
                            }
                        }
                    }
                }
            }
            return false;
        } else {
            return false;
        }
    }


}
