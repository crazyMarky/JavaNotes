# Java面试-高频基础题（20题）-有答案与解析

## 1、求以下这些例子的输出结果（考察点：自增变量）：
``` java
public static void main(String[] args){
    int i = 1;
    i = i++ ;
    int j = i++;
    int k = i+ ++i * i++;
    System.out.println("i="+i);
    System.out.println("j="+j);
    System.out.println("k="+k);
}

```

### 1.1分析：
1、int i = 1, 得i = 1 

2、i = i++ ，目前i = 1,将其压入操作数栈，在“=”号返回之前，修改i的值为2，然后“=”将栈中的1赋给i，因此目前i = 1

3、同理上一步，j = 1，i = 2

4、目前i的值为2，将其压入操作数栈，然后遇到了++i，将3压入操作数栈，又遇到i++，也将3压入操作数栈，本地变量i变为4。

所以目前操作数栈：3 3 2。局部变量i = 4，j = 1 

最后使用运算符计算值：k = 2 + 3 * 3 = 11

最终结果：
```
i = 4
j = 1
k = 11 
``` 

### 1.2小结：
1、赋值操作，最后才计算值。

2、等号右边的，从左到右加载值并依次压入操作数栈。

3、实际算哪个要看运算符的优先级。

4、自增、自减操作都是直接改变变量的值，不经过操作数栈。

5、没赋值之前，临时结果存储在操作数栈中。

## 2、单例模式（考察多种实现方式，多线程环境）

- 一个类只有一个实例
    - 构造器私有化
- 必须是他自己创建实例
    - 必须有一个静态变量保存这个类的唯一实例
- 必须向系统提供这个实例
    - 提供一个方法给外部获取实例

### 实现的方式

#### 1.1饿汉式
特点：直接创建对象，不存在线程问题
 - 直接饿汉
 - 枚举类
 - 静态代码块实现饿汉式


``` java
/**
 * 直接饿汉：
 * 直接创建对象，不存在线程问题
 *
 */
public class Singleton01 {
    //使用public，而且是final
    public final static Singleton01 INSTANCE = new Singleton01();

    //私有构造
    private Singleton01(){
    }
}
```
``` java
/**
 * 枚举饿汉式
 * 枚举类就是限定若干个实例
 * 我们只限定一个实例就是单例模式
 */
public enum  Singleton02 {
    INSTANCE;
}

```

``` java
/**
 * 静态代码块的饿汉式
 * 在静态代码可以编写一些设置属性的方法，更灵活
 */
public class Singleton03 {
    //使用public，而且是final
    public final static Singleton03 INSTANCE ;

    private String info ;

    static {
        Properties properties = new Properties();
        try {
            //读取配置文件(提前在类路径下，写一个文件singleton/kv.properties)
            properties.load(Singleton03.class.getClassLoader().getResourceAsStream("singleton/kv.properties"));
            //读取值
            String info1 = properties.getProperty("info");
            INSTANCE = new Singleton03(info1);
        } catch (IOException e) {
            throw new RuntimeException();
        }
    }

    private Singleton03(){

    }

    private Singleton03(String info){
        this.info = info;
    }

```
#### 1.2懒汉式
 特点： 延迟创建对象   
- 普通懒汉式，有线程安全问题
- 基于普通懒汉式，增加双重校验锁避免线程安全问题
- 用静态内部类实现，也能适应多线程环境

```java
/**
 * 普通懒汉式：
 * 延迟加载，但是有线程安全问题
 */
public class Singleton04 {
    private static Singleton04 instance ;
    private Singleton04(){

    }

    /**
     * 调用获取方法时才加载实例
     * @return
     */
    public static Singleton04 getInstance()  {
        if (null == instance){
            try {
                //设置一些阻碍，更容易暴露多线程中的问题
                Thread.sleep(1000);
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
            instance = new Singleton04();
        }
        return instance;
    }
}

```

```java
public class TestSingleton04 {
    public static void main(String[] args) {
        /**
         * 多线程环境
         */
        Callable<Singleton04> singleton04Callable  = () -> Singleton04.getInstance();
        ExecutorService executorService = Executors.newFixedThreadPool(2);
        Future<Singleton04> submit = executorService.submit(singleton04Callable);
        Future<Singleton04> submit2 = executorService.submit(singleton04Callable);
        try {
            System.out.println(submit.get() == submit2.get());
            System.out.println(submit.get());
            System.out.println(submit2.get());
        } catch (InterruptedException e) {
            e.printStackTrace();
        } catch (ExecutionException e) {
            e.printStackTrace();
        }finally {
            executorService.shutdown();
        }

    }
}
```


