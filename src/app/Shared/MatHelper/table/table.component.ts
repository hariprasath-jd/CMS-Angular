import { LiveAnnouncer } from '@angular/cdk/a11y';
import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import {
  IDepartmentResponse,
} from 'src/app/Modules/CMS/User/Request/login.model';
import { SelectionModel } from '@angular/cdk/collections';
import { ITableSettings } from './table.model';
@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.css'],
})
export class TableComponent implements OnInit {
  depa: IDepartmentResponse[] = [];
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  dataSource = new MatTableDataSource<any[]>();
  datalist: any;
  public _tableSettings: ITableSettings | undefined;

  @Input()
  set tableSettings(value: ITableSettings | undefined) {
    if (this._tableSettings !== value) {
      this._tableSettings = value;
      this.prepareTable();
      this.tableSettingsChange.emit(this._tableSettings);
    }
  }
  get tableSettings(): ITableSettings | undefined {
    return this._tableSettings;
  }

  @Output() tableSettingsChange = new EventEmitter<ITableSettings | undefined>();

  public _gridEdit:string ='';
  @Input()
  set matEditClick(value: any) {
    if (this._gridEdit === value) {
      return;
    }
    this._gridEdit = value;
    this.matEditClickChange.emit(this._gridEdit);
  }
  get matEditClick(){
    return this._gridEdit;
  }
  @Output() matEditClickChange = new EventEmitter<any>();

  public _gridDelete:string ='';
  @Input()
  set matDeleteClick(value: any) {
    if (this._gridDelete === value) {
      return;
    }
    this._gridDelete = value;
    this.matDeleteClickChange.emit(this._gridDelete);
  }
  get matDeleteClick(){
    return this._gridDelete;
  }
  @Output() matDeleteClickChange = new EventEmitter<any>();

  @Input()
  set jsonData(v: any[]) {
    if (this._tableSettings) {
      this._tableSettings.jsonData = v;
    }
    this.prepareTable();
  }
  tableColums: {
    title: string;
    data: string;
    class?: string;
    short?: boolean;
    width?: number;
    render?: any;
    buttongroup?: {
      button?: boolean;
      buttons?: string[];
      buttondata?: string;
    }[];
    buttonlabel?: string;
  }[] = [];
  public displayedColumns: string[] = [];
  selection = new SelectionModel<any>(true, []);

  constructor(private _liveAnnouncer: LiveAnnouncer) {}

  ngOnInit() {}
  ngAfterViewInit() {
    this.prepareTable();
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }
  prepareTable() {
    this.tableColums = this._tableSettings?.columns || [];
    //this.displayedColumns = this._parameter?.apiColumnsName || [];
    this.displayedColumns =
      this._tableSettings?.columns.map((item) => item.data) ?? [];
    this.datalist = this._tableSettings?.jsonData;

    this.dataSource = new MatTableDataSource(this.datalist);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    if (this._tableSettings?.slno == true) {
      this.generateSlno(this.datalist);

      let isExists = this.tableColums.find(
        (column) => column.data === 'autoSlno'
      );
      if (!isExists) {
        this.tableColums.unshift({ title: 'Slno', data: 'autoSlno', width: 5 });
        console.log(this.tableColums);
      }
    }
    if (this._tableSettings?.checkbox == true) {
      let isExists = this.tableColums.find(
        (column) => column.data === 'chSelect'
      );
      if (!isExists) {
        this.tableColums.unshift({
          title: 'chSelect',
          data: 'chSelect',
          width: 5,
        });
        console.log(this.tableColums);
      }
    }
  }
  isColumnSticky(index: number): boolean {
    return (this._tableSettings?.columnSticky ?? []).includes(index);
  }
  isHeaderSticky(): boolean {
    return this._tableSettings?.headerSticky ?? true;
  }
  generateSlno(data: any[]): void {
    if (data && data.length > 0) {
      data.forEach((item, index) => {
        item.autoSlno = index + 1;
      });
    }
  }
  sortData(sort: Sort) {
    if (sort.direction === '') {
      sort.direction = 'asc'; // Default to 'asc' if sort direction is 'none'
    } else if (sort.direction === 'asc') {
      sort.direction = 'desc'; // Change to 'desc' if current direction is 'asc'
    } else if (sort.direction === 'desc') {
      sort.direction = ''; // Change to 'none' if current direction is 'desc'
    }
  }
  Shorting(sortStatus: Sort) {
    if (sortStatus.direction) {
      this._liveAnnouncer.announce('sorted ${sortStatus.direction}ending');
    } else {
      this._liveAnnouncer.announce('sorting cleared');
    }
  }
  //Grid Button Click
  onMatIconEdit(element: any) {
    console.log('Clicked:', element['departmentCode']);
    this._gridEdit = element['departmentCode'];
    this.matEditClickChange.emit(this._gridEdit);
  }
  onMatIconDelete(element: any) {
    console.log('Clicked:', element['departmentCode']);
    this._gridDelete = element['departmentCode'];
    this.matDeleteClickChange.emit(this._gridDelete);
  }
  //End Grid Button Click
 // Filter
 applyFilter(event: Event) {
  const filterValue = (event.target as HTMLInputElement).value;
  this.dataSource.filter = filterValue.trim().toLowerCase();

  if (this.dataSource.paginator) {
    this.dataSource.paginator.firstPage();
  }
}
 //End Filter
  //CheckBox Control
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  toggleAllRows() {
    if (this.isAllSelected()) {
      this.selection.clear();
      return;
    }

    this.selection.select(...this.dataSource.data);
  }
  checkboxLabel(row?: any): string {
    if (!row) {
      return `${this.isAllSelected() ? 'deselect' : 'select'} all`;
    }
    console.log(this.selection);
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${
      row.position + 1
    }`;
  }
}
