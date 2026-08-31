import {
    BalloonEditor, Essentials, Paragraph, Bold, Italic, Underline, Strikethrough,
    Heading, Link, List, BlockQuote, CodeBlock, HorizontalLine,
    Table, TableToolbar, TableProperties, TableCellProperties,
    Image, ImageCaption, ImageResize, ImageToolbar, ImageUpload, Plugin, Command,
} from 'ckeditor5';
import { Widget, toWidget, viewToModelPositionOutsideModelElement } from '@ckeditor/ckeditor5-widget';
import { ButtonView } from '@ckeditor/ckeditor5-ui';
import 'ckeditor5/ckeditor5.css';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import Swiper from 'swiper';
import { Navigation, Pagination } from 'swiper/modules';
import '../css/admin-editor.css';

/* ---------- Toast ---------- */
function showToast(message, type = 'success') {
    let toast = document.getElementById('ck-toast');
    if (!toast) {
        toast = document.createElement('div');
        toast.id = 'ck-toast';
        document.body.appendChild(toast);
    }
    toast.textContent = message;
    toast.className = `ck-toast show ${type}`;
    clearTimeout(toast._timer);
    toast._timer = setTimeout(() => toast.classList.remove('show'), 3000);
}

async function uploadEditorImage(file) {
    const fd = new FormData();
    fd.append('image', file);
    const token = document.querySelector('meta[name="csrf-token"]')?.content || '';
    const res = await fetch('/auth/uploads/images', {
        method: 'POST',
        headers: { 'X-CSRF-TOKEN': token, Accept: 'application/json' },
        body: fd,
    });
    if (!res.ok) throw new Error('upload failed');
    const data = await res.json();
    return data.url;
}

function pickFiles(accept, multiple = false) {
    return new Promise((resolve) => {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = accept;
        input.multiple = multiple;
        input.onchange = () => resolve(Array.from(input.files || []));
        input.click();
    });
}

/* ---------- Upload adapter for CKEditor ImageUpload ---------- */
class UploadAdapter {
    constructor(loader) { this.loader = loader; }
    upload() {
        return this.loader.file
            .then((file) => uploadEditorImage(file))
            .then((url) => ({ default: url }));
    }
    abort() {}
}

class UploadAdapterPlugin extends Plugin {
    static get requires() { return [ImageUpload]; }
    init() {
        this.editor.plugins.get('FileRepository').createUploadAdapter = (loader) => new UploadAdapter(loader);
    }
}

/* ---------- Carousel widget (Swiper structure) ---------- */
function buildCarouselView(modelElement, writer) {
    const images = modelElement.getAttribute('carouselImages') || [];
    const figure = writer.createContainerElement('figure', { class: 'swiper-carousel' });
    const swiper = writer.createContainerElement('div', { class: 'swiper' });
    const wrapper = writer.createContainerElement('div', { class: 'swiper-wrapper' });
    images.forEach((src) => {
        const slide = writer.createContainerElement('div', { class: 'swiper-slide' });
        const img = writer.createEmptyElement('img', { src, alt: '' });
        writer.insert(writer.createPositionAt(slide, 0), img);
        writer.insert(writer.createPositionAt(wrapper, 'end'), slide);
    });
    const prev = writer.createEmptyElement('div', { class: 'swiper-button-prev' });
    const next = writer.createEmptyElement('div', { class: 'swiper-button-next' });
    const pag = writer.createEmptyElement('div', { class: 'swiper-pagination' });
    writer.insert(writer.createPositionAt(swiper, 0), wrapper);
    writer.insert(writer.createPositionAt(swiper, 'end'), pag);
    writer.insert(writer.createPositionAt(swiper, 'end'), prev);
    writer.insert(writer.createPositionAt(swiper, 'end'), next);
    writer.insert(writer.createPositionAt(figure, 0), swiper);
    const captionText = modelElement.getAttribute('carouselCaption') || '';
    const caption = writer.createContainerElement('figcaption', {
        class: 'carousel-caption',
        'data-placeholder': 'Tulis caption carousel...',
    });
    if (captionText) {
        writer.insert(writer.createPositionAt(caption, 0), writer.createText(captionText));
    }
    writer.insert(writer.createPositionAt(figure, 'end'), caption);
    return figure;
}

