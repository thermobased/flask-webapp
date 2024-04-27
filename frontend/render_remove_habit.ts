import {
    collection, deleteValue,
    habitname,
    habits,
    updateCollection,
    updateDeleteValue,
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

function renderHabits(new_habits: any) {
    function createElementWithAttributes<K extends keyof HTMLElementTagNameMap>
    (tagName: K, attrs: { [key: string]: string }): HTMLElementTagNameMap[K] {
        var el = document.createElement(tagName);

        for (let k in attrs) {
            el.setAttribute(k, attrs[k]);
        }

        return el;
    }

    console.log(new_habits);
    for (let i = 0; i < new_habits.length; i++) {
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

        // input1.addEventListener('click', () => {
        //    updateDeleteValue(new_habits[i]);
        // });

        btn.innerHTML = new_habits[i];

        let delete_button = createElementWithAttributes("button",
            { //'type' : 'submit',
                'value': 'Delete',
                'name': new_habits[i]
            }
        );
        delete_button.innerHTML = "Delete";
        delete_button.addEventListener('click', () => {
            updateDeleteValue(new_habits[i]);
            removeHabit();
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
        var div2 = document.querySelector("#habit_selector")!;
        expand_form.appendChild(expand);
        div2.appendChild(btn);
        div2.appendChild(delete_button);
        div2.appendChild(expand_form);
    }
    /*let send_new_habit = createElementWithAttributes("form",
        {
            'type': 'submit',
            'id': 'send_new_habit',
        }
    );
    send_new_habit.addEventListener('submit', () => {
        sendNewHabit();
    });*/
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

async function removeHabit(): Promise<void> {
    if (confirmDelete()) {
        const formData = new FormData();
        formData.append("habit_delete", deleteValue);
        console.log(formData);
        try {
            const container = document.querySelector("#habits_list div")!;
            var loadingIndicator = document.createElement("div");
            loadingIndicator.id = "loading_indicator"
            container.appendChild(loadingIndicator);
            const response = await fetch("/api/profile", {
                method: "POST",
                body: formData,
            });
            var x = await response.json();
            console.log(x);
            if (x.status == 'ok') {
                loadingIndicator.remove();
                updateCollection(x.collection);
                updateHabits(x.habits);
                document.getElementById("delete_habit")!.innerHTML = "";
                renderHabits(habits);
                eraseDatapoints();
            } else {
                loadingIndicator.remove();
            }
        } catch (e) {
            console.error(e);
        }
    }
}


/*async function expandHabit(): Promise<void> {
        const formData = new FormData();
        formData.append("habit_expand", expandValue);
        console.log(formData);
        try {
            const response = await fetch("/habit_expand", {
                method: "POST",
                body: formData,
            });
/!*            var x = await response.json();
            console.log(x);*!/
        } catch (e) {
            console.error(e);
        }

}*/


async function sendNewHabit() {
    var newHabit = document.getElementById("send_new_habit") as HTMLFormElement;
    const formData = new FormData(newHabit);
    const container = document.getElementById("submit_new_habit_container")!;

    var loadingIndicator = document.createElement("div");
    loadingIndicator.id = "loading_indicator";
    container.appendChild(loadingIndicator);

    try {
        const response = await fetch("/api/profile", {
            method: "POST",
            body: formData,
        });
        var x = await response.json();
        console.log(x);
        if (x.status == 'ok') {
            updateCollection(x.collection);
            updateHabits(x.habits);
            document.getElementById("delete_habit")!.innerHTML = "";

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

window.addEventListener("load", (event) => {
    renderHabits(habits);
    var newHabit = document.getElementById("send_new_habit") as HTMLFormElement;
    newHabit.addEventListener("submit", (event) => {
        event.preventDefault();
        sendNewHabit();
    });
});
/*    const delete_habit_form = document.querySelector("#delete_habit");
    delete_habit_form.addEventListener("submit", (event) => {
        removeHabit();*/