```java
/**
 * 双重锁校验的懒汉式：
 * 延迟加载，且线程安全
 */
public class Singleton05 {
    private static Singleton05 instance ;
    private Singleton05(){

    }

    /**
     * 调用获取方法时才加载实例
     * @return
     */
    public static Singleton05 getInstance()  {
        //双重锁校验，提高了性能和安全
        if (null == instance){
            synchronized (Singleton05.class){
                if (null == instance){
                    try {
                        //设置一些阻碍，更容易暴露多线程中的问题
                        Thread.sleep(100);
                    } catch (InterruptedException e) {
                        e.printStackTrace();
                    }
                    instance = new Singleton05();
                }
            }
        }
        return instance;
    }
}

```

```java
/**
 * 静态内部类实现的懒汉式：
 * 延迟加载，且线程安全
 */
public class Singleton06 {
    private Singleton06(){

    }

    /**
     * 静态内部类只有在调用时才会加载
     */
    private static class Inner{
        private static Singleton06 instance = new Singleton06();

    }

    /**
     * 调用获取方法时才加载实例
     * @return
     */
    public static Singleton06 getInstance()  {
        return Inner.instance;
    }
}
```

## 3、类的初始化和实例的初始化（考点：类是怎么初始化的？实例是怎么初始化的？多态性？）

### Q:求出输出结果

``` java
public class Father {
    private int i = test();
    private static int j = method();

    static {
        System.out.println("(1)");
    }

    Father(){
        System.out.println("(2)");
    }

    {
        System.out.println("(3)");
    }

    public int test(){
        System.out.println("(4)");
        return 1;
    }

    public static int method(){
        System.out.println("(5)");
        return 1;
    }
}

```

``` java
public class Son extends Father{
    private int i = test();
    private static int j = method();

    static {
        System.out.println("(6)");
    }

    Son(){
        System.out.println("(7)");
    }

    {
        System.out.println("(8)");
    }

    public int test(){
        System.out.println("(9)");
        return 1;
    }

    public static int method(){
        System.out.println("(10)");
        return 1;
    }

    public static void main(String[] args) {
        Son son = new Son();
        System.out.println();
        Son son1 = new Son();
    }
    //解题步骤：

        //第一步：类的初始化：
        //从main方法存在的类开始加载，也就是Son类，但是加载前要先加载他的父类father的<clinit>()方法
        //一个类的初始化就是执行< clinit >()方法，且只会执行一次
        //< clinit >()方法由静态类变量显式赋值代码和静态代码块组成，从上到下按顺序执行
        //所以先输出(5)(1)
        //然后回到子类的初始化，输出(10)(6)

        //第二步：实例的初始化
        //执行实例初始化是执行<init>()方法，<init>()方法可能重载有多个，有几个构造器就有几个< init >()方法
        // < init >()方法由非静态实例变量显式赋值代码和非静态代码块、对应构造器代码组成
        // 非静态实例变量显式赋值代码和非静态代码块从上到下顺序执行，而对应构造器的代码最后执行
        // 每次创建实例对象，调用对应构造器，执行的就是对应的< init >()方法
        // < init >()方法的首行是super()或super(实参列表)，即对应父类的< init >()方法
        // 所以执行new Son()时，先执行父类的非静态实例变量显式赋值和非静态代码块
        //执行父类 private int i = test();时，由于该方法已被子类重写，this的指向为子类，
        //因此执行的是子类的method方法，输出(9)
        //然后执行到父类的非静态代码块，输出(3)
        //最后才会执行父类的无参构造函数，输出(2)
        //回到子类，遇到子类的 private int i = test();时，输出(9)
        //执行子类的非静态代码块，输出(8)
        //最后才执行子类的无参构造函数，输出(7)

        /**最终结果：
         (5)
         (1)
         (10)
         (6)
         (9)
         (3)
         (2)
         (9)
         (8)
         (7)

         (9)
         (3)
         (2)
         (9)
         (8)
         (7)
         */
}
```