class Carousel extends Plugin {
    static get pluginName() { return 'Carousel'; }
    static get requires() { return [Widget]; }

    init() {
        const editor = this.editor;
        editor.model.schema.register('carousel', {
            isObject: true,
            allowWhere: '$block',
            allowAttributes: ['carouselImages', 'carouselCaption'],
        });

        editor.conversion.for('dataDowncast').elementToElement({
            model: 'carousel',
            view: (modelElement, { writer }) => buildCarouselView(modelElement, writer),
        });

        editor.conversion.for('editingDowncast').elementToElement({
            model: 'carousel',
            view: (modelElement, { writer }) =>
                toWidget(buildCarouselView(modelElement, writer), writer, { label: 'Carousel' }),
        });

        editor.conversion.for('upcast').elementToElement({
            view: { name: 'figure', classes: 'swiper-carousel' },
            model: (viewElement, { writer }) => {
                const images = [];
                const walk = (node) => {
                    if (!node.is('element')) return;
                    if (node.name === 'img') { const s = node.getAttribute('src'); if (s) images.push(s); }
                    for (const c of node.getChildren()) walk(c);
                };
                walk(viewElement);
                let caption = '';
                const capEl = [...viewElement.getChildren()].find((n) => n.is('element', 'figcaption'));
                if (capEl) {
                    const first = capEl.getChild(0);
                    caption = first && first.data ? first.data : '';
                }
                return writer.createElement('carousel', { carouselImages: images, carouselCaption: caption });
            },
        });

        editor.editing.mapper.on('viewToModelPosition',
            viewToModelPositionOutsideModelElement(editor.model, (viewElement) => viewElement.hasClass('swiper-carousel')));

        editor.commands.add('carouselAddPhoto', new CarouselAddCommand(editor));
        editor.commands.add('carouselRemovePhoto', new CarouselRemoveCommand(editor));
        editor.commands.add('carouselCaption', new CarouselCaptionCommand(editor));

        editor.ui.componentFactory.add('carouselAddPhoto', (locale) => {
            const b = new ButtonView(locale);
            b.set({ label: 'Tambah foto', tooltip: true, withText: true, text: '＋ Foto' });
            b.bind('isEnabled').to(editor.commands.get('carouselAddPhoto'));
            b.on('execute', () => editor.execute('carouselAddPhoto'));
            return b;
        });
        editor.ui.componentFactory.add('carouselRemovePhoto', (locale) => {
            const b = new ButtonView(locale);
            b.set({ label: 'Hapus foto', tooltip: true, withText: true, text: '－ Foto' });
            b.bind('isEnabled').to(editor.commands.get('carouselRemovePhoto'));
            b.on('execute', () => editor.execute('carouselRemovePhoto'));
            return b;
        });
        editor.ui.componentFactory.add('carouselCaption', (locale) => {
            const b = new ButtonView(locale);
            b.set({ label: 'Caption', tooltip: true, withText: true, text: 'Caption' });
            b.bind('isEnabled').to(editor.commands.get('carouselCaption'));
            b.on('execute', () => editor.execute('carouselCaption'));
            return b;
        });

        editor.ui.componentFactory.add('carousel', (locale) => {
            const button = new ButtonView(locale);
            button.set({ label: 'Carousel', tooltip: true, withText: true, text: 'Carousel' });
            button.on('execute', () => insertCarouselInto(editor));
            return button;
        });
    }

}

/* ---------- Shared insert helpers ---------- */
async function insertCarouselInto(editor) {
    const files = await pickFiles('image/jpeg,image/png,image/webp,image/gif', true);
    if (!files.length) return;
    try {
        const images = [];
        for (const f of files) images.push(await uploadEditorImage(f));
        editor.model.change((writer) => {
            const element = writer.createElement('carousel', { carouselImages: images });
            editor.model.insertContent(element);
            writer.setSelection(element, 'on');
        });
    } catch (e) {
        showToast('Gagal mengunggah gambar carousel.', 'error');
    }
}

async function insertImageInto(editor) {
    const files = await pickFiles('image/jpeg,image/png,image/webp,image/gif');
    if (!files.length) return;
    try {
        const url = await uploadEditorImage(files[0]);
        editor.execute('insertImage', { source: url });
    } catch (e) {
        showToast('Gagal mengunggah gambar.', 'error');
    }
}

