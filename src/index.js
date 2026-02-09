const pencilIconUrl = new URL('../assets/pencil.svg', import.meta.url).toString();
const iconStroke = 'currentColor';

const actionIcons = {
  'rotate-left': `<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
    <path d="M3,12.038c0,4.963,4.038,9,9,9s9-4.037,9-9S16.962,3.038,12,3.038c-2.394,0-4.677,.976-6.353,2.647l2.353,2.353H2.091c-.602,0-1.091-.488-1.091-1.091V1.038L3.529,3.567C5.763,1.341,8.807,.038,12,.038c6.617,0,12,5.383,12,12s-5.383,12-12,12C5.383,24.038,0,18.656,0,12.038H3Z" fill="${iconStroke}" />
  </svg>`,
  'rotate-right': `<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
    <path d="M21,12a9.038,9.038,0,1,1-2.647-6.353L16,8h5.909A1.09,1.09,0,0,0,23,6.909V1L20.471,3.529A11.98,11.98,0,1,0,24,12Z" fill="${iconStroke}" />
  </svg>`,
  'rotate-180': `<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
    <path d="M12,2.99a9.03,9.03,0,0,1,6.36,2.65L15.986,8.014h5.83a1.146,1.146,0,0,0,1.146-1.146V1.038L20.471,3.529A11.98,11.98,0,0,0,0,12H2.99A9.02,9.02,0,0,1,12,2.99Z" fill="${iconStroke}" />
    <path d="M21.01,12A8.994,8.994,0,0,1,5.64,18.36l2.374-2.374H1.993a.956.956,0,0,0-.955.955v6.021l2.491-2.491A11.98,11.98,0,0,0,24,12Z" fill="${iconStroke}" />
  </svg>`,
  'flip-horizontal': `<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
    <rect width="24" height="24" transform="rotate(180 12 12)" opacity="0"></rect>
    <path d="M6.09 19h12l-1.3 1.29a1 1 0 0 0 1.42 1.42l3-3a1 1 0 0 0 0-1.42l-3-3a1 1 0 0 0-1.42 0 1 1 0 0 0 0 1.42l1.3 1.29h-12a1.56 1.56 0 0 1-1.59-1.53V13a1 1 0 0 0-2 0v2.47A3.56 3.56 0 0 0 6.09 19z" fill="${iconStroke}" />
    <path d="M5.79 9.71a1 1 0 1 0 1.42-1.42L5.91 7h12a1.56 1.56 0 0 1 1.59 1.53V11a1 1 0 0 0 2 0V8.53A3.56 3.56 0 0 0 17.91 5h-12l1.3-1.29a1 1 0 0 0 0-1.42 1 1 0 0 0-1.42 0l-3 3a1 1 0 0 0 0 1.42z" fill="${iconStroke}" />
  </svg>`,
  'flip-vertical': `<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
    <rect width="24" height="24" transform="rotate(-90 12 12)" opacity="0"></rect>
    <path d="M5 6.09v12l-1.29-1.3a1 1 0 0 0-1.42 1.42l3 3a1 1 0 0 0 1.42 0l3-3a1 1 0 0 0 0-1.42 1 1 0 0 0-1.42 0L7 18.09v-12A1.56 1.56 0 0 1 8.53 4.5H11a1 1 0 0 0 0-2H8.53A3.56 3.56 0 0 0 5 6.09z" fill="${iconStroke}" />
    <path d="M14.29 5.79a1 1 0 0 0 1.42 1.42L17 5.91v12a1.56 1.56 0 0 1-1.53 1.59H13a1 1 0 0 0 0 2h2.47A3.56 3.56 0 0 0 19 17.91v-12l1.29 1.3a1 1 0 0 0 1.42 0 1 1 0 0 0 0-1.42l-3-3a1 1 0 0 0-1.42 0z" fill="${iconStroke}" />
  </svg>`,
};

const defaultLabels = {
  editorButtonLabel: 'Edit image',
  editorButtonIcon: `<img src="${pencilIconUrl}" alt="" aria-hidden="true" />`,
  modalTitle: 'Edit image',
  modalDescription: 'Use the controls to rotate or flip your image.',
  cancelButtonLabel: 'Cancel',
  applyButtonLabel: 'Apply',
  actionLabels: {
    rotateLeft: 'Rotate left',
    rotateRight: 'Rotate right',
    flipHorizontal: 'Flip horizontally',
    flipVertical: 'Flip vertically',
    rotate180: 'Rotate 180°',
  },
};

