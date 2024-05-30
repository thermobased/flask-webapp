import {
    collection,
    habitname,
    habits,
    updateCollection,
    updateHabitname,
    updateHabits
} from './global_vars';
import {renderDatapoints} from "./render_remove_datapoint";

function Choice_habit(habit: string) {
    updateHabitname(habit);
    const table = document.getElementById("table")!;
    while (table.hasChildNodes()) {
        table.removeChild(table.firstChild!);
    }
    //renderDatapoints(collection, habitname);
}

export function renderHabits(new_habits: string[]) {
    function createElementWithAttributes<K extends keyof HTMLElementTagNameMap>
    (tagName: K, attrs: { [key: string]: string }): HTMLElementTagNameMap[K] {
        var el = document.createElement(tagName);

        for (let k in attrs) {
            el.setAttribute(k, attrs[k]);
        }

        return el;
    }
    var div2 = document.querySelector("#habit_selector")!;
    div2.innerHTML = "";
    

    for (let i = 0; i < new_habits.length; i++) {
        var divka = createElementWithAttributes("div", {
            'class': 'habit_container'
        });
        let btn = createElementWithAttributes("button",
            {
                'type': 'button',
                'id': 'choose_habit',
                'value': new_habits[i]
            }
        );
        btn.addEventListener('click', () => {
            Choice_habit(new_habits[i]);
        });

        btn.innerHTML = new_habits[i];

        let delete_button = createElementWithAttributes("button",
            { //'type' : 'submit',
                'value': 'Delete',
                'id': 'delete_habit',
                'name': new_habits[i]
            }
        );
        delete_button.innerHTML = "Delete";
        delete_button.addEventListener('click', () => {
            removeHabit(new_habits[i]);
        });

        let expand = createElementWithAttributes("button",
            {
                'type': 'submit',
                'value': new_habits[i],
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
        expand_form.appendChild(expand);
        divka.appendChild(btn);
        divka.appendChild(delete_button);
        divka.appendChild(expand_form);
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

async function removeHabit(deleteValue: string): Promise<void> {
    if (confirmDelete()) {
        const formData = new FormData();
        formData.append("habit_delete", deleteValue);
        console.log(formData);
        const container = document.querySelector("#habits_list div")!;

        let obj: any = {};
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

async function sendNewHabit() {
    var newHabit = document.getElementById("send_new_habit") as HTMLFormElement;
    const formData = new FormData(newHabit);
    const container = document.getElementById("submit_new_habit_container")!;

    let obj: any = {};
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
function addDatapointRangeSlider () {
    var datapoint_range = document.querySelector('#datapoint_range') as HTMLInputElement;
    var datapoint_range_value = document.querySelector('#datapoint_range_value') as HTMLOutputElement;
    datapoint_range_value.textContent = datapoint_range.value;
    datapoint_range.addEventListener("input", (event) => {
        datapoint_range_value.textContent = datapoint_range.value;
    });
}



window.addEventListener("load", (event) => {
    const ssrHabits = document.getElementById('habits-script')!;
    updateHabits(JSON.parse(ssrHabits.textContent!));
    addDatapointRangeSlider();
    renderHabits(habits);

    var newHabit = document.getElementById("send_new_habit") as HTMLFormElement;
    newHabit.addEventListener("submit", (event) => {
        event.preventDefault();
        sendNewHabit();
    });
});
