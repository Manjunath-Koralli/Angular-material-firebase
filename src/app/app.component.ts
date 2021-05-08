import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { Component } from '@angular/core';
import { Task } from './components/task/task';
import { MatDialog } from '@angular/material/dialog';
import { TaskDialogComponent, TaskDialogResult } from './components/task-dialog/task-dialog.component';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { BehaviorSubject } from 'rxjs';

const getObservable = (collection : AngularFirestoreCollection<Task>) => {
  const subject = new BehaviorSubject([]);
  collection.valueChanges({ idField : 'id'}).subscribe((val : Task[]) => {
    subject.next(val);
  });
  return subject;

}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'kanban-fire';

  constructor(public dialog: MatDialog, private firestore: AngularFirestore) { }

  // Before integrating with firestore
  // todo: Task[] = [
  //   { title: "Buy Milk", description: "Go to shop and buy a milk" },
  //   { title: "Kanban Board", description: "Create a Kanban Board" }
  // ]

  // inProgress: Task[] = [
  //   { title : "Buy Milk", description : "Go to shop and buy a milk" },
  //   { title : "Kanban Board", description : "Create a Kanban Board" }
  // ]

  // done: Task[] = [
  //   { title : "Buy Milk", description : "Go to shop and buy a milk" },
  //   { title : "Kanban Board", description : "Create a Kanban Board" }
  // ]

  // After integrating with firestore

  todo = getObservable(this.firestore.collection('todo'));
  inProgress = getObservable(this.firestore.collection('inProgress'));
  done = getObservable(this.firestore.collection('done'));

  drop(event: CdkDragDrop<Task[]>) {
    // Before integrating with firestore

    // if (event.previousContainer === event.container) {
    //   moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    // } else {
    //   transferArrayItem(event.previousContainer.data,
    //     event.container.data,
    //     event.previousIndex,
    //     event.currentIndex);
    // }

    // After integrating with firestore

    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    }
    const item = event.previousContainer.data[event.previousIndex];
    this.firestore.firestore.runTransaction(() => {
      return Promise.all([
        this.firestore.collection(event.previousContainer.id).doc(item.id).delete(),
        this.firestore.collection(event.container.id).add(item)
      ]);
    });

    transferArrayItem(event.previousContainer.data,
      event.container.data,
      event.previousIndex,
      event.currentIndex
    );
  }

  edit(list: 'todo' | 'inProgress' | 'done', task: Task) {
    const dialogRef = this.dialog.open(TaskDialogComponent, {
      width: '270px',
      data: {
        task,
        enableDelete: true
      }
    });

    dialogRef.afterClosed().subscribe(
      (result: TaskDialogResult) => {
        // Before integrating with firestore

        // console.log(this[list])        
        // const dataList = this[list];
        // console.log(dataList.indexOf(task))
        // const taskIndex = dataList.indexOf(task);
        // if (result.delete) {
        //   dataList.splice(taskIndex, 1)
        // }
        // else {
        //   dataList[taskIndex] = task;
        // }

        // After integrating with firestore
        if(result.delete) {
          this.firestore.collection(list).doc(task.id).delete();
        }
        else {
          this.firestore.collection(list).doc(task.id).update(task);
        }

      });

  }

  newTask() {
    const dialogRef = this.dialog.open(TaskDialogComponent, {
      width: '270px',
      data: {
        task: {

        }
      }
    });

    dialogRef.afterClosed().subscribe(
      (result: TaskDialogResult) => {
        console.log(result.task, result.task.title, result.task.description);
        if (result.task.title === undefined && result.task.description === undefined) {
          alert("Title and Description is empty!!");
        }
        else if (result.task.description === undefined) {
          alert("Description is empty!!");

        }
        else if (result.task.title === undefined) {
          alert("Title is empty!!");
        }
        else {
          // Before integrating with firestore
          //this.todo.push(result.task);

          // After integrating with firestore
          this.firestore.collection('todo').add(result.task)
        }
      });

  }

}
