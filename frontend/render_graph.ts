import { XYContainer, Timeline } from '@unovis/ts'
import moment from "moment"
import { collection } from './global_vars';

type TimeDataRecord = {
    timestamp: number; // Position on the X axis. Can be `number` or `Date`
    length: number; // Length of the line in X axis values, i.e. milliseconds if you use `Date`
    type: string; // The row it will be displayed in
}

let data: TimeDataRecord[] = [];
for(let i = 0; i<collection.length; i++){
    data.push(
        {timestamp: moment(collection[i][1], "YY, M, D").unix()/24/60/60, length: collection[i][2], type: i.toString()},
             )
}
console.log(data);
const node = document.getElementById('graph');
const container = new XYContainer<TimeDataRecord>(node, {
    components: [
        new Timeline<TimeDataRecord>({
            x: (d: TimeDataRecord) => d.timestamp,
            showLabels: true
        })
    ]
}, data)
