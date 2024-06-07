import {XYContainer, Timeline, StackedBar, Axis, Area} from '@unovis/ts'
import moment from "moment"
import { collection, habits } from './global_vars';

type DataRecord = {
    x: number,
    y: number[]
}

let data: DataRecord[] = [];

function getTwoWeeksDates ():string[] {

    let twoWeeksDates: string[] = [];
    //-------- if today is sunday ----------
    if(moment().day() == 0){
        for(let i = -13; i<=-7; i++){
            twoWeeksDates.push(moment().day(i).format('YY, M, D'));
        }
        for(let i = -6; i<=0; i++){
            twoWeeksDates.push(moment().day(i).format('YY, M, D'));
        }
    //-------- if today is not sunday ----------
    } else {
        for(let i = -6; i<=0; i++){
            twoWeeksDates.push(moment().day(i).format('YY, M, D'));
        }
        
        for(let i = 1; i<=7; i++){
            twoWeeksDates.push(moment().day(i).format('YY, M, D'));
        }
    }
    return twoWeeksDates;
}

export function renderAreaChart (){

    let cnt = 0;
    const twoWeeksDates: string[] = getTwoWeeksDates();
    for(let i = 0; i <= 13; i++){
        let totalIntensity: number[] = [];
        for(let j = 0; j < habits.length; j++){
            for(let k = 0; k < collection.length; k++){ 
                if(collection[k].habit == habits[j] && collection[k].occasion == twoWeeksDates[i]){
                    cnt  += collection[k].datapoint;
                }
            }
        totalIntensity[j] = cnt;
        }
        data[i] = {
            x: i,
            y: totalIntensity
        }
        cnt = 0;
    }

    type accessors = (d: DataRecord) => number;
    let theAccessors: accessors[] = [];
    for(let i = 0; i < habits.length; i++){
        theAccessors[i] = (d: DataRecord) => {return (d.y[i])}
    }

    const node = document.querySelector('#area_chart') as HTMLElement;
    const container = new XYContainer<DataRecord>(node, {
    components: [
      new Area<DataRecord>({
      x: (d: DataRecord) => d.x,
      y: theAccessors
    })
    ]
  }, data)
}

window.addEventListener("load", (event) => {
    renderAreaChart();
});

