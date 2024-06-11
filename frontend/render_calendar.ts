import {renderDatapoints} from "./render_remove_datapoint";
import { collection, habits, habitname, chosenDate, updateChosenDate, updateCollection, updateHabits } from './global_vars';
import moment, {MomentFormatSpecification} from "moment";

export function renderCalendar() {
    function setChosenDate(kek: string){
        updateChosenDate(kek);
    }
    
    function createCalendarCell(i: number){
        let pastToday: boolean = false;
        const weekday = document.createElement('button');
        weekday.setAttribute('value', moment().day(i).format("YY, M, D"));
        if(i > moment().day()){
            weekday.setAttribute('id', 'past_todays');
        }
        weekday.setAttribute('class', 'dates');
            let kek = weekday.value;
            weekday.addEventListener('click', (ev) => {
                const old = document.querySelector(".dates.currently_selected");
                if(old !== null){old.className = "dates";}
                ((ev.target as Element).className) = "dates currently_selected";
                setChosenDate(kek);
                renderDatapoints(collection, habitname, kek);

            });
            let dayOfWeek = moment().day(i).date();
            console.log(dayOfWeek, " <-- day(i)");
            if(moment().date() == dayOfWeek){
                weekday.setAttribute('id', 'todays');
                pastToday = true;
            }
            weekday.innerHTML = dayOfWeek.toString();
            return weekday;
    }

    const firstWeek = document.querySelector(".first_week_row")!;
    const secondWeek = document.querySelector(".second_week_row")!;
    const thirdWeek = document.querySelector(".third_week_row")!;
        firstWeek.innerHTML = '';
        secondWeek.innerHTML = '';
        thirdWeek.innerHTML = '';

//-------- if today is sunday ----------
    if(moment().day() == 0){
        for(let i = -20; i<=-14; i++){
            firstWeek.appendChild(createCalendarCell(i));
        }
        for(let i = -13; i<=-7; i++){
            secondWeek.appendChild(createCalendarCell(i));
        }
        for(let i = -6; i<=0; i++){
            thirdWeek.appendChild(createCalendarCell(i));
        }
//-------- if today is not sunday ----------
    } else {
        for(let i = -13; i<=-7; i++){
            firstWeek.appendChild(createCalendarCell(i));
        }
        for(let i = -6; i<=0; i++){
            secondWeek.appendChild(createCalendarCell(i));
        }
        for(let i = 1; i<=7; i++){
            thirdWeek.appendChild(createCalendarCell(i));
        }
    }

}

