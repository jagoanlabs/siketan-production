# Design System - HeroInput & HeroTextarea

The custom `Input` and `Textarea` components in `HeroInput.tsx` act as a compatibility bridge for HeroUI v3. They wrap the raw primitives from `react-aria-components` within HeroUI v3 structure to preserve backward compatibility with HeroUI v2 props and custom styling logic.

---

## Component API

The components support the following properties:

| Property | Type | Description |
| :--- | :--- | :--- |
| `label` | `ReactNode` | Field label displayed above the input. |
| `placeholder` | `string` | Placeholder text when value is empty. |
| `variant` | `'flat' \| 'bordered' \| 'underlined'` | Theme variant style for borders/background. Default: `'flat'`. |
| `classNames` | `object` | Custom class overrides for parts of the component (e.g. `label`, `inputWrapper`, `input`). |
| `startContent` | `ReactNode` | Left-side icon or element. |
| `endContent` | `ReactNode` | Right-side icon or element (e.g., show/hide password buttons). |
| `isInvalid` | `boolean` | Activates error styles. |
| `errorMessage` | `ReactNode` | Error message displayed below the input. |
| `value` | `any` | Controlled input value. |
| `onChange` | `(e: any) => void` | Event handler when value changes. |
| `type` | `string` | Standard HTML input types (e.g., `'text'`, `'email'`, `'password'`). |
| `isDisabled` | `boolean` | Disables the field. |
| `isRequired` | `boolean` | Marks field as required. |

---

## Core Styling Design

1. **Inner Primitive (`react-aria-components`)**:
   The inner input text area has all library backgrounds, borders, and shadows stripped (`!bg-transparent !shadow-none !border-none !outline-none`).
2. **Outer Wrapper Container**:
   The outer container wrapper handles all visual borders and backgrounds.
   - If custom styles are passed in `classNames.inputWrapper` (like custom borders, padding, heights, backgrounds), they take complete precedence.
   - Default styles adapt dynamically to the `variant` prop:
     - `flat`: Gray background with hover effects, borderless.
     - `bordered`: Transparent background with border outline.
     - `underlined`: Bottom border only.
3. **Active/Focus States**:
   On focus, the outer wrapper receives `data-focus="true"`, ensuring Tailwind selectors like `data-[focus=true]:border-green-500` or `focus-within:` apply correctly.

---

## Usage Examples

### 1. Basic Email Input

```tsx
import { Input } from "@/components/Form/HeroInput";

<Input
  required
  autoComplete="email"
  label="Email"
  labelPlacement="outside"
  placeholder="Masukkan email anda"
  type="email"
  value={email}
  variant="bordered"
  onChange={(e: any) => setEmail(e.target.value)}
/>
```

### 2. Password Input with End Content Toggle

```tsx
import { useState } from "react";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { Input } from "@/components/Form/HeroInput";

const [showPassword, setShowPassword] = useState(false);

<Input
  required
  autoComplete="current-password"
  endContent={
    <button
      className="focus:outline-none"
      type="button"
      onClick={() => setShowPassword(!showPassword)}
    >
      {showPassword ? (
        <FiEyeOff className="text-gray-400 hover:text-gray-600" size={20} />
      ) : (
        <FiEye className="text-gray-400 hover:text-gray-600" size={20} />
      )}
    </button>
  }
  label="Password"
  labelPlacement="outside"
  placeholder="Masukkan password anda"
  type={showPassword ? "text" : "password"}
  value={password}
  variant="bordered"
  onChange={(e: any) => setPassword(e.target.value)}
/>
```
