export type Collection = {
  id: number,
  habit: string
  occasion: string
  datapoint: number
  comment: string
}

export var collection: Collection[] = [];
export function updateCollection(x: Collection[]) {
  collection = x;
}

export var habits: string[] = [];
export function updateHabits(x: string[]) {
  habits = x;
}

export var habitname: string = "";
export function updateHabitname(x: string) {
  habitname = x;
}

export var chosenDate: string;
export function updateChosenDate(x: string) {
  chosenDate = x;
}
export var deleteValue: string;
export function updateDeleteValue(x: string) {
  deleteValue = x;
}
