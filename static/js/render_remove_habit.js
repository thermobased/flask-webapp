function renderHabits(habits){
    console.log(habits);
    for(let i=0; i<habits.length; i++){
        div = document.createElement("div");
        btn = document.createElement("button");
        input1 = document.createElement("input");
        input2 = document.createElement("input");
        input1.setAttribute('type', 'submit');
        input1.setAttribute('value', 'Delete');
        input1.setAttribute('name', habits[i]);
        input1.setAttribute('onClick', 'setDeleteValue(this.name)');
        input2.setAttribute('type', 'hidden');
        input2.setAttribute('name', 'habit_delete');
        input2.setAttribute('value', habits[i]);
        btn.setAttribute('type', 'button');
        btn.setAttribute('id', 'choose_habit');
        btn.setAttribute('value', habitname);
        btn.setAttribute('onClick', 'Choice_habit(this.value)');
        btn.innerHTML = habits[i];
        div.setAttribute('id', habits[i]);
        div.appendChild(btn);
        div.appendChild(input1);
        div.appendChild(input2);
        div2 = document.querySelector("#delete_habit");
        div2.appendChild(div);
    }
}
renderHabits(collection.habits);

const delete_habit_form = document.querySelector("#delete_habit");
function confirmDelete(){
    if (confirm("Delete this habit?")) {
        return 1;
    }
}
async function removeHabit() {
    if(confirmDelete()){
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
            x = await response.json();
            console.log(x);
            if (x.status == 'ok') {
                loadingIndicator.remove();
                collection.collection = x.collection;
                collection.habits = x.habits;
                document.getElementById("delete_habit").innerHTML = "";
                renderHabits(collection["habits"]);

                //document.querySelector("#delete_habit #" + newValue).remove();
            }
            else{
                loadingIndicator.remove();
            }
        } catch (e) {
            console.error(e);
        }
    }}

delete_habit_form.addEventListener("submit", (event) => {
    event.preventDefault();
    removeHabit();

});

