declare var collection: any;
import moment, {MomentFormatSpecification} from "moment";


function renderCalendar() {
    const firstWeek = document.querySelector(".first_week_row");
    const secondWeek = document.querySelector(".second_week_row");
    let now = moment().day(0);
        firstWeek.innerHTML = '';
        secondWeek.innerHTML = '';
    for(let i = -6; i<=0; i++){
        const weekday = document.createElement('button');
        weekday.setAttribute('class', 'dates');
        let tempDate = moment(now).day(i).date();
        weekday.innerHTML = tempDate.toString();
        firstWeek.appendChild(weekday);
    }
    for(let i = 1; i<=7; i++){

        const weekday = document.createElement('button');
        weekday.setAttribute('class', 'dates');
        let tempDate = moment(now).day(i).date();
        if(moment().date() == tempDate){
            weekday.setAttribute('id', 'todays');
        }
        weekday.innerHTML = tempDate.toString();
        secondWeek.appendChild(weekday);
    }
}
window.addEventListener("load", (event) => {
    renderCalendar();
});