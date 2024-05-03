// TODO: change the collection type to this and make sure the code uses it correctly:
/*
type Collection = {
  habit: string
  occasion: string
  datapoint: number
  comment: string
}*/
type Collection = [string, string, number, string];

export var collection: Collection[] = [];
export function updateCollection(x: [Collection]) {
  collection = x;
}

export var habits: string[] = [];
export function updateHabits(x: any) {
  habits = x;
}

export var habitname: string = "";
export function updateHabitname(x: any) {
  habitname = x;
}

export var chosenDate: any;
export function updateChosenDate(x: any) {
  chosenDate = x;
}
export var deleteValue: any;
export function updateDeleteValue(x: any) {
  deleteValue = x;
}