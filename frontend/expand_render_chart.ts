import {renderDatapoints} from "./render_remove_datapoint";
import { collection, habits, habitname, chosenDate, updateChosenDate, updateCollection, updateHabits } from './global_vars';
import moment, {MomentFormatSpecification} from "moment";


function removeAllChildNodes(parent: HTMLElement) {
    while (parent.firstChild) {
        parent.removeChild(parent.firstChild);
    }
}

function createElementWithAttributes<K extends keyof HTMLElementTagNameMap>
    (tagName: K, attrs: { [key: string]: string }): HTMLElementTagNameMap[K] {
        var el = document.createElement(tagName);

        for (let k in attrs) {
            el.setAttribute(k, attrs[k]);
        }

        return el;
    }

    var januaryFirst = moment().dayOfYear(1).day();
    if(januaryFirst == 0){januaryFirst = 7;}
    var decemberLast = moment().month("December").date(31).day();
    if(decemberLast == 0){decemberLast = 7;}


function renderYearChart() {

    const year_chart = document.querySelector('#year_chart') as HTMLElement;
    
    for(let i = 0; i<53; i++){

        if(i == 0) {var week = createElementWithAttributes("div", {
            'class': 'chart_week first_week'
        });}
        else if(i == 52) {var week = createElementWithAttributes("div", {
            'class': 'chart_week last_week'
        });} else {var week = createElementWithAttributes("div", {
            'class': 'chart_week'
        });}
        

        for(let j = 1; j<=7; j++){
            var divka = createElementWithAttributes("button", {
                'class': 'chart_day'
            });
            //divka.innerHTML = (i*7+j).toString(); //to see which day of the year the cell corresponds to
            week.appendChild(divka);
            }

            year_chart.appendChild(week);
        }
        
        var firstWeek = document.querySelector('.chart_week.first_week') as HTMLElement;
        var lastWeek = document.querySelector('.chart_week.last_week') as HTMLElement;
        

        for(let i = 1; i<januaryFirst; i++){
            firstWeek.removeChild(firstWeek.firstChild!);
        }
        for(let i = decemberLast; i<7; i++){
            lastWeek.removeChild(lastWeek.lastChild!);
    }

        console.log(firstWeek, lastWeek);
    }
    
    



window.addEventListener("load", (event) => {
    event.preventDefault();
    const ssrCollection = document.getElementById('collection-script')!;
    updateCollection(JSON.parse(ssrCollection.textContent!));
    renderYearChart();
});