/* ---------- Command palette (Ctrl+/) ---------- */
class CommandPalette extends Plugin {
    static get pluginName() { return 'CommandPalette'; }
    init() {
        const editor = this.editor;
        this.menu = null;
        editor.editing.view.document.on('keydown', (evt, data) => {
            if ((data.ctrlKey || data.metaKey) && data.keyCode === 191) {
                evt.stop();
                this.toggle();
            }
        });
    }

    toggle() {
        if (this.menu && this.menu.isConnected) { this.hide(); return; }
        this.menu = null;
        const sel = window.getSelection();
        let rect = null;
        if (sel && sel.rangeCount) rect = sel.getRangeAt(0).getBoundingClientRect();
        if (!rect || (rect.width === 0 && rect.height === 0)) {
            const editable = this.editor.ui.getEditableElement();
            rect = editable ? editable.getBoundingClientRect() : { left: 0, top: 0, height: 0 };
        }
        this.show(rect.left, rect.top + rect.height);
    }

    show(x, y) {
        this.hide();
        const menu = document.createElement('div');
        menu.className = 'ck-command-menu';
        const editor = this.editor;
        const items = [
            { label: 'Heading 2', hint: 'h2', run: () => editor.execute('heading', { value: 'heading2' }) },
            { label: 'Table', hint: 'insert table', run: () => editor.execute('insertTable', { rows: 2, cols: 2 }) },
            { label: 'Separator', hint: 'horizontal divider', run: () => editor.execute('horizontalLine') },
            { label: 'Code block', hint: 'code', run: () => editor.execute('codeBlock') },
            { label: 'Image', hint: 'upload', run: () => insertImageInto(editor) },
            { label: 'Carousel', hint: 'multiple images', run: () => insertCarouselInto(editor) },
        ];
        items.forEach((item) => {
            const btn = document.createElement('button');
            btn.type = 'button';
            btn.className = 'ck-command-item';
            const label = document.createElement('span'); label.textContent = item.label;
            const hint = document.createElement('span'); hint.className = 'ck-command-hint'; hint.textContent = item.hint;
            btn.append(label, hint);
            btn.addEventListener('mousedown', (e) => e.preventDefault());
            btn.addEventListener('click', () => { this.hide(); item.run(); });
            menu.appendChild(btn);
        });
        document.body.appendChild(menu);
        this.menu = menu;
        const r = menu.getBoundingClientRect();
        let left = x, top = y + 8;
        if (left + r.width > window.innerWidth - 8) left = window.innerWidth - r.width - 8;
        if (left < 8) left = 8;
        if (top + r.height > window.innerHeight - 8) top = y - r.height - 8;
        menu.style.left = left + 'px';
        menu.style.top = top + 'px';
    }

    hide() {
        if (this.menu) { this.menu.remove(); this.menu = null; }
    }
}

/* ---------- Swiper + editing controls inside the editor ---------- */
function initEditorSwipers(editorEl) {
    editorEl.querySelectorAll('.swiper-carousel .swiper:not(.swiper-initialized)').forEach((sw) => {
        new Swiper(sw, {
            modules: [Navigation, Pagination],
            loop: false,
            navigation: { nextEl: sw.querySelector('.swiper-button-next'), prevEl: sw.querySelector('.swiper-button-prev') },
            pagination: { el: sw.querySelector('.swiper-pagination'), clickable: true },
        });
    });
}

function getSelectedCarousel(editor) {
    const sel = editor.model.document.selection;
    const el = sel.getSelectedElement();
    return (el && el.is('element', 'carousel')) ? el : null;
}

function rebuildCarousel(editor, modelEl, images, caption) {
    const parent = modelEl.parent;
    const index = parent.getChildIndex(modelEl);
    editor.model.change((w) => {
        w.remove(modelEl);
        const el = w.createElement('carousel', { carouselImages: images, carouselCaption: caption });
        w.insert(el, w.createPositionAt(parent, index));
        w.setSelection(el, 'on');
    });
}

