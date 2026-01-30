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

## Demo

A minimal demo is available in the `demo/` folder. Serve the repository root with a static
web server and open the demo page. The example below uses `npx` so you don't need to install
anything globally.

```sh
npx http-server .
```

Then open [http://localhost:8000/demo/](http://localhost:8000/demo/) in your browser. The demo
preloads sample images so you can immediately click the pencil button and open the modal editor.

### React demo

If you're integrating FilePond with React, the repository also ships a dedicated React demo
powered by `react-filepond`.

```sh
npx http-server .
```

Then open [http://localhost:8000/demo/react/](http://localhost:8000/demo/react/) to see the
React integration with preloaded images and the Simple Image Editor plugin.

## Configuration

The plugin exposes a single option namespace, `simpleImageEditor`, which currently supports label
customization for internationalization and optional CSS class overrides.

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
  classButton?: string;
  classModal?: string;
  classControls?: string;
  classRotateButton?: string;
  classFlipButton?: string;
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

### Adding CSS class overrides

Provide custom class names to hook into your own styles. Classes are appended to the default
structure and applied to the pencil button, modal dialog container, control group, and the rotate
or flip action buttons.

```js
FilePond.setOptions({
  simpleImageEditor: {
    classButton: 'editor-button',
    classModal: 'editor-modal',
    classControls: 'editor-controls',
    classRotateButton: 'editor-control editor-control-rotate',
    classFlipButton: 'editor-control editor-control-flip',
  },
});
```

## Usage scenarios

Use the plugin in the way that matches your setup. The snippets below mirror the structure of the
official FilePond plugin documentation and highlight common integration patterns.

### Vanilla FilePond (plain JS)

```js
import * as FilePond from 'filepond';
import SimpleImageEditorPlugin from 'filepond-plugin-simple-image-editor';

FilePond.registerPlugin(SimpleImageEditorPlugin);

const pond = FilePond.create(document.querySelector('input[type=\"file\"]'), {
  allowMultiple: true,
  credits: false,
});
```

### React with `react-filepond`

```jsx
import React, { useState } from 'react';
import * as FilePond from 'filepond';
import { FilePond as ReactFilePond } from 'react-filepond';
import SimpleImageEditorPlugin from 'filepond-plugin-simple-image-editor';

FilePond.registerPlugin(SimpleImageEditorPlugin);

export default function ImageUploader() {
  const [files, setFiles] = useState([]);

  return (
    <ReactFilePond
      files={files}
      onupdatefiles={setFiles}
      allowMultiple={true}
      credits={false}
      acceptedFileTypes={['image/*']}
    />
  );
}
```

### Preloading existing files

Use `files` (or `pond.addFile`) to preload images so the editor button is available immediately.

```js
const pond = FilePond.create(input, { credits: false });

pond.addFile('/images/already-uploaded.png');
```

### Uploading to a server

Pair the editor with the FilePond server API. The plugin edits the image before the upload so your
server receives the transformed image.

```js
FilePond.create(input, {
  credits: false,
  server: {
    process: '/api/uploads',
    revert: '/api/uploads/revert',
  },
});
```

### Localization + custom labels

```js
FilePond.setOptions({
  simpleImageEditor: {
    labels: {
      editorButtonLabel: 'Editar imagen',
      modalTitle: 'Editar imagen',
      cancelButtonLabel: 'Cancelar',
      applyButtonLabel: 'Aplicar',
      actionLabels: {
        rotateLeft: 'Girar a la izquierda',
        rotateRight: 'Girar a la derecha',
        flipHorizontal: 'Voltear horizontal',
        flipVertical: 'Voltear vertical',
      },
    },
  },
});
```
