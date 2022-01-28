import {Component, Inject, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {deleteObject, getDownloadURL, ref, Storage, uploadBytesResumable} from "@angular/fire/storage";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {ICategoryResponse} from "../../../system/interfaces/category.interface";
import {percentage} from "rxfire/storage";
import {CategoryService} from "../../../system/services/category/category.service";

@Component({
  selector: 'app-add-product',
  templateUrl: './add-product.component.html',
  styleUrls: ['./add-product.component.scss']
})
export class AddProductComponent implements OnInit {

  public productForm!: FormGroup;
  public isUploaded = false;
  public uploadPercent!: number;
  public categories!: ICategoryResponse[];

  constructor(
    private categoryService: CategoryService,
    private fb: FormBuilder,
    private storage: Storage,
    public dialogRef: MatDialogRef<AddProductComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  ngOnInit(): void {
    this.initProductForm();
    this.loadCategories();
  }

  initProductForm(): void {
    this.productForm = this.fb.group({
      category: [this.data?.prod?.category?.name ? this.data?.prod?.category?.name : null, Validators.required],
      name: [this.data?.prod?.name ? this.data?.prod?.name : null, Validators.required],
      path: [this.data?.prod?.path ? this.data?.prod?.path : null, Validators.required],
      description: [this.data?.prod?.description ? this.data?.prod?.description : null, Validators.required],
      weight: [this.data?.prod?.weight ? this.data?.prod?.weight : null, Validators.required],
      price: [this.data?.prod?.price ? this.data?.prod?.price : null, Validators.required],
      imagePath: [this.data?.prod?.imagePath ? this.data?.prod?.imagePath : null, Validators.required],
      count: [1, Validators.required]
    })
    this.isUploaded = !!this.data?.prod;
  }

  loadCategories(): void {
    this.categoryService.getAll().subscribe(data => {
      this.categories = data;
    })
  }

  upload(event: any): void {
    const file = event.target.files[0];
    this.uploadFile('images', file.name, file)
      .then(data => {
        this.productForm.patchValue({
          imagePath: data
        });
        this.isUploaded = true;
      })
      .catch(err => {
        console.log(err);
      })
  }

  async uploadFile(folder: string, name: string, file: File | null): Promise<string> {
    const ext = file!.name.split('.').pop();
    const path = `${folder}/${name}.${ext}`;
    let url = '';
    if (file) {
      try {
        const storageRef = ref(this.storage, path);
        const task = uploadBytesResumable(storageRef, file);
        percentage(task).subscribe(data => {
          this.uploadPercent = data.progress
        });
        await task;
        url = await getDownloadURL(storageRef);
      } catch (e: any) {
        console.error(e);
      }
    } else {
      console.log('wrong format')
    }
    return Promise.resolve(url);
  }

  deleteImage(imagePath?: string): void {
    imagePath = imagePath ? imagePath : this.valueByControl('imagePath')
    this.isUploaded = false;
    this.uploadPercent = 0;
    const task = ref(this.storage, imagePath);
    deleteObject(task).then(() => {
      console.log('File deleted successfully');
      this.productForm.patchValue({
        imagePath: null
      })
    })
  }

  valueByControl(control: string): string {
    return this.productForm.get(control)?.value;
  }

  createProduct() {
    this.dialogRef.close({
      prod: this.productForm.value
    })
  }

}
