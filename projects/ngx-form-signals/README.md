# NgxFormSignals

NgxFormSignals is a simple library designed to help manage form state using signals. By using the `formSignal` method on any Angular `FormGroup`, it creates an object with keys matching those of the `FormGroup` controls, but with values that are actually `signals` based on each control's `valueChanges`.

Unlike the standard approach widely used on the internet, where a `signal` is based on `form.valueChanges` and then obtaining signals for each control using `computed()`, the proposed `formSignal()` approach reduces the amount of computation. This is because each signal created by `computed()` is retriggered after any **control value change**.

## Use Case

```typescript
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, ReactiveFormsModule, AsyncPipe],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  form: FormGroup<TestFormModel> = new FormGroup<TestFormModel>({
    ctrl1: new FormControl(null),
    ctrl2: new FormControl(null),
    ctrl3: new FormControl(null),
  });
  #formSignals: FormSignal<TestFormModel> = formSignals(this.form);
  readonly ctrl1: Signal<string | null> = this.#formSignals.ctrl1;
  readonly ctrl2: Signal<string | null> = this.#formSignals.ctrl2;
  readonly ctrl3: Signal<string | null> = this.#formSignals.ctrl3;
}
```

```html

<form>
  <label>
    Test 1
    <input [formControl]="form.controls.ctrl1"/>
  </label>
  <label>
    Test 2
    <input [formControl]="form.controls.ctrl2"/>
  </label>
  <label>
    Test 3
    <input [formControl]="form.controls.ctrl3"/>
  </label>
</form>
<!-- Values obtained from signals below will change whenever the matching control is changed -->
{{ ctrl1() }}
{{ ctrl2() }}
{{ ctrl3() }}
```

These signals can be freely used in any situation where you would use other signals of these types.

### Typing

Typing is considered when converting, so each signal will be of the same type as the control it is based on. The only typing issue arises when operating on `FormArrays`, as you need to manually cast its value to the proper model, similar to handling the `valueChanges()` of an array.
