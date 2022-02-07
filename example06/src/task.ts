export type TaskType = {
    id: number,
    title: string,
    description: string,
    urgency: number,
    duration_minutes: number,
    attention_date: string,
    deadline: string,
    planned_date: string,
    planned_starting_time: string,
    status: number,
    created_at: string,
    updated_at: string
}

const initialTask: TaskType = {
    id: 0,
    title: "",
    description: "",
    urgency: 0,
    duration_minutes: 0,
    attention_date: "",
    deadline: "",
    planned_date: "",
    planned_starting_time: "",
    status: 0,
    created_at: "",
    updated_at: ""
}

export class TaskEntity {
    task: TaskType;

    constructor(task: TaskType) {
        this.task = task;
    }

    static initialize(): TaskType {
        return initialTask;
    }
}

export function formatTaskEntity(task: any): TaskType {
    return {
        id: task.id,
        title: task.title,
        description: task.description,
        urgency: task.urgency,
        duration_minutes: task.duration_minutes,
        attention_date: task.attention_date,
        deadline: task.deadline,
        planned_date: task.planned_date,
        planned_starting_time: task.planned_starting_time,
        status: task.status,
        created_at: task.created_at,
        updated_at: task.updated_at,
    };
  }
