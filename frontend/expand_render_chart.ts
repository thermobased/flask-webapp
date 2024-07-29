import {renderDatapoints} from "./render_remove_datapoint";
import { Habits, collection, habitname, habits, updateCollection } from './global_vars';
import moment, {Moment, MomentFormatSpecification} from "moment";
import { addDatapointRangeSlider } from "./render_remove_habit";

var expand_habit: Habits;
var dayOne: Moment = moment();
let firstOfMonth: Moment = moment();
var number_of_weeks: number;
var nodeid: string = 'expand_table';
function removeAllChildNodes(parent: HTMLElement) {
    while (parent.firstChild) {
        parent.removeChild(parent.firstChild);
    }
}
function displayPopup(id: string){
    let node = document.getElementById(id) as HTMLSpanElement;
    node.style.visibility = 'visible';
}
function hidePopup(id: string){
    let node = document.getElementById(id) as HTMLSpanElement;
    node.style.visibility = 'hidden';
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

    const year_chart = document.querySelector('#year_chart') as HTMLElement;
    const container = document.querySelector('#year_chart_container') as HTMLElement;
    var table = document.querySelector("#year_chart_table") as HTMLTableElement;
    year_chart.addEventListener('wheel', (event) => {
        event.preventDefault();
        year_chart.scrollBy({
          left: event.deltaY < 0 ? -30 : 30,
        });
      });

    var table_head = createElementWithAttributes("thead", {
    });
    var table_body = createElementWithAttributes("tbody", {
    });

    for(let i = 0; i<collection.length; i++){
        if(moment(collection[i].occasion, 'YY, M, D').isBefore(dayOne)){
            dayOne = moment(collection[i].occasion, 'YY, M, D');
            firstOfMonth = moment(collection[i].occasion, 'YY, M, D');
        }
    }
    dayOne = dayOne.day('Monday');
    if(collection.length == 0){
        dayOne.subtract(1, 'weeks');
    }

    number_of_weeks = moment().diff(dayOne, 'weeks') + 1;
    if(number_of_weeks == 1){number_of_weeks++;}

    for(let i = 0; i<7; i++){                                       // 7 rows
        var table_row = createElementWithAttributes("tr", {
        });
        dayOne.add(i, 'days');
        for(let j = 0; j<number_of_weeks; j++){                     // columns -- weeks
            var table_data = createElementWithAttributes("td", {
                'class': 'expand_table_cell',
                'id': dayOne.add(j, 'weeks').format('YY, M, D').concat(' cell'),
            });
            
            

            var cnt = 0;
            for(let k = 0; k<collection.length; k++){
                if(collection[k].occasion == dayOne.format('YY, M, D')){
                    cnt+=collection[k].datapoint;
                }
                if(cnt/expand_habit.goal > 0 && cnt/expand_habit.goal < 0.3){table_data.style.backgroundColor = '#86db98';}
                else if(cnt/expand_habit.goal > 0.3 && cnt/expand_habit.goal < 0.6){table_data.style.backgroundColor = '#47a15a';}
                else if(cnt/expand_habit.goal > 0.6){table_data.style.backgroundColor = '#156125';}
            }
            let id: string = dayOne.format('D, M, YY');
            var popup_data = createElementWithAttributes("span", {
                'class': 'chart_popup',
                'id': id
            });
            popup_data.style.visibility = 'hidden';
            popup_data.style.zIndex = '999';
            if(i>=4){popup_data.style.top = '-25px';}

            popup_data.innerHTML = dayOne.format('MMMM, Do').concat(" - ", cnt.toString(), ' ', expand_habit.unit);
            table_data.addEventListener("click", (ev) => {
                renderDatapoints(collection, expand_habit.habit, (ev.target as HTMLTableCellElement).id);
                });
            table_data.addEventListener('mouseenter',
                () => {
                    displayPopup(id);
                });
            table_data.addEventListener('mouseleave',
                () => {
                    hidePopup(id);
                });
            table_data.appendChild(popup_data);
            table_row.appendChild(table_data);
            
            dayOne.subtract(j, 'weeks');


        }
        dayOne.subtract(i, 'days');
        table_body.appendChild(table_row);
    }
    
    var number_of_months = moment().diff(dayOne, 'months');
    
    firstOfMonth.subtract(firstOfMonth.date()-1, 'days');

    var first_weeeks = dayOne.diff(firstOfMonth.add(1, 'month'), 'weeks');
    first_weeeks *= -1;
    if(first_weeeks < 2){first_weeeks = 2;}
    dayOne.subtract(dayOne.date()-1, 'days');
    firstOfMonth.subtract(1, 'month');
    for(let i = 0; i<=number_of_months; i++){

        let daysdiff = dayOne.diff(firstOfMonth.add(1, 'months'), 'days');

        daysdiff *= -1;
        let month = createElementWithAttributes("td", {
            'class': '',
        });

        if(i!=0 && i !=number_of_months){
        if(daysdiff-28+firstOfMonth.day() <= dayOne.day() && daysdiff-28+firstOfMonth.day()!= 0){
            month.colSpan = 5;
        } else {
            month.colSpan = 4;    
        }
        }else if (i == 0){
            month.colSpan = first_weeeks;
        } else if (i == number_of_months){
            month.colSpan = moment().date()/7;
        }
        
        month.innerHTML = dayOne.format('MMM');
        table_head.appendChild(month);
        dayOne.add(1, 'months');
    }

    table.appendChild(table_body);
    table.appendChild(table_head);


      
    
/*     for(let i = 0; i<number_of_weeks; i++){

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
    } */

    }
    
    



window.addEventListener("load", (event) => {
    event.preventDefault();
    const ssrCollection = document.getElementById('collection-script')!;
    updateCollection(JSON.parse(ssrCollection.textContent!));
    const ssrHabit_name = document.getElementById('habit_name-script')!;
    expand_habit = (JSON.parse(ssrHabit_name.textContent!));
    renderYearChart();
    addDatapointRangeSlider();
});

