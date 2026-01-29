import * as FilePond from 'https://unpkg.com/filepond/dist/filepond.esm.js';
import SimpleImageEditorPlugin from '../src/index.js';

FilePond.registerPlugin(SimpleImageEditorPlugin);

const pond = FilePond.create(document.querySelector('#demo-upload'), {
  allowMultiple: true,
  credits: false,
  simpleImageEditor: {
    classButton: 'demo-editor-button',
    classButtonIcon: 'demo-editor-button-icon',
    classOverlay: 'demo-editor-overlay',
    classModal: 'demo-editor-modal',
    classControls: 'demo-editor-controls',
    classActionButton: 'demo-editor-action',
    classRotateButton: 'demo-editor-action-rotate',
    classFlipButton: 'demo-editor-action-flip',
  },
});

const createSampleFile = ({ name, background, accent }) =>
  new Promise((resolve) => {
    const canvas = document.createElement('canvas');
    canvas.width = 520;
    canvas.height = 320;

    const ctx = canvas.getContext('2d');
    ctx.fillStyle = background;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = accent;
    ctx.fillRect(40, 40, 200, 140);
    ctx.fillRect(280, 140, 200, 140);

    ctx.fillStyle = '#0f172a';
    ctx.font = '600 28px Inter, system-ui, sans-serif';
    ctx.fillText('Sample', 56, 110);
    ctx.font = '500 18px Inter, system-ui, sans-serif';
    ctx.fillText(name, 56, 140);

    ctx.strokeStyle = '#0f172a';
    ctx.lineWidth = 6;
    ctx.beginPath();
    ctx.moveTo(320, 40);
    ctx.lineTo(480, 40);
    ctx.lineTo(480, 120);
    ctx.stroke();

    canvas.toBlob(
      (blob) => {
        if (!blob) {
          return;
        }
        resolve(new File([blob], `${name}.png`, { type: 'image/png' }));
      },
      'image/png',
      0.92
    );
  });

const preloadSamples = async () => {
  const samples = await Promise.all([
    createSampleFile({
      name: 'Sunset',
      background: '#fde68a',
      accent: '#f97316',
    }),
    createSampleFile({
      name: 'Ocean',
      background: '#bae6fd',
      accent: '#38bdf8',
    }),
  ]);

  samples.forEach((file) => pond.addFile(file));
};

preloadSamples();
