class chartValue {
    name = "";
    qty = 0;
    color = "";
}

class barChart {
    id;
    width;
    height;
    objects;
    vertName = "";
    horName = "";
    #chart_font;
    /*Создание графика*/
    createChart() {
        const chart = document.querySelector("#" + this.id);
        chart.innerHTML = "";
        chart.style.width = this.width + "px";
        chart.style.height = this.height + "px";
        this.#chart_font = this.width * 0.02;
        this.#createChartStructure();
    }

    /*Вставка данных для графика*/
    inputValue(dataArray) {
        this.objects = new Array(dataArray.length);
        for (let i = 0; i < dataArray.length; ++i) {
            this.objects[i] = new chartValue;
            this.objects[i].name = dataArray[i].name;
            this.objects[i].color = dataArray[i].color;
            this.objects[i].qty = dataArray[i].qty;
        }
    }

    /*Анимация изменения данных*/
    animateDataChanging(dataArray) {
        const ch = document.querySelector("#" + this.id);
        const chart = ch.querySelector("#chart_body");
        const absoluteHeight = parseInt(chart.clientHeight, 10);
        const absoluteWidth = parseInt(chart.clientWidth, 10);
        const width = Math.round(absoluteWidth * 0.7 / this.objects.length);
        if (this.objects.length == dataArray.length) {
            for (let i = 0; i < dataArray.length; ++i) {
                this.objects[i] = new chartValue;
                this.objects[i].name = dataArray[i].name;
                this.objects[i].color = dataArray[i].color;
                this.objects[i].qty = dataArray[i].qty;
            }
            this.#fillLegend("chart_legend");
            let maxValue = this.#fillValues("obj_values");
            if (maxValue == 0) {
                maxValue++;
            }
            for (let i = 0; i < this.objects.length; ++i) {
                const height = Math.round(absoluteHeight / maxValue * this.objects[i].qty) * 0.9;
                chart.querySelector(`#chart_item${i}`).style = `
                    width: ${width}px;
                    height: ${height}px;
                    top: ${absoluteHeight - height - 3}px;
                    background-color: ${this.objects[i].color};
                    transition-duration: .5s;
                `;
            }
        }
    }

    /*Создание структуры графика*/
    #createChartStructure() {
        const chart = document.querySelector("#" + this.id);
        chart.classList.add("main_chart");

        chart.innerHTML = `
            <p class="vert_text chart_text" style="font-size:${this.#chart_font}px">${this.vertName}</p>
            <div class="chart_col">
                <div id="chart_body"></div>
                <div id="obj_values"></div>
                <p class="hor_text chart_text" style="font-size:${this.#chart_font}px">${this.horName}</p>
            </div>
            <ul type="square" id="chart_legend">
            </ul>
        `;
        this.#fillLegend("chart_legend");
        const maxValue = this.#fillValues("obj_values");
        this.#fillChart("chart_body", maxValue);
    }
    /*Заполнение легенду графика*/
    #fillLegend(legendId) {
        const chart = document.querySelector("#" + this.id);
        const legend = chart.querySelector("#" + legendId);
        legend.innerHTML = "";
        for (let i = 0; i < this.objects.length; ++i) {
            legend.innerHTML += `
                <li style="color:${this.objects[i].color}">
                    <span style="font-size:${this.#chart_font}px" class="chart_text">${this.objects[i].name}</span>
                </li>
            `;
        }
    }

    /*Заполнение данных о количестве*/
    #fillValues(valueId) {
        const chart = document.querySelector("#" + this.id);
        const values = chart.querySelector("#" + valueId);
        let maxValue = 0;
        values.innerHTML = "";
        for (let i = 0; i < this.objects.length; ++i) {
            values.innerHTML += `
                <p  style="font-size:${this.#chart_font}px" class="chart_text">${this.objects[i].qty}</p>
            `;
            maxValue = Math.max(maxValue, this.objects[i].qty);
        }
        return maxValue;
    }

    /*Отрисовка графика*/
    #fillChart(chartId, maxValue) {
        const chart = document.querySelector("#" + chartId);
        const absoluteHeight = parseInt(chart.clientHeight, 10);
        const absoluteWidth = parseInt(chart.clientWidth, 10);
        const width = Math.round(absoluteWidth * 0.7 / this.objects.length);
        if (maxValue == 0) {
            maxValue++;
        }
        for (let i = 0; i < this.objects.length; ++i) {
            const height = Math.round(absoluteHeight / maxValue * this.objects[i].qty) * 0.9;
            chart.innerHTML += `
                <div class="chart_item" id="chart_item${i}" style="
                    width: ${width}px;
                    height: ${height}px;
                    top: ${absoluteHeight - height - 3}px;
                    background-color: ${this.objects[i].color};
                ">
                </div>
            `;
        }
    }

}