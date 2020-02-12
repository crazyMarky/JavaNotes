# Thread.sleep、Object.wait、LockSupport.park 区别
在java语言中，可以通过3种方式让线程进入休眠状态，分别是Thread.sleep()、Object.wait()、LockSupport.park()方法。这三种方法的表现和原理都各有不同，今天稍微研究了下这几个方法的区别。

## Thread.sleep() 方法
Thread.sleep(time)方法必须传入指定的时间，线程将进入休眠状态，通过jstack输出线程快照的话此时该线程的状态应该是TIMED_WAITING，表示休眠一段时间。

另外，该方法会抛出InterruptedException异常，这是受检查异常，调用者必须处理。

通过过sleep方法进入休眠的线程不会释放持有的锁，因此，在持有锁的时候调用该方法需要谨慎。

## Object.wait() 方法

我们都知道，java的每个对象都隐式的继承了Object类。因此每个类都有自己的wait()方法。我们通过object.wait()方法也可以让线程进入休眠。wait()有3个重载方法:

``` java
public final void wait() throws InterruptedException;
public final native void wait(long timeout) throws InterruptedException;
public final native void wait(long timeout) throws InterruptedException;
```

如果不传timeout，wait将会进入无限制的休眠当中，直到有人唤醒他。使用wait()让线程进入休眠的话，无论有没有传入timeout参数，线程的状态都将是WAITING状态。

另外，必须获得对象上的锁后，才可以执行该对象的wait方法。否则程序会在运行时抛出IllegalMonitorStateException异常。

在调用wait()方法后，线程进入休眠的同时，会释放持有的该对象的锁，这样其他线程就能在这期间获取到锁了。

调用Object对象的notify()或者notifyAll()方法可以唤醒因为wait()而进入等待的线程。

```java
//正确的调用方式  
Object waitObject = new Object();
try {
    //先获取到waitObject的锁
    synchronized (waitObject){
        waitObject.wait();
    }
} catch (InterruptedException e) {
      e.printStackTrace();
}
```

## LockSupport.park() 方法

通过LockSupport.park()方法，我们也可以让线程进入休眠。它的底层也是调用了Unsafe类的park方法：

调用park方法时，还允许设置一个blocker对象，主要用来给监视工具和诊断工具确定线程受阻塞的原因。

调用park方法进入休眠后，线程状态为WAITING。

### 实现原理
LockSupport.park() 的实现原理是通过二元信号量做的阻塞，要注意的是，这个信号量最多只能加到1。我们也可以理解成获取释放许可证的场景。unpark()方法会释放一个许可证，park()方法则是获取许可证，如果当前没有许可证，则进入休眠状态，知道许可证被释放了才被唤醒。无论执行多少次unpark()方法，也最多只会有一个许可证。

### 和wait的不同
park、unpark方法和wait、notify()方法有一些相似的地方。都是休眠，然后唤醒。但是wait、notify方法有一个不好的地方，就是我们在编程的时候必须能保证wait方法比notify方法先执行。如果notify方法比wait方法晚执行的话，就会导致因wait方法进入休眠的线程接收不到唤醒通知的问题。而park、unpark则不会有这个问题，我们可以先调用unpark方法释放一个许可证，这样后面线程调用park方法时，发现已经许可证了，就可以直接获取许可证而不用进入休眠状态了。

另外，和wait方法不同，执行park进入休眠后并不会释放持有的锁。

### 对中断的处理
park方法不会抛出InterruptedException，但是它也会响应中断。当外部线程对阻塞线程调用interrupt方法时，park阻塞的线程也会立刻返回。

```java
Thread parkThread = new Thread(new Runnable() {
            @Override
            public void run() {
                System.out.println("park begin");

                //等待获取许可
                LockSupport.park();
                //输出thread over.true
                System.out.println("thread over." + Thread.currentThread().isInterrupted());

            }
        });
        parkThread.start();

        Thread.sleep(2000);
        // 中断线程
        parkThread.interrupt();

        System.out.println("main over");

```

