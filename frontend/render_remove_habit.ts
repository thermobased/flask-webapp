import {
    Habits,
    collection,
    habitname,
    habits,
    updateCollection,
    updateHabitname,
    updateHabits
} from './global_vars';
import {renderDatapoints} from "./render_remove_datapoint";
import { getTwoWeeksDates, renderAreaChart } from './render_graph';

function Choice_habit(habit: string) {
    updateHabitname(habit);
    const table = document.getElementById("table")!;
    while (table.hasChildNodes()) {
        table.removeChild(table.firstChild!);
    }
    //renderDatapoints(collection, habitname);
}



export function renderHabits(habits: Habits[]) {
    function createElementWithAttributes<K extends keyof HTMLElementTagNameMap>
    (tagName: K, attrs: { [key: string]: string }): HTMLElementTagNameMap[K] {
        var el = document.createElement(tagName);

        for (let k in attrs) {
            el.setAttribute(k, attrs[k]);
        }

        return el;
    }


    function renderEditDialog(habit: Habits){

        var dialogContainer = document.querySelector(".edit_dialog_container") as HTMLElement;
        dialogContainer.innerHTML = '';

        let div1 = createElementWithAttributes("div",
        {
            'class': 'input_divs',
        }
        );
        let div2 = createElementWithAttributes("div",
        {
            'class': 'input_divs',
        }
        );
        let div3 = createElementWithAttributes("div",
        {
            'class': 'input_divs',
        }
        );
        let div4 = createElementWithAttributes("div",
        {
            'class': 'input_divs',
        }
        );

        let dialog = createElementWithAttributes("dialog",
        {
            'class': 'edit_dialog',
        }
        );
        let form = createElementWithAttributes("form",
        {
            'id': 'edit_habit_form'
        }
        );
        form.innerText = 'Edit habit';

        let input1 = createElementWithAttributes("input",
        {
            'type': 'text',
            'class': 'edit_habit',
            'id': 'edit_habit',
            'value': habit.habit,
            'name': 'edit_habit'
        }
        );
        let label1 = createElementWithAttributes("label",
        {
            'for': 'input_habit',
        }
        );
        label1.innerHTML = "Habit name: ";
        let input2 = createElementWithAttributes("input",
        {
            'type': 'text',
            'class': 'edit_habit_unit',
            'id': 'edit_habit_unit',
            'value': habit.unit,
            'name': 'edit_unit'
        }
        );
        let label2 = createElementWithAttributes("label",
        {
            'for': 'input_unit',
        }
        );
        label2.innerHTML = "Units: ";
        let input3 = createElementWithAttributes("input",
                {
                    'type': 'text',
                    'class': 'edit_habit_goal',
                    'id': 'edit_habit_goal',
                    'value': habit.goal.toString(),
                    'name': 'edit_goal'
                }
            );
        let label3 = createElementWithAttributes("label",
        {
            'for': 'input_goal',
        }
        );
        label3.innerHTML = "Daily Goal: ";
        let input4 = createElementWithAttributes("input",
            {
                'type': 'color',
                'class': 'edit_habit_color',
                'id': 'edit_habit_color',
                'value': habit.color,
                'name': 'edit_color'
            }
        );
        let label4 = createElementWithAttributes("label",
        {
            'for': 'input_color',
        }
        );
        label4.innerHTML = "Color: ";

        let input5 = createElementWithAttributes("input",
            {
                'type': 'hidden',
                'value': habit.id,
                'name': 'edit_id'
            }
        );

        let submit = createElementWithAttributes("input",
            {
                'type': 'button',
                'value': 'Edit'
            }
        );
        submit.addEventListener("click", (ev) => {
            editHabit();
            });

        let close = createElementWithAttributes("button",
        {
            'type': 'button',
            'class': 'close_button'
        }
        );
        close.innerHTML = 'Close';
        close.addEventListener("click", (ev) => {
            dialog.close();
            });
        let container = createElementWithAttributes("div",
        {
            'class': 'dialog_container'
        }
        );
        container.appendChild(close);
        div1.appendChild(label1);
        div1.appendChild(input1);
        div2.appendChild(label2);
        div2.appendChild(input2);
        div3.appendChild(label3);
        div3.appendChild(input3);
        div4.appendChild(label4);
        div4.appendChild(input4);
        div4.appendChild(input5);
        form.appendChild(div1);
        form.appendChild(div2);
        form.appendChild(div3);
        form.appendChild(div4);
        form.appendChild(submit);
        container.appendChild(form);
        dialog.appendChild(container);
        dialogContainer.appendChild(dialog);
        dialog.showModal();
    }


    var div2 = document.querySelector("#habit_selector")!;
    div2.innerHTML = "";
    

    for (let i = 0; i < habits.length; i++) {

        var divka = createElementWithAttributes("div", {
            'class': 'habit_container'
        });
        let btn = createElementWithAttributes("button",
            {
                'type': 'button',
                'class': 'habitname',
                'id': 'choose_habit',
                'value': habits[i].habit
            }
        );
        btn.addEventListener('click', (ev) => {
            const old = document.querySelector(".habitname.currently_selected");
                if(old !== null){old.className = "habitname";}
                ((ev.target as Element).className) = "habitname currently_selected";
            Choice_habit(habits[i].habit);
        });

        btn.innerHTML = habits[i].habit;

        let delete_button = createElementWithAttributes("button",
            { //'type' : 'submit',
                'value': 'Delete',
                'id': 'delete_habit',
                'name': habits[i].habit
            }
        );
        delete_button.innerHTML = "Delete";
        delete_button.addEventListener('click', () => {
            removeHabit(habits[i].habit);
        });

        let expand = createElementWithAttributes("button",
            {
                'type': 'submit',
                'value': habits[i].habit,
                'name' : 'habit_to_expand',
            }
        );
        expand.innerHTML = 'Expand';

        let expand_form = createElementWithAttributes("form",
            {
                'id' : 'expand',
                'action' : '/habit_expand',
                'method' : 'get',
            });
        
        let edit_button = createElementWithAttributes("button",
            {
                'type': 'button',
                'class': 'edit_button'
            }
        );
        edit_button.innerHTML = 'Edit';
        edit_button.addEventListener('click', (ev) => {
            renderEditDialog(habits[i]);
        });
        let indicatorCircle = createElementWithAttributes("span",
        {
            'class': 'indicator_circle'
        });
        indicatorCircle.style.backgroundColor = habits[i].color;
        expand_form.appendChild(expand);
        divka.appendChild(btn);
        divka.appendChild(indicatorCircle);
        divka.appendChild(delete_button);
        divka.appendChild(expand_form);
        divka.appendChild(edit_button);
        div2.appendChild(divka);
    }
    
}

