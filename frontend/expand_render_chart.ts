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
    console.log(collection, "< -- initial chart collection value");

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

            divka.setAttribute("name", moment().dayOfYear(i*7+j).format('YY, M, D'));
            divka.addEventListener("click", (ev) => {
                renderDatapoints(collection, expand_habit, (ev.target as HTMLButtonElement).name);
                });

            var popup = createElementWithAttributes("span", {
                'class': 'year_chart_popup'
            });
            var cnt = 0;
            for(let k = 0; k<collection.length; k++){
                if(collection[k].occasion == moment().dayOfYear(i*7+j).format('YY, M, D')){
                    cnt+=collection[k].datapoint;
                }
            }
            if(cnt > 0 && cnt < 30){divka.style.backgroundColor = '#86db98';}
            else if(cnt >= 30 && cnt < 60){divka.style.backgroundColor = '#47a15a';}
            else if(cnt >= 60){divka.style.backgroundColor = '#156125';}
            popup.innerHTML = moment().dayOfYear(i*7+j).format('MMMM, Do').concat(" - ", cnt.toString());
            cnt = 0;
            week.appendChild(divka);
            divka.appendChild(popup);
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

