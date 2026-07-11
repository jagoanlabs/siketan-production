# Design System - Theme Colors & Palette

The project's design system uses curated Tailwind CSS color palettes to maintain cohesive styling across all pages, layouts, and interactive components.

---

## Brand Theme Palette

We use Tailwind's green scale for the primary branding to represent agriculture and growth, and the blue scale for secondary interactions and notifications.

### 1. Primary Color: Green (`#16a34a` / `green-600`)
Used for primary buttons, active navigation states, successes, and brand highlights.

*   **Primary Light**: `bg-green-50` (backgrounds, alerts)
*   **Primary Normal**: `bg-green-600` / `hover:bg-green-700` (buttons, icons, primary text)
*   **Primary Dark**: `bg-green-800` (headers, active states)

### 2. Secondary Color: Blue (`#2563eb` / `blue-600`)
Used for alternative selections, info alerts, links, and secondary interactive components.

*   **Secondary Light**: `bg-blue-50` (backgrounds)
*   **Secondary Normal**: `bg-blue-600` / `hover:bg-blue-700` (secondary actions, informational tags)
*   **Secondary Dark**: `bg-blue-800`

---

## Utility Colors

| System State | Color Scale | Example Tailwind Classes |
| :--- | :--- | :--- |
| **Success** | Green | `text-green-600`, `bg-green-50` |
| **Info / Links** | Blue | `text-blue-600`, `hover:text-blue-700` |
| **Error / Invalid** | Red | `text-red-500`, `border-red-500`, `bg-red-50` |
| **Warning** | Amber | `text-amber-500`, `bg-amber-50` |
| **Neutral Grays** | Gray | `text-gray-700`, `border-gray-300`, `bg-gray-100` |

---

## Implementation Rules

1. **Focus Outline Borders**:
   Always use the primary brand color for highlighted focus outlines:
   `focus:border-green-500` or `focus-within:border-green-500`.
2. **Error Highlighting**:
   Use red borders and text when inputs are invalid (`isInvalid={true}`):
   `border-red-500 text-red-500`.
3. **Buttons**:
   - Primary: `bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white`.
   - Secondary: `bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white`.