const defaultClasses = {
  classButton: '',
  classModal: '',
  classControls: '',
  classRotateButton: '',
  classFlipButton: '',
};

const resolveLabels = (options = {}) => {
  const custom = options.simpleImageEditor?.labels ?? {};
  return {
    ...defaultLabels,
    ...custom,
    actionLabels: {
      ...defaultLabels.actionLabels,
      ...(custom.actionLabels ?? {}),
    },
  };
};

const resolveClasses = (options = {}) => {
  const custom = options.simpleImageEditor ?? {};
  return {
    ...defaultClasses,
    ...custom,
  };
};

const applyClassNames = (element, className) => {
  if (!element || !className) {
    return;
  }
  className
    .split(' ')
    .map((name) => name.trim())
    .filter(Boolean)
    .forEach((name) => element.classList.add(name));
};

const createModal = ({ labels, classes }) => {
  const titleId = `simple-editor-title-${crypto.randomUUID()}`;
  const descriptionId = `simple-editor-description-${crypto.randomUUID()}`;
  const overlay = document.createElement('div');
  overlay.className = 'filepond--simple-editor-modal';
  Object.assign(overlay.style, {
    position: 'fixed',
    inset: '0',
    background: 'rgba(0, 0, 0, 0.6)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: '9999',
  });

  const dialog = document.createElement('div');
  dialog.setAttribute('role', 'dialog');
  dialog.setAttribute('aria-modal', 'true');
  dialog.setAttribute('aria-labelledby', titleId);
  dialog.setAttribute('aria-describedby', descriptionId);
  dialog.setAttribute('tabindex', '-1');
  applyClassNames(dialog, classes.classModal);
  Object.assign(dialog.style, {
    background: '#fff',
    borderRadius: '8px',
    padding: '20px',
    width: 'min(92vw, 880px)',
    maxHeight: '90vh',
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
    boxShadow: '0 20px 50px rgba(15, 23, 42, 0.25)',
  });

  const header = document.createElement('div');
  Object.assign(header.style, {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
  });

  const title = document.createElement('h2');
  title.id = titleId;
  title.textContent = labels.modalTitle;
  Object.assign(title.style, {
    margin: '0',
    fontSize: '20px',
    fontWeight: '600',
  });

  const description = document.createElement('p');
  description.id = descriptionId;
  description.textContent = labels.modalDescription;
  Object.assign(description.style, {
    margin: '0',
    fontSize: '14px',
    color: '#475569',
  });

  header.appendChild(title);
  header.appendChild(description);

  const body = document.createElement('div');
  Object.assign(body.style, {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    alignItems: 'stretch',
  });

  const previewPanel = document.createElement('div');
  Object.assign(previewPanel.style, {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: '#f8fafc',
    borderRadius: '12px',
    padding: '16px',
    minHeight: '260px',
  });

  const canvas = document.createElement('canvas');
  Object.assign(canvas.style, {
    maxWidth: '100%',
    maxHeight: '60vh',
    alignSelf: 'center',
    borderRadius: '6px',
    background: '#fff',
  });

  previewPanel.appendChild(canvas);

  const toolbar = document.createElement('div');
  applyClassNames(toolbar, classes.classControls);
  Object.assign(toolbar.style, {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexWrap: 'wrap',
    gap: '12px',
  });

  const actions = [
    { key: 'rotate-left', label: labels.actionLabels.rotateLeft },
    { key: 'rotate-right', label: labels.actionLabels.rotateRight },
    { key: 'rotate-180', label: labels.actionLabels.rotate180 },
    { key: 'flip-horizontal', label: labels.actionLabels.flipHorizontal },
    { key: 'flip-vertical', label: labels.actionLabels.flipVertical },
  ];

  const actionButtons = new Map();

  actions.forEach((action) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.innerHTML = actionIcons[action.key] ?? '';
    button.setAttribute('aria-label', action.label);
    button.setAttribute('title', action.label);
    if (action.key.startsWith('flip')) {
      button.setAttribute('aria-pressed', 'false');
    }
    if (action.key.startsWith('rotate')) {
      applyClassNames(button, classes.classRotateButton);
    }
    if (action.key.startsWith('flip')) {
      applyClassNames(button, classes.classFlipButton);
    }
    Object.assign(button.style, {
      width: '44px',
      height: '44px',
      borderRadius: '12px',
      border: '1px solid #d7dde5',
      background: '#fff',
      cursor: 'pointer',
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: '#0f172a',
      transition: 'transform 0.15s ease, border-color 0.15s ease, box-shadow 0.15s ease',
    });
    const icon = button.querySelector('svg');
    if (icon) {
      Object.assign(icon.style, {
        width: '22px',
        height: '22px',
      });
    }
    button.addEventListener('mouseenter', () => {
      button.style.borderColor = '#a5b4fc';
      button.style.boxShadow = '0 6px 16px rgba(15, 23, 42, 0.12)';
      button.style.transform = 'translateY(-1px)';
    });
    button.addEventListener('mouseleave', () => {
      const isPressed = button.getAttribute('aria-pressed') === 'true';
      button.style.borderColor = isPressed ? '#3b82f6' : '#d7dde5';
      button.style.boxShadow = isPressed ? '0 0 0 2px rgba(59, 130, 246, 0.2)' : 'none';
      button.style.transform = 'translateY(0)';
    });
    toolbar.appendChild(button);
    actionButtons.set(action.key, button);
  });

  body.appendChild(toolbar);
  body.appendChild(previewPanel);

  const footer = document.createElement('div');
  Object.assign(footer.style, {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '8px',
  });

  const cancelButton = document.createElement('button');
  cancelButton.type = 'button';
  cancelButton.textContent = labels.cancelButtonLabel;
  Object.assign(cancelButton.style, {
    padding: '8px 16px',
    borderRadius: '6px',
    border: '1px solid #d0d0d0',
    background: '#fff',
    cursor: 'pointer',
  });

  const applyButton = document.createElement('button');
  applyButton.type = 'button';
  applyButton.textContent = labels.applyButtonLabel;
  Object.assign(applyButton.style, {
    padding: '8px 16px',
    borderRadius: '6px',
    border: '1px solid #1e5bd6',
    background: '#1e5bd6',
    color: '#fff',
    cursor: 'pointer',
  });

  footer.appendChild(cancelButton);
  footer.appendChild(applyButton);

  dialog.appendChild(header);
  dialog.appendChild(body);
  dialog.appendChild(footer);
  overlay.appendChild(dialog);

  return {
    overlay,
    dialog,
    canvas,
    actionButtons,
    cancelButton,
    applyButton,
  };
};

