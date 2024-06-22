import {renderDatapoints} from "./render_remove_datapoint";
import { collection, habits, updateCollection } from './global_vars';
import moment, {MomentFormatSpecification} from "moment";
import { addDatapointRangeSlider } from "./render_remove_habit";

var expand_habit: string = '';
var nodeid: string = 'expand_table';
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

        var week = createElementWithAttributes("div", {
            'class': 'chart_week'
        });


        if(i == 0) {
            week.setAttribute("class", "chart_week first_week");
        }
        else if(i == 52) {
            week.setAttribute("class", "chart_week last_week")
        } else {week.setAttribute("class", "chart_week")}
        

        for(let j = 1; j<=7; j++){

            var divka = createElementWithAttributes("button", {
                'class': 'chart_day',
                'type': 'button'
            });

            for(let k = 0; k<collection.length; k++){
                if(collection[k].occasion == moment().dayOfYear(i*7+j).format('YY, M, D')){
                    divka.setAttribute("name", collection[k].occasion);
                    
                    divka.addEventListener("click", (ev) => {
                        renderDatapoints(collection, expand_habit, (ev.target as HTMLButtonElement).name);
                        console.log(expand_habit, (ev.target as HTMLButtonElement).name);
                        });
                }
            
            

            //divka.innerHTML = (i*7+j).toString(); //to see which day of the year the cell corresponds to
            week.appendChild(divka);
            }

            year_chart.appendChild(week);
        }
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
/*     const ssrHabits = document.getElementById('habits-script')!;
    updateHabits(JSON.parse(ssrHabits.textContent!)); */
    const ssrHabit_name = document.getElementById('habit_name-script')!;
    expand_habit = (JSON.parse(ssrHabit_name.textContent!));
    renderYearChart();
    addDatapointRangeSlider();
});

