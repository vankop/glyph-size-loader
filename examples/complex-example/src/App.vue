<template>
	<div id="app">
		<TextWidthExample
			class="panel"
			v-for="font in fonts"
			:key="font"
			:font-family="font"
		/>
	</div>
</template>

<script>
import TextWidthExample from './components/TextWidthExample.vue';
import {fonts} from './util/loadedFonts';

export default {
	name: 'App',
	components: {
		TextWidthExample
	},
	created() {
		this.fonts = fonts;
	}
}
</script>

<style>
	@font-face {
		font-family: "OpenSans-Light";
		src: url("./fonts/OpenSans-Light.ttf") format("truetype")
	}

	@font-face {
		font-family: "OpenSans-LightItalic";
		src: url("./fonts/OpenSans-LightItalic.ttf") format("truetype")
	}

	@font-face {
		font-family: "OpenSans-Regular";
		src: url("./fonts/OpenSans-Regular.ttf") format("truetype")
	}
	@font-face {
		font-family: "OpenSans-Bold";
		src: url("./fonts/OpenSans-Bold.ttf") format("truetype")
	}

	@font-face {
		font-family: "OpenSans-BoldItalic";
		src: url("./fonts/OpenSans-BoldItalic.ttf") format("truetype")
	}
	@font-face {
		font-family: "OpenSans-ExtraBold";
		src: url("./fonts/OpenSans-ExtraBold.ttf") format("truetype")
	}

	@font-face {
		font-family: "OpenSans-ExtraBoldItalic";
		src: url("./fonts/OpenSans-ExtraBoldItalic.ttf") format("truetype")
	}
	@font-face {
		font-family: "OpenSans-RegularItalic";
		src: url("./fonts/OpenSans-RegularItalic.ttf") format("truetype")
	}

	@font-face {
		font-family: "OpenSans-SemiBold";
		src: url("./fonts/OpenSans-SemiBold.ttf") format("truetype")
	}

	@font-face {
		font-family: "OpenSans-SemiBoldItalic";
		src: url("./fonts/OpenSans-SemiBoldItalic.ttf") format("truetype")
	}
</style>

<style scoped>
#app {
	display: flex;
	max-width: 800px;
	margin: 0 auto;
	overflow-x: hidden;
	flex-wrap: wrap;
}

.panel {
	flex: 1;
	min-width: 380px;
}
</style>
