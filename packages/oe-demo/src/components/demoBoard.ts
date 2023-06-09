import { LitElement, html, css } from "lit";
import { customElement, property, query, state } from "lit/decorators.js";
import { Board, Options } from "@openexile/board";
import { Layout } from "@omegagrid/core";

@customElement('oe-demo-board')
export class DemoBoard extends LitElement implements Layout {

	static styles = css`
		* {
			box-sizing: border-box;
		}

		:host {
			display: block;
			width: 100%;
			height: 100%;
		}

		div, canvas {
			width: 100%;
			height: 100%;
		}
	`;
	
	@query('canvas')
	canvas: HTMLCanvasElement;

	@property({type: Object})
	options: Options;

	@state()
	board: Board;

	firstUpdated() {
		this.board = new Board(this.canvas, this.options);
	}

	render = () => html`
		<div>
			<canvas></canvas>
		</div>
	`;

	layout = () => this.board?.resize();

}