# Design System - HeroSelect

The custom `Select` and `SelectItem` components in `HeroSelect.tsx` bridge HeroUI v2's simple flat API with the compound popover architecture of HeroUI v3.

---

## Component API

The `Select` component supports the following properties:

| Property | Type | Description |
| :--- | :--- | :--- |
| `label` | `ReactNode` | Field label displayed above the select field. |
| `placeholder` | `string` | Placeholder text when no value is selected. |
| `selectedKeys` | `any` | Single key or set of keys representing the selected value(s). |
| `onSelectionChange` | `(keys: any) => void` | Event handler called when value selection changes. |
| `className` | `string` | Custom className overrides for the container. |
| `variant` | `'flat' \| 'bordered' \| 'underlined'` | Theme variant style for border/background. Default: `'flat'`. |
| `isDisabled` | `boolean` | Disables the select input. |
| `isInvalid` | `boolean` | Activates validation error styling. |
| `errorMessage` | `ReactNode` | Validation error message displayed below the trigger. |
| `isLoading` | `boolean` | Renders a loading spinner instead of the dropdown arrow. |
| `isRequired` | `boolean` | Marks field as required. |
| `onChange` | `(e: any) => void` | Standalone change event compatibility hook. |

---

## Core Styling Design

1. **Trigger Component (`SelectTrigger`)**:
   The trigger matches `HeroInput` styling defaults completely.
   - If custom styles are passed in `classNames.trigger`, they take complete precedence.
   - Default styles adapt to the `variant` prop:
     - `flat`: Gray background with hover effects, borderless, `rounded-xl`.
     - `bordered`: Transparent background with border outline, `rounded-xl`.
     - `underlined`: Bottom border only.
2. **Active/Focus & Validation States**:
   - Focus border matches the primary brand color (green): `focus:border-green-500`.
   - Invalid field triggers a red border automatically: `border-red-500`.

---

## Usage Examples

### 1. Basic Single Select

```tsx
import { Select, SelectItem } from "@/components/Form/HeroSelect";

<Select
  label="Pilih Kecamatan"
  placeholder="Pilih kecamatan anda"
  selectedKeys={kecamatan ? [kecamatan] : []}
  variant="bordered"
  onSelectionChange={(keys) => {
    const selected = Array.from(keys)[0];
    setKecamatan(selected);
  }}
>
  <SelectItem key="kecamatan-1">Kecamatan Ngawi</SelectItem>
  <SelectItem key="kecamatan-2">Kecamatan Geneng</SelectItem>
</Select>
```

### 2. Select with Loading Spinner & Error Message

```tsx
import { Select, SelectItem } from "@/components/Form/HeroSelect";

<Select
  isInvalid={!!errors.desa}
  errorMessage={errors.desa}
  isLoading={loadingDesa}
  label="Desa"
  placeholder="Pilih desa"
  selectedKeys={desa ? [desa] : []}
  variant="bordered"
  onSelectionChange={(keys) => {
    const selected = Array.from(keys)[0];
    setDesa(selected);
  }}
>
  {desaList.map((desa) => (
    <SelectItem key={desa.nama}>{desa.nama}</SelectItem>
  ))}
</Select>
```
