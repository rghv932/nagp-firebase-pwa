import { Injectable } from "@angular/core";
import { AngularFireDatabase, AngularFireList } from "@angular/fire/compat/database";
import { AngularFireStorage } from "@angular/fire/compat/storage";

import { finalize, Observable, of } from "rxjs";
import { FileUpload } from "src/app/shared/file-upload.model";

@Injectable({
  providedIn: 'root'
})
export class FileUploadService{
  private basePath = '/upload';
  url:string;

  constructor(private db: AngularFireDatabase, private storage: AngularFireStorage) { }

  pushFileToStorage(fileUpload: FileUpload): Observable<number | undefined> {
    console.log("inside pftS");
    const filePath = `${this.basePath}/${fileUpload.file.name}`;
    const storageRef = this.storage.ref(filePath);
    const uploadTask = this.storage.upload(filePath, fileUpload.file);

    uploadTask.snapshotChanges().pipe(
      finalize(() => {
        storageRef.getDownloadURL().subscribe(downloadURL => {
          console.log("download url:",downloadURL);
          fileUpload.url = downloadURL;
          this.url=downloadURL;
          fileUpload.name = fileUpload.file.name;
        });
      })
    ).subscribe();

    return uploadTask.percentageChanges();
  }

  getFiles(numberItems: number): AngularFireList<any> {
    return this.db.list(this.basePath, ref =>
      ref.limitToLast(numberItems));
  }
  
}