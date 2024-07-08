export type Collection = {
  habit: string
  occasion: string
  datapoint: number
  comment: string
  id: string
}

export type Habits = {
  id: string
  habit: string
  unit: string
  goal: number
  color: string
}

export var collection: Collection[] = [];
export function updateCollection(x: Collection[]) {
  collection = x;
}

export var habits: Habits[] = [];
export function updateHabits(x: Habits[]) {
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