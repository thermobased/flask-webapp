import {renderDatapoints} from "./render_remove_datapoint";
import { collection, habitname, chosenDate, updateChosenDate, updateCollection, updateHabits } from './global_vars';
import moment, {MomentFormatSpecification} from "moment";


function renderCalendar() {
    function setChosenDate(kek: any){
        updateChosenDate(kek);
        console.log("chosenDate set");
    }
    const firstWeek = document.querySelector(".first_week_row");
    const secondWeek = document.querySelector(".second_week_row");
    let now = moment().day(0);
        firstWeek.innerHTML = '';
        secondWeek.innerHTML = '';
    for(let i = -6; i<=0; i++){
        const weekday = document.createElement('button');
        weekday.setAttribute('class', 'dates');
        weekday.setAttribute('value', moment(now).day(i).format("YY, M, D"));
        let kek = weekday.value;
        weekday.addEventListener('click', () => {
            setChosenDate(kek);
            renderDatapoints(collection, habitname, kek);
        });
        let tempDate = moment(now).day(i).date();
        weekday.innerHTML = tempDate.toString();
        firstWeek.appendChild(weekday);
    }
    for(let i = 1; i<=7; i++){
        const weekday = document.createElement('button');
        weekday.setAttribute('class', 'dates');
        weekday.setAttribute('value', moment(now).day(i).format("YY, M, D"));
        let kek = weekday.value;
        weekday.addEventListener('click', () => {
            setChosenDate(kek);
            renderDatapoints(collection, habitname, kek);
        });
        let tempDate = moment(now).day(i).date();
        if(moment().date() == tempDate){
            weekday.setAttribute('id', 'todays');
        }
        weekday.innerHTML = tempDate.toString();
        secondWeek.appendChild(weekday);
    }
}
window.addEventListener("load", (event) => {
    const ssrCollection = document.getElementById('collection-script');
    const ssrHabits = document.getElementById('habits-script');

    updateCollection(JSON.parse(ssrCollection.textContent));
    updateHabits(JSON.parse(ssrHabits.textContent));

    renderCalendar();
});