const loadImageFromItem = (item) => {
  return new Promise((resolve, reject) => {
    const file = item?.file || item?.getFile?.();
    if (!file) {
      reject(new Error('No file available on item.'));
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image();
      img.onload = () => resolve({ img, file });
      img.onerror = () => reject(new Error('Failed to load image data.'));
      img.src = reader.result;
    };
    reader.onerror = () => reject(new Error('Failed to read file.'));
    reader.readAsDataURL(file);
  });
};

const updateItemFile = (item, file, metadata) => {
  if (item?.setMetadata && metadata) {
    item.setMetadata('simpleImageEditor', metadata);
  }

  if (typeof item?.setFile === 'function') {
    item.setFile(file);
  } else if (typeof item?.setFile === 'undefined' && item?.file) {
    item.file = file;
  }

  if (typeof item?.fire === 'function') {
    item.fire('load');
  }
};

const FileStatus = {
  INIT: 1,
  IDLE: 2,
  PROCESSING: 3,
  PROCESSING_COMPLETE: 5,
  PROCESSING_ERROR: 6,
  PROCESSING_QUEUED: 9,
  PROCESSING_REVERT_ERROR: 10,
  LOADING: 7,
  LOAD_ERROR: 8,
};

const shouldHideEditorButton = (item) => {
  if (!item || typeof item.status !== 'number') {
    return false;
  }

  return [
    FileStatus.PROCESSING,
    FileStatus.PROCESSING_QUEUED,
    FileStatus.LOADING,
  ].includes(item.status);
};

