# Design System - RadioGroup

The `RadioGroup` component from HeroUI v3 is a form control allowing users to select a single option from a list. It uses a compound component structure for maximum styling customization.

---

## Anatomy and Component Parts

Always compose the Radio component with its designated subcomponents to render correctly in HeroUI v3:

- **`RadioGroup`**: The parent controller container. Supports `orientation="horizontal" | "vertical"`.
- **`Radio`**: Represents an individual selectable item.
- **`Radio.Content`**: Clickable area wrapper for layout.
- **`Radio.Control`**: The circular outer control box.
- **`Radio.Indicator`**: The inner indicator dot representing the selected state.

---

## Usage Example

### Basic Horizontal Radio Group

```tsx
import { RadioGroup, Radio } from "@heroui/react";

<RadioGroup
  orientation="horizontal"
  value={kategori}
  onChange={setKategori}
  className="gap-4"
>
  <Radio value="pangan">
    <Radio.Content>
      <Radio.Control>
        <Radio.Indicator />
      </Radio.Control>
      Tanaman Pangan
    </Radio.Content>
  </Radio>
  <Radio value="perkebunan">
    <Radio.Content>
      <Radio.Control>
        <Radio.Indicator />
      </Radio.Control>
      Perkebunan
    </Radio.Content>
  </Radio>
</RadioGroup>
```
