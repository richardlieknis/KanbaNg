import { Component, OnDestroy, OnInit } from '@angular/core';
import { DialogService } from '../../services/dialog.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrl: './dialog.component.scss'
})
export class DialogComponent implements OnInit, OnDestroy {
  private dialogSub: Subscription = new Subscription();

  public show: boolean = false;
  public object: any = null;

  constructor(
    public dialogService: DialogService
  ) { }

  ngOnInit() {
    this.dialogSub = this.listenDialogState();
  }

  ngOnDestroy() {
    this.dialogSub.unsubscribe();
  }

  listenDialogState() {
    return this.dialogService.dialogState.subscribe((state: any) => {
      if (state.show) {
        this.show = true;
        this.object = state.object;
      } else {
        this.show = false;
        this.object = null;
      }
    });
  }

  confirm() {
    this.object.resolve(true);
    this.dialogService.hide();
  }

  cancel() {
    this.object.resolve(false);
    this.dialogService.hide();
  }
}