解题关键：
### 类初始化的过程
- 一个类要创建实例需要先加载并初始化该类
    - main方法所在的类需要先加载和初始化
- 一个子类的初始化需要先初始化父类
- 一个类的初始化就是执行< clinit >()方法，且只会执行一次
    - < clinit >()方法由静态类变量显式赋值代码和静态代码块组成
    - 类变量显式赋值代码和静态代码块从上到下按顺序执行
    - < clinit >()方法只执行一次

### 实例初始化的过程
实例初始化就是执行< init >()方法

- < init >()方法可能重载有多个，有几个构造器就有几个< init >()方法
- < init >()方法由非静态实例变量显式赋值代码和非静态代码块、对应构造器代码组成
- 非静态实例变量显式赋值代码和非静态代码块从上到下顺序执行，而对应构造器的代码最后执行
- 每次创建实例对象，调用对应构造器，执行的就是对应的< init >()方法
- < init >()方法的首行是super()或super(实参列表)，即对应父类的< init >()方法

## 4、方法的参数传递机制

### Q:以下代码的输出结果是？

```java
/**
 * 参数的传递机制
 */
public class TestParameter {

    public static void main(String[] args) {
        int i = 1;
        String str = "hello";
        Integer num = 200;
        int[] arr = {1,2,3,4,5};
        MyData my = new MyData();
        change(i,str,num,arr,my);

        System.out.println("i = " + i);
        System.out.println("str = " + str);
        System.out.println("num = " + num);
        System.out.println("arr = " + Arrays.toString(arr));
        System.out.println("my.a = " + my.a);
    }

    public static void change(int j, String s, Integer n, int[] a, MyData m){
        j += 1;
        s += "world";
        n += 1;
        a[0] += 1;
        m.a += 1;
    }

}

class MyData{
    int a = 10;
}
```

结果：
```
i = 1
str = hello
num = 200
arr = [2, 2, 3, 4, 5]
my.a = 11
```
分析：
- 1、形参是基本数据类型
    - 传递数据值
- 2、实参是引用数据类型
    - 传递地址值
    - 特色的类型：String、包装类等对象不可变性

## 5、递归
时间复杂度？
空间复杂度？

### Q:求N步的台阶，有多少种走法？

实现方式：

### 1、递归
```java
    //递归实现 01
    public int f01(int n){
        if (n < 1){
            return 0;
        }
        if (n == 1 || n == 2){
            return n;
        }

        return f01(n-1) + f01(n-2);
    }

```

### 2、迭代
``` java
    /**
     * 迭代实现 02
     * @param n
     * @return
     */
    public long f02(int n){
        if (n < 1){
            return 0;
        }
        if (n == 1 || n == 2){
            return n;
        }
        //初始化：走第一级台阶有一种走法，走第二级台阶有两种走法
        int first = 1, second = 2;
        int third = 0;
        //把每次计算的结果保存在变量中，避免重复计算
        for (int i = 3; i <= n; i++) {
            third = first + second;
            first = second;
            second = third;
        }
        return third;
    }
```

## 6、成员变量与局部变量


### Q:求输出的结果？
```java
/**
 * 变量的作用域、变量的分类、this指向
 *
 * 求输出的结果？
 */
public class Variable {
    static int s;
    int i;
    int j;

    {
        int i = 1;
        i++;
        j++;
        s++;
    }

    public void test(int j){
        j++;
        i++;
        s++;
    }

    public static void main(String[] args) {
        Variable variable1 = new Variable();
        Variable variable2 = new Variable();
        variable1.test(10);
        variable1.test(20);
        variable2.test(30);
        System.out.println(variable1.i+","+variable1.j+","+variable1.s);
        System.out.println(variable2.i+","+variable2.j+","+variable2.s);

        //解析：
        /**
         * main方法的第一句，variable1 = new Variable()，执行< init >()方法，先执行非静态代码块的内容，最后才执行无参构造方法
         * 代码块中，int i = 1;i++;，根据就近原则 ，该代码块中的i为2，不会影响成员变量i，i=0
         * j++使得成员变量j，变为1
         * s++使得类变量，变为1
         * 同理，重复执行一次variable2 = new Variable()
         * 变量i与变量j与variable1一致，将类变量s变为2
         * variable1.test(10)，由于形参名为j，j++只会改变局部变量，不是成员变量j，维持1；i++会让成员变量i+1,所以i=1,类变量s为3
         * variable1.test(20)，由于形参名为j，j++只会改变局部变量，不是成员变量j，维持1；i++会让成员变量i+1,所以i=2,类变量s为4
         * variable1.test(30)，由于形参名为j，j++只会改变局部变量，不是成员变量j，维持1；i++会让成员变量i+1,所以i=1,类变量s为5
         * 最终输出：
         * 2,1,5
         * 1,1,5
         *
         */

    }
}
```

