const AndroidBot = require('AndroidBot');//引用AndroidBot模块
global.spy = 'Hello, world!';//不太会玩这个东西，妈的我现在只会弄这个全局变量来处理这个问题.（作用域的关系）
global.flag = false;//全局变量，用于判断当前循环是否有效，若为否，则调用故障处理函数。
global.rss = false;//全局变量，用于判定第一波查数据时候，是否是因出故障跳出的循环
global.跟单目标的名字 = "BlogDA";//全局变量，用于判定第一波查数据时候，是否是因出故障跳出的循环
//注册主函数，安卓端连接脚本会自动调用androidMain，并传递AndroidBot对象。设置服务端监听端口，手机端默认连接端口16678
AndroidBot.registerMain(androidMain, 16678);

/**用作代码提示，androidMain函数会被多次调用，注意使用全局变量
* @param {AndroidBot} androidBot
*/
async function androidMain(androidBot) {
    //设置隐式等待(寻找元素时默认等待时间，等待时间过后依然找不到元素，才会返回失败)
    await androidBot.setImplicitTimeout(7000);
    let androidId = await androidBot.getAndroidId();
    console.log(androidId);
    //以下界面调用区域
    await androidBot.createWebView(100, "https://cdn.stocksnap.io/img-thumbs/960w/home-flowers_RTEYB2HRH0.jpg", 0, 0, 1200, 1000);
    await androidBot.createEditText(101, "BlogDA", 0, 1100, 400, 100);
    let retParams = await androidBot.getScriptParam();
    跟单目标的名字 = retParams["101"];
    console.log(跟单目标的名字);

    // await androidBot.clearScriptControl();
    //清除脚本控件

    //界面调用区域结束


    /* 存储运行代码头 */

    mymain();
    运行检测();

    /* 存储运行代码尾 */
    async function mymain() {
        let 本机账号名 = "我";
        while (true) {
            while (true) {
                //测试代码，取消注释可自定义测试.
                // let arrRet3 = [];
                // arrRet3.push({ x: "久之洋", y: 100 });
                // arrRet3.push({ x: "科净源", y: -100 });
                // arrRet3.push({ x: "久之洋", y: 100 });


                rss = false;    //一轮的开始，设置这个全局变量为假
                flag = false;    //一轮的开始，设置这个全局变量为假
                let arrRet1 = await 数据获取(跟单目标的名字);
                if (flag) {
                    for (i = 0; i < 10; i++) {
                        //疯狂的调用十次退出键，从而关闭软件，aibote没有关闭软件的调用功能，离谱！
                        await androidBot.back();
                        await androidBot.sleep("100");
                    }
                    rss = true;     //
                    break;
                }
                let arrRet2 = await 数据获取(本机账号名);     //
                if (flag || rss) {
                    for (i = 0; i < 10; i++) {
                        //疯狂的调用十次退出键，从而关闭软件，aibote没有关闭软件的调用功能，离谱！
                        await androidBot.back();
                        await androidBot.sleep("100");
                    }
                    break;
                }
                let arrRet3 = await 生成计划(arrRet1, arrRet2);
                await 买卖操作(arrRet3);
                await androidBot.sleep("74210");
            }
        }
    }

    async function 买卖操作(arrRet) {
        if (arrRet.length == 0) {
            return true;
        }
        for (i = 0; i < arrRet.length; i++) {
            //判定是买入还是卖出
            spy = i;        //大概是作用域的原因，后面的if里面没法调用i，所以用spy存i
            if (arrRet[i].y > 0) {
                //点击买入按钮
                let show = await androidBot.clickElement(`com.hexin.plat.android/@class=android.widget.ScrollView/android.widget.LinearLayout/android.widget.FrameLayout/android.widget.FrameLayout/android.widget.LinearLayout/android.widget.LinearLayout/android.widget.LinearLayout[2]/android.widget.LinearLayout/android.widget.TextView`);
                console.log(show);
                await androidBot.sleep("500");
                //点击股票名输入文本框
                show = await androidBot.clickElement(`com.hexin.plat.android/@class=android.widget.EditText`);
                await androidBot.sleep("500");
                //输入股票名称
                let name = arrRet[spy].x.toString();
                await androidBot.sendKeys(name);
                console.log(name);
                await androidBot.sleep("1000");
                //点击操作股票数量
                if (await androidBot.existsElement(`com.hexin.plat.android/com.hexin.plat.android:id=stockvolume/android.widget.EditText`)) {
                    await androidBot.clickElement(`com.hexin.plat.android/com.hexin.plat.android:id=stockvolume/android.widget.EditText`);
                    await androidBot.sleep("1000");
                }
                if (await androidBot.existsElement(`com.hexin.plat.android[1]/com.hexin.plat.android:id=stockvolume/android.widget.EditText`)) {
                    await androidBot.clickElement(`com.hexin.plat.android[1]/com.hexin.plat.android:id=stockvolume/android.widget.EditText`);
                    await androidBot.sleep("1000");
                }
                //输出操作股票数量
                let Num = arrRet[spy].y.toString();
                await androidBot.sendKeys(Num);
                await androidBot.sleep("1000");
                //根据当前市场，微微提价，用来保证买入
                let i = 0;
                while (i < 8) {
                    if (await androidBot.existsElement(`com.hexin.plat.android/com.hexin.plat.android:id=content_price_add`)) {
                        await androidBot.clickElement(`com.hexin.plat.android/com.hexin.plat.android:id=content_price_add`);
                    }
                    if (await androidBot.existsElement(`com.hexin.plat.android[1]/com.hexin.plat.android:id=content_price_add`)) {
                        await androidBot.clickElement(`com.hexin.plat.android[1]/com.hexin.plat.android:id=content_price_add`);
                    }
                    i++;
                    await androidBot.sleep("100");
                }
                let sync1 = await androidBot.getElementRect(`com.hexin.plat.android[1]/com.hexin.plat.android:id=tv_flashorder_cangwei`);
                let sync2 = await androidBot.getElementRect(`com.hexin.plat.android[1]/com.hexin.plat.android:id=chengjiao`);
                //点击买入按钮   sync1.right.toString(), sync1.bottom.toString(), sync2.left.toString(), sync2.top.toString()
                // let tchxy = await androidBot.findWords("模拟", { region: [sync1.right, sync1.bottom, sync2.left, sync2.top] });//不用ocr找了
                let tchx = (sync1.left + sync2.left) / 2;
                let thxy = (sync1.top + sync2.top) / 2;
                if (sync1 != null) {
                    await androidBot.click(tchx, thxy); //点击模拟炒股按钮（买入）
                } else {
                    //调用退出键，回到上一页（操作页面）
                    await androidBot.back();
                    await androidBot.sleep("3000");
                    console.log("sync1获取不到.");
                    return;
                }
                await androidBot.sleep("500");
                //点击确认买入
                show = await androidBot.clickElement(`com.hexin.plat.android/@class=android.widget.Button[1]`);
                await androidBot.sleep("500");
                show = await androidBot.clickElement(`com.hexin.plat.android/com.hexin.plat.android:id=ok_btn`);
                await androidBot.sleep("2000");
                //调用退出键，回到上一页（操作页面）
                await androidBot.back();
                await androidBot.sleep("3000");
            } else {
                //点击卖出按钮
                await androidBot.clickElement(`com.hexin.plat.android/@class=android.widget.ScrollView/android.widget.LinearLayout/android.widget.FrameLayout/android.widget.FrameLayout/android.widget.LinearLayout/android.widget.LinearLayout/android.widget.LinearLayout[2]/android.widget.LinearLayout[1]/android.widget.TextView`);
                await androidBot.sleep("500");
                //点击股票名输入文本框
                await androidBot.clickElement(`com.hexin.plat.android/@class=android.widget.EditText`);
                await androidBot.sleep("500");
                //输入股票名称
                let name = arrRet[spy].x.toString();
                await androidBot.sendKeys(name);
                //点击操作股票数量
                await androidBot.clickElement(`com.hexin.plat.android/@class=android.widget.ScrollView/android.widget.LinearLayout/android.widget.RelativeLayout/android.widget.RelativeLayout/android.widget.RelativeLayout/android.widget.RelativeLayout[3]/android.widget.FrameLayout/android.widget.EditText`);
                await androidBot.sleep("500");
                //输出操作股票数量
                let Num = -arrRet[spy].y.toString();
                await androidBot.sendKeys(Num);
                //根据当前市场，微微降价，用来保证卖出
                let i = 0;
                while (i < 8) {
                    if (await androidBot.existsElement(`com.hexin.plat.android/com.hexin.plat.android:id=content_price_sub`)) {
                        await androidBot.clickElement(`com.hexin.plat.android/com.hexin.plat.android:id=content_price_sub`);
                    }
                    if (await androidBot.existsElement(`com.hexin.plat.android[1]/com.hexin.plat.android:id=content_price_sub`)) {
                        await androidBot.clickElement(`com.hexin.plat.android[1]/com.hexin.plat.android:id=content_price_sub`);
                    }
                    i++;
                    await androidBot.sleep("100");
                }
                let sync1 = await androidBot.getElementRect(`com.hexin.plat.android[1]/com.hexin.plat.android:id=tv_flashorder_cangwei`);
                let sync2 = await androidBot.getElementRect(`com.hexin.plat.android[1]/com.hexin.plat.android:id=chengjiao`);
                //点击买入按钮   sync1.right.toString(), sync1.bottom.toString(), sync2.left.toString(), sync2.top.toString()
                // let tchxy = await androidBot.findWords("模拟", { region: [sync1.right, sync1.bottom, sync2.left, sync2.top] });
                // show = await androidBot.click(tchxy[0].x, tchxy[0].y);
                if (sync1 != null) {
                    let tchx = (sync1.left + sync2.left) / 2;
                    let thxy = (sync1.top + sync2.top) / 2;
                    await androidBot.click(tchx, thxy); //点击模拟炒股按钮（卖出）
                } else {
                    //调用退出键，回到上一页（操作页面）
                    await androidBot.back();
                    await androidBot.sleep("3000");
                    console.log("sync1获取不到.");
                    return;
                }
                await androidBot.sleep("500");
                //点击确认卖出
                await androidBot.clickElement(`com.hexin.plat.android/@class=android.widget.Button[1]`);
                await androidBot.sleep("500");
                show = await androidBot.clickElement(`com.hexin.plat.android/com.hexin.plat.android:id=ok_btn`);
                await androidBot.sleep("2000");
                //调用退出键，回到上一页（操作页面）
                await androidBot.back();
                await androidBot.sleep("3000");
            }
        }
    }

    async function 数据获取(用户名) {
        let arrRet = [];
        let keybuy = await androidBot.getElementText("com.hexin.plat.android/com.hexin.plat.android:id=menu_buy_text");      //获取模拟界面判定信息（买入键）
        if (keybuy != null) {
            await androidBot.clickElement("com.hexin.plat.android/com.hexin.plat.android:id=tv_genius_more");  //點擊更多牛人
            await androidBot.sleep("1000")
            //遍历寻找，标的用户，并点击查看
            for (let i = 0; ; i++) {
                let text = await androidBot.getElementText(`com.hexin.plat.android/com.hexin.plat.android:id=page_content/android.widget.RelativeLayout/android.webkit.WebView/android.webkit.WebView/android.view.View[2]/android.view.View/android.view.View[${i}]/android.widget.TextView`);//模板字符串
                if (text == 用户名) {//很离谱吧，可能有三种点击,都试着点一遍，绝了！！！
                    await androidBot.clickElement(`com.hexin.plat.android/com.hexin.plat.android:id=page_content/android.widget.RelativeLayout/android.webkit.WebView/android.webkit.WebView/android.view.View[2]/android.view.View/android.view.View[${i}]/android.widget.TextView[2]`);
                    await androidBot.clickElement(`com.hexin.plat.android/com.hexin.plat.android:id=page_content/android.widget.RelativeLayout/android.webkit.WebView/android.webkit.WebView/android.view.View[2]/android.view.View/android.view.View[${i}]/android.widget.TextView[3]`);
                    await androidBot.clickElement(`com.hexin.plat.android/com.hexin.plat.android:id=page_content/android.widget.RelativeLayout/android.webkit.WebView/android.webkit.WebView/android.view.View[2]/android.view.View/android.view.View[${i}]/android.widget.TextView[4]`);
                    break;
                }
                // console.log(text);       //遍历用户名
            }
            //已经进入标的账号页面，后面是提取数据
            await androidBot.sleep("1000");
            let sync = await androidBot.getElementRect(`com.hexin.plat.android/com.hexin.plat.android:id=page_content/android.widget.RelativeLayout/android.webkit.WebView/android.webkit.WebView/android.view.View[3]/android.view.View[1]/android.view.View/android.view.View/android.view.View[1]/android.widget.TextView[1]`);
            if (sync == null) {
                flag = true;    //获取出错，本轮数据无效
                return false;
            }
            if (sync.left == null) {
                flag = true;    //获取出错，本轮数据无效
                return false;
            }
            // console.log(sync.left.toString() + "   " + sync.top.toString());
            await androidBot.swipe(sync.left.toString(), sync.top.toString(), sync.left.toString(), sync.top.toString() - sync.top.toString(), 500);
            await androidBot.sleep("1000");
            //首先判断当前界面能否获取到元素，不能则返回null,后获取股票代码和持股数量,并打包入arrRet
            if (await androidBot.existsElement("com.hexin.plat.android/@class=android.webkit.WebView/android.webkit.WebView/android.view.View[3]/android.view.View[1]/android.view.View/android.view.View/android.view.View[4]/android.widget.TextView")) {
                for (let i = 5; ; i++) {
                    let shcode = await androidBot.getElementText(`com.hexin.plat.android/@class=android.webkit.WebView/android.webkit.WebView/android.view.View[3]/android.view.View[1]/android.view.View/android.view.View/android.view.View[${i}]/android.widget.TextView`);//获取股票名称
                    let shnumber = await androidBot.getElementText(`com.hexin.plat.android/@class=android.webkit.WebView/android.webkit.WebView/android.view.View[3]/android.view.View[1]/android.view.View/android.view.View/android.view.View[${i}]/android.widget.TextView[4]`);//获取股票名称
                    if (shcode == null) {
                        break;
                    }
                    arrRet.push({ x: shcode, y: shnumber });
                }
            }
            await androidBot.back();
            await androidBot.sleep("2000");
            await androidBot.back();
            await androidBot.sleep("2000");
            return arrRet;
        }
    }

    //arr1:跟单目标股票表   arr2:本机股票表
    async function 生成计划(arr1, arr2) {
        if (arr1 == null || arr2 == null) {
            console.log("有数组为空~~前面步骤出问题了，这轮不算");
            return false;
        }
        //arr3计划队列数组
        let arr3 = [];

        //遍历跟单目标股票表，检测同名票，若有购买数量差异，则操作其中差异，使其进入新数组
        //检测不到同名票，则直接添加入新数组
        for (let i = 0; i < arr1.length; i++) {
            for (let z = 0; z < arr2.length; z++) {
                if (arr1[i].x == arr2[z].x) {
                    let y = arr1[i].y - arr2[z].y;
                    if (y != 0) {
                        // arr3[i] = { x: arr1[i].x, y: y };
                        arr3.push({ x: arr1[i].x, y: y });      //数组直接向后加元素
                        break;
                    } else {
                        break;
                    }
                } else if (z == arr2.length - 1) {
                    if (arr1[i].y != 0) {
                        arr3.push(arr1[i]);
                    }
                }
            }
        }
        //遍历本机股票表，找不到相同票，说明对方已卖出，所以执行卖出操作(卖出标记为负数)
        for (let i = 0; i < arr2.length; i++) {
            for (let z = 0; z < arr1.length; z++) {
                if (arr2[i].x == arr1[z].x) {
                    break;
                } else if (z == arr1.length - 1) {
                    arr3.push({ x: arr2[i].x, y: -arr2[i].y });
                }
            }
        }
        //本机股票一个都没买过！！！
        if (arr2.length == 0) {
            // arr3 = arr1;     //这样写应该没问题啊，不知道为什么会出问题。。然后就换成下面的写法了
            for (let i = 0; i < arr1.length; i++) {
                if (arr1[i].y != 0) {
                    arr3.push({ x: arr1[i].x, y: arr1[i].y });
                }
            }
        }
        //对面空仓了~
        if (arr1.length == 0) {
            for (let i = 0; i < arr2.length; i++) {
                arr3.push({ x: arr2[i].x, y: -arr2[i].y });
            }
        }
        return arr3;
    }



    async function 我的ocr() {

        let initOcr = await androidBot.initOcr("192.168.1.3");
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

    async function 运行检测() {
        let appname;
        while (true) {
            appname = await androidBot.getPackage();
            if (appname !== "com.hexin.plat.android") {
                await androidBot.startApp("com.hexin.plat.android");
                console.log("可能出故障了，自动启动一次软件");
                await androidBot.sleep(12000);
                //点击主界面交易栏目
                await androidBot.clickElement(`com.hexin.plat.android/com.hexin.plat.android:id=title[3]`);
                await androidBot.sleep("500");
                //点击交易里面的模拟按钮
                await androidBot.clickElement(`com.hexin.plat.android/com.hexin.plat.android:id=tab_mn`);
                await androidBot.sleep("500");
            }
            await androidBot.sleep(30000);
        }
    }
}
