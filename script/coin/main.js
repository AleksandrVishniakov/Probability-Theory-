function generateRandomResult() {
    return Math.round(Math.random());
}

let canvas = document.querySelector('#canvas');
canvas.width = 100;
canvas.height = 100;

let coinImage = new Image();
coinImage.src = 'img/coin/coin-sprite-animation.png';

let coin = new SpinningCoin({
    ctx: canvas.getContext('2d'),
    image: coinImage,
    width: 1000,
    height: 100,
    numberOfFrames: 10,
    ticksPerFrame: 8,
    resultFieldSelector: "#coin_result"
});

document.querySelector(".start_coin_spin").addEventListener(
    "click",
    () => {
        const result = generateRandomResult();
        coin.speedUp();
        coin.spinByMilliseconds(200);
        coin.speedDown();
        coin.showResult(result);
    }
);