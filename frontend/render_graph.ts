import {XYContainer, Timeline, StackedBar, Axis, Area} from '@unovis/ts'
import moment from "moment"
import { Collection, Habits, collection, habits, updateCollection, updateHabits } from './global_vars';

function removeAllChildNodes(parent: HTMLElement) {
    while (parent.firstChild) {
        parent.removeChild(parent.firstChild);
    }
}

export function getTwoWeeksDates ():string[] {

    let twoWeeksDates: string[] = [];
    for(let i = -13; i <= 0; i++ ){
        twoWeeksDates.push(moment().add(i, 'days').format('YY, M, D'));
    }
    return twoWeeksDates;
}

export function renderAreaChart (collection: Collection[], habits: Habits[], twoWeeksDates: string[]){

    var colors: string[] = [];
    for(let i = 0; i<habits.length; i++){
    colors.push(habits[i].color);
    }
    console.log(habits);


    type DataRecord = {
        x: number,
        y: number[],
    }

    let data: DataRecord[] = [];
    let cnt = 0;
    let totalIntensity: number[] = Array(habits.length).fill(0);
    for(let i = 0; i <= 13; i++){ //for each of 14 days
        for(let j = 0; j < habits.length; j++){ //for each habit
            for(let k = 0; k < collection.length; k++){ //for each datapoint 
                if(collection[k].habit == habits[j].habit && collection[k].occasion == twoWeeksDates[i]){
                    cnt  += collection[k].datapoint;
                }
            }
        totalIntensity[j] = cnt/habits[j].goal;
        cnt = 0;
        }
        data[i] = {
            x: i,
            y: totalIntensity,
        }
        totalIntensity = [];
    }

    type accessors = (d: DataRecord) => number;
    let theAccessors: accessors[] = [];
    for(let i = 0; i < habits.length; i++){
        theAccessors[i] = (d: DataRecord) => {return (d.y[i])}
    }

    const node = document.querySelector('#area_chart') as HTMLElement;
    removeAllChildNodes(node);
    const container = new XYContainer<DataRecord>(node, {
    components: [
      new Area<DataRecord>({
      x: (d: DataRecord) => d.x,
      y: theAccessors,
      color: colors
    })
    ]
  }, data)
}

/* window.addEventListener("load", (event) => {
    event.preventDefault();
    const ssrHabits = document.getElementById('habits-script')!;
    const ssrCollection = document.getElementById('collection-script')!;
    updateHabits(JSON.parse(ssrHabits.textContent!));
    updateCollection(JSON.parse(ssrCollection.textContent!));
    renderAreaChart(collection, habits, getTwoWeeksDates());
}); */

