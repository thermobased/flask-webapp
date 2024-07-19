import {renderDatapoints} from "./render_remove_datapoint";
import { collection, habits, updateCollection } from './global_vars';
import moment, {Moment, MomentFormatSpecification} from "moment";
import { addDatapointRangeSlider } from "./render_remove_habit";

var expand_habit: string = '';
var dayOne: Moment = moment();
var number_of_weeks: number;
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

function renderYearChart() {
    console.log(collection, "< -- initial chart collection value");

    for(let i = 0; i<collection.length; i++){
        if(moment(collection[i].occasion, 'YY, M, D').isBefore(dayOne)){
            dayOne = moment(collection[i].occasion, 'YY, M, D');
        }
    }
    let first_chart_day = dayOne.day();
    dayOne = dayOne.day('Monday');
    number_of_weeks = moment().diff(dayOne, 'weeks') + 1;

    const year_chart = document.querySelector('#year_chart') as HTMLElement;
    year_chart.addEventListener('wheel', (event) => {
        event.preventDefault();
        year_chart.scrollBy({
          left: event.deltaY < 0 ? -30 : 30,
        });
      });
      
    
    for(let i = 0; i<number_of_weeks; i++){

        var week = createElementWithAttributes("div", {
            'class': 'chart_week'
        });


        if(i == 0) {
            week.setAttribute("class", "chart_week first_week");
        }
        else if(i == number_of_weeks-1) {
            week.setAttribute("class", "chart_week last_week")
        } else {week.setAttribute("class", "chart_week")}
        

        for(let j = 0; j<7; j++){

            var divka = createElementWithAttributes("button", {
                'class': 'chart_day',
                'type': 'button'
            });

            divka.setAttribute("name", dayOne.format('YY, M, D'));
            divka.addEventListener("click", (ev) => {
                renderDatapoints(collection, expand_habit, (ev.target as HTMLButtonElement).name);
                });

            var popup = createElementWithAttributes("span", {
                'class': 'year_chart_popup'
            });
            var cnt = 0;
            for(let k = 0; k<collection.length; k++){
                if(collection[k].occasion == dayOne.format('YY, M, D')){
                    cnt+=collection[k].datapoint;
                }
            }
            if(cnt > 0 && cnt < 30){divka.style.backgroundColor = '#86db98';}
            else if(cnt >= 30 && cnt < 60){divka.style.backgroundColor = '#47a15a';}
            else if(cnt >= 60){divka.style.backgroundColor = '#156125';}
            popup.innerHTML = dayOne.format('MMMM, Do').concat(" - ", cnt.toString());
            cnt = 0;
            week.appendChild(divka);
            divka.appendChild(popup);
            year_chart.appendChild(week);
            dayOne.add(1, 'days');
        }
        }
    
        
        var firstWeek = document.querySelector('.chart_week.first_week') as HTMLElement;
        var lastWeek = document.querySelector('.chart_week.last_week') as HTMLElement;
        

        for(let i = 1; i<first_chart_day; i++){
            firstWeek.removeChild(firstWeek.firstChild!);
        }
        for(let i = moment().day(); i<7; i++){
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