async function carouselAddPhoto(editor) {
    const modelEl = getSelectedCarousel(editor);
    if (!modelEl) return;
    const files = await pickFiles('image/jpeg,image/png,image/webp,image/gif', true);
    if (!files.length) return;
    try {
        const urls = [];
        for (const f of files) urls.push(await uploadEditorImage(f));
        const cur = [...modelEl.getAttribute('carouselImages')];
        rebuildCarousel(editor, modelEl, [...cur, ...urls], modelEl.getAttribute('carouselCaption') || '');
    } catch (e) {
        showToast('Gagal mengunggah gambar carousel.', 'error');
    }
}

function carouselRemoveLast(editor) {
    const modelEl = getSelectedCarousel(editor);
    if (!modelEl) return;
    const arr = [...modelEl.getAttribute('carouselImages')];
    arr.pop();
    if (!arr.length) arr.push('');
    rebuildCarousel(editor, modelEl, arr, modelEl.getAttribute('carouselCaption') || '');
}

function carouselSetCaption(editor) {
    const modelEl = getSelectedCarousel(editor);
    if (!modelEl) return;
    const current = modelEl.getAttribute('carouselCaption') || '';
    const next = window.prompt('Caption carousel:', current);
    if (next === null) return;
    rebuildCarousel(editor, modelEl, [...modelEl.getAttribute('carouselImages')], next.trim());
}

class CarouselAddCommand extends Command {
    refresh() { this.isEnabled = !!getSelectedCarousel(this.editor); }
    execute() { return carouselAddPhoto(this.editor); }
}
class CarouselRemoveCommand extends Command {
    refresh() { this.isEnabled = !!getSelectedCarousel(this.editor); }
    execute() { return carouselRemoveLast(this.editor); }
}
class CarouselCaptionCommand extends Command {
    refresh() { this.isEnabled = !!getSelectedCarousel(this.editor); }
    execute() { return carouselSetCaption(this.editor); }
}

/* ---------- Swiper inside the editor ---------- */
function syncCarousels(editor, editorEl) {
    editorEl.querySelectorAll('.swiper-carousel .swiper:not(.swiper-initialized)').forEach((sw) => {
        new Swiper(sw, {
            modules: [Navigation, Pagination],
            loop: false,
            navigation: { nextEl: sw.querySelector('.swiper-button-next'), prevEl: sw.querySelector('.swiper-button-prev') },
            pagination: { el: sw.querySelector('.swiper-pagination'), clickable: true },
        });
    });
}

/* ---------- Remove indent/outdent buttons ---------- */
function initIndentRemover() {
    const strip = () => {
        document.querySelectorAll('.ck-balloon-panel .ck-button').forEach((btn) => {
            const label = ((btn.getAttribute('aria-label') || btn.title || '') + ' ' + btn.textContent).toLowerCase();
            if (label.includes('indent') || label.includes('outdent')) btn.remove();
        });
    };
    strip();
    const mo = new MutationObserver(() => strip());
    mo.observe(document.body, { childList: true, subtree: true });
}

/* ---------- Editors ---------- */
async function initCkEditors() {
    const els = document.querySelectorAll('[data-ckeditor]');
    for (const el of els) {
        const hiddenInput = document.getElementById(el.dataset.ckeditor);
        if (!hiddenInput) continue;

        const editor = await BalloonEditor.create(el, {
            licenseKey: 'GPL',
            plugins: [Essentials, Paragraph, Bold, Italic, Underline, Strikethrough,
                Heading, Link, List, BlockQuote, CodeBlock, HorizontalLine,
                Table, TableToolbar, TableProperties, TableCellProperties,
                Image, ImageCaption, ImageResize, ImageToolbar, ImageUpload,
                UploadAdapterPlugin, Carousel, CommandPalette],
            toolbar: ['bold', 'italic', 'underline', 'strikethrough', '|', 'heading', '|',
                'bulletedList', 'numberedList', 'blockQuote', 'codeBlock', 'horizontalLine', 'link', '|',
                'insertTable', 'imageUpload', 'carousel', 'carouselAddPhoto', 'carouselRemovePhoto', 'carouselCaption'],
            image: { toolbar: ['toggleImageCaption', 'imageStyle:block', 'resizeImage', 'imageTextAlternative'] },
            table: { contentToolbar: ['tableColumn', 'tableRow', 'mergeTableCells', 'tableProperties', 'tableCellProperties'] },
        });

        if (hiddenInput.value) editor.setData(hiddenInput.value);
        editor.model.document.on('change:data', () => {
            hiddenInput.value = editor.getData();
            syncCarousels(editor, editor.ui.getEditableElement());
        });

        const editableEl = editor.ui.getEditableElement();
        const mo = new MutationObserver(() => syncCarousels(editor, editableEl));
        mo.observe(editableEl, { childList: true, subtree: true });
        syncCarousels(editor, editableEl);

        el.__ckeditor = editor;
    }
}

