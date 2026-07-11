# Design System - Modal

The `Modal` component in HeroUI v3 is a compound dialog system built on top of React Aria. It uses separate elements for overlay backdrop positioning, container boundaries, and close controls.

---

## Anatomy and Component Parts

To ensure correct focus traps, keyboard navigation, and transitions, always compose modals using their designated parts:

- **`Modal`**: Holds the state wrapper.
- **`Modal.Backdrop`**: Configures the overlay behind the dialog. It handles overlay blur/opacity styles and click-to-dismiss behavior.
- **`Modal.Container`**: Manages modal alignments, screen sizing, and scrolling configurations.
- **`Modal.Dialog`**: The active wrapper window containing accessibility roles and headers.
- **`Modal.CloseTrigger`**: An optional trigger representing the close button ("X").
- **`Modal.Header`**: The container for title headings and descriptive descriptions.
- **`Modal.Heading`**: Header title.
- **`Modal.Body`**: Main wrapper containing body content (forms, options).
- **`Modal.Footer`**: Action button grouping (cancel, confirm).

---

## Styling Design

### Backdrop Opacity / Variant
- Uses the `variant="blur"` backdrop to overlay with a premium glass-morphic backdrop blur: `<Modal.Backdrop variant="blur">`.

### Container Boundaries
- Default width limits: `sm:max-w-md` or custom sizes via `className`.
- Styling tokens: `bg-white dark:bg-gray-800 border border-gray-150 dark:border-gray-700 rounded-xl shadow-lg`.

---

## Usage Example

### Basic Modal Integration

```tsx
import { Modal } from "@heroui/react";

<Modal isOpen={isOpen} onOpenChange={setIsOpen}>
  <Modal.Backdrop variant="blur">
    <Modal.Container>
      <Modal.Dialog className="sm:max-w-md">
        <Modal.CloseTrigger />
        <Modal.Header>
          <Modal.Heading>Judul Modal</Modal.Heading>
        </Modal.Header>
        <Modal.Body className="space-y-4 p-6">
          <p className="text-sm text-gray-700 dark:text-gray-300">
            Isi content dari modal yang di-render disini.
          </p>
        </Modal.Body>
        <Modal.Footer>
          <Button color="danger" variant="light" onPress={() => setIsOpen(false)}>
            Batal
          </Button>
          <Button color="success" onPress={handleAction}>
            Konfirmasi
          </Button>
        </Modal.Footer>
      </Modal.Dialog>
    </Modal.Container>
  </Modal.Backdrop>
</Modal>
```
