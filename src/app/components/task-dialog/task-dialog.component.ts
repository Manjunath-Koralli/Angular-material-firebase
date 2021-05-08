import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Task } from '../task/task';

@Component({
  selector: 'app-task-dialog',
  templateUrl: './task-dialog.component.html',
  styleUrls: ['./task-dialog.component.css']
})
export class TaskDialogComponent implements OnInit {

  public backUpTask : Partial<Task> = {
    ... this.data.task
  }
  constructor( 
    public dialogRef : MatDialogRef<TaskDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: TaskDialogData
  ) { 
    
  }

  ngOnInit(): void {
    console.log(this.data.task)
  }

  cancel() : void {
    this.data.task.title = this.backUpTask.title;
    this.data.task.description = this.backUpTask.description;
    this.dialogRef.close(this.data);
  }

}

export interface TaskDialogData {
  task : Task;
  enableDelete : boolean;
}

export interface TaskDialogResult {
  task : Task;
  delete?: boolean;
}