/* ---------- Image dropzone (single image with preview + remove) ---------- */
function initImageDropzone(id) {
    const area = document.getElementById(`${id}-dropzone`);
    const input = document.getElementById(`${id}-input`);
    const preview = document.getElementById(`${id}-preview`);
    const clear = document.getElementById(`${id}-clear`);
    const remove = document.getElementById(`${id}-remove`);
    if (!area || !input) return;

    function hasImage() { return !!(preview && (preview.getAttribute('src') || '')); }
    function render() {
        const img = hasImage();
        if (preview) preview.classList.toggle('hidden', !img);
        if (clear) clear.classList.toggle('hidden', !img);
    }
    render();

    area.addEventListener('click', (e) => {
        if (e.target.closest('button')) return;
        input.click();
    });
    input.addEventListener('change', () => {
        const f = input.files[0];
        if (f && preview) { preview.src = URL.createObjectURL(f); render(); if (remove) remove.checked = false; }
    });
    if (clear) {
        clear.addEventListener('click', (e) => {
            e.stopPropagation();
            input.value = '';
            if (preview) preview.removeAttribute('src');
            render();
            if (remove) remove.checked = true;
        });
    }
}

/* ---------- Gallery preview ---------- */
function initGalleryPreview() {
    const input = document.getElementById('gallery-input');
    const preview = document.getElementById('gallery-preview');
    const dropzone = document.getElementById('gallery-dropzone');
    if (!input || !preview) return;
    if (dropzone) dropzone.addEventListener('click', () => input.click());

    input.addEventListener('change', () => {
        preview.innerHTML = '';
        Array.from(input.files).forEach((file) => {
            const url = URL.createObjectURL(file);
            const wrap = document.createElement('div');
            wrap.className = 'relative rounded-md overflow-hidden border border-neutral-700';

            const del = document.createElement('button');
            del.type = 'button';
            del.className = 'absolute right-2 top-2 z-10 flex h-7 w-7 items-center justify-center rounded-full bg-black/60 text-white';
            const ic = document.createElement('span');
            ic.className = 'material-symbols-outlined text-base';
            ic.textContent = 'close';
            del.appendChild(ic);
            del.addEventListener('click', () => wrap.remove());
            wrap.appendChild(del);

            if (file.type.startsWith('video/')) {
                const video = document.createElement('video');
                video.src = url;
                video.controls = true;
                video.className = 'h-28 w-full object-cover';
                wrap.appendChild(video);
            } else {
                const img = document.createElement('img');
                img.src = url;
                img.alt = file.name;
                img.className = 'h-28 w-full object-cover';
                wrap.appendChild(img);
            }

            const label = document.createElement('span');
            label.textContent = file.name;
            label.className = 'block truncate px-2 py-1 text-xs text-neutral-300';
            wrap.appendChild(label);

            preview.appendChild(wrap);
        });
    });
}

function initGalleryRemove() {
    document.querySelectorAll('.gallery-remove-btn').forEach((btn) => {
        btn.addEventListener('click', () => {
            const item = btn.closest('.gallery-item');
            const cb = item && item.querySelector('input[type="checkbox"]');
            if (cb) cb.checked = true;
            if (item) item.classList.add('opacity-40');
        });
    });
}

