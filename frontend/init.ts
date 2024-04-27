import { collection, habits, habitname, chosenDate, updateChosenDate, updateCollection, updateHabits } from './global_vars';
import { renderCalendar } from './render_calendar';
import { renderHabits } from './render_remove_habit';

// This code reads special <script type="text/json"> elements on the page
// where the server puts initial values of collection and habits variables. It
// initializes the variables and triggers rendering of the page based on them.
window.addEventListener("load", (event) => {
    const ssrCollection = document.getElementById('collection-script')!;
    updateCollection(JSON.parse(ssrCollection.textContent!));
    renderCalendar();

    const ssrHabits = document.getElementById('habits-script')!;
    updateHabits(JSON.parse(ssrHabits.textContent!));
    renderHabits(habits);
});
