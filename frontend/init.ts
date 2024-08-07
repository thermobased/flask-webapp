import moment from 'moment';
import { collection, habits, habitname, chosenDate, updateChosenDate, updateCollection, updateHabits, updateHabitname } from './global_vars';
import { renderCalendar } from './render_calendar';
import { addDatapointRangeSlider, renderHabits, sendNewHabit } from './render_remove_habit';
import { removeDatapoint, sendNewDatapoint } from './render_remove_datapoint';
import { getTwoWeeksDates, renderAreaChart } from './render_graph';

// This code reads special <script type="text/json"> elements on the page
// where the server puts initial values of collection and habits variables. It
// initializes the variables and triggers rendering of the page based on them.
window.addEventListener("load", (event) => {
    const ssrCollection = document.getElementById('collection-script')!;
    updateCollection(JSON.parse(ssrCollection.textContent!));

    const ssrHabits = document.getElementById('habits-script')!;
    updateHabits(JSON.parse(ssrHabits.textContent!));

    updateChosenDate(moment().format("YY, M, D"));
    renderCalendar();
    renderHabits(habits);
    addDatapointRangeSlider();
    var newHabit = document.getElementById("send_new_habit") as HTMLFormElement;
    newHabit.addEventListener("submit", (event) => {
        event.preventDefault();
        sendNewHabit(); 
    });
    const sendDatapoint = document.getElementById("send_new_datapoint") as HTMLFormElement;
    sendDatapoint.addEventListener("submit", (event) => {
        event.preventDefault();
        sendNewDatapoint(habitname);
    });
    const removeDatapointForm = document.getElementById("remove_datapoint") as HTMLFormElement;
    removeDatapointForm.addEventListener("submit", (event) => {
        event.preventDefault();
        removeDatapoint(habitname);
    });
    renderAreaChart(collection, habits, getTwoWeeksDates());

    const popupButton = document.querySelector('.popup_new_habit_button') as HTMLElement;
    const popupDialog = document.querySelector('.popup_new_habit_dialog') as HTMLDialogElement;
    const popupClose = document.querySelector('.popup_new_habit_close') as HTMLButtonElement;


    popupButton.addEventListener("click", (ev) => {
    popupDialog.showModal();
    });
    
    popupClose.addEventListener("click", (ev) => {
    popupDialog.close();
    }); 
    


});
