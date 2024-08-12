import {FormArray, FormControl, FormGroup} from "@angular/forms";
import {formSignals} from "./form-signals";
import {TestBed} from "@angular/core/testing";

interface TestSimpleModel {
  ctrl1: string | null;
  ctrl2: string | null;
  ctrl3: string | null;
}

const prepareSimpleModelValues = (): TestSimpleModel => ({
  ctrl1: Math.random().toString(),
  ctrl2: Math.random().toString(),
  ctrl3: Math.random().toString()
});

interface TestSimpleFormModel {
  ctrl1: FormControl<string | null>,
  ctrl2: FormControl<string | null>,
  ctrl3: FormControl<string | null>,
}

const prepFormGroup = (): FormGroup<TestSimpleFormModel> => {
  return new FormGroup<TestSimpleFormModel>({
    ctrl1: new FormControl(null),
    ctrl2: new FormControl(null),
    ctrl3: new FormControl(null),
  })
}

interface TestFormWithFormGroupModel {
  group: FormGroup<TestSimpleFormModel>;
}

interface TestFormWithFormArrayModel {
  arr: FormArray<FormGroup<TestSimpleFormModel>>;
}

describe('Form signals tests: ', () => {
  it('* Check whether keys length matches', () => {
    const simpleForm = prepFormGroup();
    const signals = TestBed.runInInjectionContext(() => formSignals(simpleForm));
    const testForm1Keys = Object.keys(simpleForm.controls);
    const signals1Keys = Object.keys(signals);
    expect(signals1Keys.length).toEqual(testForm1Keys.length);
  });

  it('* Check whether values of simple form and values of its signals matches', () => {
    const form = prepFormGroup();
    const signals = TestBed.runInInjectionContext(() => formSignals(form));
    const valueChecker = () => Object.entries(form.controls).forEach(([key, {value}]) => expect(value).toBe(signals[key as keyof TestSimpleFormModel]()))
    valueChecker();
    form.patchValue(prepareSimpleModelValues());
    valueChecker();
  });

  it('* Check whether values of form with formGroup and values of its signals matches', () => {
    const form = new FormGroup<TestFormWithFormGroupModel>({
      group: prepFormGroup()
    });
    const signals = TestBed.runInInjectionContext(() => formSignals(form));
    const valueChecker = () => Object.entries(form.controls.group.value).forEach(([key, value]) => expect(value).toBe(signals.group()[key as keyof TestSimpleFormModel]!))
    valueChecker();
    form.patchValue({group: prepareSimpleModelValues()})
    valueChecker();
  })

  it('* Check whether values of form with formArray and values of its signals matches', () => {
    const form = new FormGroup<TestFormWithFormArrayModel>({
      arr: new FormArray([prepFormGroup()])
    });
    const signals = TestBed.runInInjectionContext(() => formSignals(form));
    const valueChecker = () => Object.entries(form.controls.arr.value).forEach(([key, value], index) => {
      Object.entries(value).forEach(([key, value]) => expect(value).toBe((signals.arr() as TestSimpleModel[])?.[index][key as keyof TestSimpleFormModel]!))
    })
    valueChecker();
    form.patchValue({arr: [prepareSimpleModelValues()]});
    valueChecker();
  })
});