function eraseDatapoints() {
    var table = document.getElementById('table')!;
    table.innerHTML = '';
}

function confirmDelete() {
    if (confirm("Delete this habit?")) {
        return 1;
    }
}

export async function removeHabit(deleteValue: string): Promise<void> {
    if (confirmDelete()) {
        const formData = new FormData();
        formData.append("habit_delete", deleteValue);
        console.log(formData);
        const container = document.querySelector("#habits_list div")!;

        let obj: { [key: string]: FormDataEntryValue } = {};
        formData.forEach((value, key) => obj[key] = value);

        var loadingIndicator = document.createElement("div");
        loadingIndicator.id = "loading_indicator"
        container.appendChild(loadingIndicator);

        try {
            const response = await fetch("/api/delete_habit", {
                method: 'POST',
                body: JSON.stringify(obj),
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            var x = await response.json();
            console.log(x);
            if (x.status == 'ok') {
                updateCollection(x.collection);
                updateHabits(x.habits);
                renderHabits(habits);
                eraseDatapoints();
                renderAreaChart(collection, habits, getTwoWeeksDates());
            } else {
                console.log(`sendNewHabit: server responded with ${JSON.stringify(x)}`);
            }
        } catch (e) {
            console.error(`sendNewHabit: got exception ${e}`);
        } finally {
            loadingIndicator.remove();
        }
    }
}

export async function editHabit(): Promise<void> {
        var editForm = document.querySelector('#edit_habit_form') as HTMLFormElement;
        const formData = new FormData(editForm);
        console.log(formData);
        const container = document.querySelector(".edit_dialog") as HTMLDialogElement;

        let obj: { [key: string]: FormDataEntryValue } = {};
        formData.forEach((value, key) => obj[key] = value);

        var loadingIndicator = document.createElement("div");
        loadingIndicator.id = "loading_indicator"
        container.appendChild(loadingIndicator);

        try {
            const response = await fetch("/api/edit_habit", {
                method: 'POST',
                body: JSON.stringify(obj),
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            var x = await response.json();
            console.log(x);
            if (x.status == 'ok') {
                updateCollection(x.collection);
                updateHabits(x.habits);
                renderHabits(habits);
                eraseDatapoints();
                renderAreaChart(collection, habits, getTwoWeeksDates());
            } else {
                console.log(`editHabit: server responded with ${JSON.stringify(x)}`);
            }
        } catch (e) {
            console.error(`seditHabit: got exception ${e}`);
        } finally {
            loadingIndicator.remove();
        }
    }




export async function sendNewHabit() {
    var newHabit = document.getElementById("send_new_habit") as HTMLFormElement;
    const formData = new FormData(newHabit);
    const container = document.getElementById("submit_new_habit_container")!;

    let obj: { [key: string]: FormDataEntryValue } = {};
    formData.forEach((value, key) => obj[key] = value);

    var loadingIndicator = document.createElement("div");
    loadingIndicator.id = "loading_indicator";
    container.appendChild(loadingIndicator);

    try {
        const response = await fetch("/api/new_habit", {
            method: 'POST',
            body: JSON.stringify(obj),
            headers: {
                'Content-Type': 'application/json',
            },
        });
        var x = await response.json();
        console.log(x);
        if (x.status == 'ok') {
            updateCollection(x.collection);
            updateHabits(x.habits);
            renderHabits(habits);
            renderAreaChart(collection, habits, getTwoWeeksDates());
        } else {
            console.log(`sendNewHabit: server responded with ${JSON.stringify(x)}`);
        }
    } catch (e) {
        console.error(`sendNewHabit: got exception ${e}`);
    } finally {
        // Make sure loading indicator is removed no matter what
        loadingIndicator.remove();
    }
}
export function addDatapointRangeSlider () {
    var datapoint_range = document.querySelector('#datapoint_range') as HTMLInputElement;
    var datapoint_range_value = document.querySelector('#datapoint_range_value') as HTMLOutputElement;
    datapoint_range_value.textContent = datapoint_range.value;
    datapoint_range.addEventListener("input", (event) => {
        datapoint_range_value.textContent = datapoint_range.value;
    });
}



/* window.addEventListener("load", (event) => {
    const ssrHabits = document.getElementById('habits-script')!;
    updateHabits(JSON.parse(ssrHabits.textContent!));



}); */
