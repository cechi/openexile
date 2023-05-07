import { Bucket } from "@omegagrid/bucket";
import { dom, getStyleManager, List, ListSelectEvent } from "@omegagrid/core";
import { html, render } from 'lit';
import { styleMap } from "lit/directives/style-map.js";
import { DemoBoard } from "./components";
import { TabEvent, TabSplitContainerItem } from "@omegagrid/tabs";
import { Board, Options as BoardOptions } from "@openexile/board";

let componentList: List;

export type Options = {
	boardOptions: BoardOptions
}

const setAccent = (color: string) => {
	const s = getStyleManager();
	const theme = s.themes.get(s.currentThemeName);
	theme['accent-color'] = color;
	s.register(s.currentThemeName, theme);
};

const setTheme = (theme: string) => getStyleManager().register(theme);

const createComponentDemoLogo = (bucket: Bucket) => {
	const elm = dom.createElement('div');
	render(html`
		<div style="${styleMap({
			backgroundColor: 'var(--og-accent-color, #00955d)',
			color: '#eaeaea',
			fontSize: '2em',
			fontWeight: 'bold',
			width: '40px',
			height: '40px',
			lineHeight: '40px',
			verticalAlign: 'middle',
			textAlign: 'center'
		})}">Ω</div>
	`, elm);

	return elm;
}

const createComponentDemoThemeSelect = (bucket: Bucket) => {
	const elm = dom.createElement('div');
	render(html`
		<style>
			.circle {
				height: 20px;
				width: 20px;
				background-color: #bbb;
				border-radius: 50%;
				display: inline-block;
				cursor: pointer;
			}

			input.circle {
				outline: none;
				border: none;
				margin: 0;
				padding: 0;
			}
		</style>

		<div style="white-space: nowrap; margin: 4px 10px 0 0">
			<a class="circle btn btn-accent" style="background-color: #00955d;"></a>
			<a class="circle btn btn-accent" style="background-color: #ab35c9;"></a>
			<a class="circle btn btn-accent" style="background-color: #938700;"></a>
			<a class="circle btn btn-accent" style="background-color: #23797F;"></a>
			<a class="circle btn btn-accent" style="background-color: #e37c5b;"></a>
			<div class="circle" style="overflow: hidden; position: relative; border: 2px dashed orange; width: 16px; height: 16px">
				<input id="inputAccent" type="color" style="width: 80px; height: 80px; position: absolute; top: -50px; left: -50px">
			</div>
			<a class="circle btn btn-theme" data-theme="dark" style="background-color: #e6cb00; margin-left: 10px"></a>
		</div>
	`, elm);

	dom.on<MouseEvent>(elm, 'click', '.btn', (e, elm) => {
		if (elm.classList.contains('btn-accent')) {
			setAccent(elm.style.backgroundColor);
		} else if (elm.classList.contains('btn-theme')) {
			const theme = elm.dataset.theme == 'dark' ? 'light' : 'dark';
			setTheme(theme);
			elm.dataset.theme = theme;
			elm.style.backgroundColor = theme == 'dark' ? '#e6cb00' : '#202034';
		}
	});
	const inputAccent = elm.querySelector<HTMLInputElement>('#inputAccent');
	inputAccent.addEventListener('input', () => setAccent(inputAccent.value));

	return elm;
}

const createComponentFactory = (bucket: Bucket, options: Options) => (id: string) => new Promise<HTMLElement>((resolve) => {
	let elm: HTMLElement;
	const c = components.find(c => c.id == id);
	if (c && c.factory) {
		elm = c.factory(bucket, options);
	} else {
		elm = dom.createElement('div');
		elm.innerHTML = 'unknown';
	}
	resolve(elm);
});

const createComponentDemoBucket = (bucket: Bucket, options: Options) => {
	const bucket1 = dom.createElement<Bucket>('og-bucket');
	bucket1.createComponent = (id: string) => createComponentFactory(bucket1, options)(id);

	let items: TabSplitContainerItem[] = [];
	items.push({container: {size: null}, tabs: [{id: 'board', title: 'Board'}]});
	// if (window.location.hash) {
	// 	items.push({container: {size: null}, tabs: [{id: window.location.hash.substring(1), title: window.location.hash.substring(1)}]});
	// }

	bucket1.loadSettings({
		sidemenu: {
			activeIndex: 0,
			items: [{
				id: 'componentList',
				icon: 'puzzle-piece',
				text: 'Components'
			}]
		},
		editorLayout: {
			items: items
		}, 
		top: {
			rightItems: [] //[{id: 'themeSelector'}]
		}
	});

	bucket1.addEventListener('tab.select', (e: TabEvent) => {
		if (componentList) {
			const index = components.filter(c => c.sidebar !== false).findIndex(c => c.id == e.tab?.id);
			if (index > -1) componentList.select(index);
		}
	});

	window.addEventListener('resize', () => bucket1.layout());
	
	return bucket1;
}

const createComponentList = (bucket: Bucket) => {
	const items = components.filter(c => c.sidebar !== false);
	const list = dom.createElement<List>('og-list');
	list.style.height = "100%";
	list.nativeHeight = true;
	list.size = items.length;
	list.itemHeight = 30;
	list.itemRenderer = (div, index) => html`<div style="padding-left: 10px">${items[index].name}</div>`;
	list.addEventListener('select', (e: ListSelectEvent) => bucket.open({id: items[e.index].id, title: items[e.index].name}));
	componentList = list;
	return list;
};

const components: {id: string, name: string, factory: (bucket: Bucket, options: Options) => HTMLElement, sidebar?: boolean}[] = [
	{id: 'logo', name: 'Logo', factory: createComponentDemoLogo, sidebar: false},
	{id: 'componentList', name: 'ComponentList', factory: createComponentList, sidebar: false},
	{id: 'themeSelector', name: 'ThemeSelector', factory: createComponentDemoThemeSelect, sidebar: false},
	{id: 'board', name: 'Board', factory: (bucket, options) => {
		const c = dom.createElement<DemoBoard>('oe-demo-board')
		c.options = options.boardOptions;
		return c;
	}, sidebar: true},
];

export default function initDemo(elm: HTMLElement, options: Options) {
	dom.empty(elm);
	
	// const canvas = dom.createElement<HTMLCanvasElement>('canvas', elm);
	// canvas.style.height = '100%';
	// canvas.style.width = '100%';
	// const board = new Board(canvas);

	elm.appendChild(createComponentDemoBucket(null, options));
	getStyleManager().register('dark');
}