## 7、Spring Bean的作用域有哪些，有什么区别？
单例singlton、原型prototype、Request、Sesstion

区别：
- 单例模式是默认的作用域，在启动容器时，该bean就会被创建实例，且只有一个实例
- 原型模式有多个实例，只在每次获取该实例时才创建
- Request在web环境下，一个请求创建一个实例
- Sesstion在web环境下，一个会话求创建一个实例

## 8、请介绍spring支持的常用数据库传播属性和事务隔离级别

### 传播属性：
这篇博客讲的很好
https://blog.csdn.net/weixin_39625809/article/details/80707695

当事务方法被另一个事务方法调用时，必须指定事务应该如何传播。例如，方法可能继续在现有事务中运行，也可能会开启一个新的事务，并在自己的事务中运行。
事务的传播行为由传播属性指定，spring中定义了7种类传播行为。

| 传播属性 | 描述 |
| :--- | :-- |
|REQUIRED     |如果有事务在运行，当前的方法就在这个事务运行，否则，就启动一个新的事务，并在自己的事务内运行          |
|REQUIRES_NEW      |当前的方法必须启动新事务，并在它自己的事务内运行，如果有事务正在运行，应该将它挂起          |
|SUPPORTS      |如果有事务在运行，当前的方法就在这个事务内运行，否则它可以不运行在事务中          |
|NOT_SUPPORTS      |当前的方法不应该运行在事务中，如果有运行的事务，将它挂起|
|MANDATORY      |当前的方法必须运行在事务中，如果没有正运行的事务，就抛出异常          |
|NEVER      |当前方法不应该运行在事务中，如果当前正有一个事务运行，则会抛出异常          |
|NESTED      |如果当前已经存在一个事务，那么该方法将会嵌套事务中运行。嵌套的事务可以独立于当前事务进行单独地提交或回滚，如果当前事务不存在，那么其行为与REQUIRED一致。          |

### PROPAGATION_NESTED 与PROPAGATION_REQUIRES_NEW的区别:
> 它们非常类似,都像一个嵌套事务，如果不存在一个活动的事务，都会开启一个新的事务。 
> 使用 PROPAGATION_REQUIRES_NEW时，内层事务与外层事务就像两个独立的事务一样，一旦> 内层事务进行了提交后，外层事务不能对其进行回滚。两个事务互不影响。两个事务不是一> 个真正的嵌套事务。同时它需要JTA事务管理器的支持。
> 
> 使用PROPAGATION_NESTED时，外层事务的回滚可以引起内层事务的回滚。而内层事务的异> 常并不会导致外层事务的回滚，它是一个真正的嵌套事务。> DataSourceTransactionManager使用savepoint支持PROPAGATION_NESTED时，需要JDBC > 3.0以上驱动及1.4以上的JDK版本支持。其它的JTATrasactionManager实现可能有不同的支> 持方式。
> 
> PROPAGATION_REQUIRES_NEW 启动一个新的, 不依赖于环境的 “内部” 事务. 这个事务将> 被完全 commited 或 rolled back 而不依赖于外部事务, 它拥有自己的隔离范围, 自己的> 锁, 等等. 当内部事务开始执行时, 外部事务将被挂起, 内务事务结束时, 外部事务将继续> 执行。
> 
> 另一方面, PROPAGATION_NESTED 开始一个 “嵌套的” 事务, 它是已经存在事务的一个真正> 的子事务. 潜套事务开始执行时, 它将取得一个 savepoint. 如果这个嵌套事务失败, 我> 们将回滚到此 savepoint. 潜套事务是外部事务的一部分, 只有外部事务结束后它才会被提> 交。
> 
> 由此可见, PROPAGATION_REQUIRES_NEW 和 PROPAGATION_NESTED 的最大区别在于, > PROPAGATION_REQUIRES_NEW 完全是一个新的事务, 而 PROPAGATION_NESTED 则是外部事> 务的子事务, 如果外部事务 commit, 嵌套事务也会被 commit, 这个规则同样适用于 > roll back.

