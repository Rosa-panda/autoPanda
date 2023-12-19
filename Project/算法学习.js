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
    /*********************************************************以上类似常量存在,尽量不要动**********************************************************/

    let res = tailRecur(3, 0);
    console.log(await res.then());

    // nestedForLoop(23);
    // let res = recur(11111111111111111111111111111111111);
    // console.log(await res.then());


    /***************************************************************以下为函数区域**************************************************************/

    /**
     * for循环的使用
     * 以下函数基于 for 循环实现了求和 1 + 2 + ⋯ + 𝑛 ，求和结果使用变量 res 记录。
     * @param {1+2+...+n} n 
     * @returns 
     */
    async function forLoop(n) {
        let res = 0;
        for (let i = 0; i <= n; i++) {
            res += i;
        }
        console.log("forLoop" + res)
        return res;
    }

    /**
     * while循环的使用
     *  while 循环来实现求和 1 + 2 + ⋯ + 𝑛 。
     * @param {1+2+...+n} n 
     */
    async function whileLoop(n) {
        let res = 0;
        let i = 1;
        while (i <= n) {
            res += i;
            i++;
        }
        console.log("whileLoop" + res);
        return res;
    }
    //for 循环的代码更加紧凑，while 循环更加灵活

    /**
     * 双重for循环,函数的操作数量与 𝑛2 成正比，或者说算法运行时间和输入数据大小 𝑛 成“平方关系”。
     * 我们可以继续添加嵌套循环，每一次嵌套都是一次“升维”，将会使时间复杂度提高至“立方关系”、“四
     * 次方关系”、以此类推。
     * @param {1+2+...+n} n 
     */
    async function nestedForLoop(n) {
        let res = '';
        for (let i = 1; i < n; i++) {
            for (let j = 1; j < n; j++) {
                res += `(${i}, ${j}),`;
            }
        }
        console.log(res);
        return res;
    }
    /**
     * 「递归 recursion」是一种算法策略，通过函数调用自身来解决问题。它主要包含两个阶段。
     * 1. 递：程序不断深入地调用自身，通常传入更小或更简化的参数，直到达到“终止条件”。
     * 2. 归：触发“终止条件”后，程序从最深层的递归函数开始逐层返回，汇聚每一层的结果。而从实现的角度看，
     * 递归代码主要包含三个要素。
     * 1. 终止条件：用于决定什么时候由“递”转“归”。
     * 2. 递归调用：对应“递”，函数调用自身，通常输入更小或更简化的参数。
     * 3. 返回结果：对应“归”，将当前递归层级的结果返回至上一层。
     * 观察以下代码，我们只需调用函数 recur(n) ，就可以完成 1 + 2 + ⋯ + 𝑛 的计算：
     * @param {1+2+...+n} n 
     * @returns 
     */
    async function recur(n) {
        //终止条件
        if (n === 1) return 1;
        //递:递归调用
        const res = recur(n - 1);
        //归:返回结果
        return n + await res.then(); //.then可以取出PromiseValue里面的值 ,而且.then是异步的,所以前面加一个await
    }

    /**
     * 尾递归
     * @param {1+2+...+n} n 
     * @param {默认为应为0,存储结果} res 
     * @returns 
     */
    async function tailRecur(n, res) {
        //终止条件
        if (n === 0) return res;
        //尾递归调用
        return tailRecur(n - 1, res + n);
    }

    /**
     * 不用循环了,直接降维打击!
     * @param {} n 
     * @returns 
     */
    async function addLoopN(n) {
        let res = (n * (n + 1)) / 2;
        console.log("addLoopN" + res);
        return res;
    }



}