const updateEditorButtonVisibility = (itemElement, item) => {
  if (!itemElement) {
    return;
  }

  const button = itemElement.querySelector('[data-simple-image-editor]');
  if (!button) {
    return;
  }

  button.style.display = shouldHideEditorButton(item) ? 'none' : 'flex';
};

const drawImageToCanvas = ({ img, canvas, rotation, flipX, flipY }) => {
  const context = canvas.getContext('2d');
  if (!context) {
    return;
  }

  const width = img.naturalWidth || img.width;
  const height = img.naturalHeight || img.height;
  const normalizedRotation = ((rotation % 360) + 360) % 360;
  const isSideways = normalizedRotation === 90 || normalizedRotation === 270;

  canvas.width = isSideways ? height : width;
  canvas.height = isSideways ? width : height;

  context.clearRect(0, 0, canvas.width, canvas.height);
  context.save();
  context.translate(canvas.width / 2, canvas.height / 2);
  context.rotate((normalizedRotation * Math.PI) / 180);
  context.scale(flipX ? -1 : 1, flipY ? -1 : 1);
  context.drawImage(img, -width / 2, -height / 2, width, height);
  context.restore();
};

const openEditorModal = async ({ item, labels, classes }) => {
  const modal = createModal({ labels, classes });
  const previousActiveElement = document.activeElement;
  const focusableSelector =
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';
  const focusableElements = () =>
    Array.from(modal.dialog.querySelectorAll(focusableSelector)).filter(
      (element) => !element.hasAttribute('disabled')
    );

  const closeModal = () => {
    modal.overlay.remove();
    if (previousActiveElement && typeof previousActiveElement.focus === 'function') {
      previousActiveElement.focus();
    }
    document.removeEventListener('keydown', handleKeydown);
  };

  const handleKeydown = (event) => {
    if (event.key === 'Escape') {
      event.preventDefault();
      closeModal();
      return;
    }

    if (event.key !== 'Tab') {
      return;
    }

    const focusables = focusableElements();
    if (focusables.length === 0) {
      event.preventDefault();
      return;
    }

    const first = focusables[0];
    const last = focusables[focusables.length - 1];
    const isShift = event.shiftKey;

    if (!isShift && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    } else if (isShift && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    }
  };

  document.body.appendChild(modal.overlay);
  document.addEventListener('keydown', handleKeydown);

  const [initialFocus] = focusableElements();
  if (initialFocus) {
    initialFocus.focus();
  } else {
    modal.dialog.focus();
  }

  let rotation = 0;
  let flipX = false;
  let flipY = false;

  try {
    const { img, file } = await loadImageFromItem(item);

    const redraw = () => {
      drawImageToCanvas({
        img,
        canvas: modal.canvas,
        rotation,
        flipX,
        flipY,
      });
    };

    redraw();

    modal.actionButtons.get('rotate-left').addEventListener('click', () => {
      rotation -= 90;
      redraw();
    });

    modal.actionButtons.get('rotate-right').addEventListener('click', () => {
      rotation += 90;
      redraw();
    });

    modal.actionButtons.get('rotate-180').addEventListener('click', () => {
      rotation += 180;
      redraw();
    });

    modal.actionButtons.get('flip-horizontal').addEventListener('click', () => {
      flipX = !flipX;
      modal.actionButtons.get('flip-horizontal').setAttribute('aria-pressed', String(flipX));
      modal.actionButtons.get('flip-horizontal').style.borderColor = flipX
        ? '#3b82f6'
        : '#d7dde5';
      modal.actionButtons.get('flip-horizontal').style.boxShadow = flipX
        ? '0 0 0 2px rgba(59, 130, 246, 0.2)'
        : 'none';
      redraw();
    });

    modal.actionButtons.get('flip-vertical').addEventListener('click', () => {
      flipY = !flipY;
      modal.actionButtons.get('flip-vertical').setAttribute('aria-pressed', String(flipY));
      modal.actionButtons.get('flip-vertical').style.borderColor = flipY
        ? '#3b82f6'
        : '#d7dde5';
      modal.actionButtons.get('flip-vertical').style.boxShadow = flipY
        ? '0 0 0 2px rgba(59, 130, 246, 0.2)'
        : 'none';
      redraw();
    });

    modal.cancelButton.addEventListener('click', () => {
      closeModal();
    });

    modal.applyButton.addEventListener('click', () => {
      modal.applyButton.disabled = true;
      modal.canvas.toBlob((blob) => {
        if (!blob) {
          closeModal();
          return;
        }
        const editedFile = new File([blob], file.name, { type: blob.type });
        updateItemFile(item, editedFile, { rotation, flipX, flipY });
        closeModal();
      }, file.type || 'image/png');
    });
  } catch (error) {
    closeModal();
    // eslint-disable-next-line no-console
    console.warn('[SimpleImageEditor]', error);
  }
};

