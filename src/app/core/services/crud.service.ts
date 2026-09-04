import { Observable } from 'rxjs';

/* Generic CRUD contract — all entity services implement this so BaseCrudComponent works uniformly */
export interface CrudService<T> {
  getAll(): Observable<T[]>;
  create(item: T): Observable<T>;
  update(id: number, item: T): Observable<T>;
  delete(id: number): Observable<void>;
}
