import moment from 'moment';
import { chosenDate, collection, habitname, habits, updateCollection, updateHabits } from './global_vars';
import {Collection} from './global_vars';
import { renderCalendar } from './render_calendar';
import { getTwoWeeksDates, renderAreaChart } from './render_graph';

export function renderDatapoints(collection: Collection[], habitname: string, date: string) {
    var table = document.getElementById('table')!;
    table.innerHTML = '';
for(let i =0; i<collection.length; i++){
    console.log(collection);
    if(collection[i].habit == habitname && collection[i].occasion == date || collection[i].habit === undefined && collection[i].occasion == date){
        console.log('OK!');
        let delete_button = document.createElement('button');
        delete_button.setAttribute('type', 'button');
        delete_button.innerHTML = "Delete";
        delete_button.setAttribute('name', collection[i].id);
        delete_button.addEventListener("click", (ev) => {
            removeDatapoint((ev.target as HTMLButtonElement).name);
            });
        let new_row = document.createElement('tr');
        let new_table_data2 = document.createElement('td');
        let new_table_data3 = document.createElement('td');
        let new_div = document.createElement('div');

        new_div.appendChild(delete_button);
        new_table_data2.innerHTML = collection[i].datapoint.toString();
        new_table_data3.innerHTML = collection[i].comment;
        new_table_data3.appendChild(new_div);
        new_row.appendChild(new_table_data3);
        new_row.appendChild(new_table_data2);
        console.log(new_row);
        table.appendChild(new_row);
}
}
}

export async function sendNewDatapoint(habitname: string): Promise <void>  {
    const sendDatapoint = document.getElementById("send_new_datapoint") as HTMLFormElement;
    const datapoint_range = document.querySelector('#datapoint_range') as HTMLInputElement;
    const formData = new FormData(sendDatapoint);
    formData.append("new_datapoint_name", habitname);
    formData.append("new_datapoint_date", chosenDate);
    formData.append("new_datapoint_time", datapoint_range.value);

    let obj: { [key: string]: FormDataEntryValue } = {};
    formData.forEach((value, key) => obj[key] = value);

    try {
        const container = document.getElementById("send_new_datapoint") as HTMLFormElement;
        var loadingIndicator = document.createElement("div");
        loadingIndicator.id = "loading_indicator"
        container.appendChild(loadingIndicator);

        const response = await fetch("/api/new_datapoint", {
            method: 'POST',
            body: JSON.stringify(obj),
            headers: {
                'Content-Type': 'application/json',
            },
        });

        var x = await response.json();
        console.log(x);
        if (x.status == 'ok') {
            loadingIndicator.remove();
            updateCollection(x.collection);
            updateHabits(x.habits);
            renderDatapoints(collection, habitname, chosenDate);
            renderAreaChart(collection, habits, getTwoWeeksDates());
        }
        else {
            loadingIndicator.remove();
        }
    } catch (e) {
        console.error(e);
    }

}

export async function removeDatapoint(id: string): Promise <void>  {
    const removeDatapointForm = document.getElementById("remove_datapoint") as HTMLFormElement;
    const formData = new FormData(removeDatapointForm);
    formData.append("datapoint_delete", id);
    formData.append("datapoint_delete_date", chosenDate);
    //console.log(formData);
    let obj: { [key: string]: FormDataEntryValue } = {};
    formData.forEach((value, key) => obj[key] = value);

    try {
        const container = document.getElementById("remove_datapoint")!;
        var loadingIndicator = document.createElement("div");
        loadingIndicator.id = "loading_indicator"
        container.appendChild(loadingIndicator);

        const response = await fetch("/api/delete_datapoint", {
            method: 'POST',
            body: JSON.stringify(obj),
            headers: {
                'Content-Type': 'application/json',
            },
        });

        var x = await response.json();
        console.log(x);
        if (x.status == 'ok') {
            loadingIndicator.remove();
            updateCollection(x.collection);
            updateHabits(x.habits);
            renderDatapoints(collection, habitname, chosenDate);
            renderAreaChart(collection, habits, getTwoWeeksDates());
        }
        else {
            loadingIndicator.remove();
        }
    } catch (e) {
        console.error(e);
    }

}

/* window.addEventListener("load", (event) => {
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
}); */

