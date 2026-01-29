import { __testUtils } from '../src/index.js';

const ensureCrypto = () => {
  if (!globalThis.crypto?.randomUUID) {
    globalThis.crypto = {
      randomUUID: () => 'test-uuid',
    };
  }
};

describe('simple image editor plugin utilities', () => {
  beforeAll(() => {
    ensureCrypto();
  });

  test('resolveLabels merges custom labels with defaults', () => {
    const labels = __testUtils.resolveLabels({
      simpleImageEditor: {
        labels: {
          modalTitle: 'Editar imagen',
          actionLabels: {
            rotateLeft: 'Rotar a la izquierda',
          },
        },
      },
    });

    expect(labels.modalTitle).toBe('Editar imagen');
    expect(labels.actionLabels.rotateLeft).toBe('Rotar a la izquierda');
    expect(labels.actionLabels.rotateRight).toBe('Rotate right');
  });

  test('resolveClasses merges class overrides', () => {
    const classes = __testUtils.resolveClasses({
      simpleImageEditor: {
        classButton: 'custom-button',
        classModal: 'custom-modal',
      },
    });

    expect(classes.classButton).toBe('custom-button');
    expect(classes.classModal).toBe('custom-modal');
  });

  test('createModal applies class hooks to elements', () => {
    const labels = __testUtils.resolveLabels();
    const classes = __testUtils.resolveClasses({
      simpleImageEditor: {
        classOverlay: 'overlay-class',
        classModal: 'modal-class',
        classCanvas: 'canvas-class',
        classActionButton: 'action-class',
        classCancelButton: 'cancel-class',
        classApplyButton: 'apply-class',
      },
    });

    const modal = __testUtils.createModal({ labels, classes });

    expect(modal.overlay.classList.contains('overlay-class')).toBe(true);
    expect(modal.dialog.classList.contains('modal-class')).toBe(true);
    expect(modal.canvas.classList.contains('canvas-class')).toBe(true);
    expect(modal.cancelButton.classList.contains('cancel-class')).toBe(true);
    expect(modal.applyButton.classList.contains('apply-class')).toBe(true);

    const [firstActionButton] = modal.actionButtons.values();
    expect(firstActionButton.classList.contains('action-class')).toBe(true);
  });
});
