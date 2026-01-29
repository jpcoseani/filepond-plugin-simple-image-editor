# FilePond Plugin Simple Image Editor

A lightweight FilePond plugin that adds an inline image editor with rotate and flip controls.

## Usage

Register the plugin and enable it on your FilePond instance:

```js
import * as FilePond from 'filepond';
import SimpleImageEditorPlugin from 'filepond-plugin-simple-image-editor';

FilePond.registerPlugin(SimpleImageEditorPlugin);

const pond = FilePond.create(document.querySelector('input[type="file"]'));
```

The plugin adds a small edit button on each image item. Clicking the button opens a modal editor
that lets users rotate or flip the image and apply the change.

## Configuration

The plugin exposes a single option namespace, `simpleImageEditor`, which currently supports label
customization for internationalization.

### Options

```ts
simpleImageEditor: {
  labels: {
    editorButtonLabel: string;
    editorButtonIcon: string;
    modalTitle: string;
    cancelButtonLabel: string;
    applyButtonLabel: string;
    actionLabels: {
      rotateLeft: string;
      rotateRight: string;
      flipHorizontal: string;
      flipVertical: string;
    };
  };
}
```

### Default strings

```js
const defaultLabels = {
  editorButtonLabel: 'Edit image',
  editorButtonIcon: '✏️',
  modalTitle: 'Edit image',
  cancelButtonLabel: 'Cancel',
  applyButtonLabel: 'Apply',
  actionLabels: {
    rotateLeft: '⟲ Rotate Left',
    rotateRight: '⟳ Rotate Right',
    flipHorizontal: '⇋ Flip Horizontal',
    flipVertical: '⇅ Flip Vertical',
  },
};
```

### Overriding strings (i18n example)

Use `FilePond.setOptions` (or provide options when creating FilePond) to override any of the
labels. Only the provided values are replaced; the rest fall back to the defaults.

```js
FilePond.setOptions({
  simpleImageEditor: {
    labels: {
      editorButtonLabel: 'Bild bearbeiten',
      modalTitle: 'Bild bearbeiten',
      cancelButtonLabel: 'Abbrechen',
      applyButtonLabel: 'Übernehmen',
      actionLabels: {
        rotateLeft: 'Links drehen',
        rotateRight: 'Rechts drehen',
        flipHorizontal: 'Horizontal spiegeln',
        flipVertical: 'Vertikal spiegeln',
      },
    },
  },
});
```

### Custom button and modal text

You can customize just a subset of strings, including the button icon, without redefining all
labels.

```js
FilePond.setOptions({
  simpleImageEditor: {
    labels: {
      editorButtonIcon: '🖉',
      modalTitle: 'Quick edits',
    },
  },
});
```
