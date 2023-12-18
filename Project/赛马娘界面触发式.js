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
    global.initOcr = await androidBot.initOcr("192.168.1.3", { enableGPU: true, enableTensorrt: true });//初始化OCR,全局
    // global.initOcr = await androidBot.initOcr("127.0.0.1");//使用本机OCR初始化,全局
    await 界面分辨率获取();//分辨率必须先获取
    /******************************************************上面的东西尽量不要动********************************************************/

    console.log("gogogogogo");
    /**试试赛马娘,全自动界面触发式脚本                                                                                                                                                                                                                                                                                                                                                                                        
     */
    // while (true) {
    //     await androidBot.showToast("通知嘛,你是要通知嘛,只能在这里通知呐!!!", 3000);
    //     await androidBot.sleep("3000");
    // }
    // await 训练();
    // 养成界面操作();
    let bbb = await androidBot.getWords({ region: [Math.ceil(Po_X * 0.26), Math.ceil(Po_Y * 0.16), Math.ceil(Po_X * 0.39), Math.ceil(Po_Y * 0.19)] })
    界面判断();
    // 我的ocr();
    // 少女事件界面选择();
    // await 训练属性获取();


    /**********************************************************以下为函数区域******************************************************/


    /**
     * 判断进入了养成界面后,进行的操作
     */
    async function 养成界面操作() {
        /*生病判断*/
        let col1 = await androidBot.getColor(Math.ceil(Po_X * 0.206666666), Math.ceil(Po_Y * 0.8775));
        if (col1 != "#a29fa4") {
            await androidBot.click(Math.ceil(Po_X * 0.206666666), Math.ceil(Po_Y * 0.8775));//点击医务室按钮
            await 找到字后再点击(0.39, 0.3, 0.61, 0.35, 0.73, 0.65, "医务室确认");
            return;
        }
        /*心情判断*/
        if (!await androidBot.findWords("极佳", { region: [Math.ceil(Po_X * 0.736), Math.ceil(Po_Y * 0.1), Math.ceil(Po_X * 0.89), Math.ceil(Po_Y * 0.15)] })) {
            await androidBot.click(Math.ceil(Po_X * 0.5), Math.ceil(Po_Y * 0.9));//点击外出按钮
            await 找到字后再点击(0.39, 0.3, 0.61, 0.35, 0.73, 0.65, "外出确认");
            return;
        }
        /*通过找色,体力条判断*/
        let col2 = await androidBot.getColor(Math.ceil(Po_X * 0.5), Math.ceil(Po_Y * 0.134));
        if (col2 == "#757575") {
            console.log("体力不够了");
            await androidBot.showToast("体力不够了", 1000);
            await androidBot.click(Math.ceil(Po_X * 0.5), Math.ceil(Po_Y * 0.9));//点击休息按钮
            await 找到字后再点击(0.39, 0.3, 0.61, 0.35, 0.73, 0.65, "休息确认");
            return;
        }
        await androidBot.click(Math.ceil(Po_X * 0.5), Math.ceil(Po_Y * 0.76));//点击训练按钮
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
        let i = 0;
        while (true) {
            //如果接近30秒都找不到的话,也跳出,可能是ocr出问题了
            if (await androidBot.findWords(str, { region: [Math.ceil(Po_X * x1), Math.ceil(Po_Y * y1), Math.ceil(Po_X * x2), Math.ceil(Po_Y * y2)], scale: 2 })) {
                await androidBot.sleep("250");//OCR找的也太快了吧,找到以后还需要加延时才能反应过来.
                await androidBot.click(Math.ceil(Po_X * x3), Math.ceil(Po_Y * y3));//点击确定
                await androidBot.sleep("250");//怕有些时候反应不过来
                return;
            }
            //如果接近30秒都找不到的话,也跳出,可能是ocr出问题了,就点个确定再跳出
            i++;
            await androidBot.sleep("30");
            if (i == 900) {
                await androidBot.click(Math.ceil(Po_X * x3), Math.ceil(Po_Y * y3));//点击确定
                return;
            }
        }
    }

    /**
     * 总入口
     */
    async function 界面判断() {
        console.log(initOcr);
        while (true) {
            while (true) {
                if (await androidBot.findWords("训练", { region: [0, 0, Math.ceil(Po_X * 0.11), Math.ceil(Po_Y * 0.07)] })) {
                    console.log("当前在训练界面");
                    await 训练();
                    await androidBot.sleep("3000");
                }
                if (await androidBot.findWords("助卡事", { region: [Math.ceil(Po_X * 0.26), Math.ceil(Po_Y * 0.16), Math.ceil(Po_X * 0.39), Math.ceil(Po_Y * 0.19)] })) {
                    console.log("当前在协助卡事件界面");
                    await 事件界面选择();
                    await androidBot.sleep("3000");
                }
                if (await androidBot.findWords("少女事件", { region: [Math.ceil(Po_X * 0.26), Math.ceil(Po_Y * 0.16), Math.ceil(Po_X * 0.39), Math.ceil(Po_Y * 0.19)] })) {
                    console.log("当前在少女事件界面");
                    await 事件界面选择();
                    await androidBot.sleep("3000");
                }
                if (await androidBot.findWords("比赛日", { region: [Math.ceil(Po_X * 0), Math.ceil(Po_Y * 0.088), Math.ceil(Po_X * 0.214), Math.ceil(Po_Y * 0.131875)] })) {
                    console.log("当前在比赛日界面");
                    await 任务比赛页面();
                    await androidBot.sleep("3000");
                }
                if (await androidBot.findWords("目标粉丝数不足", { region: [Math.ceil(Po_X * 0.31), Math.ceil(Po_Y * 0.23), Math.ceil(Po_X * 0.68), Math.ceil(Po_Y * 0.28)] })) {
                    console.log("目标粉丝数不足");
                    await androidBot.click(Math.ceil(Po_X * 0.7), Math.ceil(Po_Y * 0.71));//点击前往赛事按钮一次
                    await androidBot.sleep("3000");
                }
                if (await androidBot.findWords("养成", { region: [0, 0, Math.ceil(Po_X * 0.11), Math.ceil(Po_Y * 0.07)] })) {
                    console.log("当前在养成界面");
                    await 养成界面操作();
                    await androidBot.sleep("3000");
                }
            }
        }
    }
    /**
     * 训练操作
     */
    async function 训练() {
        let speed, endure, power, perseverance, intelligence;
        let scoreAll = [];
        let swp = await 判断当前选定项目();
        //出故障了,并且速度已经点过了,直接跳出
        if (swp == null) {
            return;
        }
        let i = swp + 1;
        do {
            if (i == 5) {
                i = 0;
            }
            //智力
            if (i == 0) {
                intelligence = await 训练属性获取();
                await androidBot.click(Math.ceil(Po_X * 0.14777), Math.ceil(Po_Y * 0.8225));//点击速度按钮一次
                await androidBot.sleep("1500");
            }
            //速度
            if (i == 1) {
                speed = await 训练属性获取();
                await androidBot.click(Math.ceil(Po_X * 0.31444), Math.ceil(Po_Y * 0.8225));//点击耐力按钮一次
                await androidBot.sleep("1500");
            }
            //耐力
            if (i == 2) {
                endure = await 训练属性获取();
                await androidBot.click(Math.ceil(Po_X * 0.5), Math.ceil(Po_Y * 0.8225));//点击力量按钮一次
                await androidBot.sleep("1500");
            }
            //力量
            if (i == 3) {
                power = await 训练属性获取();
                await androidBot.click(Math.ceil(Po_X * 0.67555), Math.ceil(Po_Y * 0.8225));//点击毅力按钮一次
                await androidBot.sleep("1500");
            }
            //毅力
            if (i == 4) {
                perseverance = await 训练属性获取();
                await androidBot.click(Math.ceil(Po_X * 0.84333), Math.ceil(Po_Y * 0.8225));//点击智力按钮一次
                await androidBot.sleep("1500");
            }
            i++;
        } while (i != (swp + 1));
        // console.log("速度" + speed + "\n" + "耐力" + endure + "\n" + "力量" + power + "\n" + "毅力" + perseverance + "\n" + "智力" + intelligence);
        scoreAll.push(speed);
        scoreAll.push(endure);
        scoreAll.push(power);
        scoreAll.push(perseverance);
        scoreAll.push(intelligence);
        let max = Math.max(...scoreAll);
        console.log(max);
        for (let i = 0; i < scoreAll.length; i++) {
            if (scoreAll[i] == max) {
                if (i == 0) {
                    await androidBot.click(Math.ceil(Po_X * 0.14777), Math.ceil(Po_Y * 0.8225));//点击速度按钮一次
                    await androidBot.sleep(1500);
                    await androidBot.click(Math.ceil(Po_X * 0.14777), Math.ceil(Po_Y * 0.8225));//点击速度按钮一次
                } else if (i == 1) {
                    await androidBot.click(Math.ceil(Po_X * 0.31444), Math.ceil(Po_Y * 0.8225));//点击耐力按钮一次
                    await androidBot.sleep(1500);
                    await androidBot.click(Math.ceil(Po_X * 0.31444), Math.ceil(Po_Y * 0.8225));//点击耐力按钮一次
                } else if (i == 2) {
                    await androidBot.click(Math.ceil(Po_X * 0.5), Math.ceil(Po_Y * 0.8225));//点击力量按钮一次
                    await androidBot.sleep(1500);
                    await androidBot.click(Math.ceil(Po_X * 0.5), Math.ceil(Po_Y * 0.8225));//点击力量按钮一次
                } else if (i == 3) {
                    await androidBot.click(Math.ceil(Po_X * 0.67555), Math.ceil(Po_Y * 0.8225));//点击毅力按钮一次
                    await androidBot.sleep(1500);
                    await androidBot.click(Math.ceil(Po_X * 0.67555), Math.ceil(Po_Y * 0.8225));//点击毅力按钮一次
                } else if (i == 4) {
                    await androidBot.click(Math.ceil(Po_X * 0.84333), Math.ceil(Po_Y * 0.8225));//点击智力按钮一次
                    await androidBot.sleep(1500);
                    await androidBot.click(Math.ceil(Po_X * 0.84333), Math.ceil(Po_Y * 0.8225));//点击智力按钮一次
                } else {
                    console("这是什么鬼,我CPU烧了?怎么跑到这里来了,不可能绝对不可能!");
                    /*摆烂了,乱点速度拉倒!*/
                    await androidBot.click(Math.ceil(Po_X * 0.14777), Math.ceil(Po_Y * 0.8225));//点击速度按钮一次
                    await androidBot.sleep(1500);
                    await androidBot.click(Math.ceil(Po_X * 0.14777), Math.ceil(Po_Y * 0.8225));//点击速度按钮一次
                }
            }
        }
    }
    /**
     * 获取当前界面积分,并返回其值
     * @returns 总积分
     */
    async function 训练属性获取() {
        let speed, endure, power, perseverance, intelligence;
        let scoreAll = [];
        let score = 0;
        //获取数据
        speed = await androidBot.getWords({ region: [Math.ceil(Po_X * 0), Math.ceil(Po_Y * 0.58), Math.ceil(Po_X * 0.2), Math.ceil(Po_Y * 0.65)], scale: 2 });
        endure = await androidBot.getWords({ region: [Math.ceil(Po_X * 0.193), Math.ceil(Po_Y * 0.58), Math.ceil(Po_X * 0.35), Math.ceil(Po_Y * 0.65)], scale: 2 });
        power = await androidBot.getWords({ region: [Math.ceil(Po_X * 0.34), Math.ceil(Po_Y * 0.58), Math.ceil(Po_X * 0.51), Math.ceil(Po_Y * 0.65)], scale: 2 });
        perseverance = await androidBot.getWords({ region: [Math.ceil(Po_X * 0.49), Math.ceil(Po_Y * 0.58), Math.ceil(Po_X * 0.7), Math.ceil(Po_Y * 0.65)], scale: 2 });
        intelligence = await androidBot.getWords({ region: [Math.ceil(Po_X * 0.63), Math.ceil(Po_Y * 0.58), Math.ceil(Po_X * 0.83), Math.ceil(Po_Y * 0.65)], scale: 2 });
        //去除加号
        speed = await 去除加号(speed);
        endure = await 去除加号(endure);
        power = await 去除加号(power);
        perseverance = await 去除加号(perseverance);
        intelligence = await 去除加号(intelligence);
        // console.log("速度" + speed + "\n" + "耐力" + endure + "\n" + "力量" + power + "\n" + "毅力" + perseverance + "\n" + "智力" + intelligence);
        scoreAll.push(speed);
        scoreAll.push(endure);
        scoreAll.push(power);
        scoreAll.push(perseverance);
        scoreAll.push(intelligence);
        for (let i = 0; i < scoreAll.length; i++) {
            if (scoreAll[i] != null) {
                score = parseInt(score) + parseInt(scoreAll[i]);
            }
        }
        return score;

    }
    /**判断当前选定的项目
     * 
     * @returns 0:速, 1:耐, 2:力, 3:毅, 4:智, null:找不到啊,直接摆烂点速度!
     */
    async function 判断当前选定项目() {
        let col1 = await androidBot.getColor(Math.ceil(Po_X * 0.1533), Math.ceil(Po_Y * 0.7287));
        let col2 = await androidBot.getColor(Math.ceil(Po_X * 0.3288), Math.ceil(Po_Y * 0.7287));
        let col3 = await androidBot.getColor(Math.ceil(Po_X * 0.51), Math.ceil(Po_Y * 0.7287));
        let col4 = await androidBot.getColor(Math.ceil(Po_X * 0.6822), Math.ceil(Po_Y * 0.7287));
        let col5 = await androidBot.getColor(Math.ceil(Po_X * 0.86), Math.ceil(Po_Y * 0.7287));
        if (col1 == "#0e96fc") {
            console.log("当前选定的是速度");
            return 0;
        } else if (col2 == "#0e96fc") {
            console.log("当前选定的是耐力");
            return 1;
        } else if (col3 == "#0e96fc") {
            console.log("当前选定的是力量");
            return 2;
        } else if (col4 == "#0e96fc") {
            console.log("当前选定的是毅力");
            return 3;
        } else if (col5 == "#0e96fc") {
            console.log("当前选定的是智力");
            return 4;
        } else {
            console.log("这是出故障了啊,不用怕,等下无脑点速度,养成总能跑过的吧");
            await androidBot.click(Math.ceil(Po_X * 0.14777), Math.ceil(Po_Y * 0.8225));//保险,再点击一次训练速度
            await androidBot.sleep(1500);
            await androidBot.click(Math.ceil(Po_X * 0.14777), Math.ceil(Po_Y * 0.8225));//保险,再点击一次训练速度
            return null;
        }
    }
    /**
     * 分辨率获取,需要打开游戏
     */
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
    async function 任务比赛页面() {
        await androidBot.click(Math.ceil(Po_X * 0.7), Math.ceil(Po_Y * 0.84));//点击比赛按钮
        await androidBot.sleep(2000);
        await androidBot.click(Math.ceil(Po_X * 0.7), Math.ceil(Po_Y * 0.84));//点击参赛按钮
        await 找到字后再点击(0.38, 0.226, 0.6, 0.29, 0.73, 0.65, "赛事详情");
        await 找到字后再点击(0.26, 0.9, 0.44, 0.93, 0.44, 0.93, "查看结果");
        await androidBot.sleep("3500");
        await androidBot.click(Math.ceil(Po_X * 0.7), Math.ceil(Po_Y * 0.84));//随便的点击屏幕
        await 找到字后再点击(0.42, 0.9, 0.57, 0.93, 0.44, 0.93, "下一页");
        await 找到字后再点击(0.65, 0.93, 0.77, 0.96, 0.7, 0.93, "下一步");
        await 找到字后再点击(0.43, 0.85, 0.57, 0.88, 0.57, 0.88, "继续");
        await 找到字后再点击(0.43, 0.85, 0.57, 0.88, 0.57, 0.88, "继续");
    }

    /**
     * 进入了少女事件界面的操作
     * @returns 
     */
    async function 事件界面选择() {
        let t1, t2, t3
        /*多项(3,4,5)事件判断*/
        t1 = await androidBot.getWords({ region: [Math.ceil(Po_X * 0), Math.ceil(Po_Y * 0.58), Math.ceil(Po_X * 0.2), Math.ceil(Po_Y * 0.65)], scale: 2 });
        t2 = await androidBot.getWords({ region: [Math.ceil(Po_X * 0), Math.ceil(Po_Y * 0.58), Math.ceil(Po_X * 0.2), Math.ceil(Po_Y * 0.65)], scale: 2 });
        t3 = await androidBot.getWords({ region: [Math.ceil(Po_X * 0), Math.ceil(Po_Y * 0.58), Math.ceil(Po_X * 0.2), Math.ceil(Po_Y * 0.65)], scale: 2 });

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
     * 寻找相符的对应事件,有相符的事件则返回真
     * @param {OCR获取的事件名} 事件名 
     * @returns 返回布尔值,真则选二,假则选一
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

    async function 去除加号(str) {
        if (str != null) {
            str = str.replace("+", "");
            return str;
        } else {
            return null;
        }
    }

}