/* ---------- Action buttons (dynamic rows) ---------- */
function initActionButtons() {
    const container = document.getElementById('actions-container');
    const hidden = document.getElementById('actions-input');
    const addBtn = document.getElementById('actions-add');
    if (!container || !hidden) return;

    function addRow(label = '', url = '') {
        const row = document.createElement('div');
        row.className = 'flex flex-col gap-2 sm:flex-row';

        const labelInput = document.createElement('input');
        labelInput.type = 'text';
        labelInput.placeholder = 'Label (mis. View Demo)';
        labelInput.value = label;
        labelInput.className = 'flex-1 rounded-md border border-neutral-700 bg-neutral-950 px-3 py-2.5 text-white outline-none focus:border-neutral-500';

        const urlInput = document.createElement('input');
        urlInput.type = 'text';
        urlInput.placeholder = 'URL (https://...)';
        urlInput.value = url;
        urlInput.className = 'flex-1 rounded-md border border-neutral-700 bg-neutral-950 px-3 py-2.5 text-white outline-none focus:border-neutral-500';

        const removeBtn = document.createElement('button');
        removeBtn.type = 'button';
        removeBtn.className = 'btn btn--secondary whitespace-nowrap inline-flex items-center gap-1';
        const rmIcon = document.createElement('span');
        rmIcon.className = 'material-symbols-outlined text-base';
        rmIcon.textContent = 'close';
        removeBtn.append(rmIcon, document.createTextNode(' Hapus'));
        removeBtn.addEventListener('click', () => { row.remove(); sync(); });

        row.append(labelInput, urlInput, removeBtn);
        container.appendChild(row);

        labelInput.addEventListener('input', sync);
        urlInput.addEventListener('input', sync);
    }

    function sync() {
        const lines = [];
        container.querySelectorAll(':scope > div').forEach((row) => {
            const inputs = row.querySelectorAll('input');
            const l = inputs[0].value.trim();
            const u = inputs[1].value.trim();
            if (l) lines.push(`${l} | ${u || '#'}`);
        });
        hidden.value = lines.join('\n');
    }

    if (hidden.value) {
        hidden.value.split('\n').forEach((line) => {
            const parts = line.split('|').map((s) => s.trim());
            addRow(parts[0] || '', parts[1] || '');
        });
    } else {
        addRow();
    }

    if (addBtn) addBtn.addEventListener('click', () => addRow());
    sync();
}

function initPlatformInput() {
    const container = document.getElementById('platform-container');
    const input = document.getElementById('platform-new');
    const insertBtn = document.getElementById('platform-insert');
    const hidden = document.getElementById('platform-input');
    if (!container || !input || !insertBtn || !hidden) return;

    function items() {
        return hidden.value.split('\n').map((s) => s.trim()).filter(Boolean);
    }

    function render() {
        container.innerHTML = '';
        items().forEach((item) => {
            const pill = document.createElement('span');
            pill.className = 'inline-flex items-center gap-1 rounded-full border border-neutral-700 bg-neutral-900 px-3 py-1 text-sm text-neutral-200';
            const text = document.createElement('span');
            text.textContent = item;
            const x = document.createElement('button');
            x.type = 'button';
            x.className = 'flex h-5 w-5 items-center justify-center text-neutral-400 hover:text-white';
            const xIcon = document.createElement('span');
            xIcon.className = 'material-symbols-outlined text-sm';
            xIcon.textContent = 'close';
            x.appendChild(xIcon);
            x.addEventListener('click', () => {
                hidden.value = items().filter((s) => s !== item).join('\n');
                render();
            });
            pill.append(text, x);
            container.appendChild(pill);
        });
    }

    function add() {
        const v = input.value.trim();
        if (!v) return;
        hidden.value = [...items(), v].join('\n');
        input.value = '';
        render();
    }

    insertBtn.addEventListener('click', add);
    input.addEventListener('keydown', (e) => { if (e.key === 'Enter') { e.preventDefault(); add(); } });
    render();
}

function initSubmitLoading() {
    document.querySelectorAll('form[enctype="multipart/form-data"]').forEach((form) => {
        form.addEventListener('submit', () => {
            const btn = form.querySelector('button[type="submit"]');
            if (!btn) return;
            btn.disabled = true;
            btn.dataset.originalText = btn.textContent;
            btn.textContent = 'Menyimpan...';
            btn.classList.add('opacity-60', 'cursor-not-allowed');
        });
    });
}

document.addEventListener('DOMContentLoaded', () => {
    initCkEditors();
    initImageDropzone('hero');
    initImageDropzone('card');
    initGalleryPreview();
    initGalleryRemove();
    initActionButtons();
    initPlatformInput();
    initSubmitLoading();
    initIndentRemover();
    document.addEventListener('click', () => {
        document.querySelectorAll('.ck-command-menu').forEach((n) => n.remove());
    });
});
