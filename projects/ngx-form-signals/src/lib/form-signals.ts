import {AbstractControl, FormGroup} from "@angular/forms";
import {Signal} from "@angular/core";
import {toSignal} from "@angular/core/rxjs-interop";

type ControlMap<T> = { [K in keyof T]: AbstractControl<any, any> };
export type FormSignal<T extends ControlMap<T>> = { [K in keyof T]: Signal<T[K]['value']> };

export const formSignals = <T extends ControlMap<T>>(formGroup: FormGroup<T>): FormSignal<T> => {
  if (!formGroup || !Object.keys(formGroup.controls).length) {
    throw new Error("Form not defined!");
  }

  const signals = {} as FormSignal<T>;
  Object.entries(formGroup.controls).forEach(([key, control]) => {
    signals[key as keyof T] = toSignal(control.valueChanges, {initialValue: control.value});
  });

  return signals;
}
