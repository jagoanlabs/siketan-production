# Design System - Checkbox

The `Checkbox` component in HeroUI v3 is a compound component built on top of React Aria. It uses separate elements for the control (visual box) and content (label).

---

## Anatomy and Component Parts

- **`Checkbox`**: The root wrapper that manages checked state and focus.
- **`Checkbox.Content`**: Wraps the control indicator and the label text.
- **`Checkbox.Control`**: The visual box (the square) with styling for checked/unchecked states.
- **`Checkbox.Indicator`**: The checkmark icon rendered inside `Control` when checked.

---

## Styling Design

- Accent color: `accent-green-600` via `color="success"` (default).
- Uses the compound pattern for consistent spacing and alignment.

---

## Usage Example

```tsx
import { Checkbox } from "@heroui/react";

<Checkbox isSelected={isAccepted} onValueChange={setIsAccepted}>
  <Checkbox.Content>
    <Checkbox.Control>
      <Checkbox.Indicator />
    </Checkbox.Control>
    Accept terms and conditions
  </Checkbox.Content>
</Checkbox>
```

## Props

| Prop           | Type       | Default    | Description                       |
|----------------|------------|------------|-----------------------------------|
| `isSelected`   | `boolean`  | `false`    | Controlled checked state          |
| `onValueChange`| `(v: boolean) => void` | — | Callback when state changes  |
| `isDisabled`   | `boolean`  | `false`    | Disables interaction              |
| `isReadOnly`   | `boolean`  | `false`    | Makes the field read-only         |
| `name`         | `string`   | —          | Name attribute for form submission |
| `value`        | `string`   | —          | Value attribute for form submission|
