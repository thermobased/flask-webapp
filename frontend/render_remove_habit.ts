declare var collection: any;
declare var habits: any;
declare var newValue: any;
declare var habitname: any;
import {renderDatapoints} from "./render_remove_datapoint";

function Choice_habit(habit: string) {
    habitname = habit;
    const table = document.getElementById("table");
    while (table.hasChildNodes()) {
        table.removeChild(table.firstChild);
    }
    //renderDatapoints(collection, habitname);
}

function renderHabits(new_habits: any) {
    console.log(new_habits);
    for (let i = 0; i < new_habits.length; i++) {
        var div = document.createElement("div");
        var btn = document.createElement("button");
        var input1 = document.createElement("input");
        var input2 = document.createElement("input");
        input1.setAttribute('type', 'submit');
        input1.setAttribute('value', 'Delete');
        input1.setAttribute('name', new_habits[i]);
        input2.setAttribute('type', 'hidden');
        input2.setAttribute('name', 'habit_delete');
        input2.setAttribute('value', new_habits[i]);
        btn.setAttribute('type', 'button');
        btn.setAttribute('id', 'choose_habit');
        btn.setAttribute('value', new_habits[i]);
        btn.addEventListener('click', () => {
            Choice_habit(new_habits[i]);
        });
        btn.innerHTML = new_habits[i];
        div.setAttribute('id', new_habits[i]);
        div.appendChild(btn);
        div.appendChild(input1);
        div.appendChild(input2);
        var div2 = document.querySelector("#delete_habit");
        div2.appendChild(div);
    }
}

function eraseDatapoints() {
    var table = document.getElementById('table');
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
        formData.append("habit_delete", newValue);
        console.log(formData);
        try {
            const container = document.querySelector("#habits_list div");
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
                collection = x.collection;
                habits = x.habits;
                document.getElementById("delete_habit").innerHTML = "";
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



async function sendNewHabit() {
    var newHabit = document.getElementById("send_new_habit") as HTMLFormElement;
    const formData = new FormData(newHabit);
    const formHabit = formData.get("new_habit");
    try {
        const container = document.getElementById("submit_new_habit_container");
        var loadingIndicator = document.createElement("div");
        loadingIndicator.id = "loading_indicator";
        container.appendChild(loadingIndicator);
        const response = await fetch("/api/profile", {
            method: "POST",
            body: formData,
        });
        var x = await response.json();
        console.log(x);
        if (x.status == 'ok') {
            loadingIndicator.remove();
            collection = x.collection;
            habits = x.habits;
            document.getElementById("delete_habit").innerHTML = "";
            renderHabits(habits);
        } else {
            loadingIndicator.remove();
        }
    } catch (e) {
        console.error(e);
    }
}

window.addEventListener("load", (event) => {
    renderHabits(habits);
    const delete_habit_form = document.querySelector("#delete_habit");
    delete_habit_form.addEventListener("submit", (event) => {
        event.preventDefault();
        removeHabit();
    });
    var newHabit = document.getElementById("send_new_habit") as HTMLFormElement;
    newHabit.addEventListener("submit", (event) => {
        event.preventDefault();
        sendNewHabit();
    });
});



