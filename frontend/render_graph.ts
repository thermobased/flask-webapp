import {XYContainer, Timeline, StackedBar, Axis, Area} from '@unovis/ts'
import moment from "moment"
import { collection } from './global_vars';

type DataRecord = {
    x: number,
    y: number
}

let data: DataRecord[] = [];


export function renderAreaChart (){

    for(let i = 0; i<collection.length; i++){
        data.push(
            {
                x: i, y: i+Math.random()
            }
                 )
                 console.log(data[i]);
    }
    const node = document.querySelector('#area_chart') as HTMLElement;
    const container = new XYContainer<DataRecord>(node, {
    components: [
      new Area<DataRecord>({
      x: (d: DataRecord) => d.x, 
      y: (d: DataRecord) => d.y
    })
    ]
  }, data)
}

window.addEventListener("load", (event) => {
    renderAreaChart();
});

