<template>
	<Panel>
		<input v-model="val">
		<div class="example">
			<span>{{ width }} px</span><span>&nbsp;⟶&nbsp;</span>
			<div class="example-text" :style="styles">{{ val }}</div>
		</div>
	</Panel>
</template>

<script>
import Panel from './Panel.vue';
import {fontStringFactory} from '../util/loadedFonts';

export default {
	name: "TextWidthExample",
	components: {
		Panel
	},
	props: {
		defaultText: {
			type: String,
			default: 'The length of string is computed with 1px precision'
		},
		fontFamily: String
	},
	data() {
		return {
			val: this.defaultText
		};
	},
	computed: {
		width() {
			return fontStringFactory(this.fontFamily)(this.val, 12);
		},
		styles() {
			return `font-family: ${this.fontFamily}, sans-serif;`;
		}
	}
};
</script>

<style scoped>
	input {
		flex: 1;
		min-height: 30px;
		margin-bottom: 10px;
	}

	.example-text {
		font-size: 12px;
		max-width: max-content;
		background-color: rgb(200, 190, 180);
	}

	.example {
		display: flex;
	}
</style>
