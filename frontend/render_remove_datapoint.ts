import moment from 'moment';
import { chosenDate, collection, habitname, habits, updateCollection, updateHabits } from './global_vars';

export function renderDatapoints(collection: any, habitname: any, date: any) {
    var table = document.getElementById('table');
    table.innerHTML = '';
for(let i =0; i<collection.length; i++){
    console.log(date, 'renderdatapoints date');
    if(collection[i][0] == habitname && collection[i][1] == date){
        let delete_button = document.createElement('input');
        let delete_hidden = document.createElement('input');
        delete_button.setAttribute('type', 'submit');
        delete_button.setAttribute('value', 'Delete');
        delete_button.setAttribute('name', collection[i][3]);
        delete_hidden.setAttribute('type', 'hidden');
        delete_hidden.setAttribute('name', 'datapoint_delete');
        delete_hidden.setAttribute('value', collection[i][3]);
        let new_row = document.createElement('tr');
        //let new_table_data1 = document.createElement('td');
        let new_table_data2 = document.createElement('td');
        let new_table_data3 = document.createElement('td');
        let new_div = document.createElement('div');
        new_div.appendChild(delete_button);
        new_div.appendChild(delete_hidden);
        //new_table_data1.innerHTML = collection[i][1];
        new_table_data2.innerHTML = '1';
        new_table_data3.innerHTML = collection[i][3];
        new_table_data3.appendChild(new_div);
        //new_row.appendChild(new_table_data1);
        new_row.appendChild(new_table_data3);
        new_row.appendChild(new_table_data2);
        table.appendChild(new_row);
}
}
}


async function sendNewDatapoint(habitname: string): Promise <void>  {
    console.log(chosenDate, 'chosendate');
    const sendDatapoint = document.getElementById("send_new_datapoint") as HTMLFormElement;
    const formData = new FormData(sendDatapoint);
    formData.append("new_datapoint_name", habitname);
    //let now = moment().format("YY, M, D");
    formData.append("new_datapoint_date", chosenDate);
    console.log(formData);
    try {
        const container = document.getElementById("send_new_datapoint");
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
            renderDatapoints(collection, habitname, chosenDate);
        }
        else {
            loadingIndicator.remove();
        }
    } catch (e) {
        console.error(e);
    }

}

async function removeDatapoint(habitname: string): Promise <void>  {
    const removeDatapointForm = document.getElementById("remove_datapoint") as HTMLFormElement;
    const formData = new FormData(removeDatapointForm);
    formData.append("datapoint_delete_name", habitname);
    formData.append("datapoint_delete_date", chosenDate);
    console.log(formData, "< --- removedatapoint formdata");
    try {
        const container = document.getElementById("remove_datapoint");
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
            renderDatapoints(collection, habitname, chosenDate);
        }
        else {
            loadingIndicator.remove();
        }
    } catch (e) {
        console.error(e);
    }

}


window.addEventListener("load", (event) => {
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
});