const addEditorButton = (item, itemElement, labels, classes) => {
  if (!itemElement || itemElement.querySelector('[data-simple-image-editor]')) {
    return;
  }

  const button = document.createElement('button');
  button.type = 'button';
  button.setAttribute('data-simple-image-editor', 'true');
  button.setAttribute('aria-label', labels.editorButtonLabel);
  button.setAttribute('title', labels.editorButtonLabel);
  button.innerHTML = labels.editorButtonIcon;
  applyClassNames(button, classes.classButton);
  Object.assign(button.style, {
    position: 'absolute',
    top: '8px',
    right: '8px',
    zIndex: '10',
    width: '32px',
    height: '32px',
    borderRadius: '50%',
    border: '1px solid rgba(0, 0, 0, 0.2)',
    background: 'rgba(255, 255, 255, 0.9)',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  });

  const icon = button.querySelector('img');
  if (icon) {
    Object.assign(icon.style, {
      width: '16px',
      height: '16px',
    });
  }

  button.addEventListener('click', (event) => {
    event.preventDefault();
    event.stopPropagation();
    openEditorModal({ item, labels, classes });
  });

  itemElement.style.position = 'relative';
  itemElement.appendChild(button);
  updateEditorButtonVisibility(itemElement, item);
};

const plugin = (fpAPI) => {
  const { addFilter, utils } = fpAPI;
  const { Type, createRoute } = utils;

  const isImage = (file) => file && /^image\//.test(file.type);

  addFilter('CREATE_VIEW', (viewAPI) => {
    const { is, view, query } = viewAPI;

    // solo en la vista de archivo (item)
    if (!is('file')) return;

    const didLoadItem = ({ root, props }) => {
      const { id } = props;
      const item = query('GET_ITEM', id);
      if (!item || item.archived || !isImage(item.file)) return;

      // ✅ acá leés tu option (porque query existe acá)
      const simpleOpts =
        root.query('GET_SIMPLE_IMAGE_EDITOR') ?? {
          labels: defaultLabels,
          ...defaultClasses,
        };

      const labels = resolveLabels({ simpleImageEditor: simpleOpts });
      const classes = resolveClasses({ simpleImageEditor: simpleOpts });

      // ✅ acá tenés el elemento del item real
      addEditorButton(item, root.element, labels, classes);
      updateEditorButtonVisibility(root.element, item);
    };

    const updateItemButton = ({ root, id }) => {
      const item = query('GET_ITEM', id);
      if (!item) return;
      updateEditorButtonVisibility(root.element, item);
    };

    view.registerWriter(
      createRoute(
        {
          DID_LOAD_ITEM: didLoadItem,
          DID_START_ITEM_PROCESSING: updateItemButton,
          DID_REQUEST_ITEM_PROCESSING: updateItemButton,
          DID_COMPLETE_ITEM_PROCESSING: updateItemButton,
          DID_ABORT_ITEM_PROCESSING: updateItemButton,
          DID_REVERT_ITEM_PROCESSING: updateItemButton,
          DID_THROW_ITEM_PROCESSING_ERROR: updateItemButton,
          DID_THROW_ITEM_PROCESSING_REVERT_ERROR: updateItemButton,
        },
        () => {
          // writer noop (opcional)
        }
      )
    );
  });

  return {
    options: {
      // esto crea GET_SIMPLE_IMAGE_EDITOR
      simpleImageEditor: [
        {
          labels: defaultLabels,
          ...defaultClasses,
        },
        Type.OBJECT,
      ],
    },
  };
};

export default plugin;