### 不同事务级别带来的并发问题：
假设现在有两个事务，T1和T2并发的执行
- 1、脏读：
    - 1、T1将某条记录的AGE值从20修改为30
    - 2、T2读取了T1修改后的值，30
    - 3、T1回滚了，AGE又变回了20 
    - 4、T2读取到的30就是一个无效的值
- 2、不可重复读：
    - 1、T1读取AGE值为20
    - 2、T2修改AGE为30
    - 3、T1再次读取AGE，前后不一致
- 3、幻读：
    - 1、T1读取了STUDENT表的一部分数据
    - 2、T2想STUDENT表插入了新行
    - 3、T1再次读取了STUDENT表，发现多了新行

### 数据库事务的隔离级别：

- 1、 **Read UnCommitted(读未提交)**
最低的隔离级别。一个事务可以读取另一个事务并未提交的更新结果。

- 2、 **Read Committed(读提交)**
大部分数据库采用的默认隔离级别。一个事务的更新操作结果只有在该事务提交之后，另一个事务才可以的读取到同一笔数据更新后的结果。

- 3、 **Repeatable Read(重复读)**
mysql的默认级别。整个事务过程中，对同一笔数据的读取结果是相同的，不管其他事务是否在对共享数据进行更新，也不管更新提交与否。

- 4、 **Serializable(序列化)**
最高隔离级别。所有事务操作依次顺序执行。注意这会导致并发度下降，性能最差。通常会用其他并发级别加上相应的并发锁机制来取代它。

## 9、简单谈一下SpringMVC的工作流程

### spring的MVC执行原理

- 1.spring mvc将所有的请求都提交给DispatcherServlet,它会委托应用系统的其他模块负责对请求 进行真正的处理工作。
- 2.DispatcherServlet查询一个或多个HandlerMapping,找到处理请求的Controller.
- 3.DispatcherServlet请请求提交到目标Controller
- 4.Controller进行业务逻辑处理后，会返回一个ModelAndView
- 5.Dispathcher查询一个或多个ViewResolver视图解析器,找到ModelAndView对象指定的视图对象
- 6.视图对象负责渲染返回给客户端。

### SpringMVC执行流程：

