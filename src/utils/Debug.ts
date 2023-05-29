import { GUI } from "lil-gui";
import Stats from "stats.js";

export default class Debug {
	active = window.location.hash === "#debug";
	ui?: GUI;
	stats?: Stats;

	constructor(active?: boolean) {
		if (this.active || active) {
			this.ui = new GUI();
			this.stats = new Stats();
			this.stats.showPanel(0);

			if (window) {
				window.document.body.appendChild(this.stats.dom);

				if (window.innerWidth <= 450) {
					this.ui.close();
				}
			}
		}
	}
}
