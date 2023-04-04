class functionLink {
    constructor(options) {
        this.name = options.name || "";
        this.parameters = options.parameters || new Array(0);
    }
}

class SpinningCoin {
    constructor(options) {
        this.ctx = options.ctx;

        this.image = options.image;

        this.frameIndex = 0;
        this.tickCount = 0;
        this.ticksPerFrame = options.ticksPerFrame || 0;
        this.numberOfFrames = options.numberOfFrames || 1;

        this.width = options.width;
        this.height = options.height;
        this.resultFieldSelector = options.resultFieldSelector || "";

        window.requestAnimationFrame(() => this.render());
    }

    allPassedFrames = 0;
    animationInProcess = false;

    #ticksOnMaxSpeed = 2;
    #ticksOnMinSpeed = 8;

    #queue = new Array(0);
    #functionCalledByQueue = false;

    /*Обновление монетки*/
    update() {
        this.tickCount++;

        if (this.tickCount > this.ticksPerFrame) {
            this.tickCount = 0;
            this.allPassedFrames++;
            if (this.frameIndex < this.numberOfFrames - 1) {
                this.frameIndex++;
            } else {
                this.frameIndex = 0;
            }
        }
    }

    /*Прорисовка монетки*/
    render() {
        this.ctx.clearRect(0, 0, this.width / this.numberOfFrames, this.height);
        this.ctx.drawImage(
            this.image,
            this.frameIndex * this.width / this.numberOfFrames,
            0,
            this.width / this.numberOfFrames,
            this.height,
            0,
            0,
            this.width / this.numberOfFrames,
            this.height
        )
    }

    /*Бесконечное вращение*/
    infinitySpin() {
        if (!this.animationInProcess && (this.#queue.length == 0 || this.#functionCalledByQueue)) {
            this.#functionCalledByQueue = false;
            this.animationInProcess = true;
            let loop = () => {
                this.update();
                this.render();

                window.requestAnimationFrame(loop);
            }

            window.requestAnimationFrame(loop);
        } else {
            this.#queue.length = this.#queue.length + 1;
            this.#queue[this.#queue.length - 1] = new functionLink({
                name: this.spinByMilliseconds,
                parameters: [msToStop]
            });
        }
    }

    /*Вращение по времени (сек * 100)*/
    spinByMilliseconds(msToStop) {
        if (!this.animationInProcess && (this.#queue.length == 0 || this.#functionCalledByQueue)) {
            this.#functionCalledByQueue = false;
            let timePassed = 0;
            let timePlus = setInterval(() => ++timePassed, 10);
            this.animationInProcess = true;
            let loop = () => {
                this.update();
                this.render();
                if (timePassed < msToStop) {
                    window.requestAnimationFrame(loop);
                } else {
                    this.animationInProcess = false;
                    clearInterval(timePlus);
                    this.#checkQueue();
                }
            }

            window.requestAnimationFrame(loop);
        } else {
            this.#queue.length = this.#queue.length + 1;
            this.#queue[this.#queue.length - 1] = new functionLink({
                name: this.spinByMilliseconds,
                parameters: [msToStop]
            });
        }
    }

    /*Вращение по фреймам*/
    spinByFrames(framesToStop) {
        if (!this.animationInProcess && (this.#queue.length == 0 || this.#functionCalledByQueue)) {
            this.#functionCalledByQueue = false;
            let firstFrame = this.allPassedFrames;
            this.animationInProcess = true;
            let loop = () => {
                this.update();
                this.render();
                if (this.allPassedFrames - firstFrame < framesToStop) {
                    window.requestAnimationFrame(loop);
                } else {
                    this.animationInProcess = false;
                    this.#checkQueue();
                }
            }

            window.requestAnimationFrame(loop);
        } else {
            this.#queue.length = this.#queue.length + 1;
            this.#queue[this.#queue.length - 1] = new functionLink({
                name: this.spinByFrames,
                parameters: [framesToStop]
            });
        }
    }

    /*Плавное замедление от текущей скорости до минимальной*/
    speedDown() {
        if (!this.animationInProcess && (this.#queue.length == 0 || this.#functionCalledByQueue)) {
            this.#functionCalledByQueue = false;
            let ticks = this.ticksPerFrame;
            this.animationInProcess = true;
            let loop = () => {
                this.update();
                this.render();
                if (this.ticksPerFrame < this.#ticksOnMinSpeed) {
                    ticks += 0.02;
                    this.ticksPerFrame = Math.round(ticks);
                    window.requestAnimationFrame(loop);
                } else {
                    this.animationInProcess = false;
                    this.#checkQueue();
                }

            }
            window.requestAnimationFrame(loop);
        } else {
            this.#queue.length = this.#queue.length + 1;
            this.#queue[this.#queue.length - 1] = new functionLink({
                name: this.speedDown,
                parameters: []
            });
        }
    }

    /*Плавное ускорение от текущей скорости до максимальной*/
    speedUp() {
        if (!this.animationInProcess && (this.#queue.length == 0 || this.#functionCalledByQueue)) {
            this.#functionCalledByQueue = false;
            let ticks = this.ticksPerFrame;
            this.animationInProcess = true;
            let loop = () => {
                this.update();
                this.render();
                if (this.ticksPerFrame > this.#ticksOnMaxSpeed) {
                    ticks -= 0.02;
                    this.ticksPerFrame = Math.round(ticks);
                    window.requestAnimationFrame(loop);
                } else {
                    this.animationInProcess = false;
                    this.#checkQueue();
                }

            }
            window.requestAnimationFrame(loop);
        } else {
            this.#queue.length = this.#queue.length + 1;
            this.#queue[this.#queue.length - 1] = new functionLink({
                name: this.speedUp,
                parameters: []
            });
        }
    }

    /*Показ результата (true - орёл, false - решка)*/
    showResult(result) {
        if (!this.animationInProcess && (this.#queue.length == 0 || this.#functionCalledByQueue)) {
            this.#functionCalledByQueue = false;

            let framesToResult;
            if (result) {
                framesToResult = (this.numberOfFrames - 1) - this.frameIndex;
            } else {
                framesToResult = (this.numberOfFrames) * 2 - this.frameIndex;
            }

            this.spinByFrames(framesToResult);
            this.displayResultText(result);
            this.#checkQueue();
        } else {
            this.#queue.length = this.#queue.length + 1;
            this.#queue[this.#queue.length - 1] = new functionLink({
                name: this.showResult,
                parameters: [result]
            });
        }
    }

    displayResultText(result) {
        if (!this.animationInProcess && (this.#queue.length == 0 || this.#functionCalledByQueue)) {
            const resultField = document.querySelector(this.resultFieldSelector);
            if (result) {
                resultField.innerHTML = "орёл";
            } else {
                resultField.innerHTML = "решка";
            }

            this.#checkQueue();
        } else {
            this.#queue.length = this.#queue.length + 1;
            this.#queue[this.#queue.length - 1] = new functionLink({
                name: this.displayResultText,
                parameters: [result]
            });
        }
    }

    /*Проверка функций, стоящих в очереди*/
    #checkQueue() {
        if (this.#queue.length > 0) {
            this.#functionCalledByQueue = true;
            const linkToFunction = this.#queue[0].name;
            const functionParametrs = this.#queue[0].parameters;
            this.#queue.shift();
            linkToFunction.apply(this, functionParametrs);
        }
    }
}