![](https://img-blog.csdn.net/20160905135531151?watermark/2/text/aHR0cDovL2Jsb2cuY3Nkbi5uZXQv/font/5a6L5L2T/fontsize/400/fill/I0JBQkFCMA==/dissolve/70/gravity/Center)

- 1、用户发起请求到前端控制器（Controller）
- 2、前端控制器没有处理业务逻辑的能力，需要找到具体的模型对象处理（Handler），到处理器映射器（HandlerMapping）中查找Handler对象（Model）。
- 3、HandlerMapping返回执行链，包含了2部分内容： ① Handler对象、② 拦截器数组
- 4、前端处理器通过处理器适配器包装后执行Handler对象。
- 5、处理业务逻辑。
- 6、Handler处理完业务逻辑，返回ModelAndView对象，其中view是视图名称，不是真正的视图- 对象。
- 8、将ModelAndView返回给前端控制器。
- 9、视图解析器（ViewResolver）返回真正的视图对象（View）。
- 10、（此时前端控制器中既有视图又有Model对象数据）前端控制器根据模型数据和视图对象，- 进行视图渲染。
- 11、返回渲染后的视图（html/json/xml）返回。
- 12、给用户产生响应。


## 10、Linux常用命令-服务类

### centos6 - service命令常用命令

- service servicename start     开始服务
- service servicename stop      停止服务
- service servicename restart   重启服务（重启 stop+start）
- service servicename reload    重新加载配置文件
- service servicename status    服务的状态
- /etc/init.d/服务名            查看服务
- chkconfig --list              查看服务
- chkconfig --level 5 servicename on    设置自启动

### centos7 - systemctl命令
- systemctl start servicename 
- systemctl restart servicename 
- systemctl stop servicename 
- systemctl reload servicename 
- systemctl status servicename 
- systemctl list-unit-file      查看服务
- systemctl --type service      查看服务
- systemctl enable servicename  设置自启动

## 11、Git常用命令
- 创建分支 git branch <name> 

- 切换分支 git checkout <name>

- 创建并切换分支 git checkout -b <name>

- 合并分支 git merge <name>

- 删除分支 git branch -D <name>

这里还可以补充一下git工作流

## 12、Redis的持久化
### RDB 
一段时间内将内存中的数据写入硬盘，也就是snapShot快照，它恢复时，将快照文件直接读到内存中。
RDB执行的机制：Redis会单独fork一个子进程来进行持久化，会将数据先写入到一个临时的文件中，待持久化的进程结束，才替换上次的持久化文件。整个过程中，主进程是不需要进行任何的IO操作的，这确保了极高的性能，如果需要大规模的数据恢复，且对于数据恢复完整性不敏感的场景下，RDB比AOF更为高效，但是缺点是最后一次持久化之后的数据会丢失。

### RDB的优点：
- 节省磁盘空间
- 恢复速度快

### RDB的缺点：
- 最后一次持久化之后的数据会丢失。
- 虽然使用了fork写时拷贝数据，但是如果数据庞大时还是比较消耗性能。

### AOF持久化
以日志的形式，记录每个写操作，将Redis执行过的写操作记录在，且只允许追加，不可改写文件，Redis启动时，会读取该文件，并重新构建数据。

### AOF的优点
- 备份机制明确，丢失数据的概率低
- 可读的日志文件，通过AOF操作，可以处理误操作

### AOF的缺点：
- 占用的 磁盘空间较大
- 恢复速度较慢
- 每次读写都同步的话，有一定的压力
- 存在个别bug，造成不能恢复

## 13、MySQL索引（待完善）

### MySQL数据库引擎


### 查询优化

## 14、JVM垃圾回收机制（待完善）
### Q：GC发生在JVM的哪个部分？有几种GC？它们的算法是什么？
垃圾回收发生在堆区
- Minor GC 
- Full GC
- 永久代

GC的算法：

    - 复制算法：在年轻代中采用的是复制算法
    - 标记清除：标记清除的内存

### 15、平衡二叉树（树的旋转）
平衡二叉树建立在二叉排序树的基础上，目的是使二叉排序树的平均查找长度更小，即让各结点的深度尽可能小，因此，树中每个结点的两棵子树的深度不要偏差太大。

平衡二叉树的递归定义：平衡二叉树是一棵二叉树，其可以为空，或满足如下2个性质：①左右子树深度之差的绝对值不大于1。②左右子树都是平衡二叉树。

平衡因子的概念：结点的平衡因子 = 结点的左子树深度 — 结点的右子树深度。若平衡因子的取值为-1、0或1时，该节点是平衡的，否则是不平衡的。

最低不平衡结点的概念：用A表示最低不平衡结点，则A的祖先结点可能有不平衡的，但其所有后代结点都是平衡的。

![](https://upload-images.jianshu.io/upload_images/4891882-40caa36a7b232bf1.png?imageMogr2/auto-orient/strip|imageView2/2/w/800/format/webp)

- 左左情况

注意，此时的左左情况是基于自下而上（从插入的新叶子节点往上查找）的第一个不平衡的节点。这个基准点很重要，所有的操作都与这个点有关，反而新插入的叶子节点不一定需要参与旋转。
图中的root节点就是基准点。
如果root的左子树pivot存在，并且pivot的左子树也存在，则满足左左情况，进行一次右旋操作，即可平衡。
- 右右情况

图中的root节点就是基准点（同上）。
如果root的右子树pivot存在，并且pivot的右子树也存在，则满足右右情况，进行一次左旋操作，即可平衡。
- 左右情况

注意，此时的图有误导的可能，基准点不再是root节点，因为root节点是平衡的。
现在的基准点是root节点的父节点，我们暂且称它为parent节点。
如果parent的左子树root存在，并且root的右子树也存在，则满足左右情况，先进行一次左旋操作，变成第一种情况。基准点始终不变，再按第一种情况进行一次右旋操作，即可平衡。
- 右左情况

跟第三种情况类似，root节点的父节点parent为基准点。
如果parent的右子树root存在，并且root的左子树也存在，则满足右左情况，先进行一次右旋操作，变成第二种情况。基准点始终不变，再按第二种情况进行一次左旋操作，即可平衡。

## 16、ES和Solr的区别

